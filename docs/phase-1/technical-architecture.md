# DNaI Genomic Vault — Technical Architecture Specification

**Project:** DNaI — Genomic Sovereign Token  
**Organization:** Cloud Control LLC  
**Document Version:** 0.1.0  
**Status:** Phase I Draft  
**Date:** 2026-07-01  
**Classification:** Internal — Engineering  

---

## Table of Contents

1. [Overview & Guiding Principles](#1-overview--guiding-principles)
2. [Genomic Vault Architecture](#2-genomic-vault-architecture)
3. [Zero-Knowledge Proof Layer](#3-zero-knowledge-proof-layer)
4. [Smart Contract Architecture](#4-smart-contract-architecture)
5. [API Layer](#5-api-layer)
6. [Security Threat Model](#6-security-threat-model)
7. [Infrastructure Diagram](#7-infrastructure-diagram)
8. [Development Milestones — Phase I Weeks 1–6](#8-development-milestones--phase-i-weeks-16)

---

## 1. Overview & Guiding Principles

### 1.1 System Mission

DNaI transforms every human genome into a cryptographically sovereign, on-chain-anchored digital asset. The protocol guarantees that:

- Raw genomic sequences **never leave the owner's control** in plaintext.
- Researchers and pharma companies **cannot access data without explicit, auditable, on-chain consent**.
- Owners **earn streaming royalties** every time their data is queried under a consent grant.
- Any genomic claim (ancestry, disease variant, trait) can be **proven without revealing the underlying sequence** via zero-knowledge proofs.

### 1.2 Guiding Design Principles

| Principle | Implementation |
|---|---|
| **Sovereign by default** | Client-side encryption before any byte leaves the user's device |
| **Minimal trust surface** | No server ever sees plaintext genomic data; key material stays wallet-bound |
| **Verifiable without exposure** | ZK proofs provide selective disclosure without raw sequence leakage |
| **Composable consent** | On-chain consent registry enables programmable, auditable, revocable access grants |
| **Censorship-resistant storage** | Encrypted blobs stored on IPFS/Filecoin; no single operator can deny access |
| **Open standard** | ERC-721 extension, EIP-2981 royalties, and The Graph indexing enable third-party tooling |

### 1.3 Technology Stack Summary

| Layer | Technology |
|---|---|
| Encryption | AES-256-GCM, Argon2id, ECDH (secp256k1 / Curve25519) |
| Key Management | Wallet-bound keys, ERC-4337 Account Abstraction |
| Storage | IPFS + Filecoin (via web3.storage / Lighthouse) |
| ZK Framework | Noir (Aztec) |
| Smart Contracts | Solidity 0.8.x on Ethereum (L2: Base or Arbitrum) |
| Indexing | The Graph Protocol |
| Backend API | Rust / Axum |
| Frontend | React + wagmi + viem |
| Dev/Test | Foundry (forge, cast, anvil) |

---

## 2. Genomic Vault Architecture

### 2.1 Data Format Support

The vault ingests and encrypts genomic data in three industry-standard formats:

| Format | Description | Typical Size | Use Case |
|---|---|---|---|
| **VCF** (Variant Call Format) | Variant-only representation | 50 MB–1 GB | Consumer genomics (23andMe exports), clinical variants |
| **FASTQ** | Raw sequencing reads with quality scores | 10–100 GB | Whole-genome sequencing (WGS) raw output |
| **BAM / CRAM** | Aligned reads, reference-compressed | 10–60 GB | Clinical-grade aligned WGS |

All formats are processed identically by the encryption pipeline. The vault stores file type in encrypted metadata so the decryption layer knows how to present data to authorized consumers.

### 2.2 Client-Side Encryption Pipeline

Encryption is performed entirely within the user's browser or native client **before** any upload begins. The server and IPFS nodes only ever receive ciphertext.

#### 2.2.1 Key Derivation

```
User wallet (secp256k1 private key)
        │
        ▼
 ECDH key agreement with a per-vault ephemeral key
        │
        ▼
  Shared secret (32 bytes)
        │
        ▼
  Argon2id KDF
    - memory: 64 MiB
    - iterations: 3
    - parallelism: 4
    - salt: keccak256(owner_address || vault_uuid || "DNaI_v1")
        │
        ▼
  256-bit Data Encryption Key (DEK)
```

**Why Argon2id?** Argon2id provides memory-hardness that defeats GPU-based brute-force attacks on the derived key, critical because wallet addresses are public and the salt is therefore deterministic. The OWASP 2024 recommendation for password hashing defaults (`m=64MiB, t=3, p=4`) apply here.

**Why ECDH from wallet key?** The user's existing secp256k1 wallet private key acts as the root secret — no new secret needs to be stored or remembered. The ECDH derivation ensures the DEK changes per vault while remaining deterministically recoverable from the same wallet.

#### 2.2.2 Encryption

```
DEK (256-bit)
      │
      ▼
AES-256-GCM
  - IV:  96-bit random (generated per chunk)
  - AAD: keccak256(owner_address || vault_uuid || chunk_index)
  - Tag: 128-bit authentication tag appended to ciphertext
      │
      ▼
Ciphertext chunks (4 MB each for FASTQ; 16 MB for BAM)
```

**Chunked encryption** allows:
- Streaming upload to IPFS without loading a 100 GB file into memory
- Selective access: a researcher granted access to chromosome 22 only receives and decrypts that chunk range
- Incremental vault updates without re-encrypting the entire file

#### 2.2.3 Encrypted Manifest

Each vault carries a manifest encrypted with the same DEK:

```json
{
  "vault_uuid": "0x<uuid>",
  "owner": "0x<wallet_address>",
  "created_at": 1751328000,
  "genome_hash": "0x<keccak256_of_plaintext>",
  "file_format": "VCF",
  "reference_genome": "GRCh38",
  "chunk_count": 12,
  "chunks": [
    {
      "index": 0,
      "cid": "bafyreib...",
      "iv": "0x<96_bit_iv>",
      "tag": "0x<128_bit_tag>",
      "byte_range": [0, 4194304],
      "chromosome_range": "1:1-249250621"
    }
  ],
  "zk_commitment": "0x<poseidon_hash_of_genome_vector>"
}
```

The `zk_commitment` is a Poseidon hash of a fixed-length genomic feature vector (SNP positions, allele encodings), used as the public input to all ZK circuits without revealing raw sequence data.

### 2.3 Key Management Model

#### 2.3.1 Standard Key Recovery Path

The primary recovery path uses the user's secp256k1 wallet key:

```
Wallet Private Key
      │
      ├── Sign "DNaI vault access request" message
      │         (EIP-712 typed signature)
      │
      ├── ECDH with ephemeral vault public key
      │         ──► DEK re-derived
      │
      └── Decrypt manifest → decrypt requested chunks
```

No server holds any fragment of the DEK. The server holds only the encrypted manifest CID and the vault's on-chain registration.

#### 2.3.2 Social Recovery via ERC-4337 Account Abstraction

Users who lose their primary wallet can recover vault access via an ERC-4337 smart account configured with a guardian set:

```
Smart Account (ERC-4337)
      │
      ├── Guardian 1 (Trusted contact wallet)
      ├── Guardian 2 (Hardware wallet cold key)
      └── Guardian 3 (Cloud Control LLC key escrow — time-locked 30 days)

Recovery threshold: 2 of 3 guardians
Recovery action:   Rotate vault access key → re-encrypt manifest with new DEK
```

The recovery mechanism re-encrypts the vault manifest only — not the chunks — because the manifest stores per-chunk IVs. This limits re-encryption cost to ~1 KB per vault.

**Key escrow note:** Cloud Control LLC's guardian key is time-locked behind a 30-day on-chain delay and emits a public event, giving users a 30-day window to abort unauthorized recovery. This is the minimum-trust operator design.

#### 2.3.3 Key Wrapped Access Tokens

When a consent grant is approved, the vault owner's client generates a **Key Wrapped Access Token (KWAT)**:

```
Requester's public key (provided at consent-grant time)
      │
      ▼
ECDH key agreement
      │
      ▼
Wrap key (per-requester, per-grant, per-scope)
      │
      ▼
AES-KeyWrap (RFC 3394): Wrap(DEK_chunk_subset → authorized_scope)
      │
      ▼
KWAT blob stored encrypted in consent registry contract
(only decryptable by requester's private key)
```

This means: the vault owner **never uploads their raw DEK to any server**. The KWAT is computed off-chain, stored on-chain, and only the authorized requester can unwrap it.

### 2.4 Decentralized Storage Layer

#### 2.4.1 Storage Architecture

```
Encrypted chunks (CIDs) + Encrypted manifest (CID)
      │
      ├── IPFS (hot tier)
      │     └── Gateway: Cloudflare IPFS gateway + self-hosted kubo node
      │
      └── Filecoin (cold persistence tier)
            └── Storage provider selection: auto via Lighthouse.storage
                  - Minimum 3 replicas across geographically distributed providers
                  - Renewal automation: Lighthouse deal renewal API
                  - Retrieval: Filecoin Fast Retrieval + Lassie client
```

#### 2.4.2 Storage Provider Selection Criteria

| Criterion | Requirement |
|---|---|
| Geographic distribution | At least 1 provider per continent (NA, EU, APAC) |
| Redundancy | Minimum 3 active storage deals per CID |
| Deal duration | 520 days (renewable) |
| Retrieval SLA | < 1 hour for full WGS BAM via Filecoin Fast Retrieval |
| Provider reputation | Filecoin reputation score ≥ 95% |

#### 2.4.3 Content Addressing and Integrity

Every chunk is content-addressed (CID = SHA2-256 of ciphertext). This guarantees:
- Ciphertext integrity: any tampering changes the CID, breaking the manifest reference
- Deduplication: identical ciphertext (same DEK, same plaintext, same IV) produces same CID
- Immutability: uploaded chunks cannot be modified, only new versions can be added

### 2.5 Vault Access Control Model

Access to vault contents follows a strict cryptographic gating flow:

```
Requester                  Smart Contract               Vault Owner
    │                           │                            │
    │── Submit access request ──►                            │
    │   (ZK proof + payment)     │                            │
    │                           │── Emit ConsentGrantEvent ──►│
    │                           │                            │
    │                           │         ◄── KWAT blob ─────│
    │                           │         (owner's client     │
    │                           │          wraps DEK for      │
    │                           │          requester pubkey)  │
    │                           │                            │
    │◄── KWAT blob delivered ───│                            │
    │                           │                            │
    │  Unwrap KWAT with         │                            │
    │  own private key          │                            │
    │  → chunk subset DEK       │                            │
    │  → decrypt chunks         │                            │
    │  → access authorized data │                            │
```

**Critical property:** The vault owner's client generates and encrypts the KWAT. The server (and all intermediaries) see only encrypted blobs. Even a fully compromised API server cannot yield plaintext genomic data.

---

## 3. Zero-Knowledge Proof Layer

### 3.1 Use Cases

| Use Case | Proof Statement | Public Input | Private Input |
|---|---|---|---|
| Variant presence | "My genome contains rs334 (sickle cell variant)" | Variant ID (rs334) | Full variant call set |
| Ancestry percentile | "My European ancestry is ≥ 25%" | Ancestry reference panel, threshold | Population admixture vector |
| Disease predisposition | "My polygenic risk score for Type 2 Diabetes is < 20th percentile" | PRS weights, threshold | SNP allele encodings |
| Pharmacogenomic compatibility | "My CYP2D6 metabolizer status is 'normal'" | Gene locus, phenotype map | CYP2D6 diplotype |
| Kinship non-relation | "I am not genetically related to address 0x..." | Other person's public genome commitment | Own genome commitment |
| Data freshness | "This genome was sequenced after 2024-01-01" | Date threshold | Sequencing metadata |

### 3.2 ZK Framework Evaluation

#### 3.2.1 Comparison Matrix

| Framework | Language | Proof System | Recursion | WASM Support | Circuit Dev UX | EVM Verifier | Maturity |
|---|---|---|---|---|---|---|---|
| **Circom** | Circom DSL | Groth16 / PLONK | Limited | Yes | Steep learning curve | Yes (snarkjs) | High (battle-tested) |
| **Noir (Aztec)** | Rust-like DSL | Barretenberg (UltraHonk) | Native (Folding) | Yes | Excellent | Yes (Solidity verifier gen) | Medium-High (v0.30+) |
| **gnark** | Go | Groth16 / PLONK / STARK | Limited | Via TinyGo | Good (Go ecosystem) | Yes | High |
| **Risc0** | Rust (RISC-V zkVM) | STARKs + FRI | Yes (Bonsai) | No | Excellent (any Rust) | Yes (via Groth16 wrapping) | Medium |

#### 3.2.2 Recommendation: Noir (Aztec)

**Decision: Adopt Noir as the primary ZK framework.**

**Rationale:**

1. **Developer experience:** Noir's Rust-like syntax is immediately accessible to any Rust developer — the primary backend language. Circom requires learning a specialized DSL with non-obvious constraint semantics that cause silent soundness bugs.

2. **Native recursion / folding:** Genomic proofs involve large witness sizes (millions of SNPs). Noir's native support for proof folding (Protogalaxy/ProtoPlonk) enables batching many SNP-level proofs into a single succinct proof without a trusted setup per circuit.

3. **EVM verifier generation:** `nargo codegen-verifier` emits a Solidity `verify()` function directly. This plugs directly into the access control contract with no manual ABI bridging.

4. **UltraHonk performance:** UltraHonk (Barretenberg backend) provides better proof generation performance than Groth16 for large constraint systems, with no per-circuit trusted setup ceremony — critical for a production system where we'll add new genomic proof types post-launch.

5. **Aztec ecosystem alignment:** If DNaI expands to Aztec's privacy-native L2 (for full on-chain private consent), Noir circuits are first-class citizens. This optionality is strategically valuable.

**Trade-off acknowledged:** Noir is less battle-tested at scale than Circom. Mitigation: conduct formal security audit of all ZK circuits before Phase III launch, and maintain Circom fallback implementations for the two highest-value proof types (variant presence, PRS range).

### 3.3 Circuit Design

#### 3.3.1 Genomic Commitment Scheme

Before any proof can be generated, the genome must be committed to in a ZK-friendly format. Raw VCF/FASTQ is not circuit-friendly; we derive a canonical genomic feature vector.

```
VCF File (plaintext, client-side only)
      │
      ▼
Canonical SNP Vector: [allele_0, allele_1, ..., allele_N]
  - N = 627,119 SNPs (1000 Genomes Phase 3 variant set)
  - Encoding: 0 = ref/ref, 1 = ref/alt, 2 = alt/alt, 3 = missing
  - Format: packed 2-bit encoding → 157,530 bytes
      │
      ▼
Poseidon2 hash (ZK-friendly, ~40x faster than SHA-256 in circuit)
  - Hash the packed SNP vector in 512-bit chunks
  - Output: 32-byte Poseidon commitment (the "genome_commitment")
      │
      ▼
genome_commitment stored in:
  - DNaI token metadata (on-chain, public)
  - Encrypted vault manifest (verifiable by requester post-decrypt)
```

#### 3.3.2 Variant Presence Circuit

```noir
use dep::std;

fn main(
    // Public inputs
    target_variant_index: pub u32,          // Index of variant in canonical SNP vector
    expected_allele_encoding: pub u8,       // 0, 1, or 2 (ref/ref, ref/alt, alt/alt)
    genome_commitment: pub Field,           // Poseidon hash of full SNP vector (on-chain)

    // Private inputs (witness)
    snp_vector: [u8; 627119],              // Full SNP vector (2-bit packed, expanded here)
    merkle_path: [Field; 20],              // Merkle path proving vector membership
    merkle_indices: [u1; 20],
) {
    // 1. Verify the SNP vector matches the on-chain commitment
    let computed_commitment = std::hash::poseidon2::Poseidon2::hash(snp_vector, snp_vector.len());
    assert(computed_commitment == genome_commitment);

    // 2. Verify the target variant has the claimed allele encoding
    let actual_allele = snp_vector[target_variant_index];
    assert(actual_allele == expected_allele_encoding);
}
```

**Constraint estimate:** ~2.1M constraints for 627K SNP vector commitment verification. Expected Barretenberg proving time: ~18 seconds on M3 Pro; ~4 seconds with Bonsai-equivalent parallelism.

#### 3.3.3 PRS Range Proof Circuit

Polygenic Risk Score (PRS) calculation and threshold proof:

```noir
fn main(
    // Public inputs
    prs_weights: pub [i32; 1024],          // Published GWAS weights (public research data)
    threshold_percentile: pub u8,          // e.g., 20 for "< 20th percentile"
    genome_commitment: pub Field,

    // Private inputs
    relevant_snps: [u8; 1024],            // Only the SNPs that appear in PRS model
    full_snp_vector: [u8; 627119],        // Full vector for commitment verification
) {
    // 1. Verify genome commitment
    let computed_commitment = std::hash::poseidon2::Poseidon2::hash(full_snp_vector, full_snp_vector.len());
    assert(computed_commitment == genome_commitment);

    // 2. Verify relevant_snps are a correct subset of full_snp_vector
    // (Merkle inclusion proofs for each of the 1024 SNP positions)

    // 3. Compute weighted PRS sum
    let mut prs_score: i64 = 0;
    for i in 0..1024 {
        prs_score += (relevant_snps[i] as i64) * (prs_weights[i] as i64);
    }

    // 4. Assert PRS is below threshold (range proof)
    // Threshold is converted to score units during circuit parameterization
    let threshold_score = compute_threshold(threshold_percentile, prs_weights);
    assert(prs_score < threshold_score);
}
```

**Constraint estimate:** ~3.8M constraints (commitment verification dominates). Proving time: ~32 seconds on M3 Pro.

#### 3.3.4 Ancestry Range Proof Circuit

```noir
fn main(
    // Public inputs
    population_label: pub u8,              // 0=EUR, 1=AFR, 2=EAS, 3=SAS, 4=AMR
    min_percentage: pub u8,               // Minimum ancestry % claimed
    genome_commitment: pub Field,
    reference_panel_commitment: pub Field, // Hash of public 1000G reference panel

    // Private inputs
    admixture_vector: [u16; 5],           // 5-population admixture proportions (x1000)
    full_snp_vector: [u8; 627119],
) {
    // 1. Verify genome commitment
    // 2. Verify admixture_vector is consistent with snp_vector
    //    (This requires embedding a simplified ADMIXTURE-style computation)
    // 3. Assert admixture_vector[population_label] >= min_percentage * 10
    assert(admixture_vector[population_label] >= (min_percentage as u16) * 10);
}
```

**Note:** The admixture computation sub-circuit is the most complex component. Phase I will produce a specification; Phase II will implement a reduced-precision (100-SNP ancestry-informative marker) version suitable for proof-of-concept.

### 3.4 Performance Benchmarks

| Circuit | Constraint Count | Client Proving Time (M3 Pro) | Proof Size | Verification Gas (EVM) |
|---|---|---|---|---|
| Variant Presence | ~2.1M | ~18s | ~1.5 KB | ~350K gas |
| PRS Range Proof | ~3.8M | ~32s | ~1.5 KB | ~350K gas |
| Ancestry Range | ~12M | ~95s | ~1.5 KB | ~350K gas |
| Pharmacogenomic | ~1.4M | ~12s | ~1.5 KB | ~350K gas |

**Phase II target:** Reduce client proving time by 4× using WASM SIMD and Barretenberg's multi-threaded prover (available in browsers via SharedArrayBuffer with COOP/COEP headers).

**Phase III target:** Offer server-side proving as an opt-in service (user sends encrypted witness, server proves in TEE, returns proof). This trades privacy for latency for power users.

---

## 4. Smart Contract Architecture

All contracts target Solidity 0.8.26, deployed on Ethereum mainnet with an L2 deployment (Base preferred — low fees, EVM equivalent, Coinbase institutional pipeline for pharma payments).

### 4.1 DNaI Token Contract (ERC-721 Extension)

**File:** `contracts/DNaIToken.sol`

#### 4.1.1 Token ID Derivation

```solidity
// Token ID is deterministic: no two owners can mint for the same genome
function computeTokenId(
    bytes32 genomeHash,     // keccak256 of canonical SNP vector (plaintext, computed client-side)
    address ownerAddress    // msg.sender at mint time
) public pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(genomeHash, ownerAddress)));
}
```

**Why include `ownerAddress`?** Without it, identical twins would collide on token ID. Including the owner address makes the token ID unique per (genome, person) pair. Note: identical twins sharing a genome can each mint distinct tokens.

#### 4.1.2 Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DNaIToken is ERC721, ERC2981, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    struct GenomicVault {
        bytes32  genomeHash;          // keccak256 of plaintext SNP vector
        bytes32  zkCommitment;        // Poseidon hash (ZK-friendly commitment)
        string   encryptedManifestCID;// IPFS CID of encrypted vault manifest
        uint64   mintedAt;
        string   referenceGenome;     // "GRCh38" or "GRCh37"
        uint8    fileFormat;          // 0=VCF, 1=FASTQ, 2=BAM
        bool     revoked;             // Emergency revocation flag
    }

    mapping(uint256 => GenomicVault) public vaults;
    mapping(bytes32 => uint256)      public genomeHashToTokenId;
    mapping(address => uint256)      public ownerToTokenId;  // One genome per address

    event GenomicVaultMinted(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 indexed genomeHash,
        string  encryptedManifestCID
    );

    event VaultManifestUpdated(
        uint256 indexed tokenId,
        string  newCID
    );

    // Mint: owner must not already hold a DNaI token
    function mint(
        bytes32 genomeHash,
        bytes32 zkCommitment,
        string calldata encryptedManifestCID,
        string calldata referenceGenome,
        uint8  fileFormat
    ) external returns (uint256 tokenId) { ... }

    // Update encrypted manifest CID (e.g., after adding new data types)
    function updateManifest(
        uint256 tokenId,
        string calldata newCID
    ) external onlyTokenOwner(tokenId) { ... }

    // Soulbound: transfers disabled
    function _update(address to, uint256 tokenId, address auth)
        internal override returns (address) {
        require(auth == address(0), "DNaI: token is soulbound");
        return super._update(to, tokenId, auth);
    }

    // EIP-165
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC2981, AccessControl)
        returns (bool) { ... }
}
```

**Soulbound design:** DNaI tokens are non-transferable. The genome is bound to the person, not a tradeable commodity. Secondary markets in genome tokens are a regulatory and ethical liability; soulbound design closes that door at the protocol level.

### 4.2 Consent Registry Contract

**File:** `contracts/ConsentRegistry.sol`

#### 4.2.1 Data Model

```solidity
enum ConsentScope {
    FULL_GENOME,          // Access to all chunks
    VARIANT_SUBSET,       // Specific variant list
    CHROMOSOME_RANGE,     // Chromosomal region
    PRS_CALCULATION,      // Polygenic risk score only
    ANCESTRY_INFERENCE,   // Ancestry computation only
    PHARMACOGENOMICS,     // Drug metabolism variants only
    RESEARCH_AGGREGATE    // Aggregated/anonymized statistics only
}

struct ConsentGrant {
    uint256  tokenId;             // DNaI token being accessed
    address  requester;           // Authorized accessor address
    ConsentScope scope;
    uint64   grantedAt;
    uint64   expiresAt;           // Unix timestamp; 0 = no expiry
    uint256  pricePerQuery;       // Wei per query (streaming micropayment)
    uint256  totalBudget;         // Max total spend authorized
    uint256  totalSpent;
    bytes    encryptedKWAT;       // Key Wrapped Access Token (for requester's pubkey)
    bytes32  scopeHash;           // keccak256 of authorized scope parameters
    bool     active;
    bool     revoked;
}

mapping(bytes32 => ConsentGrant) public grants;
// grantId = keccak256(tokenId, requester, scope, grantedAt)

mapping(uint256 => bytes32[]) public tokenGrants;   // tokenId → [grantIds]
mapping(address => bytes32[]) public requesterGrants; // requester → [grantIds]
```

#### 4.2.2 Key Functions

```solidity
interface IConsentRegistry {

    // Owner grants access to requester
    function grantConsent(
        uint256       tokenId,
        address       requester,
        ConsentScope  scope,
        uint64        expiresAt,
        uint256       pricePerQuery,
        uint256       totalBudget,
        bytes calldata encryptedKWAT,  // Wrapped DEK subset for requester's pubkey
        bytes32       scopeHash
    ) external returns (bytes32 grantId);

    // Owner revokes an active grant
    function revokeConsent(bytes32 grantId) external;

    // Requester consumes an access unit (triggers micropayment)
    function consumeAccess(
        bytes32 grantId,
        bytes calldata zkProof,         // Proof of authorized query type
        bytes calldata queryParameters
    ) external payable returns (bytes memory encryptedKWAT);

    // View all grants for a token (audit trail)
    function getTokenGrants(uint256 tokenId)
        external view returns (bytes32[] memory);

    // View grant details
    function getGrant(bytes32 grantId)
        external view returns (ConsentGrant memory);

    event ConsentGranted(
        bytes32 indexed grantId,
        uint256 indexed tokenId,
        address indexed requester,
        ConsentScope    scope,
        uint64          expiresAt
    );

    event ConsentRevoked(
        bytes32 indexed grantId,
        uint256 indexed tokenId,
        address indexed requester,
        uint64          revokedAt
    );

    event AccessConsumed(
        bytes32 indexed grantId,
        address indexed requester,
        uint256         feePaid,
        uint64          consumedAt
    );
}
```

### 4.3 Royalty Distribution Contract

**File:** `contracts/RoyaltyDistributor.sol`

The royalty distributor extends EIP-2981 with streaming micropayments and multi-party splits.

#### 4.3.1 Architecture

```
Access fee payment (ETH or USDC)
      │
      ▼
RoyaltyDistributor.distributeRoyalty(grantId, amount)
      │
      ├── 80% ──► Genome Owner (streaming via Sablier v2 or push-payment)
      ├── 10% ──► DNaI Protocol Treasury (DAO governance)
      ├──  7% ──► Research Data Pool (future: participant grant fund)
      └──  3% ──► Referral / Partner attribution
```

```solidity
contract RoyaltyDistributor is ERC2981 {

    struct RoyaltySplit {
        address payable owner;         // Genome owner
        address payable treasury;      // Protocol DAO treasury
        address payable researchPool;
        address payable referrer;      // Optional; address(0) if none
        uint16  ownerBps;             // Basis points (8000 = 80%)
        uint16  treasuryBps;          // 1000 = 10%
        uint16  researchBps;          // 700 = 7%
        uint16  referrerBps;          // 300 = 3%
    }

    // Streaming payment to owner via push-pull pattern
    mapping(address => uint256) public pendingWithdrawals;
    mapping(uint256 => RoyaltySplit) public tokenSplits;

    // EIP-2981 implementation
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external view override
        returns (address receiver, uint256 royaltyAmount)
    {
        // For secondary market tooling compatibility;
        // primary royalties flow through distributeRoyalty()
        return (tokenSplits[tokenId].owner, salePrice * 1000 / 10000);
    }

    function distributeRoyalty(
        uint256 tokenId,
        uint256 amount,
        address referrer
    ) external payable {
        require(msg.value == amount, "Payment mismatch");
        RoyaltySplit memory split = tokenSplits[tokenId];

        // Accumulate pull-payment balances
        pendingWithdrawals[split.owner]       += amount * split.ownerBps / 10000;
        pendingWithdrawals[split.treasury]    += amount * split.treasuryBps / 10000;
        pendingWithdrawals[split.researchPool]+= amount * split.researchBps / 10000;
        if (referrer != address(0)) {
            pendingWithdrawals[referrer]      += amount * split.referrerBps / 10000;
        } else {
            pendingWithdrawals[split.treasury]+= amount * split.referrerBps / 10000;
        }

        emit RoyaltyDistributed(tokenId, amount, split.owner);
    }

    // Pull-payment: owners withdraw accumulated royalties
    function withdraw() external {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    event RoyaltyDistributed(
        uint256 indexed tokenId,
        uint256 amount,
        address indexed owner
    );
}
```

**Phase III enhancement:** Replace pull-payment with Sablier v2 streaming contracts so owners see a real-time token balance that grows second-by-second as queries are consumed. This is a significant UX differentiation — the "genomic royalty stream" is a core product narrative.

### 4.4 Access Control Contract

**File:** `contracts/AccessController.sol`

```solidity
contract AccessController {

    IConsentRegistry   public consentRegistry;
    IZKVerifier        public zkVerifier;
    IRoyaltyDistributor public royaltyDistributor;

    // Core access flow
    function requestAccess(
        bytes32        grantId,
        bytes calldata zkProof,
        bytes calldata publicInputs,   // variant_index, threshold, etc.
        bytes calldata queryParameters
    ) external payable returns (bytes memory encryptedKWAT) {

        ConsentGrant memory grant = consentRegistry.getGrant(grantId);

        // 1. Verify grant is active and requester is authorized
        require(grant.active && !grant.revoked, "Grant inactive");
        require(grant.requester == msg.sender, "Not authorized requester");
        require(block.timestamp < grant.expiresAt || grant.expiresAt == 0, "Grant expired");

        // 2. Verify payment
        require(msg.value >= grant.pricePerQuery, "Insufficient payment");
        require(grant.totalSpent + msg.value <= grant.totalBudget, "Budget exceeded");

        // 3. Verify ZK proof (requester proves their query is within authorized scope)
        require(
            zkVerifier.verify(zkProof, publicInputs, grant.scopeHash),
            "Invalid ZK proof"
        );

        // 4. Distribute royalty
        royaltyDistributor.distributeRoyalty{value: msg.value}(grant.tokenId, msg.value, address(0));

        // 5. Log access and return KWAT
        return consentRegistry.consumeAccess(grantId, zkProof, queryParameters);
    }
}
```

### 4.5 DAO Governance Contract Skeleton

**File:** `contracts/DNaIGovernor.sol`

```solidity
// Based on OpenZeppelin Governor with DNaI-specific parameterization
contract DNaIGovernor is Governor, GovernorSettings, GovernorCountingSimple,
                          GovernorVotes, GovernorTimelockControl {

    // Governance parameters (Phase I — conservative defaults)
    uint48  public constant VOTING_DELAY   = 2 days;   // Time before vote opens
    uint32  public constant VOTING_PERIOD  = 7 days;   // Voting window
    uint256 public constant PROPOSAL_THRESHOLD = 1;    // Any DNaI holder can propose

    // Quorum: 4% of total token supply must vote
    function quorum(uint256 blockNumber) public view override returns (uint256) {
        return (token.getPastTotalSupply(blockNumber) * 4) / 100;
    }

    // Governable parameters:
    // - Royalty split percentages
    // - Protocol fee rates
    // - Approved ZK circuit hash registry
    // - Access scope definitions
    // - Emergency pause authority
    // - Treasury allocation
}
```

---

## 5. API Layer

### 5.1 Backend Technology

The API backend is implemented in **Rust using the Axum framework** for the following reasons:

| Consideration | Rationale |
|---|---|
| Performance | Rust/Axum handles 100K+ req/s on commodity hardware; critical for batch ZK proof submission endpoints |
| Memory safety | No GC pauses; predictable latency for real-time royalty WebSocket streams |
| Cryptographic libraries | `ring`, `dalek` (ed25519), `k256` (secp256k1), `aes-gcm` — all mature, audited Rust crates |
| WASM compilation | Encryption/ZK code shared between server and browser client via WASM |
| Type safety | Eliminates entire classes of bugs in complex consent data model serialization |

### 5.2 REST API Specification

Base URL: `https://api.dnai.io/v1`

All endpoints require `Authorization: Bearer <wallet-signed JWT>` except `/health`.

#### 5.2.1 Vault Endpoints

```
POST /vault/upload
```

Initiates a chunked encrypted vault upload.

| Parameter | Type | Description |
|---|---|---|
| `token_id` | `uint256` | Minted DNaI token ID |
| `file_format` | `string` | `"VCF"`, `"FASTQ"`, or `"BAM"` |
| `chunk_count` | `uint32` | Total chunks to upload |
| `encrypted_manifest` | `bytes` | AES-256-GCM encrypted manifest |
| `manifest_iv` | `bytes12` | 96-bit IV for manifest |
| `manifest_tag` | `bytes16` | 128-bit authentication tag |

Response:
```json
{
  "upload_session_id": "uuid",
  "chunk_upload_urls": ["https://..."],
  "manifest_cid": "bafyrei...",
  "expires_at": 1751500000
}
```

```
PUT /vault/upload/{upload_session_id}/chunk/{chunk_index}
```

Uploads a single encrypted chunk. Body is raw binary ciphertext. Returns `{ "cid": "bafyrei..." }`.

```
POST /vault/upload/{upload_session_id}/finalize
```

Confirms all chunks uploaded; triggers Filecoin deal initiation.

```
GET /vault/{token_id}/manifest
```

Returns the encrypted manifest CID. The caller must decrypt client-side.

Response:
```json
{
  "token_id": "12345",
  "manifest_cid": "bafyrei...",
  "chunk_count": 12,
  "uploaded_at": 1751328000,
  "filecoin_deal_id": "bafy...",
  "storage_status": "active"
}
```

```
DELETE /vault/{token_id}
```

Marks vault inactive; cancels Filecoin deal renewal. Does not delete IPFS content (content-addressed; only the vault registry is cleared). Requires owner signature proof in request header.

#### 5.2.2 Token Endpoints

```
POST /token/mint
```

Prepares and submits the DNaI token mint transaction.

| Parameter | Type | Description |
|---|---|---|
| `genome_hash` | `bytes32` | keccak256 of plaintext SNP vector (computed client-side) |
| `zk_commitment` | `bytes32` | Poseidon commitment (ZK-friendly) |
| `encrypted_manifest_cid` | `string` | IPFS CID of vault manifest |
| `reference_genome` | `string` | `"GRCh38"` |
| `file_format` | `uint8` | 0=VCF, 1=FASTQ, 2=BAM |

Response:
```json
{
  "token_id": "0x...",
  "tx_hash": "0x...",
  "status": "pending"
}
```

```
GET /token/{token_id}
```

Returns token metadata (all fields are public; vault content remains encrypted).

```
GET /token/by-owner/{address}
```

Returns the DNaI token ID for a given owner address (at most one).

#### 5.2.3 Consent Endpoints

```
POST /consent/grant
```

Owner grants access to a requester. Server relays to ConsentRegistry contract.

| Parameter | Type | Description |
|---|---|---|
| `token_id` | `uint256` | |
| `requester` | `address` | |
| `scope` | `ConsentScope` | Enum value |
| `expires_at` | `uint64` | Unix timestamp; 0 = no expiry |
| `price_per_query` | `uint256` | Wei |
| `total_budget` | `uint256` | Wei |
| `encrypted_kwat` | `bytes` | Key Wrapped Access Token for requester |
| `scope_hash` | `bytes32` | |

```
POST /consent/revoke
```

Body: `{ "grant_id": "0x..." }`. Owner-signed request.

```
POST /consent/access
```

Requester submits ZK proof to consume an access unit.

| Parameter | Type | Description |
|---|---|---|
| `grant_id` | `bytes32` | |
| `zk_proof` | `bytes` | Noir-generated proof |
| `public_inputs` | `bytes` | Circuit public inputs |
| `query_parameters` | `bytes` | Scope-specific query params |

Response:
```json
{
  "encrypted_kwat": "0x...",
  "access_log_id": "uuid",
  "fee_paid": "1000000000000000",
  "royalty_tx_hash": "0x..."
}
```

```
GET /consent/audit/{token_id}
```

Returns complete consent audit trail for a token (all grants, revocations, accesses).

```
GET /consent/audit/{token_id}/export
```

Returns GDPR-compliant audit log export (PDF or JSON).

#### 5.2.4 ZK Proof Endpoints

```
POST /zk/prove
```

Server-side (TEE) ZK proof generation — opt-in, sends witness encrypted to TEE.

```
POST /zk/verify
```

Verify a submitted ZK proof off-chain (cheaper than on-chain; for requester pre-validation).

### 5.3 GraphQL API

GraphQL endpoint: `https://api.dnai.io/v1/graphql`

```graphql
type Query {
  # Vault queries
  vault(tokenId: String!): Vault
  vaultsByOwner(owner: String!): [Vault!]!

  # Consent queries
  grant(grantId: String!): ConsentGrant
  grantsByToken(tokenId: String!, first: Int, skip: Int): [ConsentGrant!]!
  grantsByRequester(requester: String!, first: Int, skip: Int): [ConsentGrant!]!
  activeGrantsForToken(tokenId: String!): [ConsentGrant!]!

  # Analytics
  royaltiesEarned(tokenId: String!, from: Int, to: Int): RoyaltyStats!
  accessHistory(tokenId: String!, first: Int): [AccessEvent!]!
}

type Mutation {
  grantConsent(input: GrantConsentInput!): ConsentGrant!
  revokeConsent(grantId: String!, signature: String!): Boolean!
}

type Subscription {
  royaltyReceived(tokenId: String!): RoyaltyEvent!
  consentGranted(ownerAddress: String!): ConsentGrant!
  consentRevoked(ownerAddress: String!): ConsentRevocationEvent!
  accessConsumed(tokenId: String!): AccessEvent!
}

type Vault {
  tokenId: String!
  owner: String!
  genomeHash: String!
  zkCommitment: String!
  encryptedManifestCid: String!
  mintedAt: Int!
  referenceGenome: String!
  fileFormat: String!
  activeGrantCount: Int!
  totalRoyaltiesEarned: String!
}

type ConsentGrant {
  grantId: String!
  tokenId: String!
  requester: String!
  scope: String!
  grantedAt: Int!
  expiresAt: Int
  pricePerQuery: String!
  totalBudget: String!
  totalSpent: String!
  active: Boolean!
  revoked: Boolean!
  accessCount: Int!
}
```

### 5.4 The Graph Subgraph

**Subgraph:** `cloudcontrolllc/dnai-consent`

The Graph indexes all on-chain consent events for fast historical queries without requiring archive node RPC calls.

#### 5.4.1 Entities Indexed

```graphql
# subgraph.yaml schema

type ConsentGrantedEvent @entity {
  id: Bytes!                    # transaction hash + log index
  grantId: Bytes!
  tokenId: BigInt!
  requester: Bytes!
  scope: Int!
  expiresAt: BigInt
  blockNumber: BigInt!
  timestamp: BigInt!
  transactionHash: Bytes!
}

type ConsentRevokedEvent @entity {
  id: Bytes!
  grantId: Bytes!
  revokedAt: BigInt!
  blockNumber: BigInt!
  transactionHash: Bytes!
}

type AccessConsumedEvent @entity {
  id: Bytes!
  grantId: Bytes!
  requester: Bytes!
  feePaid: BigInt!
  timestamp: BigInt!
}

type RoyaltyDistributedEvent @entity {
  id: Bytes!
  tokenId: BigInt!
  amount: BigInt!
  owner: Bytes!
  timestamp: BigInt!
}

type TokenMintedEvent @entity {
  id: Bytes!
  tokenId: BigInt!
  owner: Bytes!
  genomeHash: Bytes!
  encryptedManifestCid: String!
  timestamp: BigInt!
}
```

#### 5.4.2 Subgraph Mappings

```typescript
// src/mappings/consent-registry.ts
export function handleConsentGranted(event: ConsentGranted): void {
  let entity = new ConsentGrantedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.grantId = event.params.grantId;
  entity.tokenId = event.params.tokenId;
  entity.requester = event.params.requester;
  entity.scope = event.params.scope;
  entity.expiresAt = event.params.expiresAt;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}
```

### 5.5 WebSocket Streams

Real-time event streams via WebSocket at `wss://api.dnai.io/v1/ws`.

#### 5.5.1 Authentication

```json
// Client sends on connect:
{
  "type": "auth",
  "token": "<wallet-signed JWT>"
}
```

#### 5.5.2 Subscription Topics

```
dnai:royalty:{token_id}         — Real-time royalty payments
dnai:consent:{owner_address}    — Consent grants/revocations for this owner
dnai:access:{token_id}          — Access consumption events
dnai:vault:{token_id}:status    — Storage deal status updates
```

#### 5.5.3 Royalty Event Payload

```json
{
  "type": "royalty_received",
  "token_id": "12345",
  "amount_wei": "1000000000000000",
  "amount_usd": "0.0038",
  "requester": "0x...",
  "grant_id": "0x...",
  "scope": "VARIANT_SUBSET",
  "timestamp": 1751328000,
  "cumulative_today_wei": "15000000000000000",
  "tx_hash": "0x..."
}
```

---

## 6. Security Threat Model

### 6.1 Threat Vectors and Mitigations

#### 6.1.1 Vector: Client-Side Compromise During Upload

| Attribute | Detail |
|---|---|
| **Description** | Attacker injects malicious JavaScript into the DNaI web app (XSS, supply chain attack on npm dependency), intercepts plaintext genomic data before encryption |
| **Impact** | Critical — raw genome exposed before encryption |
| **Likelihood** | Medium (supply chain attacks increasing in frequency) |
| **Mitigations** | (1) Content Security Policy (CSP) with strict-dynamic; (2) Subresource Integrity (SRI) for all loaded scripts; (3) Native desktop client (Tauri) as primary upload path — eliminates browser JS execution surface; (4) npm lockfile and automated dependency audit (Dependabot + Socket.dev); (5) Code signing for client releases |

#### 6.1.2 Vector: API Server Breach (Ciphertext Exposure)

| Attribute | Detail |
|---|---|
| **Description** | Attacker compromises API server and downloads encrypted vault manifests and chunk CIDs from IPFS |
| **Impact** | Low — attacker obtains ciphertext only; no DEK on server |
| **Likelihood** | Medium |
| **Mitigations** | (1) Server by design holds zero decryption keys — breach yields only encrypted blobs; (2) All manifests are additionally sealed with owner wallet signature; (3) IPFS CIDs are public but ciphertext is computationally opaque without DEK; (4) Rate-limit CID enumeration APIs |

#### 6.1.3 Vector: Private Key Extraction from Browser

| Attribute | Detail |
|---|---|
| **Description** | Malware on user's device extracts wallet private key from browser extension or clipboard |
| **Impact** | Critical — attacker can derive DEK and decrypt vault |
| **Likelihood** | Low-Medium (targeted attacks on high-value genome holders) |
| **Mitigations** | (1) Encourage hardware wallet use (Ledger/Trezor); signing happens inside HSM, key never exposed to browser; (2) ERC-4337 guardian recovery provides "key rotation without re-encryption" — if compromise detected, rotate access key; (3) Genomic data access events emit on-chain, enabling anomaly detection; (4) Client-side rate limiting on DEK derivation attempts |

#### 6.1.4 Vector: ZK Proof Forgery

| Attribute | Detail |
|---|---|
| **Description** | Attacker submits forged ZK proof claiming genomic property they don't have (e.g., false disease-free status for insurance) |
| **Impact** | High — undermines proof integrity; reputational and legal liability |
| **Likelihood** | Low (computationally infeasible if circuit is sound) |
| **Mitigations** | (1) Formal security audit of all Noir circuits by ZK specialist (e.g., Trail of Bits, Veridise); (2) Circuit constraint count reviewed for under-constraining (the primary soundness failure mode); (3) Trusted setup ceremony (if using Groth16 fallback); (4) On-chain verifier contract uses audited bytecode — upgrades require governance vote + timelock |

#### 6.1.5 Vector: Man-in-the-Middle on Upload

| Attribute | Detail |
|---|---|
| **Description** | Attacker intercepts HTTPS traffic between client and upload endpoint |
| **Impact** | Negligible — ciphertext only; no plaintext |
| **Likelihood** | Low (TLS) |
| **Mitigations** | (1) TLS 1.3 required; TLS 1.2 disabled; (2) HTTP Public Key Pinning (HPKP) for API domain; (3) Certificate Transparency monitoring; (4) Encryption already applied client-side before bytes hit the network |

#### 6.1.6 Vector: Insider Threat (Cloud Control LLC Employee)

| Attribute | Detail |
|---|---|
| **Description** | Malicious or coerced Cloud Control LLC employee accesses user vault data |
| **Impact** | Low — no employee holds decryption keys |
| **Likelihood** | Low-Medium |
| **Mitigations** | (1) Zero-knowledge architecture: no plaintext ever reaches company infrastructure; (2) Operator guardian key (for ERC-4337 recovery) is time-locked 30 days on-chain, emitting public events; (3) Multi-sig required for all privileged contract operations; (4) Audit logs for all API access, immutable to operators |

#### 6.1.7 Vector: Regulatory Compulsion (Law Enforcement Subpoena)

| Attribute | Detail |
|---|---|
| **Description** | Law enforcement compels Cloud Control LLC to produce user genomic data |
| **Impact** | High if company holds decryption material |
| **Likelihood** | Medium (especially for high-profile users) |
| **Mitigations** | (1) Company holds no decryption keys — legally cannot produce what it does not have; (2) Encrypted blobs on IPFS/Filecoin are distributed across jurisdictions; (3) Legal counsel prepares cannot-comply affidavit templates for law enforcement requests; (4) Transparency report published annually |

#### 6.1.8 Vector: Smart Contract Exploit

| Attribute | Detail |
|---|---|
| **Description** | Reentrancy, integer overflow, access control bypass, or logic error in consent or royalty contracts |
| **Impact** | High — could drain royalty pools or forge consent grants |
| **Likelihood** | Medium (smart contracts are high-value attack targets) |
| **Mitigations** | (1) Formal audit by Trail of Bits or OpenZeppelin Audit (Phase II); (2) Foundry invariant tests + fuzzing; (3) 48-hour governance timelock on all contract upgrades; (4) Pausable contracts with multi-sig pause authority; (5) Bug bounty program (Immunefi); (6) Proxy upgrade pattern with transparent proxy; (7) All ETH movements use pull-payment pattern |

### 6.2 Audit Checklist

**Pre-Launch (Phase II — prior to any real genomic data):**

- [ ] Third-party smart contract audit (Trail of Bits or equivalent)
- [ ] ZK circuit soundness review (Veridise or ZKSecurity.xyz)
- [ ] Penetration test of API layer and upload pipeline
- [ ] Dependency audit: all Rust crates, JS npm packages
- [ ] Key derivation scheme review (AES-GCM, Argon2id parameterization)
- [ ] IPFS/Filecoin encryption at rest verification
- [ ] ERC-4337 recovery flow security analysis
- [ ] HIPAA compliance technical safeguard mapping
- [ ] GDPR Data Protection Impact Assessment (DPIA)

**Ongoing:**

- [ ] Automated secret scanning (GitHub Advanced Security / truffleHog)
- [ ] Quarterly dependency vulnerability review
- [ ] Annual penetration test
- [ ] Transparency report publication
- [ ] Bug bounty program maintenance

---

## 7. Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER DEVICE (TRUSTED ZONE)                         │
│                                                                             │
│  ┌──────────────────┐     ┌──────────────────────────────────────────────┐  │
│  │  Genomic File    │     │           DNaI Client App (Browser/Tauri)    │  │
│  │  (VCF/FASTQ/BAM) │────►│                                              │  │
│  │  (plaintext)     │     │  ┌─────────────────────────────────────────┐ │  │
│  └──────────────────┘     │  │  Client-Side Encryption Pipeline        │ │  │
│                           │  │  Wallet Key → ECDH → Argon2id → DEK    │ │  │
│                           │  │  Genome → SNP Vector → Poseidon Hash   │ │  │
│                           │  │  File → AES-256-GCM chunks             │ │  │
│                           │  └───────────────┬─────────────────────────┘ │  │
│                           │                  │ ciphertext only            │  │
│  ┌──────────────────┐     │  ┌───────────────▼─────────────────────────┐ │  │
│  │  Hardware Wallet │◄────│  │  Noir ZK Circuit (WASM in browser)      │ │  │
│  │  (Ledger/Trezor) │────►│  │  Generates proofs from SNP vector       │ │  │
│  │  secp256k1 key   │     │  └─────────────────────────────────────────┘ │  │
│  └──────────────────┘     └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │ HTTPS (ciphertext + ZK proofs)
                                           │ Zero plaintext genomic data
┌──────────────────────────────────────────▼──────────────────────────────────┐
│                         DNaI API LAYER (UNTRUSTED)                          │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      Rust / Axum REST + GraphQL API                    │ │
│  │           /vault/upload  /consent/grant  /token/mint  /zk/verify      │ │
│  └──────┬──────────────────────────────────────────────┬─────────────────┘ │
│         │                                              │                    │
│  ┌──────▼──────┐   ┌────────────────┐   ┌─────────────▼────────────────┐   │
│  │  PostgreSQL  │   │  Redis Cache   │   │  Ethereum RPC Node           │   │
│  │  (metadata  │   │  (session,     │   │  (Infura + self-hosted        │   │
│  │   & indexing)│   │   rate limits) │   │   Erigon for redundancy)     │   │
│  └─────────────┘   └────────────────┘   └──────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  WebSocket Server (tokio-tungstenite)                               │   │
│  │  Real-time royalty, consent, and access event streams               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────────────────┘
                       │
          ┌────────────┼────────────────┐
          │            │                │
┌─────────▼────┐ ┌─────▼──────┐ ┌──────▼──────────────────────────────────┐
│ IPFS Network │ │ Filecoin   │ │ Ethereum L1 / Base L2 (Blockchain)      │
│              │ │ Storage    │ │                                          │
│ Hot tier:    │ │ Deals via  │ │ ┌──────────────────────────────────────┐ │
│ - Cloudflare │ │ Lighthouse │ │ │  DNaIToken.sol (ERC-721 soulbound)   │ │
│   IPFS GW   │ │            │ │ │  ConsentRegistry.sol                 │ │
│ - Self-hosted│ │ Min 3      │ │ │  RoyaltyDistributor.sol (EIP-2981)   │ │
│   kubo node  │ │ replicas   │ │ │  AccessController.sol                │ │
│              │ │ per CID    │ │ │  DNaIGovernor.sol (DAO)              │ │
│ Encrypted    │ │ 520-day    │ │ └──────────────────────────────────────┘ │
│ blobs only   │ │ deals      │ │                                          │
└──────────────┘ └────────────┘ │ ┌──────────────────────────────────────┐ │
                                │ │  The Graph Subgraph                  │ │
                                │ │  (consent & royalty event indexing)  │ │
                                │ └──────────────────────────────────────┘ │
                                └──────────────────────────────────────────┘

TRUST BOUNDARIES:
══════════════════
  ████ USER DEVICE:     Full trust — plaintext exists here only
  ░░░░ API LAYER:       Zero trust — ciphertext only; no key material
  ░░░░ STORAGE:         Zero trust — encrypted blobs, distributed
  ░░░░ BLOCKCHAIN:      Transparent trust — public commitments, auditable
```

---

## 8. Development Milestones — Phase I Weeks 1–6

### Week 1 (Jul 1–7): Project Initialization

**Goal:** Development environment operational; toolchain selected; team aligned.

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| Mon Jul 1 | Repository structure, mono-repo setup (Cargo workspaces + npm workspaces) | Backend | `/contracts`, `/api`, `/client`, `/circuits` directories created |
| Mon Jul 1 | Foundry initialization: `forge init`, hardhat config for ethers.js compat | Smart Contracts | `foundry.toml`, `remappings.txt` |
| Tue Jul 2 | Technical architecture kickoff session — review this document, open questions | All | Architecture decisions logged in `/docs/decisions/` |
| Tue Jul 2 | Noir installation and "hello world" circuit: `nargo new hello_genome` | ZK | Noir toolchain confirmed working |
| Wed Jul 3 | IPFS/Filecoin testnet setup: Lighthouse API key, kubo node deployment | Infrastructure | Kubo node responding on testnet |
| Wed Jul 3 | Axum scaffold: `cargo new dnai-api`, basic `/health` endpoint | Backend | API responds 200 on localhost |
| Thu Jul 4 | Competitive analysis: Nebula Genomics, Shivom, EncrypGen API study | Product | Competitive landscape doc |
| Fri Jul 5 | Week 1 review: blockers, open questions, Sprint 2 planning | All | Sprint 2 task list finalized |

**Exit Criteria:** Repository initialized; all team members can run `forge test`, `nargo check`, and `cargo test` locally.

### Week 2 (Jul 8–14): Vault Encryption Implementation

**Goal:** Client-side encryption pipeline working end-to-end on a test VCF file.

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| Mon Jul 8 | Implement `VaultEncryptor` in Rust: Argon2id KDF + AES-256-GCM chunked encryption | Backend/ZK | `crates/vault-crypto/src/lib.rs` with test vectors |
| Mon Jul 8 | Define canonical SNP vector format: 627K SNP index from 1000G Phase 3 | ZK/Bioinformatics | `docs/snp-vector-spec.md` |
| Tue Jul 9 | Implement Poseidon2 commitment computation for SNP vector | ZK | `crates/vault-crypto/src/commitment.rs` |
| Tue Jul 9 | ECDH key agreement from secp256k1 wallet key (using `k256` crate) | Backend | `crates/vault-crypto/src/key_derivation.rs` |
| Wed Jul 10 | VCF parser: extract SNP vector from VCF file (`htslib` Rust bindings) | Bioinformatics | `crates/genomic-parser/src/vcf.rs` |
| Wed Jul 10 | IPFS chunk upload integration: upload ciphertext chunk, get CID | Backend | Integration test: upload 4 MB chunk to IPFS testnet |
| Thu Jul 11 | Encrypted manifest construction and serialization | Backend | JSON schema + Rust struct; serialization round-trip tests |
| Thu Jul 11 | EIP-712 typed signing for vault access requests | Client | `packages/client-sdk/src/signing.ts` |
| Fri Jul 12 | End-to-end test: VCF → SNP vector → encrypt → upload to IPFS → retrieve → decrypt | All | `tests/e2e/vault_roundtrip.rs` passing |

**Exit Criteria:** A 50 MB test VCF file can be encrypted, chunked, uploaded to IPFS testnet, retrieved, and decrypted with correct byte-for-byte match.

### Week 3 (Jul 15–21): Smart Contract Development

**Goal:** Core smart contracts drafted, compiled, and unit-tested.

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| Mon Jul 15 | `DNaIToken.sol`: ERC-721 soulbound extension with vault struct | Smart Contracts | Compiles; `forge test` unit tests pass |
| Mon Jul 15 | Token ID computation: `keccak256(genomeHash, ownerAddress)` tests | Smart Contracts | Collision test: same genome, different owners → different IDs |
| Tue Jul 16 | `ConsentRegistry.sol`: grant, revoke, consumeAccess functions | Smart Contracts | Unit tests for grant lifecycle |
| Wed Jul 17 | `RoyaltyDistributor.sol`: EIP-2981 + pull-payment distributeRoyalty | Smart Contracts | Fuzz tests on split arithmetic (no wei stuck in contract) |
| Wed Jul 17 | `AccessController.sol`: request flow wiring consent + royalty contracts | Smart Contracts | Integration test: full access request flow on Anvil |
| Thu Jul 18 | `DNaIGovernor.sol`: skeleton with parameter constants | Smart Contracts | Compiles; governance proposal test |
| Thu Jul 18 | Deployment scripts: `script/Deploy.s.sol` for Sepolia | Smart Contracts | Deployment script tested on Anvil fork |
| Fri Jul 19 | All contracts deployed to Sepolia testnet; Etherscan verified | Smart Contracts | Contract addresses published in `deployments/sepolia.json` |

**Exit Criteria:** All five contracts deployed to Sepolia; verified on Etherscan; full unit test coverage (≥ 90% line coverage via `forge coverage`).

### Week 4 (Jul 22–28): ZK Proof Circuit Implementation

**Goal:** Variant presence circuit producing verifiable proofs; EVM verifier deployed.

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| Mon Jul 22 | Variant presence circuit: `circuits/variant_presence/src/main.nr` | ZK | Circuit compiles with `nargo check` |
| Tue Jul 23 | Generate proving/verification keys for variant presence circuit | ZK | `circuits/variant_presence/target/` artifacts |
| Tue Jul 23 | End-to-end proof test: generate witness from test SNP vector, generate proof | ZK | `nargo prove` + `nargo verify` passing |
| Wed Jul 24 | Generate Solidity verifier: `nargo codegen-verifier` | ZK | `contracts/VariantPresenceVerifier.sol` |
| Wed Jul 24 | Deploy verifier to Sepolia; integrate with `AccessController.sol` | Smart Contracts | On-chain proof verification test |
| Thu Jul 25 | PRS range proof circuit: skeleton + constraint analysis | ZK | `circuits/prs_range/src/main.nr` skeleton; constraint count documented |
| Thu Jul 25 | Proof generation benchmarks: M3 Pro timing for variant presence circuit | ZK | `docs/benchmarks/zk-performance.md` |
| Fri Jul 26 | Client-side WASM proof generation: `wasm-pack build` from Noir circuit | Client | Browser proving demo working (even if slow) |

**Exit Criteria:** A variant presence proof can be generated client-side (WASM), submitted to Sepolia, and verified on-chain by the AccessController contract.

### Week 5 (Jul 29–Aug 4): API Layer and Integration

**Goal:** REST API scaffolded; vault upload and consent flows testable via API.

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| Mon Jul 29 | Axum router: all REST endpoint stubs with request/response types | Backend | All endpoints return 501 with correct schemas |
| Mon Jul 29 | JWT authentication middleware: wallet-signed JWT verify | Backend | Auth middleware unit tests |
| Tue Jul 30 | `/vault/upload` endpoint: chunked upload to IPFS, manifest storage | Backend | Integration test: 50 MB VCF upload via API |
| Tue Jul 30 | `/token/mint` endpoint: trigger contract mint via Ethereum RPC | Backend | Mint flow test on Sepolia |
| Wed Jul 31 | `/consent/grant` and `/consent/revoke` endpoints | Backend | Consent round-trip test |
| Wed Jul 31 | WebSocket server: royalty event streaming via tokio-tungstenite | Backend | WebSocket test: subscribe to token, trigger royalty, receive event |
| Thu Aug 1 | The Graph subgraph: deploy to hosted service for Sepolia | Indexing | Subgraph syncing consent events |
| Thu Aug 1 | GraphQL endpoint: integrate with The Graph subgraph | Backend | GraphQL query for consent grants returns data |
| Fri Aug 2 | API documentation: OpenAPI 3.1 spec auto-generated from Axum handlers | Backend | `docs/api/openapi.yaml` published |

**Exit Criteria:** A complete flow — upload vault → mint token → grant consent → request access → receive royalty — is demonstrable via REST API calls to Sepolia.

### Week 6 (Aug 5–15): Security Review, Documentation, Phase I Close

**Goal:** All Phase I deliverables complete; architecture approved for Phase II build.

| Day | Task | Owner | Deliverable |
|---|---|---|---|
| Mon Aug 5 | Smart contract security self-review: reentrancy, access control, arithmetic | Smart Contracts | Security checklist completed; findings logged |
| Mon Aug 5 | Foundry invariant tests for royalty distributor (no funds stuck) | Smart Contracts | `forge test --match-test invariant` passing |
| Tue Aug 6 | ZK circuit soundness self-review: under-constraining check | ZK | Circuit review checklist; all inputs constrained |
| Tue Aug 6 | Threat model peer review session | All | Threat model doc updated with new findings |
| Wed Aug 7 | HIPAA technical safeguard mapping document | Legal/Engineering | `docs/compliance/hipaa-mapping.md` |
| Wed Aug 7 | GDPR Data Protection Impact Assessment (DPIA) skeleton | Legal | `docs/compliance/gdpr-dpia.md` |
| Thu Aug 8 | Security audit firm RFP: contact Trail of Bits, OpenZeppelin, Veridise | Leadership | 3 RFPs sent; audit scoped for Phase II |
| Thu Aug 8 | Phase I deliverables gap analysis | All | Checklist: all deliverables green or formally deferred |
| Fri Aug 9 | Internal architecture review: this document v1.0 sign-off | All | `docs/phase-1/technical-architecture.md` — version 1.0 |
| Aug 10–15 | Phase I buffer: address any open items from review | All | Phase I sign-off; Phase II kickoff |

**Exit Criteria (Phase I Go/No-Go):**

- [ ] This architecture document approved by all technical leads
- [ ] All smart contracts deployed to Sepolia with passing tests (≥ 90% coverage)
- [ ] Vault encrypt/decrypt round-trip working end-to-end
- [ ] Variant presence ZK proof verifiable on-chain
- [ ] REST API documented (OpenAPI spec published)
- [ ] The Graph subgraph syncing on Sepolia
- [ ] Security threat model reviewed and accepted
- [ ] Audit firm engagement initiated
- [ ] Legal framework (HIPAA/GDPR) skeleton complete

---

## Appendix A: Dependency Versions (Pinned)

| Dependency | Version | Use |
|---|---|---|
| Solidity | 0.8.26 | Smart contracts |
| OpenZeppelin Contracts | 5.0.2 | ERC-721, ERC-2981, Governor |
| Foundry | nightly-2026-06-01 | Contract testing |
| Noir | 0.32.0 | ZK circuits |
| Barretenberg | 0.55.0 | ZK proving backend |
| Rust | 1.80.0 (stable) | API backend |
| Axum | 0.7.5 | HTTP framework |
| aes-gcm (Rust) | 0.10.3 | Encryption |
| argon2 (Rust) | 0.5.3 | Key derivation |
| k256 (Rust) | 0.13.3 | secp256k1 ECDH |
| wagmi | 2.12.0 | Client wallet integration |
| viem | 2.18.0 | Ethereum client |
| The Graph CLI | 0.87.0 | Subgraph development |

---

## Appendix B: Open Questions for Architecture Review

The following questions require decisions before Phase II implementation begins:

1. **L1 vs. L2 deployment:** Base (Coinbase, OP Stack) vs. Arbitrum vs. Polygon. Decision criteria: institutional pharma counterparty familiarity, gas cost for consent micropayments, EVM equivalence. **Recommendation: Base** — Coinbase institutional relationships align with pharma BD pipeline.

2. **Payment token:** ETH native vs. USDC for royalty payments. Pharma companies will not send ETH for clinical data access; USDC is the institutional standard. **Recommendation: USDC** with an ETH fallback. Requires USDC transfer logic in RoyaltyDistributor.

3. **Reference genome version:** GRCh38 is current standard; GRCh37 (hg19) remains in heavy clinical use. The SNP vector canonical index must specify a reference genome. **Recommendation:** Support both; index VCFs are converted to GRCh38 coordinates via liftOver during upload, stored with reference metadata.

4. **Proof generation UX:** 18–95 second browser proving time is too long for casual users. Phase I decision: is client-side proving required for MVP, or is opt-in TEE proving acceptable as the primary path? **Recommendation:** TEE proving as primary path in Phase II; client-side proving as advanced/privacy-max option by Phase III.

5. **Soulbound vs. transferable:** This document specifies soulbound. This prevents genome transfer — a sound ethical and legal position. However, it also prevents genome-backed DeFi applications that might be in scope for Phase IV. **Decision confirmed:** Soulbound in DNaI V1. V2 may introduce a delegable wrapper token.

---

*Document maintained in `/home/user/cloudcontrolllc-site/docs/phase-1/technical-architecture.md`*  
*Next review: Phase I Week 6 (Aug 9, 2026)*  
*Document owner: Cloud Control LLC Engineering*
