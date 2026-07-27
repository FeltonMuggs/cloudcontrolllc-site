// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./IFtsoAdapter.sol";

/**
 * @title DNaIConsent
 * @notice Sovereign genomic asset with oracle-priced, consent-gated access and
 *         automatic royalty settlement — the on-chain slice of the DNaI
 *         provisional (consent token + decentralized price feed + royalty split
 *         + revocation + audit ledger). Merges the tested base contract with the
 *         good ideas from the DNaIVault draft, fixing that draft's bugs:
 *
 *   - FTSO read is isolated behind IFtsoAdapter (draft hard-coded a fabricated
 *     interface); price staleness is enforced (draft dropped the check).
 *   - Co-custody uses EIP-712 typed signatures with a per-token nonce + expiry
 *     (draft used a raw hash with no prefix, no nonce → unverifiable + replayable).
 *   - Payouts use pull-payments (draft used .transfer(), which breaks to a
 *     multisig recipient — the very owner your mainnet gate requires).
 *   - Individual mode requires explicit owner approval per request (draft
 *     auto-granted on payment, contradicting "consent-gated").
 *   - Token is soulbound (a genome bound to identity is not transferable to a
 *     stranger; inheritance is a later controlled path).
 *
 * Testnet/demo. Mainnet is gated: provisional filed, securities opinion,
 * MTL/KYC scoping, audit, and a secure multisig owner.
 */
