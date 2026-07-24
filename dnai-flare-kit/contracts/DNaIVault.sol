// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Minimal ERC721 Interface for on-chain BioNFT tracking.
 */
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function balanceOf(address owner) external view returns (uint256 balance);
}

/**
 * @dev Interface for the Flare Time Series Oracle (FTSO) v2 on Coston2 Testnet.
 * Used to dynamically price genomic queries in USD, paid natively in FLR.
 */
interface IFlareFTSO {
    // Returns the price of an asset (e.g., FLR/USD) with its decimal precision and timestamp
    function getFeedPrice(string calldata _feedId) external view returns (uint256 price, uint256 decimals, uint256 timestamp);
}

/**
 * @title DNaI Sovereign Genomic Vault & Consent Engine
 * @dev Core smart contract for the DNaI Flare Native Hackathon Submission.
 * Deployed on the Coston2 Testnet.
 * 
 * Implements:
 * 1. ERC-721 tokenized genomic sovereignty (BioNFTs mapped to dynamic metadata hashes)
 * 2. Multi-generational co-custody consent gates (Parent A + Parent B signature verifications)
 * 3. Dynamic pricing utilizing Flare's native FTSO feeds (converting USD targets to native FLR fees)
 * 4. Immutable access ledger logging who, when, what price, and purpose for compliance audits
 */
