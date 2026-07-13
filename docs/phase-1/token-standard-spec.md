# DNaI Genomic Sovereign Token — Standard Specification

**Document Version:** 0.1  
**Status:** Draft  
**Author:** Cloud Control LLC — DNaI Protocol Team  
**Date:** July 1, 2026  
**Phase:** I — Foundation  

---

## Table of Contents

1. [Token Overview](#1-token-overview)
2. [Token Data Structure](#2-token-data-structure)
3. [Smart Contract Specification](#3-smart-contract-specification)
4. [Royalty Mechanism](#4-royalty-mechanism)
5. [On-Chain Consent Layer](#5-on-chain-consent-layer)
6. [Genesis Event Mechanics](#6-genesis-event-mechanics)
7. [Governance Rights](#7-governance-rights)
8. [Competitive Analysis](#8-competitive-analysis)
9. [Audit Requirements](#9-audit-requirements)
10. [Appendix: Interface Summary](#10-appendix-interface-summary)

---

## 1. Token Overview

### 1.1 Summary

The **DNaI Genomic Sovereign Token** is a blockchain-native instrument proving cryptographic, sovereign ownership over one specific human genome. Each token represents an irrevocable, on-chain attestation that a unique, verified genome has been encrypted, vaulted, and registered to a single human owner — and that the owner retains exclusive authority over all downstream access, licensing, and consent decisions.

| Property | Value |
|---|---|
| Token Name | DNaI (Genomic Sovereign Token) |
| Symbol | DNaI |
| Base Standard | ERC-721 |
| Extensions | Soulbound (EIP-5192), Royalties (EIP-2981), Consent Layer (custom) |
| Deployment Chain | Ethereum L2 — Base (preferred) |
| Fallback Chain | Ethereum Mainnet (for finality anchoring) |
| Token Model | Non-fungible, non-transferable (soulbound) |
| Max Supply | Uncapped (one per verified human genome; functionally bounded by global population) |
| Genesis Cohort | 10,000 tokens (founding-member batch) |

### 1.2 Design Principles

**Sovereignty First.** The token does not merely represent genomic data — it represents ownership authority. The genome owner holds the only key capable of authorizing data access. Smart contracts enforce consent; they do not override it.

**Soulbound Sovereignty, Tradeable Access.** The DNaI token itself is non-transferable; sovereignty cannot be sold. However, the protocol supports the minting of separate, time-bound, scope-limited **Access Rights Tokens (ART)** — tradeable ERC-20 or ERC-1155 instruments representing licensed access to specific genomic data subsets. This separation is critical: it preserves identity sovereignty while enabling a compliant data economy.

**Client-Side Encryption.** Genomic data is encrypted at the source, before upload, using owner-controlled keys. The protocol never holds plaintext genomic data. The chain holds only hashes, CIDs, and consent state.

**ZK-First Verification.** Zero-knowledge proofs allow researchers to verify genomic properties (e.g., presence of a disease-associated variant) without accessing the underlying sequence. This is the protocol's core privacy guarantee.

### 1.3 Chain Selection Rationale

Base (Coinbase L2, Ethereum-equivalent) is the primary deployment target for the following reasons:

- Gas costs 10–100x lower than Ethereum mainnet, making consent transactions and royalty distributions economically viable at scale
- EVM-equivalent: full Solidity/Foundry toolchain compatibility
- Native USDC support (Circle's primary stablecoin deployment) essential for royalty payouts
- Ethereum mainnet used for periodic state root anchoring to inherit L1 security for high-value consent events

---

## 2. Token Data Structure

### 2.1 On-Chain Storage (Canonical State)

The following fields are stored directly in contract storage. They are the authoritative source of truth and cannot be changed post-mint except by explicit, permissioned operations.

```
struct DNaIToken {
    uint256 tokenId;          // keccak256(genomeHash ++ ownerAddress ++ chainId)
    bytes32 genomeHash;       // SHA-256 of the encrypted vault CID (IPFS content address)
    string  vaultCID;         // IPFS CID of the encrypted genomic data package
    address ownerAddress;     // Immutable after mint; soulbound recipient
    address sequencingProvider; // Verified provider that called mint()
    uint256 mintTimestamp;    // block.timestamp at mint
    bool    isGenesisMember;  // True if tokenId index <= 10,000
    uint8   consentVersion;   // Current consent policy version accepted by owner
}
```

**tokenId derivation:**

```solidity
uint256 tokenId = uint256(
    keccak256(abi.encodePacked(genomeHash, ownerAddress, block.chainid))
);
```

This deterministic derivation ensures:
- Uniqueness: the same genome cannot be re-minted to the same owner on the same chain
- Cross-chain collision resistance via `chainId` inclusion
- Verifiability: anyone can recompute the expected tokenId from public inputs

### 2.2 Off-Chain Metadata (IPFS JSON)

Token URI points to a JSON document stored on IPFS (pinned via Filecoin for persistence). This document is the ERC-721 `tokenURI` payload and contains all non-critical metadata not requiring on-chain enforcement.

```json
{
  "name": "DNaI Genomic Sovereign Token #<tokenId>",
  "description": "Cryptographic proof of sovereign ownership over a verified human genome.",
  "image": "ipfs://<CID>/dnai-token-art.svg",
  "external_url": "https://dnai.cloudcontrolllc.com/token/<tokenId>",
  "attributes": [
    { "trait_type": "sequencingProvider", "value": "<provider_name>" },
    { "trait_type": "sequencingType",     "value": "WGS | WES | SNP_ARRAY" },
    { "trait_type": "coverageDepth",      "value": "30x" },
    { "trait_type": "referenceGenome",    "value": "GRCh38" },
    { "trait_type": "mintDate",           "value": "2026-07-01" },
    { "trait_type": "genesisStatus",      "value": "Founding Member | Standard" },
    { "trait_type": "consentScopesActive", "value": 0 }
  ],
  "dnai_metadata": {
    "genomeHash": "<bytes32 hex>",
    "vaultCID": "ipfs://<encrypted-vault-CID>",
    "encryptionScheme": "AES-256-GCM + ECIES-secp256k1",
    "zkProofCapable": true,
    "dataVersion": "1.0"
  }
}
```

### 2.3 On-Chain vs. Off-Chain Split

| Field | Location | Rationale |
|---|---|---|
| `tokenId` | On-chain | Required for ERC-721 indexing and all contract logic |
| `genomeHash` | On-chain | Integrity anchor; must be immutable and publicly verifiable |
| `vaultCID` | On-chain | Needed by consent layer to locate encrypted payload |
| `ownerAddress` | On-chain | Soulbound enforcement; consent authorization check |
| `sequencingProvider` | On-chain | Access control for mint; auditable provenance |
| `mintTimestamp` | On-chain | Genesis cohort determination; dispute resolution |
| `isGenesisMember` | On-chain | Governance weight calculation |
| `consentVersion` | On-chain | Policy enforcement |
| Sequencing type/depth | Off-chain (IPFS) | Informational; not required by contract logic |
| Token artwork | Off-chain (IPFS) | Non-functional display metadata |
| Reference genome version | Off-chain (IPFS) | Informational; may migrate as genome assemblies update |
| Active consent scope count | Off-chain (IPFS, updated) | Dashboard display; authoritative state is in ConsentRegistry |

---

## 3. Smart Contract Specification

### 3.1 Contract Architecture

The DNaI protocol is composed of four contracts, each with a single responsibility:

```
DNaIToken.sol          — ERC-721 core; mint, soulbound enforcement, tokenURI
ConsentRegistry.sol    — Access grant/revoke, scope management, audit events
RoyaltyDistributor.sol — Fee splits, escrow, claimRoyalties
DNaIGovernor.sol       — DAO voting, delegation, proposal execution
```

All contracts are upgradeable via UUPS proxy pattern (OpenZeppelin), with upgrade authority held by the DNaI DAO multisig (3-of-5 initially, transitioning to full DAO governance by Phase III).

### 3.2 DNaIToken.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC5192.sol"; // Soulbound interface

contract DNaIToken is ERC721Upgradeable, IERC2981, IERC5192 {

    // ─── State ───────────────────────────────────────────────────────────────

    struct TokenData {
        bytes32 genomeHash;
        string  vaultCID;
        address ownerAddress;
        address sequencingProvider;
        uint256 mintTimestamp;
        bool    isGenesisMember;
        uint8   consentVersion;
    }

    mapping(uint256 => TokenData) private _tokenData;
    mapping(address => bool)      public  approvedProviders;
    mapping(bytes32 => bool)      private _genomeHashMinted; // prevent duplicate genomes

    uint256 public totalMinted;
    uint256 public constant GENESIS_SUPPLY = 10_000;
    address public protocolAdmin; // transitioning to DAO
    address public royaltyDistributor;

    // ─── Events ──────────────────────────────────────────────────────────────

    event GenomeMinted(
        uint256 indexed tokenId,
        address indexed owner,
        address indexed provider,
        bytes32 genomeHash,
        string  vaultCID,
        bool    isGenesisMember
    );

    event ProviderApproved(address indexed provider);
    event ProviderRevoked(address indexed provider);

    // ─── Modifiers ───────────────────────────────────────────────────────────

    modifier onlyApprovedProvider() {
        require(approvedProviders[msg.sender], "DNaI: caller not approved provider");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == protocolAdmin, "DNaI: caller not admin");
        _;
    }

    // ─── Initialization ──────────────────────────────────────────────────────

    function initialize(
        address _protocolAdmin,
        address _royaltyDistributor
    ) public initializer {
        __ERC721_init("DNaI Genomic Sovereign Token", "DNaI");
        protocolAdmin = _protocolAdmin;
        royaltyDistributor = _royaltyDistributor;
    }

    // ─── Mint ────────────────────────────────────────────────────────────────

    /// @notice Mint a DNaI sovereign token. Called only by verified sequencing providers.
    /// @param owner         Wallet address of the genome owner (token recipient)
    /// @param genomeHash    SHA-256 of the encrypted vault CID; uniqueness enforced on-chain
    /// @param vaultCID      IPFS CID of the encrypted genomic data package
    /// @return tokenId      Deterministically derived from genomeHash + owner + chainId
    function mint(
        address owner,
        bytes32 genomeHash,
        string calldata vaultCID
    ) external onlyApprovedProvider returns (uint256 tokenId) {
        require(owner != address(0),           "DNaI: mint to zero address");
        require(genomeHash != bytes32(0),      "DNaI: empty genome hash");
        require(bytes(vaultCID).length > 0,    "DNaI: empty vault CID");
        require(!_genomeHashMinted[genomeHash], "DNaI: genome already minted");
        require(balanceOf(owner) == 0,         "DNaI: owner already holds a DNaI token");

        tokenId = uint256(
            keccak256(abi.encodePacked(genomeHash, owner, block.chainid))
        );

        _genomeHashMinted[genomeHash] = true;
        totalMinted++;

        bool isGenesis = (totalMinted <= GENESIS_SUPPLY);

        _tokenData[tokenId] = TokenData({
            genomeHash:          genomeHash,
            vaultCID:            vaultCID,
            ownerAddress:        owner,
            sequencingProvider:  msg.sender,
            mintTimestamp:       block.timestamp,
            isGenesisMember:     isGenesis,
            consentVersion:      1
        });

        _safeMint(owner, tokenId);

        emit GenomeMinted(tokenId, owner, msg.sender, genomeHash, vaultCID, isGenesis);
        emit Locked(tokenId); // EIP-5192 soulbound event
    }

    // ─── Soulbound Enforcement ───────────────────────────────────────────────

    /// @notice Overrides ERC-721 transfer functions to enforce soulbound constraint.
    /// Ownership can never be transferred; the token remains with the original recipient.
    function transferFrom(
        address,
        address,
        uint256
    ) public pure override {
        revert("DNaI: token is soulbound and non-transferable");
    }

    function safeTransferFrom(
        address,
        address,
        uint256
    ) public pure override {
        revert("DNaI: token is soulbound and non-transferable");
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override {
        revert("DNaI: token is soulbound and non-transferable");
    }

    /// @notice EIP-5192: all tokens are permanently locked
    function locked(uint256 tokenId) external view override returns (bool) {
        require(_exists(tokenId), "DNaI: query for nonexistent token");
        return true;
    }

    // ─── EIP-2981 Royalty Info ───────────────────────────────────────────────

    /// @notice Returns royalty receiver and amount for secondary market tooling.
    /// For DNaI, royalties are routed through RoyaltyDistributor.
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        require(_exists(tokenId), "DNaI: nonexistent token");
        receiver = royaltyDistributor;
        royaltyAmount = (salePrice * 1000) / 10_000; // 10% of any secondary sale
    }

    // ─── View Functions ──────────────────────────────────────────────────────

    function getTokenData(uint256 tokenId)
        external view returns (TokenData memory)
    {
        require(_exists(tokenId), "DNaI: nonexistent token");
        return _tokenData[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public view override returns (string memory)
    {
        require(_exists(tokenId), "DNaI: nonexistent token");
        // Returns IPFS URI; metadata JSON stored off-chain
        return string(abi.encodePacked(
            "ipfs://", _tokenData[tokenId].vaultCID, "/metadata.json"
        ));
    }

    // ─── Provider Management ─────────────────────────────────────────────────

    function approveProvider(address provider) external onlyAdmin {
        approvedProviders[provider] = true;
        emit ProviderApproved(provider);
    }

    function revokeProvider(address provider) external onlyAdmin {
        approvedProviders[provider] = false;
        emit ProviderRevoked(provider);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Upgradeable, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            interfaceId == type(IERC5192).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
```

### 3.3 ConsentRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ConsentRegistry
/// @notice Manages time-bound, scoped access grants over DNaI genomic data.
///         All consent events are indexed by The Graph for off-chain audit.
contract ConsentRegistry {

    // ─── Types ───────────────────────────────────────────────────────────────

    enum DataScope {
        FULL_GENOME,    // Complete whole-genome sequence
        VARIANT_PANEL,  // Pre-defined variant panel (e.g., BRCA1/2, pharmacogenomics)
        ANCESTRY,       // Ancestry composition and haplogroup data
        DISEASE_RISK,   // Polygenic risk scores for specified conditions
        DRUG_RESPONSE   // Pharmacogenomic response markers
    }

    struct AccessGrant {
        address requester;     // Authorized data accessor (pharma, researcher, AI co.)
        DataScope scope;       // Granted data scope category
        uint256 grantedAt;     // block.timestamp of grant
        uint256 expiresAt;     // 0 = no expiry; otherwise UNIX timestamp
        uint256 price;         // Total USDC paid for this access grant (18 decimals)
        bool    active;        // False if revoked or expired
        bytes32 zkProofKey;    // Optional: identifier for ZK proof circuit to use
    }

    // tokenId => requester => AccessGrant
    mapping(uint256 => mapping(address => AccessGrant)) public accessGrants;
    // tokenId => list of requesters (for enumeration)
    mapping(uint256 => address[]) private _grantees;

    address public dnaiToken;
    address public royaltyDistributor;

    // ─── Events ──────────────────────────────────────────────────────────────

    event ConsentGranted(
        uint256 indexed tokenId,
        address indexed requester,
        DataScope       scope,
        uint256         duration,   // seconds; 0 = indefinite
        uint256         price,      // USDC amount
        uint256         timestamp
    );

    event ConsentRevoked(
        uint256 indexed tokenId,
        address indexed requester,
        uint256         timestamp
    );

    event AccessVerified(
        uint256 indexed tokenId,
        address indexed requester,
        DataScope       scope,
        uint256         timestamp
    );

    // ─── Modifiers ───────────────────────────────────────────────────────────

    modifier onlyTokenOwner(uint256 tokenId) {
        require(
            IDNaIToken(dnaiToken).ownerOf(tokenId) == msg.sender,
            "ConsentRegistry: caller is not token owner"
        );
        _;
    }

    // ─── Core Consent Functions ───────────────────────────────────────────────

    /// @notice Grant time-bound, scoped access to genomic data for a specific requester.
    /// @param tokenId     The DNaI token representing the genome
    /// @param requester   Address of the data requester (must be a registered entity)
    /// @param scope       Data scope category being licensed
    /// @param duration    Access duration in seconds (0 = no expiry; use with caution)
    /// @param price       USDC amount paid for access (transferred to RoyaltyDistributor)
    function grantAccess(
        uint256   tokenId,
        address   requester,
        DataScope scope,
        uint256   duration,
        uint256   price
    ) external onlyTokenOwner(tokenId) {
        require(requester != address(0), "ConsentRegistry: zero requester");
        require(
            !accessGrants[tokenId][requester].active,
            "ConsentRegistry: active grant already exists; revoke first"
        );

        uint256 expiresAt = (duration == 0) ? 0 : block.timestamp + duration;

        accessGrants[tokenId][requester] = AccessGrant({
            requester:  requester,
            scope:      scope,
            grantedAt:  block.timestamp,
            expiresAt:  expiresAt,
            price:      price,
            active:     true,
            zkProofKey: bytes32(0)
        });

        _grantees[tokenId].push(requester);

        // Trigger royalty accounting
        IRoyaltyDistributor(royaltyDistributor).recordAccessPayment(
            tokenId, requester, price
        );

        emit ConsentGranted(tokenId, requester, scope, duration, price, block.timestamp);
    }

    /// @notice Revoke a previously granted access right. Effective immediately.
    ///         Requester must purge cached data per off-chain data use agreement.
    /// @param tokenId    The DNaI token
    /// @param requester  Address whose access is being revoked
    function revokeAccess(
        uint256 tokenId,
        address requester
    ) external onlyTokenOwner(tokenId) {
        AccessGrant storage grant = accessGrants[tokenId][requester];
        require(grant.active, "ConsentRegistry: no active grant to revoke");

        grant.active = false;

        emit ConsentRevoked(tokenId, requester, block.timestamp);
    }

    /// @notice Check whether a requester has valid, unexpired access for a given scope.
    ///         Called by data delivery infrastructure before releasing encrypted payload.
    function hasValidAccess(
        uint256   tokenId,
        address   requester,
        DataScope scope
    ) external returns (bool valid) {
        AccessGrant storage grant = accessGrants[tokenId][requester];

        if (!grant.active) return false;
        if (grant.scope != scope && grant.scope != DataScope.FULL_GENOME) return false;
        if (grant.expiresAt != 0 && block.timestamp > grant.expiresAt) {
            // Auto-expire
            grant.active = false;
            emit ConsentRevoked(tokenId, requester, block.timestamp);
            return false;
        }

        emit AccessVerified(tokenId, requester, scope, block.timestamp);
        return true;
    }

    /// @notice Return all active grantees for a token (for owner dashboard).
    function listActiveGrants(uint256 tokenId)
        external view returns (AccessGrant[] memory active)
    {
        address[] storage grantees = _grantees[tokenId];
        uint256 count = 0;
        for (uint256 i = 0; i < grantees.length; i++) {
            if (accessGrants[tokenId][grantees[i]].active) count++;
        }
        active = new AccessGrant[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < grantees.length; i++) {
            if (accessGrants[tokenId][grantees[i]].active) {
                active[idx++] = accessGrants[tokenId][grantees[i]];
            }
        }
    }
}
```

### 3.4 RoyaltyDistributor.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title RoyaltyDistributor
/// @notice Receives USDC access payments and distributes them per the protocol fee split.
///         Genome holders pull their share via claimRoyalties().
contract RoyaltyDistributor {

    // ─── Fee Split Constants (basis points, out of 10,000) ───────────────────

    uint256 public constant HOLDER_BPS         = 7000; // 70% to genome owner
    uint256 public constant PROTOCOL_BPS       = 2000; // 20% to Cloud Control LLC
    uint256 public constant DAO_TREASURY_BPS   = 1000; // 10% to DAO treasury

    address public immutable usdc;
    address public immutable protocolFeeAddress;  // Cloud Control LLC treasury
    address public immutable daoTreasury;

    address public dnaiToken;
    address public consentRegistry;

    // tokenId => claimable USDC balance (18 decimals)
    mapping(uint256 => uint256) public pendingRoyalties;
    // tokenId => total lifetime USDC earned
    mapping(uint256 => uint256) public lifetimeEarnings;
    // tokenId => requester => amount held in dispute escrow
    mapping(uint256 => mapping(address => uint256)) public disputeEscrow;

    // ─── Events ──────────────────────────────────────────────────────────────

    event RoyaltyAccrued(
        uint256 indexed tokenId,
        address indexed requester,
        uint256 holderAmount,
        uint256 protocolAmount,
        uint256 daoAmount
    );

    event RoyaltyClaimed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 amount
    );

    event EscrowCreated(
        uint256 indexed tokenId,
        address indexed requester,
        uint256 amount
    );

    event EscrowResolved(
        uint256 indexed tokenId,
        address indexed requester,
        bool    releasedToHolder
    );

    // ─── Core Distribution ───────────────────────────────────────────────────

    /// @notice Called by ConsentRegistry when an access payment is made.
    ///         USDC must be transferred to this contract before or atomically with this call.
    function recordAccessPayment(
        uint256 tokenId,
        address requester,
        uint256 totalAmount
    ) external onlyConsentRegistry {
        require(totalAmount > 0, "RoyaltyDistributor: zero payment");

        uint256 holderShare   = (totalAmount * HOLDER_BPS)       / 10_000;
        uint256 protocolShare = (totalAmount * PROTOCOL_BPS)     / 10_000;
        uint256 daoShare      = (totalAmount * DAO_TREASURY_BPS) / 10_000;

        pendingRoyalties[tokenId] += holderShare;
        lifetimeEarnings[tokenId] += holderShare;

        // Immediately route protocol and DAO shares
        IERC20(usdc).transfer(protocolFeeAddress, protocolShare);
        IERC20(usdc).transfer(daoTreasury, daoShare);

        emit RoyaltyAccrued(tokenId, requester, holderShare, protocolShare, daoShare);
    }

    /// @notice Genome owner pulls their accrued royalties. Pull-over-push pattern
    ///         prevents reentrancy and distributes gas costs to claimants.
    /// @param tokenId  The DNaI token whose royalties are being claimed
    function claimRoyalties(uint256 tokenId) external {
        address owner = IDNaIToken(dnaiToken).ownerOf(tokenId);
        require(msg.sender == owner, "RoyaltyDistributor: caller is not token owner");

        uint256 amount = pendingRoyalties[tokenId];
        require(amount > 0, "RoyaltyDistributor: no royalties to claim");

        pendingRoyalties[tokenId] = 0;

        IERC20(usdc).transfer(owner, amount);

        emit RoyaltyClaimed(tokenId, owner, amount);
    }

    /// @notice Place disputed payment in escrow pending resolution.
    ///         Called by DAO multisig when a data use violation is raised.
    function createEscrow(
        uint256 tokenId,
        address requester,
        uint256 amount
    ) external onlyAdmin {
        // Reduce pending royalties by disputed amount (already accrued)
        require(pendingRoyalties[tokenId] >= amount, "RoyaltyDistributor: insufficient pending balance");
        pendingRoyalties[tokenId] -= amount;
        disputeEscrow[tokenId][requester] += amount;

        emit EscrowCreated(tokenId, requester, amount);
    }

    /// @notice Resolve escrow: release to genome holder (violation confirmed)
    ///         or return to requester (dispute rejected).
    function resolveEscrow(
        uint256 tokenId,
        address requester,
        bool    releaseToHolder
    ) external onlyAdmin {
        uint256 amount = disputeEscrow[tokenId][requester];
        require(amount > 0, "RoyaltyDistributor: no escrow to resolve");

        disputeEscrow[tokenId][requester] = 0;

        if (releaseToHolder) {
            address owner = IDNaIToken(dnaiToken).ownerOf(tokenId);
            IERC20(usdc).transfer(owner, amount);
        } else {
            IERC20(usdc).transfer(requester, amount);
        }

        emit EscrowResolved(tokenId, requester, releaseToHolder);
    }
}
```

### 3.5 DNaIGovernor.sol — Delegation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DNaIGovernor (excerpt — delegation module)
/// @notice Integrates with OpenZeppelin Governor for DAO voting.
///         Each DNaI token = 1 vote. Voting power may be delegated.
contract DNaIGovernor {

    // tokenId => delegated address (address(0) = self-vote)
    mapping(uint256 => address) public votingDelegate;

    event DelegateSet(
        uint256 indexed tokenId,
        address indexed delegator,
        address indexed delegate
    );

    /// @notice Delegate voting power for a token to another address.
    ///         Delegation is revocable at any time by the token owner.
    ///         A token owner may delegate to themselves (default behavior).
    /// @param tokenId   The DNaI token whose vote is being delegated
    /// @param delegate  Address to receive voting power; address(0) to self-delegate
    function delegate(uint256 tokenId, address delegate) external {
        require(
            IDNaIToken(dnaiToken).ownerOf(tokenId) == msg.sender,
            "DNaIGovernor: caller is not token owner"
        );

        votingDelegate[tokenId] = delegate;

        emit DelegateSet(tokenId, msg.sender, delegate);
    }

    /// @notice Return the effective voting address for a token.
    function getDelegate(uint256 tokenId) external view returns (address) {
        address d = votingDelegate[tokenId];
        // Default to owner if no explicit delegate set
        return (d == address(0))
            ? IDNaIToken(dnaiToken).ownerOf(tokenId)
            : d;
    }

    /// @notice Count voting power for an address across all tokens they hold
    ///         or have been delegated.
    function getVotes(address account) external view returns (uint256 votes) {
        // Implementation iterates the token registry; production version uses
        // Checkpoints for gas-efficient snapshot voting (ERC-5805 / OpenZeppelin ERC721Votes)
        return _computeVotes(account);
    }
}
```

---

## 4. Royalty Mechanism

### 4.1 Fee Structure

All data access payments are denominated in USDC (ERC-20, Base network). The protocol enforces the following split at the contract level, with no admin override capability:

| Recipient | Share | Address |
|---|---|---|
| Genome Owner (token holder) | 70% | `ownerOf(tokenId)` — pull model |
| Cloud Control LLC (protocol fee) | 20% | Multisig treasury |
| DNaI DAO Treasury | 10% | DAO-controlled contract |

The split is enforced on-chain and is not configurable by any single party. Changing the fee structure requires a DAO governance vote with supermajority (see Section 7).

### 4.2 Payment Flow

```
Requester (pharma, researcher, AI co.)
    │
    │  USDC transfer + grantAccess() call (atomic)
    ▼
ConsentRegistry.sol
    │
    │  recordAccessPayment(tokenId, requester, amount)
    ▼
RoyaltyDistributor.sol
    ├── 70% → pendingRoyalties[tokenId]  (claimable by holder)
    ├── 20% → protocolFeeAddress          (Cloud Control LLC, immediate transfer)
    └── 10% → daoTreasury                 (immediate transfer)
```

### 4.3 Streaming Royalties (Phase II Extension)

For high-frequency, continuous data access arrangements (e.g., an AI training pipeline with ongoing genomic data access), the protocol will support streaming micropayments via **Superfluid Protocol** (native on Base):

- Requester opens a Superfluid stream denominated in USDCx (wrapped USDC)
- Stream rate is denominated per-second and maps to the agreed annual license fee
- ConsentRegistry monitors stream health; access reverts automatically if stream is cancelled or underfunded
- Streamed amounts are settled into the royalty distribution split via a Superfluid SuperApp hook

This removes the need for manual renewal transactions and enables truly continuous royalty accrual. Superfluid integration is scoped for Phase II smart contract development.

### 4.4 Escrow and Dispute Mechanics

When a genome owner raises a data use violation (e.g., requester used data beyond granted scope):

1. Owner or DAO flags the dispute via `createEscrow(tokenId, requester, amount)`
2. The disputed amount is frozen from the requester's accrued pool (if not yet claimed)
3. DAO arbitration panel reviews evidence within 14-day window
4. `resolveEscrow()` releases funds to the appropriate party
5. Repeat violations trigger requester blacklist via `revokeProvider()` equivalent in ConsentRegistry

### 4.5 EIP-2981 Compatibility

DNaIToken.sol implements `royaltyInfo()` per EIP-2981 to ensure compatibility with NFT marketplace tooling. Since DNaI tokens are soulbound and not tradeable on secondary markets, this implementation is a forward-compatibility measure for any ecosystem integrations that query royalty data.

---

## 5. On-Chain Consent Layer

### 5.1 Consent Event Schema

All consent events are emitted as EVM logs and indexed by The Graph subgraph for queryable audit history. The following canonical event signatures are used:

```solidity
// Access granted
event ConsentGranted(
    uint256 indexed tokenId,
    address indexed requester,
    DataScope       scope,       // enum: FULL_GENOME | VARIANT_PANEL | ANCESTRY | DISEASE_RISK | DRUG_RESPONSE
    uint256         duration,    // seconds; 0 = indefinite (requires explicit revocation)
    uint256         price,       // USDC paid, 18-decimal precision
    uint256         timestamp    // block.timestamp
);

// Access revoked (by owner or auto-expiry)
event ConsentRevoked(
    uint256 indexed tokenId,
    address indexed requester,
    uint256         timestamp
);

// Access verified (logged each time a requester is granted entry by the delivery layer)
event AccessVerified(
    uint256 indexed tokenId,
    address indexed requester,
    DataScope       scope,
    uint256         timestamp
);
```

### 5.2 Data Scope Categories

| Scope | Enum Value | Description | Typical Use Case |
|---|---|---|---|
| `FULL_GENOME` | 0 | Complete whole-genome sequence; includes all variants, insertions, deletions, structural variants | Clinical research, longitudinal studies, AI training |
| `VARIANT_PANEL` | 1 | A defined set of variants (e.g., 500K SNP array); agreed list in off-chain data use agreement | GWAS studies, specific disease research |
| `ANCESTRY` | 2 | Ancestry composition, haplogroup, population assignment | Consumer ancestry products, anthropology research |
| `DISEASE_RISK` | 3 | Computed polygenic risk scores for specified conditions; no raw sequence | Insurance research (regulated), preventive medicine |
| `DRUG_RESPONSE` | 4 | Pharmacogenomic markers (e.g., CYP2D6, TPMT, VKORC1); no raw sequence | Precision prescribing, clinical trials |

Access scope is enforced at the consent grant level. The encrypted vault package contains separate sub-packages per scope, each encrypted with a different derived key. A `VARIANT_PANEL` grant cannot decrypt the `FULL_GENOME` sub-package. ZK proofs allow proving properties within a scope without revealing the underlying data.

### 5.3 Time-Bound Access

All access grants carry an explicit duration. The protocol enforces three time-bound models:

| Model | `duration` Value | Use Case |
|---|---|---|
| One-time access | `86400` (24 hours) | Spot query; single dataset download |
| Term license | `7776000` (90 days) | Clinical trial phase data window |
| Annual subscription | `31536000` (365 days) | Ongoing research partnership |
| Indefinite | `0` | Long-term institutional access (explicit owner choice; requires DAO notification) |

Auto-expiry is enforced lazily: `hasValidAccess()` checks `block.timestamp > expiresAt` and marks the grant inactive on first access attempt post-expiry. A keeper bot (Chainlink Automation or Gelato) can proactively batch-expire grants to maintain clean on-chain state.

### 5.4 The Graph Indexing

A dedicated DNaI subgraph on The Graph (Base network) indexes all consent events and exposes a GraphQL API:

```graphql
type ConsentGrant @entity {
  id:           ID!           # tokenId-requester-grantedAt
  tokenId:      BigInt!
  requester:    Bytes!
  scope:        DataScope!
  grantedAt:    BigInt!
  expiresAt:    BigInt!
  price:        BigInt!
  active:       Boolean!
  revokedAt:    BigInt
}

type TokenRoyaltySummary @entity {
  id:               ID!       # tokenId
  tokenId:          BigInt!
  lifetimeEarnings: BigInt!
  pendingClaim:     BigInt!
  totalGrants:      Int!
  activeGrants:     Int!
}
```

This subgraph powers:
- The DNaI owner dashboard (real-time royalty and consent state)
- Regulator audit exports (HIPAA, GDPR Article 30 processing records)
- Partner transparency reports

---

## 6. Genesis Event Mechanics

### 6.1 Overview

The first **10,000 DNaI tokens** minted constitute the **Founding Genomic Cohort** — a permanent designation baked into on-chain token data at mint time. Genesis members receive protocol-level benefits that are non-transferable and do not expire.

### 6.2 Genesis Member Benefits

| Benefit | Description |
|---|---|
| Enhanced governance weight | 1.5x voting power in DNaI DAO (for first 3 years post-genesis) |
| Royalty boost | 5% royalty bonus on all data access payments (paid from protocol fee share) |
| Founding Member badge | On-chain `isGenesisMember = true`; reflected in token metadata |
| Priority partner access | First right of participation in clinical research programs negotiated by Cloud Control LLC |
| Protocol fee waiver | Zero protocol fee on first $1,000 of lifetime royalty earnings |

### 6.3 Whitelist Mechanism

Genesis mint is restricted to whitelisted addresses. Whitelist eligibility:

1. **Verified early sequencing partners** — genomes processed by Cloud Control LLC's inaugural sequencing partners during the genesis window
2. **Protocol waitlist participants** — individuals who registered at `dnai.cloudcontrolllc.com` and completed identity pre-verification before the genesis close date
3. **DAO contributor allocation** — up to 500 addresses reserved for core protocol contributors (developers, auditors, legal counsel); allocated by DAO multisig

Whitelist is implemented as a Merkle tree root stored on-chain. Proof is provided at mint time:

```solidity
function mintGenesis(
    address owner,
    bytes32 genomeHash,
    string calldata vaultCID,
    bytes32[] calldata merkleProof
) external onlyApprovedProvider {
    require(
        MerkleProof.verify(merkleProof, genesisRoot, keccak256(abi.encodePacked(owner))),
        "DNaI: address not on genesis whitelist"
    );
    _mint(owner, genomeHash, vaultCID);
}
```

### 6.4 Genesis Pricing

| Participant Type | Mint Cost |
|---|---|
| Early sequencing partner clients | Free (mint fee absorbed by sequencing partner) |
| Waitlist participants (protocol-subsidized) | Free (first 5,000); nominal gas only |
| Waitlist participants (standard) | Gas only (no protocol fee) |
| DAO contributor allocation | Free |

There is no protocol-level mint fee for any genesis participant. The business model is royalty-stream revenue, not mint fees.

### 6.5 Genesis Close Conditions

Genesis status closes when either:
- 10,000 tokens have been minted, or
- The genesis window end date (TBD at Phase II kickoff) passes

After genesis close, the `isGenesisMember` flag is permanently false for all subsequent mints. The genesis close is enforced by the counter `totalMinted` in `DNaIToken.sol`.

---

## 7. Governance Rights

### 7.1 Voting Structure

The DNaI DAO governs the protocol via on-chain governance built on OpenZeppelin Governor (Bravo-compatible). Voting power is derived from DNaI token holdings:

| Parameter | Value |
|---|---|
| Base voting weight | 1 token = 1 vote |
| Genesis member multiplier | 1.5x for the first 3 years |
| Voting period | 5 days |
| Voting delay (after proposal creation) | 1 day |
| Proposal threshold | Minimum 10 DNaI tokens (or delegated votes) to submit |
| Quorum | 10% of circulating token supply |
| Standard majority | >50% of cast votes |
| Supermajority (protocol changes) | ≥67% of cast votes |
| Execution timelock | 48 hours after vote passes |

### 7.2 Proposal Types

| Proposal Type | Majority Required | Description |
|---|---|---|
| Data Usage Policy Update | Standard (50%) | Add, modify, or deprecate a DataScope category; update off-chain data use agreement templates |
| Royalty Fee Adjustment | Supermajority (67%) | Change the protocol fee split (HOLDER_BPS, PROTOCOL_BPS, DAO_TREASURY_BPS) |
| New Data Scope Category | Standard (50%) | Add a new consent scope enum value and associated ZK circuit |
| Protocol Upgrade | Supermajority (67%) | UUPS proxy upgrade to any core contract |
| Sequencing Provider Approval | Standard (50%) | Approve or revoke sequencing provider whitelist status |
| Treasury Allocation | Standard (50%) | Allocate DAO treasury funds to grants, audits, or partnerships |
| Emergency Pause | DAO Multisig (3-of-5) | Emergency circuit breaker; no full vote required; must be ratified within 72 hours |

### 7.3 Delegation

Genome owners may delegate their vote to any address without transferring the token. Delegation is revocable at any time. Common delegation targets:

- Research-aligned representatives (e.g., patient advocacy groups)
- Technical experts for protocol upgrade votes
- Institutional delegates for governance continuity

Delegation is recorded in `DNaIGovernor.sol` via the `delegate()` function (see Section 3.5).

### 7.4 Governance Timeline

| Phase | Governance State |
|---|---|
| Phase I–II | DAO multisig (3-of-5, Cloud Control LLC controlled) |
| Phase III | Hybrid: multisig veto + DAO vote on major proposals |
| Phase IV | Full DAO governance; multisig retains emergency pause only |
| 24 months post-genesis | Multisig emergency pause transferred to DAO timelock |

---

## 8. Competitive Analysis

### 8.1 Landscape Overview

| Protocol | Launch | Model | On-Chain Consent | ZK Proofs | Royalty Streaming | DAO Governance |
|---|---|---|---|---|---|---|
| **Nebula Genomics** | 2018 | Centralized custodian; token rewards for sharing | No (ToS-based) | No | No | No |
| **Shivom** | 2018 | Blockchain data marketplace; OmniPHR concept | Limited (basic smart contract) | No | No | Token-weighted (limited) |
| **EncrypGen (Gene-Chain)** | 2018 | Peer-to-peer genomic data marketplace; DNA token | No (platform-enforced) | No | No | No |
| **Genomes.io** | 2019 | Consumer genomic platform; partial encryption | No | No | No | No |
| **DNaI (this document)** | 2026 | Sovereign token; client-side encryption; ZK licensing | Yes (on-chain, auditable) | Yes (Phase II) | Yes (Superfluid) | Yes (full DAO, Phase IV) |

### 8.2 Differentiation Analysis

**Nebula Genomics**

Nebula is the most commercially mature genomics-blockchain hybrid but operates as a centralized custodian. Users upload genomic data to Nebula's servers; Nebula compensates users with tokens for consenting to research access. The key failure mode: Nebula holds the data and controls access. Consent is a terms-of-service construct, not an on-chain enforcement mechanism. There is no cryptographic proof of sovereignty.

DNaI differentiation: The genome owner holds the encryption key. The protocol never holds plaintext genomic data. Consent is enforced by smart contract, not by a company's server-side policy.

**Shivom**

Shivom proposed a decentralized genomic data marketplace and introduced the OmniPHR (Personal Health Record) concept as a patient-controlled data store. Early roadmap included blockchain-based consent. Adoption has been limited due to the early-mover timing (2018 blockchain market), lack of zero-knowledge infrastructure, and absence of a true soulbound sovereignty model. Shivom's architecture requires data to pass through their marketplace infrastructure.

DNaI differentiation: Full client-side encryption with no protocol-level data custody. ZK proof licensing allows data monetization without exposing raw sequence data — Shivom had no equivalent capability. The DNaI DAO provides sustainable governance that was absent in Shivom's centralized team model.

**EncrypGen (Gene-Chain)**

EncrypGen built a peer-to-peer marketplace on their proprietary Gene-Chain, using the DNA token for transactions. The platform focuses on direct researcher-to-participant transactions for anonymized genomic data segments. Limitations: the Gene-Chain is a permissioned chain with limited DeFi composability; no ZK proof capability; no streaming royalties; consent is platform-enforced rather than cryptographically guaranteed.

DNaI differentiation: EVM-compatible deployment on Base provides full DeFi composability (USDC, Superfluid, Uniswap, Chainlink). The DNaI consent layer is fully on-chain and auditable via The Graph. ZK proofs allow pharma and AI companies to verify genomic properties without receiving raw data — a capability EncrypGen cannot offer and which represents the highest-margin data licensing use case.

### 8.3 DNaI's Structural Advantages

1. **True sovereignty**: Client-side AES-256-GCM encryption with owner-controlled key derivation. No intermediary ever holds plaintext genomic data.
2. **ZK-first data licensing**: Researchers can prove genomic properties (e.g., "cohort has >60% responders to drug X") without receiving sequence data. This unlocks licensing tiers that competitors cannot match.
3. **On-chain consent with auto-expiry**: Time-bound, scope-limited consent enforced at the contract level, not by a company's internal policy. Auditable forever via The Graph.
4. **Royalty streaming**: Superfluid integration enables per-second USDC micropayments for ongoing data access — no manual renewals, no delayed payments.
5. **Soulbound sovereignty + tradeable access rights**: The separation of non-transferable sovereignty tokens from tradeable Access Rights Tokens (ART) is architecturally novel — it preserves identity integrity while enabling a liquid secondary market for data access licenses.
6. **DAO governance**: The protocol's rules are governed by genome owners themselves, not a corporate board. Fee structures, scope categories, and partner approvals are all subject to token holder votes.

---

## 9. Audit Requirements

### 9.1 Audit Scope

The following contract functions and modules represent the highest-risk attack surface and are mandatory audit targets before any mainnet deployment:

| Contract | Function / Module | Risk Category | Priority |
|---|---|---|---|
| `DNaIToken.sol` | `mint()` access control, `approvedProviders` management | Unauthorized minting | Critical |
| `DNaIToken.sol` | Soulbound enforcement (`transferFrom` overrides) | Token theft via transfer bypass | Critical |
| `DNaIToken.sol` | `tokenId` collision resistance | Duplicate genome registration | High |
| `ConsentRegistry.sol` | `grantAccess()` / `revokeAccess()` owner verification | Unauthorized consent manipulation | Critical |
| `ConsentRegistry.sol` | `hasValidAccess()` expiry logic | Stale access bypass | High |
| `RoyaltyDistributor.sol` | Fee split arithmetic | Fee manipulation, rounding exploits | High |
| `RoyaltyDistributor.sol` | `claimRoyalties()` reentrancy | Fund drainage | Critical |
| `RoyaltyDistributor.sol` | Escrow creation and resolution | Escrow manipulation, fund lock | High |
| `DNaIGovernor.sol` | Vote counting, delegation logic | Governance manipulation | High |
| `DNaIGovernor.sol` | Proposal execution timelock | Premature execution | Medium |
| All contracts | UUPS upgrade authorization | Unauthorized proxy upgrade | Critical |
| All contracts | Initialization functions | Reinitialization attacks | High |

### 9.2 Recommended Auditors

| Firm | Specialty | Engagement Timing |
|---|---|---|
| **Trail of Bits** | EVM security, cryptographic correctness, toolchain analysis | Phase II pre-testnet (primary audit) |
| **OpenZeppelin** | Governor pattern, ERC-721 extensions, access control | Phase II concurrent (focused review) |
| **Spearbit** | DeFi protocol security, economic attack vectors, fuzzing | Phase III pre-mainnet (final audit) |

A minimum of two independent audits from the above firms is required before mainnet deployment. Audit reports will be published publicly in the DNaI GitHub repository.

### 9.3 Formal Verification Targets

The following invariants are candidates for formal verification (Certora Prover or Echidna):

- `balanceOf(owner) <= 1` for all `owner` addresses at all times
- `_genomeHashMinted[hash] == true` implies exactly one token exists with that `genomeHash`
- `pendingRoyalties[tokenId]` can only decrease via `claimRoyalties()` (no unauthorized drain path)
- Sum of `HOLDER_BPS + PROTOCOL_BPS + DAO_TREASURY_BPS == 10_000` is a compile-time constant
- A token with `locked(tokenId) == true` cannot appear with a different `ownerOf()` after any state transition

---

## 10. Appendix: Interface Summary

### 10.1 IDNaIToken Interface

```solidity
interface IDNaIToken {
    function mint(address owner, bytes32 genomeHash, string calldata vaultCID)
        external returns (uint256 tokenId);
    function transferFrom(address, address, uint256) external pure;
    function locked(uint256 tokenId) external view returns (bool);
    function getTokenData(uint256 tokenId) external view returns (DNaIToken.TokenData memory);
    function ownerOf(uint256 tokenId) external view returns (address);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external view returns (address receiver, uint256 royaltyAmount);
    function approveProvider(address provider) external;
    function revokeProvider(address provider) external;
    function totalMinted() external view returns (uint256);
    function approvedProviders(address provider) external view returns (bool);
}
```

### 10.2 IConsentRegistry Interface

```solidity
interface IConsentRegistry {
    function grantAccess(
        uint256 tokenId, address requester, DataScope scope,
        uint256 duration, uint256 price
    ) external;
    function revokeAccess(uint256 tokenId, address requester) external;
    function hasValidAccess(uint256 tokenId, address requester, DataScope scope)
        external returns (bool);
    function listActiveGrants(uint256 tokenId)
        external view returns (AccessGrant[] memory);
}
```

### 10.3 IRoyaltyDistributor Interface

```solidity
interface IRoyaltyDistributor {
    function recordAccessPayment(uint256 tokenId, address requester, uint256 amount)
        external;
    function claimRoyalties(uint256 tokenId) external;
    function pendingRoyalties(uint256 tokenId) external view returns (uint256);
    function lifetimeEarnings(uint256 tokenId) external view returns (uint256);
    function createEscrow(uint256 tokenId, address requester, uint256 amount) external;
    function resolveEscrow(uint256 tokenId, address requester, bool releaseToHolder)
        external;
}
```

### 10.4 IDNaIGovernor Interface

```solidity
interface IDNaIGovernor {
    function delegate(uint256 tokenId, address delegate) external;
    function getDelegate(uint256 tokenId) external view returns (address);
    function getVotes(address account) external view returns (uint256);
    function propose(
        address[] memory targets, uint256[] memory values,
        bytes[] memory calldatas, string memory description
    ) external returns (uint256 proposalId);
    function castVote(uint256 proposalId, uint8 support) external returns (uint256 weight);
    function execute(
        address[] memory targets, uint256[] memory values,
        bytes[] memory calldatas, bytes32 descriptionHash
    ) external payable returns (uint256 proposalId);
}
```

### 10.5 Key Constants Reference

| Constant | Value | Location |
|---|---|---|
| `GENESIS_SUPPLY` | `10_000` | `DNaIToken.sol` |
| `HOLDER_BPS` | `7000` (70%) | `RoyaltyDistributor.sol` |
| `PROTOCOL_BPS` | `2000` (20%) | `RoyaltyDistributor.sol` |
| `DAO_TREASURY_BPS` | `1000` (10%) | `RoyaltyDistributor.sol` |
| `QUORUM_BPS` | `1000` (10%) | `DNaIGovernor.sol` |
| `SUPERMAJORITY_BPS` | `6700` (67%) | `DNaIGovernor.sol` |
| `VOTING_PERIOD` | `5 days` | `DNaIGovernor.sol` |
| `VOTING_DELAY` | `1 day` | `DNaIGovernor.sol` |
| `TIMELOCK_DELAY` | `48 hours` | `DNaIGovernor.sol` |

---

*DNaI Token Standard Specification v0.1 — Cloud Control LLC — July 1, 2026*  
*This document is confidential and intended for smart contract developers, protocol auditors, and strategic partners.*  
*For investor inquiries: everett@cloudcontrolllc.com*