contract DNaIConsent is ERC721, Ownable, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;

    // --- Consent state machine (provisional FIG. 3) ---
    enum Consent { Idle, Requested, Granted, Revoked, Expired }
    enum Gov { Individual, MultiSig }

    struct Asset {
        bytes32 contentHash;   // keccak256 of the off-chain asset (never the data)
        bytes32 lineageHash;   // binds a synthetic proxy to its source (0 if real); provisional §[0028]
        string  provenance;    // "REAL" | "SYNTHETIC" | "BUNDLED" — buyer always told which
        uint256 baseFeeUsdCents; // access fee in USD cents (e.g. $10.00 = 1000)
        Gov     gov;
        address parentB;       // co-signer for MultiSig (parentA = token owner); 0 if Individual
        uint64  grantExpiry;   // unix ts a granted access auto-expires (0 = no expiry)
        Consent state;
    }

    struct AccessRecord {
        address licensee;
        uint256 tokenId;
        uint256 pricePaidWei;
        uint256 usdCents;
        uint64  timestamp;
        bytes32 purposeHash;   // keccak256 of the inquiry purpose string
        bool    granted;
    }

    // EIP-712 typed struct parent B signs to co-authorize a specific request
    // ParentBConsent(uint256 tokenId,address licensee,bytes32 purposeHash,uint256 nonce,uint256 expiry)
    bytes32 private constant PARENTB_TYPEHASH =
        keccak256("ParentBConsent(uint256 tokenId,address licensee,bytes32 purposeHash,uint256 nonce,uint256 expiry)");

    mapping(uint256 => Asset) public assets;
    mapping(uint256 => address) public activeRequester;
    mapping(uint256 => uint256) public escrowed;        // required FLR locked for the active request
    mapping(uint256 => bytes32) public activePurpose;
    mapping(uint256 => uint256) public parentBNonce;    // per-token nonce → kills signature replay
    mapping(address => uint256) public pendingWithdrawals;

    AccessRecord[] public accessLog;
    mapping(uint256 => uint256[]) private _tokenHistory;

    IFtsoAdapter public ftso;
    uint96 public platformRoyaltyBps;
    uint96 public constant BPS_DENOMINATOR = 10_000;
    uint256 public maxPriceStaleness = 3600; // seconds; a feed older than this is rejected
    uint256 private _nextTokenId = 1;
    mapping(uint256 => string) private _tokenURIs;

    // --- Events (the audit trail) ---
    event AssetRegistered(uint256 indexed tokenId, address indexed owner, bytes32 contentHash, string provenance, uint256 baseFeeUsdCents, Gov gov);
    event AccessRequested(uint256 indexed tokenId, address indexed licensee, uint256 pricePaidWei, uint256 usdCents, bytes32 purposeHash, uint256 logIndex);
    event AccessGranted(uint256 indexed tokenId, address indexed licensee, uint256 ownerShareWei, uint256 platformShareWei, uint64 grantExpiry, uint256 logIndex);
    event AccessDenied(uint256 indexed tokenId, address indexed licensee, uint256 refundedWei);
    event ConsentRevoked(uint256 indexed tokenId, address indexed licensee);
    event FeeUpdated(uint256 indexed tokenId, uint256 newBaseFeeUsdCents);
    event Withdrawal(address indexed account, uint256 amountWei);
    event FtsoAdapterUpdated(address indexed adapter);

    constructor(uint96 _platformRoyaltyBps, address _ftso)
        ERC721("DNaI Sovereign Genomic Asset", "DNAI")
        Ownable(msg.sender)
        EIP712("DNaIConsent", "1")
    {
        require(_platformRoyaltyBps <= BPS_DENOMINATOR, "royalty > 100%");
        require(_ftso != address(0), "zero ftso");
        platformRoyaltyBps = _platformRoyaltyBps;
        ftso = IFtsoAdapter(_ftso);
    }

    // --- Admin ---
    function setFtsoAdapter(address _ftso) external onlyOwner {
        require(_ftso != address(0), "zero ftso");
        ftso = IFtsoAdapter(_ftso);
        emit FtsoAdapterUpdated(_ftso);
    }

    function setMaxPriceStaleness(uint256 s) external onlyOwner {
        require(s > 0, "zero staleness");
        maxPriceStaleness = s;
    }

    // --- Registration ---
    function registerAsset(
        address to,
        bytes32 contentHash,
        bytes32 lineageHash,
        string calldata provenance,
        string calldata tokenURI_,
        uint256 baseFeeUsdCents,
        Gov gov,
        address parentB
    ) external returns (uint256 tokenId) {
        require(to != address(0), "zero owner");
        require(contentHash != bytes32(0), "empty hash");
        if (gov == Gov.MultiSig) {
            require(parentB != address(0) && parentB != to, "bad parentB");
        } else {
            require(parentB == address(0), "parentB set on individual");
        }

        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = tokenURI_;

        assets[tokenId] = Asset({
            contentHash: contentHash,
            lineageHash: lineageHash,
            provenance: provenance,
            baseFeeUsdCents: baseFeeUsdCents,
            gov: gov,
            parentB: parentB,
            grantExpiry: 0,
            state: Consent.Idle
        });

        emit AssetRegistered(tokenId, to, contentHash, provenance, baseFeeUsdCents, gov);
    }

    // --- Pricing (FTSO via adapter, with staleness) ---

    /// @notice Required FLR (wei) to access `tokenId` at the current feed price.
    function requiredFlrWei(uint256 tokenId) public view returns (uint256) {
        _requireMinted(tokenId);
        (uint256 price, int8 decimals, uint64 ts) = ftso.getFlrUsdPrice();
        require(price > 0, "bad feed price");
        require(block.timestamp >= ts && block.timestamp - ts <= maxPriceStaleness, "stale price");
        return _usdCentsToFlrWei(assets[tokenId].baseFeeUsdCents, price, decimals);
    }

    /**
     * @dev 1 FLR in USD = price / 10^decimals.
     *      wei = (usdCents/100) / (price/10^decimals) * 1e18.
     *      Multiply before divide; handle signed decimals both ways.
     */
    function _usdCentsToFlrWei(uint256 usdCents, uint256 price, int8 decimals) internal pure returns (uint256) {
        require(decimals >= -18 && decimals <= 36, "decimals out of range");
        if (decimals >= 0) {
            return (usdCents * 1e18 * (10 ** uint256(uint8(decimals)))) / (price * 100);
        } else {
            return (usdCents * 1e18) / (price * 100 * (10 ** uint256(uint8(-decimals))));
        }
    }

    // --- Access request (licensee) ---

    /**
     * @notice Request access to `tokenId`, paying at least the FTSO-priced fee in FLR.
     *         The required amount is escrowed; any overpayment is immediately
     *         withdrawable by the licensee. Funds settle on grant, or refund on deny.
     */
    function requestAccess(uint256 tokenId, string calldata purpose) external payable nonReentrant {
        Asset storage a = assets[tokenId];
        _requireMinted(tokenId);
        require(a.state == Consent.Idle || a.state == Consent.Revoked || a.state == Consent.Expired, "request pending or active");
        require(msg.sender != ownerOf(tokenId), "owner cannot request own asset");

        uint256 required = requiredFlrWei(tokenId);
        require(msg.value >= required, "insufficient payment");

        uint256 excess = msg.value - required;
        if (excess > 0) pendingWithdrawals[msg.sender] += excess; // refund overpayment via pull

        bytes32 purposeHash = keccak256(bytes(purpose));
        a.state = Consent.Requested;
        activeRequester[tokenId] = msg.sender;
        activePurpose[tokenId] = purposeHash;
        escrowed[tokenId] = required;

        accessLog.push(AccessRecord({
            licensee: msg.sender,
            tokenId: tokenId,
            pricePaidWei: required,
            usdCents: a.baseFeeUsdCents,
            timestamp: uint64(block.timestamp),
            purposeHash: purposeHash,
            granted: false
        }));
        uint256 logIndex = accessLog.length - 1;
        _tokenHistory[tokenId].push(logIndex);

        emit AccessRequested(tokenId, msg.sender, required, a.baseFeeUsdCents, purposeHash, logIndex);
    }

    // --- Owner consent decisions ---

    /**
     * @notice Grant the pending request.
     *         Individual mode: token owner (parentA) approves alone.
     *         MultiSig mode: token owner approves AND supplies parent B's EIP-712
     *         signature over exactly this (tokenId, licensee, purpose, nonce, expiry).
     * @param grantValiditySeconds seconds until the grant auto-expires (0 = no expiry)
     * @param parentBExpiry        expiry embedded in parent B's signature
     * @param parentBSig           parent B's EIP-712 signature (empty in Individual mode)
     */
    function grantAccess(
        uint256 tokenId,
        uint64 grantValiditySeconds,
        uint256 parentBExpiry,
        bytes calldata parentBSig
    ) external nonReentrant {
        Asset storage a = assets[tokenId];
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(a.state == Consent.Requested, "no pending request");

        address licensee = activeRequester[tokenId];

        if (a.gov == Gov.MultiSig) {
            require(block.timestamp <= parentBExpiry, "parentB sig expired");
            bytes32 structHash = keccak256(abi.encode(
                PARENTB_TYPEHASH,
                tokenId,
                licensee,
                activePurpose[tokenId],
                parentBNonce[tokenId],
                parentBExpiry
            ));
            address signer = _hashTypedDataV4(structHash).recover(parentBSig);
            require(signer == a.parentB, "bad parentB signature");
            parentBNonce[tokenId] += 1; // consume the nonce → this sig can never be replayed
        }

        uint256 amount = escrowed[tokenId];
        escrowed[tokenId] = 0;
        uint256 platformShare = (amount * platformRoyaltyBps) / BPS_DENOMINATOR;
        uint256 ownerShare = amount - platformShare;
        pendingWithdrawals[ownerOf(tokenId)] += ownerShare;
        pendingWithdrawals[owner()] += platformShare;

        a.state = Consent.Granted;
        a.grantExpiry = grantValiditySeconds == 0 ? 0 : uint64(block.timestamp) + grantValiditySeconds;

        uint256[] storage hist = _tokenHistory[tokenId];
        uint256 lastIdx = hist[hist.length - 1];
        accessLog[lastIdx].granted = true;

        emit AccessGranted(tokenId, licensee, ownerShare, platformShare, a.grantExpiry, lastIdx);
    }

    /// @notice Deny the pending request; licensee refunded in full (pull).
    function denyAccess(uint256 tokenId) external nonReentrant {
        Asset storage a = assets[tokenId];
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(a.state == Consent.Requested, "no pending request");

        address licensee = activeRequester[tokenId];
        uint256 amount = escrowed[tokenId];
        escrowed[tokenId] = 0;
        activeRequester[tokenId] = address(0);
        activePurpose[tokenId] = bytes32(0);
        a.state = Consent.Idle;

        pendingWithdrawals[licensee] += amount;
        emit AccessDenied(tokenId, licensee, amount);
    }

    /// @notice Revoke a live grant (provisional §[0017] instantaneous revocation).
    function revokeAccess(uint256 tokenId) external {
        Asset storage a = assets[tokenId];
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(a.state == Consent.Granted, "not granted");
        address licensee = activeRequester[tokenId];
        activeRequester[tokenId] = address(0);
        a.state = Consent.Revoked;
        emit ConsentRevoked(tokenId, licensee);
    }

    /// @notice Anyone may finalize an expired grant into the Expired state.
    function expireGrant(uint256 tokenId) external {
        Asset storage a = assets[tokenId];
        require(a.state == Consent.Granted, "not granted");
        require(a.grantExpiry != 0 && block.timestamp > a.grantExpiry, "not expired");
        activeRequester[tokenId] = address(0);
        a.state = Consent.Expired;
    }

    function setBaseFee(uint256 tokenId, uint256 newBaseFeeUsdCents) external {
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(assets[tokenId].state != Consent.Requested, "request pending");
        assets[tokenId].baseFeeUsdCents = newBaseFeeUsdCents;
        emit FeeUpdated(tokenId, newBaseFeeUsdCents);
    }

    // --- Withdrawals (pull payment) ---
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "nothing to withdraw");
        pendingWithdrawals[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "withdraw failed");
        emit Withdrawal(msg.sender, amount);
    }

    // --- Views ---
    function getAssetState(uint256 tokenId)
        external view
        returns (bytes32 contentHash, string memory provenance, uint256 baseFeeUsdCents, Gov gov, Consent state, address currentRequester, uint64 grantExpiry)
    {
        Asset storage a = assets[tokenId];
        return (a.contentHash, a.provenance, a.baseFeeUsdCents, a.gov, a.state, activeRequester[tokenId], a.grantExpiry);
    }

    function tokenHistory(uint256 tokenId) external view returns (AccessRecord[] memory) {
        uint256[] storage idxs = _tokenHistory[tokenId];
        AccessRecord[] memory out = new AccessRecord[](idxs.length);
        for (uint256 i = 0; i < idxs.length; i++) out[i] = accessLog[idxs[i]];
        return out;
    }

    function accessLogLength() external view returns (uint256) { return accessLog.length; }
    function totalMinted() external view returns (uint256) { return _nextTokenId - 1; }

    /// @notice Digest parent B must sign off-chain (helper for the frontend/tests).
    function parentBDigest(uint256 tokenId, address licensee, bytes32 purposeHash, uint256 expiry)
        external view returns (bytes32)
    {
        bytes32 structHash = keccak256(abi.encode(
            PARENTB_TYPEHASH, tokenId, licensee, purposeHash, parentBNonce[tokenId], expiry
        ));
        return _hashTypedDataV4(structHash);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        return _tokenURIs[tokenId];
    }

    // --- Soulbound: allow mint, block transfers ---
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }

    function _requireMinted(uint256 tokenId) internal view {
        require(_ownerOf(tokenId) != address(0), "token does not exist");
    }
}
