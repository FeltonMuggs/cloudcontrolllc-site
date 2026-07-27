// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DNaIToken
 * @notice Sovereign genomic asset as an ERC-721 with an on-chain consent state
 *         machine, native-FLR access payments, and a verifiable access ledger.
 *
 * Design notes (hackathon scope, Flare testnet):
 *  - One token per genomic asset (ERC-721). The token OWNER is the data owner.
 *  - No raw genomic data ever touches the chain. Each token stores only a
 *    keccak256 content hash + an IPFS pointer (URI). Same posture as the
 *    existing DNaI reservation/VIP contracts.
 *  - Consent is a per-token state: Idle -> Requested -> Granted (or Revoked).
 *    A licensee submits an access request WITH payment; the owner grants; the
 *    grant is logged with price, licensee, and timestamp. Every transition is
 *    an event, so "who accessed what, when, for what price" is fully on-chain.
 *  - Payment is NATIVE FLR for demo simplicity (no ERC-20 approval step). The
 *    contract splits each payment between the token owner and the platform by
 *    a configurable royalty bps, and uses pull-payment withdrawals to stay
 *    reentrancy-safe.
 *
 * This is testnet/demo code. Mainnet deployment is gated (see project go-live
 * gates: provisional patent, securities opinion, MTL/KYC scoping, audit,
 * multisig owner).
 */