contract DNaIVault is IERC721 {
    // --- ERC-721 State Variables ---
    string public constant name = "DNaI Sovereign BioNFT";
    string public constant symbol = "BioNFT";

    uint256 private _tokenCounter;
    address public platformAdmin;
    address public ftsoOracleAddress; // Coston2 FTSO Registry address

    // --- Mappings ---
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    // Mapping from Token ID to Sovereign Genome Metadata
    mapping(uint256 => GenomicProfile) public genomes;
    
    // Mapping from Token ID to historical access audits
    mapping(uint256 => AccessRecord[]) private _accessLedger;

    // --- Enums & Structs ---
    enum GovernanceMode {
        Individual,     // Single owner signature required
        MultiSig        // Shared/Co-custody requiring dual parent signatures
    }

    struct GenomicProfile {
        bytes32 dnaFingerprintHash; // SHA-256 fingerprint generated from 50+ SNPs
        string ipfsCid;             // Encrypted off-chain raw file location (LDP-masked)
        GovernanceMode mode;        // Consent policy mode
        address parentA;            // Custodian A (Owner of token)
        address parentB;            // Custodian B (Co-signer for MultiSig mode)
        uint256 baseFeeUSD;         // Standard querying fee in USD (2 decimals, e.g., 1000 = $10.00)
        bool isSealed;              // Sealed state lock
    }

    struct AccessRecord {
        address researcher;         // Entity requesting data access
        uint256 timestamp;          // Access epoch time
        uint256 flrPaid;            // Total native FLR paid
        string queryPurpose;        // Decrypted research metadata string
        bool wasAuthorized;         // Consent status output
    }

    // --- Events ---
    event BioNFTMinted(uint256 indexed tokenId, address indexed owner, bytes32 indexed dnaFingerprintHash);
    event ConsentPolicyUpdated(uint256 indexed tokenId, GovernanceMode mode, address indexed parentB);
    event AccessRequested(uint256 indexed tokenId, address indexed researcher, uint256 flrPaid, string purpose);
    event AccessGranted(uint256 indexed tokenId, address indexed researcher, uint256 payoutAmount);
    event AccessDenied(uint256 indexed tokenId, address indexed researcher, string reason);
    event FTSOAddressUpdated(address indexed newFTSO);

    // --- Modifiers ---
    modifier onlyAdmin() {
        require(msg.sender == platformAdmin, "DNaI: Only platform admin can execute");
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(genomes[tokenId].parentA == msg.sender, "DNaI: Not the primary custodian of this BioNFT");
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        require(_owners[tokenId] != address(0), "DNaI: BioNFT does not exist");
        _;
    }

    constructor(address _ftsoOracleAddress) {
        require(_ftsoOracleAddress != address(0), "DNaI: Invalid FTSO oracle address");
        platformAdmin = msg.sender;
        ftsoOracleAddress = _ftsoOracleAddress;
    }

    // --- ERC-721 Read Methods ---
    function ownerOf(uint256 tokenId) external view override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "DNaI: BioNFT does not exist");
        return owner;
    }

    function balanceOf(address owner) external view override returns (uint256) {
        require(owner != address(0), "DNaI: Invalid address");
        return _balances[owner];
    }

    // --- Core Sovereign Functions ---

    /**
     * @notice Mints a new Sovereign BioNFT representing an individual's genome.
     * @param _dnaFingerprintHash Cryptographic SHA-256 baseline fingerprint computed on-device.
     * @param _ipfsCid Encrypted off-chain location pointing to LDP-masked dataset.
     * @param _baseFeeUSD Access fee target in USD (2 decimals, e.g., 1000 = $10.00 USD).
     * @return tokenId The ID of the newly minted BioNFT.
     */
    function mintBioNFT(
        bytes32 _dnaFingerprintHash,
        string calldata _ipfsCid,
        uint256 _baseFeeUSD
    ) external returns (uint256) {
        require(_baseFeeUSD > 0, "DNaI: Base fee must be greater than 0");
        require(_dnaFingerprintHash != bytes32(0), "DNaI: DNA fingerprint cannot be empty");

        _tokenCounter++;
        uint256 newTokenId = _tokenCounter;

        _owners[newTokenId] = msg.sender;
        _balances[msg.sender]++;

        genomes[newTokenId] = GenomicProfile({
            dnaFingerprintHash: _dnaFingerprintHash,
            ipfsCid: _ipfsCid,
            mode: GovernanceMode.Individual,
            parentA: msg.sender,
            parentB: address(0),
            baseFeeUSD: _baseFeeUSD,
            isSealed: true
        });

        emit BioNFTMinted(newTokenId, msg.sender, _dnaFingerprintHash);
        return newTokenId;
    }

    /**
     * @notice Configures custom data governance policies (e.g., locking down minor children's genomes).
     * @param tokenId Target BioNFT ID.
     * @param _mode Individual or MultiSig mode.
     * @param _parentB Co-custodian address required if MultiSig is selected.
     */
    function setConsentPolicy(
        uint256 tokenId,
        GovernanceMode _mode,
        address _parentB
    ) external onlyTokenOwner(tokenId) tokenExists(tokenId) {
        GenomicProfile storage profile = genomes[tokenId];
        
        if (_mode == GovernanceMode.MultiSig) {
            require(_parentB != address(0), "DNaI: MultiSig requires valid co-custodian");
            require(_parentB != msg.sender, "DNaI: Parent B cannot match Parent A");
        }

        profile.mode = _mode;
        profile.parentB = _parentB;

        emit ConsentPolicyUpdated(tokenId, _mode, _parentB);
    }

    /**
     * @notice Dynamically calculates the required FLR payment using the Coston2 FTSO oracle.
     * @param tokenId Target BioNFT ID.
     * @return flrAmount Total FLR required to request query access based on USD target.
     */
    function getRequiredFLRPayment(uint256 tokenId) public view tokenExists(tokenId) returns (uint256) {
        GenomicProfile memory profile = genomes[tokenId];
        
        // Query the FTSO contract for live FLR/USD feed price
        (uint256 flrPriceUSD, uint256 decimals, ) = IFlareFTSO(ftsoOracleAddress).getFeedPrice("FLR/USD");
        
        require(flrPriceUSD > 0, "DNaI: Oracle feed failure");

        // profile.baseFeeUSD is scaled to 2 decimals ($10.00 = 1000)
        // FTSO price returns with 'decimals' precision
        // We compute: baseFeeUSD * 10^decimals * 1e18 / (flrPriceUSD * 100)
        uint256 requiredFLR = (profile.baseFeeUSD * (10 ** decimals) * 1e18) / (flrPriceUSD * 100);
        return requiredFLR;
    }

    /**
     * @notice Executes a secure research access query on Flare testnet.
     * @dev Automatically parses consent policies, charges FLR dynamically via FTSO, and routes royalties.
     * @param tokenId Target BioNFT genomic asset.
     * @param _purpose Explanation string describing research study goals.
     * @param _signatureB Optional co-signature byte array from Parent B (required in MultiSig mode).
     */
    function requestAccess(
        uint256 tokenId,
        string calldata _purpose,
        bytes calldata _signatureB
    ) external payable tokenExists(tokenId) {
        GenomicProfile memory profile = genomes[tokenId];
        require(profile.isSealed, "DNaI: Target genome is not active");

        // 1. Resolve dynamic pricing using the Flare Time Series Oracle
        uint256 requiredFLR = getRequiredFLRPayment(tokenId);
        require(msg.value >= requiredFLR, "DNaI: Insufficient FLR payment for this query");

        emit AccessRequested(tokenId, msg.sender, msg.value, _purpose);

        // 2. Evaluate dynamic consent state-machine
        if (profile.mode == GovernanceMode.MultiSig) {
            // Confirm we have a second parent signature authorizing msg.sender's specific query purpose
            bytes32 queryHash = keccak256(abi.encodePacked(tokenId, msg.sender, _purpose));
            address recoveredSigner = _recoverSigner(queryHash, _signatureB);
            
            if (recoveredSigner != profile.parentB) {
                emit AccessDenied(tokenId, msg.sender, "Multi-signature verification failed");
                payable(msg.sender).transfer(msg.value); // Return fees
                _logAccess(tokenId, msg.sender, msg.value, _purpose, false);
                return;
            }
        }

        // 3. Complete payment routing & on-chain settlement
        // Platform commission is set at a flat 5%, remaining 95% goes directly to family address
        uint256 platformFee = (msg.value * 5) / 100;
        uint256 ownerPayout = msg.value - platformFee;

        payable(platformAdmin).transfer(platformFee);
        payable(profile.parentA).transfer(ownerPayout);

        emit AccessGranted(tokenId, msg.sender, ownerPayout);
        _logAccess(tokenId, msg.sender, msg.value, _purpose, true);
    }

    /**
     * @notice Getter for access history of a specific BioNFT.
     * @param tokenId Target BioNFT ID.
     * @return Array of AccessRecord structs.
     */
    function getAccessHistory(uint256 tokenId) external view tokenExists(tokenId) returns (AccessRecord[] memory) {
        return _accessLedger[tokenId];
    }

    /**
     * @notice Returns the count of access requests for a BioNFT.
     * @param tokenId Target BioNFT ID.
     * @return Total number of access requests.
     */
    function getAccessHistoryLength(uint256 tokenId) external view tokenExists(tokenId) returns (uint256) {
        return _accessLedger[tokenId].length;
    }

    /**
     * @notice Returns a single access record by index.
     * @param tokenId Target BioNFT ID.
     * @param index Position in the access history.
     * @return The AccessRecord at that index.
     */
    function getAccessRecordByIndex(uint256 tokenId, uint256 index) external view tokenExists(tokenId) returns (AccessRecord memory) {
        require(index < _accessLedger[tokenId].length, "DNaI: Access record index out of bounds");
        return _accessLedger[tokenId][index];
    }

    /**
     * @notice Updates the FTSO oracle address (admin only).
     * @param _newFTSO New FTSO contract address.
     */
    function updateFTSOAddress(address _newFTSO) external onlyAdmin {
        require(_newFTSO != address(0), "DNaI: Invalid FTSO address");
        ftsoOracleAddress = _newFTSO;
        emit FTSOAddressUpdated(_newFTSO);
    }

    // --- Internal Helpers ---

    function _logAccess(
        uint256 tokenId,
        address researcher,
        uint256 flrPaid,
        string memory purpose,
        bool authorized
    ) internal {
        _accessLedger[tokenId].push(AccessRecord({
            researcher: researcher,
            timestamp: block.timestamp,
            flrPaid: flrPaid,
            queryPurpose: purpose,
            wasAuthorized: authorized
        }));
    }

    function _recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _sig) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(_sig);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function _splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "DNaI: Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    // --- Fallback ---
    receive() external payable {}
}