contract DNaIToken is ERC721, Ownable, ReentrancyGuard {
    // --- Consent state machine ---
    enum Consent {
        Idle,       // no active request or grant
        Requested,  // a licensee has requested + paid; awaiting owner decision
        Granted,    // owner approved; access is live
        Revoked     // owner revoked a prior grant
    }

    struct AssetInfo {
        bytes32 contentHash;   // keccak256 of the off-chain genomic asset (never the data itself)
        string  provenance;    // "REAL" | "SYNTHETIC" | "BUNDLED" (buyer always told which)
        uint256 accessPriceWei;// price a licensee must pay to request access, in FLR wei
        Consent state;
    }

    struct AccessRecord {
        address licensee;
        uint256 tokenId;
        uint256 pricePaidWei;
        uint256 timestamp;
        bool    granted;       // false while Requested, true once owner grants
    }

    // token id => asset info
    mapping(uint256 => AssetInfo) public assets;
    // token id => the current pending/active requester (0 if none)
    mapping(uint256 => address) public activeRequester;
    // token id => amount escrowed for the active request (refunded if denied)
    mapping(uint256 => uint256) public escrowed;

    // full access history (append-only)
    AccessRecord[] public accessLog;
    // token id => indices into accessLog, for per-token history reads
    mapping(uint256 => uint256[]) private _tokenHistory;

    // pull-payment balances
    mapping(address => uint256) public pendingWithdrawals;

    // platform royalty in basis points (e.g. 1000 = 10%)
    uint96 public platformRoyaltyBps;
    uint96 public constant BPS_DENOMINATOR = 10_000;

    uint256 private _nextTokenId = 1;

    // --- Events (the audit trail) ---
    event AssetRegistered(uint256 indexed tokenId, address indexed owner, bytes32 contentHash, string provenance, uint256 accessPriceWei);
    event AccessRequested(uint256 indexed tokenId, address indexed licensee, uint256 pricePaidWei, uint256 logIndex);
    event AccessGranted(uint256 indexed tokenId, address indexed licensee, uint256 pricePaidWei, uint256 ownerShareWei, uint256 platformShareWei, uint256 logIndex);
    event AccessDenied(uint256 indexed tokenId, address indexed licensee, uint256 refundedWei);
    event ConsentRevoked(uint256 indexed tokenId, address indexed licensee);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPriceWei);
    event Withdrawal(address indexed account, uint256 amountWei);

    constructor(uint96 _platformRoyaltyBps)
        ERC721("DNaI Sovereign Genomic Asset", "DNAI")
        Ownable(msg.sender)
    {
        require(_platformRoyaltyBps <= BPS_DENOMINATOR, "royalty > 100%");
        platformRoyaltyBps = _platformRoyaltyBps;
    }

    // --- Registration ---

    /**
     * @notice Register a genomic asset as a new DNaI token owned by `to`.
     * @param to           the data owner who will hold the token
     * @param contentHash  keccak256 of the off-chain asset (NOT the data)
     * @param provenance   REAL / SYNTHETIC / BUNDLED
     * @param tokenURI_    IPFS (or other) pointer to consent-safe metadata
     * @param accessPriceWei price in FLR wei a licensee pays to request access
     */
    function registerAsset(
        address to,
        bytes32 contentHash,
        string calldata provenance,
        string calldata tokenURI_,
        uint256 accessPriceWei
    ) external returns (uint256 tokenId) {
        require(to != address(0), "zero owner");
        require(contentHash != bytes32(0), "empty hash");

        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = tokenURI_;

        assets[tokenId] = AssetInfo({
            contentHash: contentHash,
            provenance: provenance,
            accessPriceWei: accessPriceWei,
            state: Consent.Idle
        });

        emit AssetRegistered(tokenId, to, contentHash, provenance, accessPriceWei);
    }

    // --- Access request flow (licensee side) ---

    /**
     * @notice A licensee requests access to a token, paying the access price in FLR.
     *         Funds are escrowed until the owner grants (funds split) or denies (refund).
     */
    function requestAccess(uint256 tokenId) external payable nonReentrant {
        AssetInfo storage a = assets[tokenId];
        _requireMinted(tokenId);
        require(a.state == Consent.Idle || a.state == Consent.Revoked, "request pending or granted");
        require(msg.value == a.accessPriceWei, "wrong payment amount");
        require(msg.sender != ownerOf(tokenId), "owner cannot request own asset");

        a.state = Consent.Requested;
        activeRequester[tokenId] = msg.sender;
        escrowed[tokenId] = msg.value;

        AccessRecord memory rec = AccessRecord({
            licensee: msg.sender,
            tokenId: tokenId,
            pricePaidWei: msg.value,
            timestamp: block.timestamp,
            granted: false
        });
        accessLog.push(rec);
        uint256 logIndex = accessLog.length - 1;
        _tokenHistory[tokenId].push(logIndex);

        emit AccessRequested(tokenId, msg.sender, msg.value, logIndex);
    }

    // --- Owner consent decisions ---

    /**
     * @notice Token owner grants the pending request. Escrow splits to owner + platform.
     */
    function grantAccess(uint256 tokenId) external nonReentrant {
        AssetInfo storage a = assets[tokenId];
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(a.state == Consent.Requested, "no pending request");

        address licensee = activeRequester[tokenId];
        uint256 amount = escrowed[tokenId];
        escrowed[tokenId] = 0;

        uint256 platformShare = (amount * platformRoyaltyBps) / BPS_DENOMINATOR;
        uint256 ownerShare = amount - platformShare;

        pendingWithdrawals[ownerOf(tokenId)] += ownerShare;
        pendingWithdrawals[owner()] += platformShare; // platform = contract owner

        a.state = Consent.Granted;

        // mark the most recent history record for this token as granted
        uint256[] storage hist = _tokenHistory[tokenId];
        uint256 lastIdx = hist[hist.length - 1];
        accessLog[lastIdx].granted = true;

        emit AccessGranted(tokenId, licensee, amount, ownerShare, platformShare, lastIdx);
    }

    /**
     * @notice Token owner denies the pending request; the licensee is refunded in full.
     */
    function denyAccess(uint256 tokenId) external nonReentrant {
        AssetInfo storage a = assets[tokenId];
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(a.state == Consent.Requested, "no pending request");

        address licensee = activeRequester[tokenId];
        uint256 amount = escrowed[tokenId];
        escrowed[tokenId] = 0;
        activeRequester[tokenId] = address(0);
        a.state = Consent.Idle;

        pendingWithdrawals[licensee] += amount; // refund via pull payment

        emit AccessDenied(tokenId, licensee, amount);
    }

    /**
     * @notice Token owner revokes a previously granted access. Future queries by the
     *         licensee are off; the on-chain state proves the revocation.
     */
    function revokeAccess(uint256 tokenId) external {
        AssetInfo storage a = assets[tokenId];
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(a.state == Consent.Granted, "not granted");

        address licensee = activeRequester[tokenId];
        activeRequester[tokenId] = address(0);
        a.state = Consent.Revoked;

        emit ConsentRevoked(tokenId, licensee);
    }

    // --- Owner asset management ---

    function setAccessPrice(uint256 tokenId, uint256 newPriceWei) external {
        require(msg.sender == ownerOf(tokenId), "not token owner");
        require(assets[tokenId].state != Consent.Requested, "request pending");
        assets[tokenId].accessPriceWei = newPriceWei;
        emit PriceUpdated(tokenId, newPriceWei);
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

    // --- Views for the frontend ---

    function getAssetState(uint256 tokenId)
        external
        view
        returns (bytes32 contentHash, string memory provenance, uint256 accessPriceWei, Consent state, address currentRequester)
    {
        AssetInfo storage a = assets[tokenId];
        return (a.contentHash, a.provenance, a.accessPriceWei, a.state, activeRequester[tokenId]);
    }

    function tokenHistory(uint256 tokenId) external view returns (AccessRecord[] memory) {
        uint256[] storage idxs = _tokenHistory[tokenId];
        AccessRecord[] memory out = new AccessRecord[](idxs.length);
        for (uint256 i = 0; i < idxs.length; i++) {
            out[i] = accessLog[idxs[i]];
        }
        return out;
    }

    function accessLogLength() external view returns (uint256) {
        return accessLog.length;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // --- Minimal tokenURI storage (avoids pulling ERC721URIStorage for one field) ---
    mapping(uint256 => string) private _tokenURIs;

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        return _tokenURIs[tokenId];
    }

    function _requireMinted(uint256 tokenId) internal view {
        require(_ownerOf(tokenId) != address(0), "token does not exist");
    }
}
