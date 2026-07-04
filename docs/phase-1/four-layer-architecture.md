# DNaI Genomic Sovereignty Stack — Four-Layer Architecture Specification

**Project:** DNaI — Genomic Sovereign Token  
**Organization:** Cloud Control LLC  
**Document Version:** 1.0.0  
**Status:** Definitive Engineering Reference  
**Date:** 2026-07-04  
**Classification:** Internal — Engineering / Strategic  
**Supersedes:** Portions of `technical-architecture.md` v0.1.0 (see Section 7 for delta analysis)

---

## Table of Contents

1. [Stack Overview & Design Principles](#1-stack-overview--design-principles)
2. [Layer 1: Foundation & Trust](#2-layer-1-foundation--trust)
3. [Layer 2: Data & Oracles](#3-layer-2-data--oracles)
4. [Layer 3: Privacy Compute Engine](#4-layer-3-privacy-compute-engine)
5. [Layer 4: Governance & Legacy](#5-layer-4-governance--legacy)
6. [Cross-Layer Data Flow — End-to-End Scenarios](#6-cross-layer-data-flow--end-to-end-scenarios)
7. [Technology Selection Delta Analysis](#7-technology-selection-delta-analysis)
8. [Implementation Sequence by Phase](#8-implementation-sequence-by-phase)
9. [Revenue Impact of the Four-Layer Stack](#9-revenue-impact-of-the-four-layer-stack)

---

## 1. Stack Overview & Design Principles

### 1.1 Why Four Layers?

The DNaI Genomic Sovereignty Stack is organized into four distinct trust domains, not as an engineering convenience, but because each layer solves a fundamentally different trust problem. Collapsing these concerns into fewer layers would force unacceptable trade-offs in privacy, throughput, or sovereignty. The four layers and their core trust propositions are:

| Layer | Name | Trust Question Answered |
|---|---|---|
| **Layer 1** | Foundation & Trust | Who is allowed to participate in the consortium, and how do different chains agree on facts? |
| **Layer 2** | Data & Oracles | Where does raw data live, and how does the network know what it is worth? |
| **Layer 3** | Privacy Compute Engine | How can computation happen on data that must never be decrypted? |
| **Layer 4** | Governance & Legacy | Who owns the genome, who gets paid, and what happens when the owner dies? |

Each layer has a distinct **trust model**:

- **Layer 1** operates on institutional trust — only verified consortium members (IRB-approved research institutions, certified sequencing providers, certified pharma partners) participate. Trust is permissioned.
- **Layer 2** operates on cryptographic trust — content-addressed storage ensures data integrity without trusting any storage provider, and decentralized oracle networks ensure pricing data cannot be manipulated by any single party.
- **Layer 3** operates on mathematical trust — homomorphic encryption provides privacy guarantees based on computational hardness assumptions, not on trusting any party to behave honestly.
- **Layer 4** operates on sovereign trust — smart contracts enforce consent and royalty distribution without requiring trust in any intermediary, including Cloud Control LLC.

### 1.2 Design Principles

The following principles govern architectural decisions across all four layers:

| Principle | Manifestation |
|---|---|
| **Sovereign by default** | Client-side AES-256-GCM encryption before any byte leaves the device. No server holds plaintext or decryption keys. |
| **Separation of privacy and compute** | Computation (Layer 3) is architecturally isolated from storage (Layer 2) and governance (Layer 4). FHE enables computation without co-locating data and compute. |
| **Cross-chain verifiability** | The Flare Network bridge (Layer 1) ensures that events proven on Hyperledger Fabric are cryptographically verifiable on Ethereum/Base, enabling trustless cross-chain royalty distribution. |
| **Minimal trust surface** | Each layer is designed so a full compromise of that layer cannot compromise another layer. A compromised IPFS node (Layer 2) cannot affect consent enforcement (Layer 4). |
| **Multi-generational durability** | Layer 4's multi-sig inheritance model ensures genomic assets survive their original holders across generations. |
| **Composable consent** | On-chain consent registry enables programmable, auditable, revocable access grants without re-architecturing. |
| **Open standards where possible** | ERC-721 (Layer 4), IPFS CID (Layer 2), and standard FHE libraries (Layer 3) ensure ecosystem integration and third-party tooling. |

### 1.3 Stack Summary Diagram

```
 DNaI GENOMIC SOVEREIGNTY STACK
 ════════════════════════════════════════════════════════════════════════════════

 ┌──────────────────────────────────────────────────────────────────────────────┐
 │  LAYER 4: GOVERNANCE & LEGACY  (Owner Sovereignty — Public Ethereum/Base)   │
 │                                                                              │
 │  ┌─────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐   │
 │  │  BioNFTs™        │  │  Smart Contracts      │  │  Multi-Sig Wallets   │   │
 │  │  (DNaI ERC-721   │  │  (Consent Registry,   │  │  (Gnosis Safe —      │   │
 │  │   Soulbound)     │  │   Royalty Distributor, │  │   Generational       │   │
 │  │                  │  │   ERC-4337 Paymaster)  │  │   Inheritance)       │   │
 │  └────────┬─────────┘  └──────────┬───────────┘  └──────────┬───────────┘   │
 └───────────┼────────────────────────┼──────────────────────────┼──────────────┘
             │  Royalty trigger via    │  Consent event from      │
             │  Flare State Connector  │  Fabric → Base           │
 ┌───────────┼────────────────────────┼──────────────────────────┼──────────────┐
 │  LAYER 3: PRIVACY COMPUTE ENGINE  (Encrypted Computation — Distributed)     │
 │                                                                              │
 │  ┌──────────────────────────────────┐  ┌─────────────────────────────────┐  │
 │  │  Homomorphic Encryption (FHE)    │  │  Federated Learning (FL)        │  │
 │  │  Scheme: CKKS via OpenFHE        │  │  Framework: Flower (flwr)       │  │
 │  │  Encrypted in → Encrypted out    │  │  FHE-encrypted gradients        │  │
 │  │  GWAS, Drug Response, ML         │  │  Aggregators = Fabric peers     │  │
 │  └──────────────────────────────────┘  └─────────────────────────────────┘  │
 └─────────────────────────────────────────────────────────────────────────────┘
             ▲                                           ▲
             │  Encrypted data fetch                     │  Model training jobs
 ┌───────────┼───────────────────────────────────────────┼──────────────────────┐
 │  LAYER 2: DATA & ORACLES  (Storage & External Inputs — Decentralized)       │
 │                                                                              │
 │  ┌──────────────────────────────────┐  ┌─────────────────────────────────┐  │
 │  │  IPFS / Filecoin Storage         │  │  Flare FTSO Oracle              │  │
 │  │  BAM/VCF encrypted chunks        │  │  Genomic data pricing feeds     │  │
 │  │  Content-addressed CIDs          │  │  Health outcomes data streams   │  │
 │  │  30GB WGS → 16MB chunks          │  │  ~90s epoch pricing updates     │  │
 │  └──────────────────────────────────┘  └─────────────────────────────────┘  │
 └─────────────────────────────────────────────────────────────────────────────┘
             ▲                                           ▲
             │  Access events logged                     │  Price feeds
 ┌───────────┼───────────────────────────────────────────┼──────────────────────┐
 │  LAYER 1: FOUNDATION & TRUST  (Consortium Consensus — Private)              │
 │                                                                              │
 │  ┌──────────────────────────────────┐  ┌─────────────────────────────────┐  │
 │  │  Hyperledger Fabric              │  │  Flare Network Bridge           │  │
 │  │  Private consortium network      │  │  State Connector cross-chain    │  │
 │  │  Trusted nodes only              │  │  Fabric state → Ethereum/Base   │  │
 │  │  3,500+ TPS, no gas costs        │  │  BioNFT ownership → Fabric      │  │
 │  └──────────────────────────────────┘  └─────────────────────────────────┘  │
 └─────────────────────────────────────────────────────────────────────────────┘

 EXTERNAL INTERFACES
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │  User Device (plaintext zone)  │  Pharma / Research APIs  │  AI Platforms   │
 └──────────────────────────────────────────────────────────────────────────────┘
```

### 1.4 Data Flow: Genome Sequencing to Royalty Payout

The canonical end-to-end data flow across all four layers, from the moment a genome is sequenced to the moment a royalty lands in the owner's wallet:

```
GENOME HOLDER DEVICE (plaintext zone — trust boundary)
──────────────────────────────────────────────────────
Step 1:  Raw genomic file (BAM/VCF) processed client-side
         → SNP vector extracted → Poseidon ZK commitment computed
         → AES-256-GCM encryption applied (wallet-derived key)
         → Ciphertext chunks produced

         ↓  Ciphertext only crosses trust boundary

LAYER 2 (Data & Oracles)
──────────────────────────────────────────────────────
Step 2:  Encrypted chunks uploaded → IPFS (hot tier) → Filecoin (cold persistence)
         → CIDs recorded in encrypted manifest
         → Manifest CID → vault registration

LAYER 1 (Foundation & Trust)
──────────────────────────────────────────────────────
Step 3:  Consortium sequencing provider node submits mint transaction
         to Hyperledger Fabric (GenomicAccessChaincode)
         → Fabric records: vault CID + genome hash + owner address
         → Fabric emits GenomicVaultRegisteredEvent

LAYER 4 (Governance & Legacy)
──────────────────────────────────────────────────────
Step 4:  Flare State Connector relays Fabric registration event → Base L2
         → DNaIToken.sol mints BioNFT (ERC-721 soulbound)
         Token ID = keccak256(genomeHash + ownerAddress + chainId)
         → Owner now holds sovereign digital certificate of genome ownership

         [TIME PASSES — pharma company requests access]

LAYER 4 (Governance & Legacy)
──────────────────────────────────────────────────────
Step 5:  Pharma submits access request + USDC deposit to ConsentRegistry.sol
         → Owner approves: KWAT (Key Wrapped Access Token) generated client-side
         → Consent grant stored on-chain (Base)

LAYER 1 (Foundation & Trust)
──────────────────────────────────────────────────────
Step 6:  Flare State Connector relays consent event → Hyperledger Fabric
         → Fabric consortium validates pharma's access rights
         → RoyaltySettlementChaincode records access event
         → GenomicAccessChaincode authorizes data delivery

LAYER 2 (Data & Oracles)
──────────────────────────────────────────────────────
Step 7:  Pharma node decrypts KWAT using own private key → obtains chunk DEK subset
         → Fetches authorized encrypted chunks from IPFS
         → Decrypts locally — raw data never traverses network in plaintext
         FTSO oracle provides current market price validation

LAYER 3 (Privacy Compute Engine)  [for compute-type access]
──────────────────────────────────────────────────────
Step 8:  [If compute access is requested, not raw data:]
         FHE server receives encrypted genomic data
         → Runs analysis (GWAS, drug response model) entirely on ciphertext
         → Returns encrypted result → pharma decrypts only final statistics

LAYER 4 (Governance & Legacy)
──────────────────────────────────────────────────────
Step 9:  Flare State Connector proves Fabric access event → Base smart contract
         → RoyaltyDistributor.sol releases USDC to genome owner
         → ERC-4337 paymaster sponsors gas — holder receives USDC gas-free
         → The Graph indexes royalty event → owner dashboard updates in real-time
```

---

## 2. Layer 1: Foundation & Trust

### 2.1 Architecture Overview

Layer 1 is the private, permissioned backbone of the DNaI stack. It consists of two complementary subsystems: a **Hyperledger Fabric consortium network** that provides high-throughput, private consensus among verified institutional participants, and the **Flare Network bridge** that connects this private layer to the public Ethereum/Base blockchain where BioNFTs and royalty smart contracts live.

The core insight is that not all operations in a genomic data platform belong on a public blockchain. Consortium operations — validating sequencing providers, recording data access events, settling royalties among institutions — require confidentiality, high throughput, and zero gas cost. Public blockchain operations — token ownership, consent enforcement, royalty receipt by individuals — require censorship resistance and composability with the broader DeFi ecosystem. Layer 1 provides both, bridged by Flare.

### 2.2 Hyperledger Fabric Network Topology

#### 2.2.1 Ordering Service

The ordering service provides crash fault tolerant (CFT) consensus using **Raft** (not Byzantine Fault Tolerant; the threat model assumes consortium members are trusted but potentially unavailable, not adversarial within the network):

```
ORDERING SERVICE (Raft consensus)
─────────────────────────────────
  Orderer Node 1: Cloud Control LLC (primary)
  Orderer Node 2: Pilot Research Institution A
  Orderer Node 3: Pilot Sequencing Partner

  Block generation:  ~0.5s block time
  TPS:               3,500+ transactions/second
  Block size:        10 MB max
  Finality:          Instant (Raft deterministic finality)
```

The three-node ordering service satisfies Raft quorum requirements (requires floor(n/2)+1 = 2 nodes available). Cloud Control LLC operates the primary orderer; institutional partners operate secondary orderers to prevent single-operator control.

#### 2.2.2 Peer Node Architecture

Each consortium member organization operates at minimum one peer node:

```
PEER NODE ROLES
───────────────
  Endorsing Peer:  Executes chaincode (smart contract) and endorses proposals
  Committing Peer: Validates and commits endorsed transactions to ledger
  Anchor Peer:     Gossip protocol discovery point for inter-org communication

PEER HARDWARE REQUIREMENTS (minimum)
  CPU:    8 vCPU
  RAM:    32 GB
  SSD:    2 TB NVMe (ledger storage, growing)
  Network: 1 Gbps dedicated

FULL NODE CONFIGURATION (Phase II, 3 organizations)
  Cloud Control LLC:      2 peers (endorsing + anchor)
  Research Institution:   1 peer (endorsing + anchor)
  Sequencing Partner:     1 peer (endorsing + anchor)
  Total peers:            4 peers across 3 organizations
```

#### 2.2.3 Membership Service Provider (MSP)

Every participant's identity is managed through the MSP — Fabric's PKI-based identity layer. This is the enforcement mechanism that makes the network permissioned:

```
MSP STRUCTURE
─────────────
  Root CA:     Cloud Control LLC Certificate Authority (self-hosted, HSM-backed)
  
  Per-Organization CAs:
    cloudcontrolllc.dnai.msp:     Issues certs to Cloud Control LLC components
    [institution_a].dnai.msp:     Issues certs to Research Institution A nodes
    [seqprovider_a].dnai.msp:     Issues certs to Sequencing Provider A nodes
  
  Certificate types:
    Admin cert:    Org admin operations (channel config, chaincode install)
    Peer cert:     Peer identity for gossip and endorsement
    Client cert:   Application identity for submitting transactions
    Orderer cert:  Ordering service node identity

  Revocation:
    CRL (Certificate Revocation List) updated within 1 hour of revocation event
    Revoked consortium member immediately loses endorsement rights
```

### 2.3 Consortium Membership

#### 2.3.1 Eligibility Criteria

Consortium membership requires passing all of the following criteria:

| Criterion | Requirement | Verification Method |
|---|---|---|
| **Sequencing Providers** | CLIA-certified laboratory; ISO 15189 or CAP accreditation | Certificate upload + third-party verification |
| **Research Institutions** | IRB approval for human genomic data research; university or government affiliation | IRB approval letter + DUNS registration |
| **Pharma Partners** | FDA-registered facility; demonstrated GCP (Good Clinical Practice) compliance | FDA registration number + audit report |
| **Cloud Control LLC** | Protocol operator; always a member | Founding member; cannot be removed without full DAO governance vote |
| **Data Processing Agreements** | Signed DPA with Cloud Control LLC covering HIPAA/GDPR obligations | Legal counsel review + on-chain DPA hash commitment |

#### 2.3.2 Admission Process

```
CONSORTIUM ADMISSION FLOW
──────────────────────────
1. Applicant submits: (a) legal entity docs, (b) accreditation certificates,
   (c) signed DPA, (d) technical contact + infrastructure specs

2. Cloud Control LLC legal review: 5 business days

3. Existing consortium member vote: simple majority required
   (Phase II: Cloud Control LLC sole vote; Phase III: multi-org vote)

4. On admission: Cloud Control LLC Root CA issues org-level intermediate CA cert
   Applicant generates their own node + admin certs from issued intermediate CA

5. Channel updates: new org added to relevant channel configurations
   via channel update transaction (requires orderer approval)

6. New peer joins network: gossip protocol syncs ledger history

TARGET CONSORTIUM SIZE
  Phase II:    3 organizations (Cloud Control LLC + 2 pilot partners)
  Phase III:   10 organizations
  Phase IV:    50 organizations (full network)
```

### 2.4 Channel Design

Hyperledger Fabric's channel model allows partitioning ledger state between subsets of participants. DNaI uses three dedicated channels, each with distinct membership and data sensitivity:

#### Channel A: Genomic Data Access Events (`dnai-access`)

```
PURPOSE:   Record every authorized data access event (who accessed what,
           when, under which consent grant). This is the primary audit log.

MEMBERS:   All consortium organizations

DATA:
  - AccessEventRecord:
      vault_cid: string          // IPFS CID of the accessed vault
      token_id: uint256          // On-chain BioNFT token ID
      requester_org: string      // MSP org ID of accessing entity
      grant_id: bytes32          // Corresponding on-chain consent grant ID
      scope: enum                // FULL_GENOME | VARIANT_PANEL | etc.
      accessed_at: timestamp
      data_hash: bytes32         // Hash of data subset accessed (for integrity)

THROUGHPUT TARGET:   1,000 access events/second at steady state
RETENTION:           Permanent (immutable ledger)
PRIVACY COLLECTIONS: Raw vault contents are NOT stored here — only metadata
```

#### Channel B: Royalty Settlements (`dnai-royalty`)

```
PURPOSE:   Inter-consortium royalty accounting and settlement preparation
           before Flare State Connector relays to Base for on-chain distribution.

MEMBERS:   Cloud Control LLC + Sequencing Partners + any institution with
           revenue sharing arrangements

DATA:
  - RoyaltySettlementRecord:
      period_start: timestamp
      period_end: timestamp
      token_id: uint256
      access_count: uint32
      gross_amount_usdc: uint256   // 6-decimal USDC
      holder_share: uint256        // 70%
      protocol_share: uint256      // 20%
      dao_share: uint256           // 10%
      settlement_status: enum      // PENDING | RELAYED | CONFIRMED
      flare_relay_tx: bytes32      // Flare State Connector proof transaction

THROUGHPUT TARGET:   Batch settlements, 100/second
RETENTION:           7 years (regulatory requirement for financial records)
```

#### Channel C: Consortium Governance (`dnai-governance`)

```
PURPOSE:   Consortium-level governance decisions: member admission, 
           chaincode upgrades, channel configuration changes.
           Separated from data channels to prevent governance events
           from contaminating access audit logs.

MEMBERS:   Cloud Control LLC + all full consortium members (not observer nodes)

DATA:
  - GovernanceProposal: type, proposer, proposed_config, vote_deadline
  - GovernanceVote: proposal_id, voter_org, vote (APPROVE | REJECT), signature
  - MemberAdmission: new_org_msp_id, admission_cert_hash, effective_date
  - ChaincodeUpgrade: chaincode_name, new_version, code_hash, approvals[]

THROUGHPUT TARGET:   Low volume; governance actions are infrequent
RETENTION:           Permanent
```

### 2.5 Chaincode Design

#### 2.5.1 GenomicAccessChaincode

```go
// GenomicAccessChaincode — manages vault registration and access event logging
// Deployed on: dnai-access channel
// Language: Go (Hyperledger Fabric Go SDK)

package main

// VaultRegistration represents a registered genomic vault on the Fabric ledger
type VaultRegistration struct {
    VaultCID          string    `json:"vault_cid"`
    TokenID           string    `json:"token_id"`       // Hex uint256
    GenomeHash        string    `json:"genome_hash"`    // keccak256 hex
    OwnerAddress      string    `json:"owner_address"`  // Ethereum address
    SequencingOrg     string    `json:"sequencing_org"` // MSP org ID
    RegisteredAt      int64     `json:"registered_at"`
    ReferenceGenome   string    `json:"reference_genome"`
    ConsentGrantIDs   []string  `json:"consent_grant_ids"` // Active grant IDs
}

// AccessEvent represents a single authorized data access event
type AccessEvent struct {
    EventID       string `json:"event_id"`      // deterministic: keccak256(grantID+timestamp)
    TokenID       string `json:"token_id"`
    GrantID       string `json:"grant_id"`       // On-chain consent grant ID
    RequesterOrg  string `json:"requester_org"`  // MSP org ID
    AccessedAt    int64  `json:"accessed_at"`
    Scope         string `json:"scope"`
    DataHash      string `json:"data_hash"`
    RelayedToBase bool   `json:"relayed_to_base"` // true after Flare SC relay
}

// RegisterVault — called by approved sequencing provider after genome sequencing
func (c *GenomicAccessChaincode) RegisterVault(ctx, vaultCID, tokenID,
    genomeHash, ownerAddress, referenceGenome string) error

// LogAccessEvent — called when consortium member accesses vault data
func (c *GenomicAccessChaincode) LogAccessEvent(ctx, tokenID, grantID,
    requesterOrg, scope, dataHash string) (string, error)

// ValidateConsentGrant — verify that a cross-chain consent grant is active
// Calls out to Flare State Connector verification for on-chain grant state
func (c *GenomicAccessChaincode) ValidateConsentGrant(ctx, grantID,
    requesterAddress string) (bool, error)

// GetUnrelayedEvents — returns access events not yet relayed to Base via Flare
func (c *GenomicAccessChaincode) GetUnrelayedEvents(ctx string) ([]AccessEvent, error)

// MarkEventRelayed — called after Flare State Connector confirms relay
func (c *GenomicAccessChaincode) MarkEventRelayed(ctx, eventID,
    flareRelayTx string) error
```

#### 2.5.2 RoyaltySettlementChaincode

```go
// RoyaltySettlementChaincode — manages royalty accounting on the consortium layer
// Deployed on: dnai-royalty channel
// Language: Go

type RoyaltyBatch struct {
    BatchID        string          `json:"batch_id"`
    PeriodStart    int64           `json:"period_start"`
    PeriodEnd      int64           `json:"period_end"`
    Settlements    []Settlement    `json:"settlements"`
    TotalAmount    string          `json:"total_amount_usdc"` // string to avoid float
    Status         string          `json:"status"`            // PENDING|RELAYED|CONFIRMED
    FlareProofTx   string          `json:"flare_proof_tx"`
}

type Settlement struct {
    TokenID         string `json:"token_id"`
    AccessEventIDs  []string `json:"access_event_ids"`
    GrossAmountUSDC string `json:"gross_amount_usdc"`
    HolderShare     string `json:"holder_share"`      // 70%
    ProtocolShare   string `json:"protocol_share"`    // 20%
    DAOShare        string `json:"dao_share"`         // 10%
}

// CreateBatch — aggregate access events into a settlement batch
func (c *RoyaltySettlementChaincode) CreateBatch(ctx string,
    periodStart, periodEnd int64) (string, error)

// FinalizeAndRelay — mark batch ready for Flare State Connector relay
// Returns a deterministic batch hash for Flare proof construction
func (c *RoyaltySettlementChaincode) FinalizeAndRelay(ctx,
    batchID string) (string, error)

// ConfirmBaseSettlement — called after on-chain settlement confirmed on Base
func (c *RoyaltySettlementChaincode) ConfirmBaseSettlement(ctx, batchID,
    baseSettlementTx string) error
```

### 2.6 Flare State Connector Integration

The Flare State Connector is the cryptographic bridge that allows the permissioned Hyperledger Fabric network to communicate trustlessly with the public Ethereum/Base network. It operates in two directions:

#### 2.6.1 Fabric → Base: Proving Access Events for Royalty Trigger

```
FLARE STATE CONNECTOR: FABRIC → BASE FLOW
──────────────────────────────────────────

1. Access event logged on Fabric (GenomicAccessChaincode.LogAccessEvent)

2. DNaI Relay Service (off-chain, operated by Cloud Control LLC):
   - Fetches unrelayed events from Fabric via GetUnrelayedEvents
   - Constructs State Connector attestation request:
     AttestationType: "EVMTransaction" equivalent for Fabric state
     SourceId:        dnai_fabric_network_id
     RequestBody:
       transactionHash: Fabric block+tx hash of the access event
       requiredConfirmations: 3 (Raft finality is instant, but 3 blocks for safety)

3. Flare attestation providers (decentralized network) verify the
   Fabric event by running their own Fabric light clients

4. Supermajority of attestation providers submit their attestation hash
   to the Flare State Connector contract → Merkle root committed on-chain

5. DNaI Relay Service retrieves Merkle proof from Flare network

6. Relay Service submits proof to Base:
   DNaIRoyaltyBridge.settleFromFabric(
     merkleProof,     // Flare attestation Merkle proof
     accessEvent,     // Decoded Fabric event data
     royaltyAmount    // Calculated royalty for this access
   )

7. Base smart contract verifies proof against Flare State Connector root
   → distributes USDC royalty to genome owner
   → ERC-4337 paymaster covers gas → holder receives USDC gas-free

8. Relay Service calls Fabric.MarkEventRelayed(eventID, baseTxHash)
```

#### 2.6.2 Base → Fabric: Verifying BioNFT Ownership

When a consortium member needs to verify that a genome holder actually owns the BioNFT before logging an access event:

```
FLARE STATE CONNECTOR: BASE → FABRIC FLOW
──────────────────────────────────────────

1. Consortium member requests data access for tokenID 0x1234...

2. GenomicAccessChaincode.ValidateConsentGrant(grantID, requesterAddress)
   is called from Fabric

3. DNaI Relay Service constructs Flare attestation request:
   AttestationType: "EVMTransaction"
   SourceId:        base_mainnet (chain ID 8453)
   RequestBody:
     transactionHash: tx hash of the ConsentGranted event on Base
     requiredConfirmations: 10 (Base block finality)

4. Flare attestation providers read Base L2 state
   → verify consent grant is active + grantee matches requester

5. Attestation committed to Flare; Fabric chaincode receives verification
   via Flare-to-Fabric relay service

6. GenomicAccessChaincode confirms grant is valid
   → access event logging proceeds
   → data delivery authorized
```

### 2.7 Why Hyperledger Fabric for the Consortium Layer

| Criterion | Hyperledger Fabric | Ethereum/Base |
|---|---|---|
| **Throughput** | 3,500+ TPS (Raft) | ~15 TPS (L1) / ~2,000 TPS (Base) |
| **Transaction cost** | Zero (consortium operates own infrastructure) | $0.001–$0.10 per tx (Base) |
| **Privacy** | Private data collections; consortium-only ledger | Public — all data visible |
| **Permissioning** | MSP enforces institutional identity at network level | Permissionless — anyone can read/write |
| **Data model** | Rich key-value + complex query via CouchDB | Limited on-chain state (high cost) |
| **Compliance** | HIPAA-aligned private network; auditable membership | Regulatory uncertainty for health data |
| **Finality** | Instant (Raft deterministic) | ~2s (Base, probabilistic finality) |

**Private data collections** are the critical Fabric feature for DNaI: sensitive business data (e.g., the exact price a pharma company pays for a specific genome cohort) can be shared only between the relevant parties on the same channel, with only a hash of the private data committed to the public ledger. This is unavailable on any public blockchain.

---

## 3. Layer 2: Data & Oracles

### 3.1 Architecture Overview

Layer 2 has two distinct responsibilities: **decentralized storage** for the actual genomic data blobs, and **decentralized oracle feeds** that provide real-time pricing signals to the marketplace. These are architecturally separate systems that interact only through the marketplace pricing engine.

### 3.2 IPFS Storage Architecture

#### 3.2.1 Supported File Formats

| Format | Typical Size | Chunk Size | Chunk Count (30GB WGS) |
|---|---|---|---|
| **BAM** (aligned reads) | 10–60 GB | 16 MB | ~1,875 chunks |
| **VCF** (variants) | 50 MB–1 GB | 4 MB | ~13 chunks (1GB VCF) |
| **FASTQ** (raw reads) | 10–100 GB | 8 MB | ~3,750 chunks (30GB) |
| **CRAM** (compressed aligned) | 5–30 GB | 16 MB | ~940 chunks |

For a 30GB whole-genome sequencing BAM file:
- 16 MB chunks = 1,875 chunks
- Each chunk receives its own AES-256-GCM IV (96-bit random)
- Each chunk has its own CID (SHA2-256 of ciphertext)
- Total CIDs per genome vault: 1,875 data chunks + 1 encrypted manifest = 1,876 CIDs

#### 3.2.2 Content Addressing and CID Derivation

```
ENCRYPTION BEFORE UPLOAD (client-side)
──────────────────────────────────────
Input:  Plaintext chunk (16 MB)
        DEK (256-bit, wallet-derived via Argon2id — see technical-architecture.md §2.2.1)
        chunk_index (uint32)
        vault_uuid (bytes16)

1. Generate IV: CSPRNG(96 bits)  [unique per chunk]

2. Compute AAD: keccak256(owner_address || vault_uuid || chunk_index)
   [binds ciphertext to owner identity — prevents chunk replay across vaults]

3. Encrypt: AES-256-GCM(key=DEK, iv=IV, aad=AAD, plaintext=chunk)
   Output: ciphertext || 128-bit auth tag

4. Upload to IPFS: IPFS content-addresses by SHA2-256(ciphertext)
   CID = CIDv1(SHA2-256(ciphertext), codec=raw)

5. Record in vault manifest:
   { "index": N, "cid": "bafyrei...", "iv": "0x...", "tag": "0x...",
     "byte_range": [start, end], "chromosome_range": "chr1:1-248956422" }
```

The chromosome range metadata in the manifest enables selective access grants: a consent grant scoped to chromosome 22 only needs to deliver ~50 chunks out of 1,875 total — reducing both cost and exposure.

#### 3.2.3 Filecoin Storage Deals

```
FILECOIN STORAGE STRATEGY
──────────────────────────
Provider selection:     Automated via Lighthouse.storage API
                        (filters by reputation score ≥ 95% and geographic distribution)

Geographic requirement: Minimum 1 provider per continent: NA, EU, APAC
Replication factor:     3 active storage deals per CID (minimum)
Deal duration:          520 days (renewable; Lighthouse auto-renewal)
Retrieval SLA:          < 1 hour for full 30GB BAM via Filecoin Fast Retrieval
Deal monitoring:        Lighthouse deal health API, polled every 6 hours

COST MODEL (approximate, 2026 market rates)
  30GB BAM vault: ~$0.50–$2.00/year per replica
  3 replicas:     ~$1.50–$6.00/year per genome
  10,000 genomes: ~$15K–$60K/year storage costs
  [Covered by protocol fee revenue — negligible vs. $90K/month Phase III]

ENCRYPTED MANIFEST STORAGE
  Manifest (~50 KB) stored as separate IPFS object
  CID of manifest stored on-chain in DNaIToken.sol (vaultCID field)
  Manifest also has 3 Filecoin replicas
  Manifest updates (e.g., adding new data format) create new CID;
  updateManifest() on-chain records new CID — old manifest CIDs remain valid
  for any consumer who cached the previous version
```

#### 3.2.4 Selective Access Architecture

The chunk manifest enables fine-grained selective data delivery without re-encrypting:

```
SELECTIVE DELIVERY FLOW
──────────────────────────────────────────────────
Consent Grant Scope: CHROMOSOME_22_ONLY

Authorized chunk indices:  Manifest lookup → chunks 1,820–1,875
                           (chromosome 22 spans final ~2.8% of BAM)

KWAT generation (owner's client):
  authorized_chunks = [1820, 1821, ..., 1875]
  chunk_keys = [DEK_chunk_1820, DEK_chunk_1821, ..., DEK_chunk_1875]
  KWAT = ECIES-Encrypt(requester_pubkey, chunk_keys)

Requester receives:
  - KWAT blob (unwrappable with their private key)
  - CIDs for chunks 1820–1875 (from manifest)
  
Requester fetches 56 chunks × 16MB = 896 MB  [vs. 30 GB full genome]
Requester decrypts using unwrapped chunk keys
Raw chromosome 22 data available locally for authorized analysis
```

### 3.3 Flare FTSO Integration for Genomic Data Pricing

#### 3.3.1 What FTSO Is

The Flare Time Series Oracle (FTSO) is a decentralized oracle system native to the Flare Network. Unlike Chainlink (which uses a push-based model with independent oracle nodes), FTSO operates through a delegation-based voting system where FLR and WFLR token holders delegate their tokens to data providers who submit price feeds every ~90 seconds. Providers who submit values close to the weighted median earn rewards. This creates a strong economic incentive for accuracy and censorship resistance.

DNaI's application of FTSO to genomic data pricing is a novel extension of the system beyond financial data — the first genomic data oracle use case on Flare.

#### 3.3.2 Standard FTSO Feeds Used by DNaI

DNaI consumes standard FTSO feeds for base financial calculations:

| FTSO Symbol | Use in DNaI |
|---|---|
| `USDC/USD` | Normalize royalty amounts; genomic data priced in USD, settled in USDC |
| `ETH/USD` | Gas cost estimation for consent transactions |
| `FLR/USD` | Relay service operational cost estimation |

These standard feeds are consumed via the Flare FTSO registry contract with no custom development required.

#### 3.3.3 Custom FTSO Data Provider for Genomic Data Pricing

DNaI's primary FTSO innovation is operating a **custom data provider** that submits genomic-market-specific price feeds to the FTSO system. This requires becoming an FTSO data provider on Flare Network (an open participation system):

```
DNAI CUSTOM FTSO DATA PROVIDER
─────────────────────────────────────────────────────────────────
Provider:     DNaI FTSO Oracle Node (operated by Cloud Control LLC)
Feeds submitted every ~90 seconds:

  DNAI_GENOME_FLOOR_USD    — Base price floor per genome per month (full access)
                             Aggregated from: active marketplace bid/ask spread,
                             recent closed transactions, demand signal (access requests
                             in last 24h / available genome supply)
                             Initial value: $150/genome/month
  
  DNAI_VARIANT_PANEL_USD   — Price for variant panel access
                             Derived: DNAI_GENOME_FLOOR_USD × 0.35
  
  DNAI_DISEASE_RISK_USD    — Price for computed risk score access
                             Derived: DNAI_GENOME_FLOOR_USD × 0.25
  
  DNAI_PHARMA_COHORT_USD   — Premium for rare-variant cohort access
                             Derived: DNAI_GENOME_FLOOR_USD × 2.0–5.0
                             (multiplier from variant prevalence data)
  
  DNAI_AI_TRAINING_USD     — Price per genome per AI training epoch
                             Derived: DNAI_GENOME_FLOOR_USD × 8.0
                             (reflects higher-value compute use case)

DECENTRALIZATION PLAN
  Phase II: Single DNaI data provider (centralized starting point)
  Phase III: Invite 3 research institution partners to run their own FTSO
             providers for the genomic feeds — creating a decentralized
             price discovery network for genomic data for the first time
  Phase IV: Open provider participation — any FTSO participant can
             propose genomic data price feeds; community aggregation
```

#### 3.3.4 FTSO Epoch Timing and Marketplace Impact

```
FTSO EPOCH CYCLE (~90 seconds)
────────────────────────────────
Second 0:   Submit window opens
            DNaI FTSO node reads: last 90s access volume,
            current genome supply (active consent listings),
            demand signals (new access requests in queue)
            Computes new DNAI_GENOME_FLOOR_USD estimate
            
Second 30:  Submit window closes; all providers have submitted hashes

Second 45:  Reveal window: providers reveal their actual values
            Weighted median computed by Flare protocol

Second 90:  New epoch; updated prices available on-chain
            DNaI marketplace contracts read updated floor prices
            Active access requests repriced against new floor
            New consent grant price minimums enforced

IMPACT ON MARKETPLACE OPERATIONS
─────────────────────────────────
  - Genome holder price floors auto-adjust with market conditions
    (holders who set floor = FTSO price floor track market automatically)
  - Pharma company access requests validated against current FTSO floor
    (requests priced below floor rejected at contract level)
  - Flash-sale prevention: price cannot drop more than 20% in one epoch
    (circuit breaker encoded in marketplace contract)
  - Historical FTSO data provides transparent price history for regulatory
    reporting and dispute resolution
```

#### 3.3.5 Health Outcomes Data Streams

Beyond pricing, DNaI FTSO providers submit health data streams that serve as pricing signals for specific genomic variants:

```
HEALTH OUTCOMES FEEDS
─────────────────────────────────────────────────────────────────
Source data: Aggregated (de-identified) clinical outcomes from
             consortium research partners; public clinical trial databases;
             FDA drug approval data

Feeds:
  DNAI_DRUG_RESPONSE_DEMAND — Demand index for pharmacogenomic data
                               (high when new drug trials active)
  
  DNAI_VARIANT_PREVALENCE_[RSID] — Estimated prevalence of specific variants
                                    in current enrolled genome holder population
                                    (enables rare variant premium pricing)
  
  DNAI_GWAS_ACTIVITY_INDEX — Volume of active GWAS studies globally
                              (from ClinicalTrials.gov API, updated daily)

These feeds allow the marketplace to automatically increase prices for
genomic data that is particularly relevant to current research activity —
for example, if 5 new BRCA1/2 studies register in ClinicalTrials.gov,
the DNAI_VARIANT_PANEL_USD feed for BRCA1/2 variants would increase,
automatically benefiting holders of genomes with those variants.
```

---

## 4. Layer 3: Privacy Compute Engine

### 4.1 Architecture Overview

Layer 3 is the most technically novel component of the DNaI stack. It answers the question: how can a pharmaceutical company train an AI model on 50,000 human genomes without those genome holders ever having to hand over their data — and without those companies trusting the owners, and without the owners trusting the companies?

The answer is a combination of two complementary privacy-preserving computation techniques:

- **Homomorphic Encryption (FHE)**: allows computation on encrypted data without decryption. The genome holder's data stays encrypted throughout; the research organization receives encrypted results that only they can decrypt into final statistics.
- **Federated Learning (FL)**: allows AI model training across multiple institutions without moving raw datasets. Each institution trains on their local data; only model gradients (not raw data) are shared. Combined with FHE-encrypted gradients, this provides double-layer privacy protection.

### 4.2 Homomorphic Encryption (FHE)

#### 4.2.1 Scheme Selection: CKKS

DNaI adopts the **CKKS scheme** (Cheon-Kim-Kim-Song, also called HEAAN) for all FHE operations on genomic data.

| FHE Scheme | Type | Best For | Why Not for DNaI |
|---|---|---|---|
| **CKKS** | Approximate arithmetic (float) | ML inference, statistical analysis, GWAS | **Selected — ideal for genomic ML** |
| **BFV** | Exact integer arithmetic | Counting, exact queries | No approximate arithmetic; poor for ML |
| **BGV** | Exact integer arithmetic | Database queries, exact matching | Same limitation as BFV |
| **TFHE** | Bit-level operations | Boolean circuits, exact comparison | Very slow for large genomic vectors |

**CKKS is selected** because:
1. Genomic analysis (GWAS, PRS calculation, drug response prediction) involves floating-point arithmetic — weighted sums, correlations, regression coefficients — all approximate operations where CKKS's approximate arithmetic is a feature, not a bug.
2. ML model inference and training on genomic data maps naturally to CKKS's packed SIMD operations: up to 32,768 floating-point values encrypted in a single ciphertext, matching the scale of SNP vectors.
3. CKKS provides the best performance-to-capability ratio for the target use cases.

#### 4.2.2 Library: OpenFHE

**Recommended library: OpenFHE** (open-source, BSD license, maintained by Samsung Research, Duality Technologies, and MIT).

Alternatives considered:

| Library | Language | Maturity | Reason Not Selected |
|---|---|---|---|
| **OpenFHE** | C++ (+ Python, Rust bindings) | High | **Selected** |
| Microsoft SEAL | C++ | High | No native Python; being superseded by OpenFHE |
| HElib | C++ | High | BGV/CKKS but harder API; IBM research project |
| PALISADE | C++ | Medium | Merged into OpenFHE; use OpenFHE instead |
| Concrete (Zama) | Rust | Medium | TFHE-focused; less suitable for CKKS |

OpenFHE selection rationale:
- Actively maintained with CKKS bootstrapping support (enables deep circuits)
- Rust FFI bindings available — aligns with DNaI backend language
- Permissive BSD license for commercial use
- Supports both CPU and GPU acceleration (CUDA backend in development)

#### 4.2.3 Performance and Phase Planning

FHE is computationally expensive — typically 1,000–10,000× slower than plaintext computation. This is a known, quantifiable trade-off, not a blocker. The key is understanding which operations are feasible at each phase:

```
FHE PERFORMANCE BENCHMARKS (CKKS, OpenFHE, 128-bit security)
──────────────────────────────────────────────────────────────
Parameters:
  Ring dimension (N):   32768   (for 128-bit security + SIMD batching)
  Ciphertext modulus:   ~500 bits
  Multiplicative depth: 20 levels (sufficient for typical genomic ML models)

Operation benchmarks (single-threaded, commodity server, 2026 hardware):
  FHE encrypt (32768 floats): ~50ms
  FHE add:                    ~1ms
  FHE multiply:               ~25ms
  FHE rotation:               ~15ms
  FHE bootstrapping:          ~3s  (resets noise level; expensive)

GWAS linear regression on 627K SNPs (encrypted):
  Plaintext time:   ~0.5 seconds
  FHE time:         ~8-15 minutes (per phenotype, 1 regression)
  Feasibility:      Phase III+ (batch processing, not interactive)

PRS calculation (1,024 SNPs, weighted sum):
  Plaintext time:   ~1ms
  FHE time:         ~3-8 seconds
  Feasibility:      Phase II (interactive response time acceptable)

Neural network inference (100-layer model, genomic input):
  Plaintext time:   ~100ms
  FHE time:         ~2-4 hours
  Feasibility:      Phase IV (overnight batch jobs only)
```

**Phase-gated FHE deployment:**

| Phase | FHE Capability | What's Feasible |
|---|---|---|
| **Phase I** | None (design only) | No FHE operations |
| **Phase II** | FHE prototype | PRS calculations, simple variant statistics |
| **Phase III** | FHE production | GWAS per phenotype (batch), drug response prediction |
| **Phase IV** | FHE at scale | Deep neural network inference, full federated training |

#### 4.2.4 FHE Use Cases vs. ZK Use Cases

FHE and ZK proofs solve different problems. Understanding when to use each is critical:

| Use Case | Technology | Reason |
|---|---|---|
| Variant presence check ("does genome contain rs334?") | **ZK proof (Noir)** | Proof needed, no computation; fast (~18s) |
| PRS range proof ("my T2D risk is < 20th percentile") | **ZK proof (Noir)** | Comparison/threshold; no external data needed |
| Ancestry range proof | **ZK proof (Noir)** | Population admixture; private witness |
| Drug response GWAS (compute correlation across cohort) | **FHE (CKKS)** | Computation on data, not proof; external computation |
| Federated model training | **FL + FHE gradients** | Multi-party; model emerges from computation |
| Ownership proof ("I hold token X") | **ZK proof (Noir)** | Membership proof; no computation |
| Kinship non-relation proof | **ZK proof (Noir)** | Comparison of commitments |

**FHE + ZK combination pattern** (used for result verification):

```
COMBINED FHE + ZK WORKFLOW
────────────────────────────
1. Researcher submits encrypted genomic data to FHE server
   [FHE: computation happens on ciphertext]

2. FHE server performs GWAS regression → returns encrypted beta coefficients

3. Researcher decrypts coefficients → obtains p-values

4. Researcher wants to publish "variant rs12345 is significant (p < 0.001)
   in a cohort of ≥ 10,000 genomes" without revealing:
   - which specific genomes were in the cohort
   - the exact p-value
   - any individual genome data

5. ZK proof generated:
   Public inputs:  variant ID (rs12345), threshold (p < 0.001), cohort_size (≥ 10K)
   Private inputs: actual p-value, FHE computation transcript, cohort genome IDs
   Circuit proves: p-value < 0.001 AND cohort_size ≥ 10000 WITHOUT revealing either

6. On-chain verification: ZK proof verified by EVM verifier contract
   → publishable result with cryptographic backing
```

### 4.3 Federated Learning Integration

#### 4.3.1 Flower (flwr) Framework

**Framework: Flower (flwr)** — a general-purpose federated learning framework implemented in Python, with gRPC communication.

Flower is selected because:
- Framework-agnostic: works with PyTorch, TensorFlow, JAX, and custom models
- Designed for cross-silo FL (institutional nodes) not just cross-device
- Supports custom aggregation strategies — essential for FHE-encrypted gradient aggregation
- Active development by Adap.ai; production deployments at pharmaceutical companies
- Privacy plugins available including differential privacy and secure aggregation

#### 4.3.2 Architecture: Consortium Nodes as FL Aggregators

```
FEDERATED LEARNING TOPOLOGY
────────────────────────────────────────────────────────────
Flower Server (aggregator):   Cloud Control LLC infrastructure
                              Can be promoted to consensus among Fabric peers
                              in Phase IV for fully decentralized aggregation

Flower Clients (data nodes):
  Institution A peer:   Trains model on their local encrypted vault subset
  Institution B peer:   Trains model on their local encrypted vault subset
  Sequencing Provider:  Trains on their genome holder dataset (consented)
  Genome Holder nodes:  Optional; consenting holders contribute compute + data
                        from local Tauri client (desktop app)

COMMUNICATION PROTOCOL
  Round 1: Server sends initial model weights to all clients
  Round 2: Clients train locally (plaintext, on their local decrypted data)
           OR with FHE (on ciphertext — double-layer privacy)
  Round 3: Clients send gradients to server
           [Gradients encrypted with FHE before transmission in Phase IV]
  Round 4: Server aggregates gradients (FedAvg or FedProx)
  Repeat until convergence

PRIVACY MODEL COMPARISON BY PHASE
  Phase III: Standard FL — local training on plaintext, gradient sharing
             Privacy: data never leaves institution; gradients may leak info
  Phase IV:  FL + FHE — FHE-encrypted gradients
             Privacy: even gradient inspection reveals nothing about raw data
  Phase IV+: FL + FHE + Differential Privacy — adds calibrated noise to gradients
             Privacy: formal DP guarantees (epsilon-delta) against membership inference
```

#### 4.3.3 FHE-Encrypted Gradients

```python
# Pseudocode: FHE-encrypted gradient submission in Flower client

import flwr as fl
import openfhe  # OpenFHE Python bindings

class DNaIFLClient(fl.client.NumPyClient):
    
    def __init__(self, genome_vault_path, fhe_public_key, model):
        self.vault = load_encrypted_vault(genome_vault_path)
        self.cc = openfhe.CryptoContext()  # CKKS context
        self.public_key = fhe_public_key
        self.model = model
    
    def fit(self, parameters, config):
        # Load model weights from server
        self.model.set_weights(parameters)
        
        # Train locally on decrypted genomic data
        # (decryption happens inside secure enclave in Phase IV)
        X, y = self.vault.decrypt_for_training()
        self.model.fit(X, y, epochs=config["local_epochs"])
        
        # Compute gradients
        gradients = self.model.get_gradients()
        
        # FHE-encrypt gradients before sending to server
        encrypted_gradients = []
        for grad_layer in gradients:
            flat = grad_layer.flatten().tolist()
            # CKKS pack multiple floats per ciphertext (batching)
            batched = batch_floats(flat, self.cc.GetBatchSize())
            encrypted = [
                self.cc.Encrypt(self.public_key, 
                                self.cc.MakeCKKSPackedPlaintext(batch))
                for batch in batched
            ]
            encrypted_gradients.append(encrypted)
        
        return serialize_fhe_gradients(encrypted_gradients), len(X), {}
    
    def evaluate(self, parameters, config):
        self.model.set_weights(parameters)
        X_test, y_test = self.vault.decrypt_for_eval()
        loss, accuracy = self.model.evaluate(X_test, y_test)
        return loss, len(X_test), {"accuracy": accuracy}
```

#### 4.3.4 Incentive Mechanism for FL Participants

Genome holders who contribute their local device compute to federated learning earn additional USDC beyond standard data access royalties:

```
FL PARTICIPATION INCENTIVE STRUCTURE
─────────────────────────────────────
Standard royalty (data access):   $X per access grant (70% of access fee)
FL compute contribution bonus:    +15% on top of standard royalty rate
                                  for each training round their vault participates

Example:
  Standard FULL_GENOME access grant:  $150/month → holder earns $105
  If holder also contributes to FL:   $105 × 1.15 = $120.75/month

FL participation is strictly opt-in:
  - Separate consent scope: "FEDERATED_LEARNING_COMPUTE"
  - Holder must explicitly enable FL participation in vault settings
  - Holder can revoke FL consent at any time
  - FL compute happens on Tauri desktop client (genome holder controls hardware)
  - Tauri client verifies FL jobs via ZK proof before executing:
    "I am participating in a legitimate DNaI FL job" (circuit checks job signature)

Settlement:
  FL compute contributions logged on Fabric (RoyaltySettlementChaincode)
  Batched with standard royalty settlements → same Flare relay path to Base
  Additional USDC distributed to holder address on Base
```

---

## 5. Layer 4: Governance & Legacy

### 5.1 BioNFTs — The DNaI Token

BioNFTs are the consumer-facing identity anchor of the DNaI protocol — the physical manifestation of genomic sovereignty in the digital realm. Each BioNFT is an ERC-721 soulbound NFT that represents one human's unique genetic sequence, anchored on Base (Ethereum L2).

Cross-reference: full BioNFT token contract specification in `token-standard-spec.md`. This section covers the 4-layer integration specifics.

#### 5.1.1 Token ID Derivation

```solidity
// Token ID incorporates genomeHash + ownerAddress + chainId
// Cross-chain collision resistance: same genome on different chains = different token IDs
function computeTokenId(
    bytes32 genomeHash,     // keccak256 of canonical SNP vector (plaintext, client-side)
    address ownerAddress,   // msg.sender at mint time
    uint256 chainId         // block.chainid (8453 for Base)
) public pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(genomeHash, ownerAddress, chainId)));
}
```

**Comparison with token-standard-spec.md**: The original spec derives `tokenId = keccak256(genomeHash, ownerAddress, block.chainid)`. This document adds the chainId as an explicit parameter (not just `block.chainid`) to support cross-chain validation — when Flare State Connector proves ownership on Fabric, it must reconstruct the expected token ID from the genome hash and owner address without relying on on-chain context.

#### 5.1.2 Cross-Chain Verification via Flare State Connector

The BioNFT on Base is the **authoritative ownership record**. The Hyperledger Fabric consortium validates access requests by proving ownership against the Base record:

```
BIONFT CROSS-CHAIN VERIFICATION
─────────────────────────────────
Question: "Does address 0xABC hold token ID 0x1234...?"
Context:  Asked by Fabric consortium during access event validation

Process:
1. Requester submits to Fabric: (token_id, owner_address, grant_id)

2. GenomicAccessChaincode constructs Flare attestation request:
   AttestationType: EVMTransaction
   SourceId:        base (8453)
   RequestBody:
     contractAddress: DNaIToken.sol (Base)
     callData: ownerOf(token_id)  // ERC-721 ownerOf call
     requiredConfirmations: 12

3. Flare attestation providers call DNaIToken.ownerOf(token_id) on Base
   → verify returned address matches owner_address in request

4. Supermajority attestation → Merkle root committed on Flare

5. Fabric receives verification: YES, 0xABC holds 0x1234... on Base
   → access event logging proceeds
   → data delivery authorized

This verification chain means: a malicious party cannot forge Fabric
access events for a genome they don't own on Base. The Base BioNFT
is the ground truth; Fabric reads it via Flare.
```

### 5.2 Automated Consent and Revenue Distribution

#### 5.2.1 Complete Smart Contract Flow

```
CONSENT-TO-ROYALTY SMART CONTRACT FLOW
────────────────────────────────────────────────────────────────────────

STEP 1: Pharma requests access (on Base)
─────────────────────────────────────────
  PharmaAddress → ConsentRegistry.grantAccess(
    tokenId:    12345,
    requester:  0xPharmaAddress,
    scope:      DataScope.VARIANT_PANEL,
    duration:   7776000,  // 90 days
    price:      150_000_000  // $150 USDC (6 decimals)
  )
  + transfers 150 USDC to ConsentRegistry atomically

STEP 2: Consent recorded (on Base)
────────────────────────────────────
  ConsentRegistry stores AccessGrant {
    requester, scope, grantedAt, expiresAt, price, active: true
  }
  Emits: ConsentGranted(tokenId=12345, requester=0xPharmaAddress, ...)
  The Graph indexes event → owner dashboard notified

STEP 3: Owner generates KWAT (client-side, off-chain)
───────────────────────────────────────────────────────
  Owner's Tauri client:
  - Sees ConsentGranted event via WebSocket
  - Derives KWAT:
    wrap_key = ECDH(owner_private_key, pharma_public_key)
    kwat = AES-KeyWrap(wrap_key, DEK_for_authorized_scope)
  - Submits KWAT blob to ConsentRegistry (encrypted, on-chain)
  
  [See technical-architecture.md §2.3.3 for full KWAT derivation]

STEP 4: Flare relays consent to Fabric
────────────────────────────────────────
  DNaI Relay Service detects ConsentGranted event on Base
  → Constructs Flare State Connector attestation of the event
  → Fabric GenomicAccessChaincode.ValidateConsentGrant() confirmed

STEP 5: Pharma accesses data (via Fabric-authorized path)
──────────────────────────────────────────────────────────
  Pharma node on Fabric:
  - Retrieves KWAT from ConsentRegistry (via DNaI API)
  - Decrypts KWAT with pharma private key → chunk DEKs
  - Fetches authorized chunks from IPFS
  - Decrypts locally
  - GenomicAccessChaincode.LogAccessEvent() called on Fabric

STEP 6: Access event relayed to Base → royalty distributed
────────────────────────────────────────────────────────────
  Flare State Connector relays Fabric access event → Base
  
  DNaIRoyaltyBridge.settleFromFabric(merkleProof, accessEvent) called
  → ConsentRegistry.recordAccessPayment(tokenId, requester, amount)
  → RoyaltyDistributor.distributeRoyalty():
    70% → pendingRoyalties[tokenId]    (genome owner's claimable balance)
    20% → protocolFeeAddress           (Cloud Control LLC treasury)
    10% → daoTreasury                  (DNaI DAO)
  
  ERC-4337 Paymaster sponsors gas for royalty distribution:
  → Holder receives USDC to their wallet with ZERO gas cost
  → Holder's ERC-4337 smart account handles gas abstraction
```

#### 5.2.2 Gas-Free Royalty Receipt (ERC-4337 Paymaster)

Genome holders should not need to hold ETH or worry about gas costs to receive royalties. The ERC-4337 paymaster design:

```
ERC-4337 PAYMASTER DESIGN
─────────────────────────────────────────────────────────────────
Paymaster contract:   DNaIPaymaster.sol (deployed on Base)
Paymaster operator:   Cloud Control LLC
Paymaster funds:      Funded from 2% of protocol fee revenue (monthly top-up)

Eligible operations (paymaster sponsors gas for):
  - claimRoyalties(tokenId)       — holder claims accumulated USDC
  - revokeConsent(grantId)        — holder revokes data access
  - updateManifest(tokenId, cid)  — holder updates vault after re-sequencing
  - delegate(tokenId, address)    — holder delegates governance vote

Operations NOT sponsored (holder pays gas):
  - grantConsent()   — holder initiates access grant (revenue-generating; holder pays)
  - DAO proposals    — governance participation (low frequency; holder pays)

Paymaster budget per holder per month:
  Max 5 sponsored transactions ($0.01–$0.05 gas each on Base ≈ $0.25/holder/month)
  At 10,000 holders: $2,500/month paymaster operating cost
  Protocol fee revenue at Phase III: $90,000/month
  Paymaster cost: 2.8% of protocol revenue — acceptable operating expense
```

### 5.3 Multi-Generational Transfer: Full Specification

The multi-generational transfer capability is the most legally complex and architecturally novel component of Layer 4. It addresses a question that no existing genomic data platform has answered: what happens to a genome owner's digital sovereign asset and ongoing royalty stream when they die?

#### 5.3.1 Technical Implementation: Gnosis Safe Multi-Sig

```
GNOSIS SAFE CONFIGURATION FOR GENOMIC INHERITANCE
────────────────────────────────────────────────────────────────────
Safe contract:  Gnosis Safe 1.4.x (deployed on Base alongside DNaI contracts)
Standard config: 2-of-3 multisig

Signers:
  Signer 1:  Genome Holder (primary — holds during their lifetime)
  Signer 2:  Heir 1 (designated by holder; e.g., spouse)
  Signer 3:  Heir 2 (designated by holder; e.g., adult child)

Operations requiring 2-of-3 signatures:
  - Trigger inheritance (transfer royalty claim rights to heir)
  - Modify heir designations
  - Invoke time-lock inheritance trigger
  - Partial sovereignty delegation

Operation requiring 3-of-3 signatures (holder + both heirs):
  - None by default (prevents holder being overruled while alive)

Operation requiring 1 signature (Signer 1 = holder, alone):
  - Grant consent, revoke consent
  - Update vault manifest
  - Delegate governance vote
  - Any standard genome management operation

THE SOULBOUND INHERITANCE CONSTRAINT
  The BioNFT (DNaI ERC-721) is soulbound — it CANNOT be transferred.
  Inheritance does NOT transfer the token.
  
  Instead, inheritance transfers:
  (a) ROYALTY CLAIM RIGHTS: right to call claimRoyalties(tokenId)
  (b) CONSENT GOVERNANCE: right to grant/revoke access on behalf of estate
  (c) VAULT ACCESS: DEK access for authorized estate purposes (e.g., medical)
  
  The soulbound token remains on the original holder's address forever,
  preserving the cryptographic record that this specific human's genome
  is represented. The token becomes a permanent memorial record.
```

#### 5.3.2 Time-Locked Inheritance Trigger

```
TIME-LOCK INHERITANCE SMART CONTRACT
──────────────────────────────────────────────────────────────────────
Contract:  DNaIInheritance.sol (separate contract, linked to DNaI ecosystem)

Parameters (set by holder at estate setup):
  inactivity_trigger_years:  3    // Default: 3 years of no holder activity
  inheritance_delay:         180  // Days after trigger before heirs can claim
                                  // (provides window to disprove death / contact holder)

Holder activity events that RESET the inactivity clock:
  - Any ConsentRegistry interaction (grant, revoke)
  - claimRoyalties() call
  - updateManifest() call
  - Explicit heartbeat transaction: DNaIInheritance.heartbeat(tokenId)
  - Any transaction signed by holder wallet address to any contract

INHERITANCE TRIGGER SEQUENCE
─────────────────────────────
Day 0:    Holder's last on-chain activity

Day 1095: (3 years later) inactivity_trigger_years elapsed
          Any heir can call: DNaIInheritance.triggerInheritanceTimer(tokenId)
          Emits: InheritanceTimerStarted(tokenId, triggeredBy, triggerDate)
          The Graph indexes → heir dashboards notified
          Cloud Control LLC notified → attempts to contact holder via registered email

Day 1275: (180 days after trigger) inheritance_delay elapsed
          If holder has NOT called DNaIInheritance.cancelInheritance(tokenId):
          Heir calls DNaIInheritance.claimInheritance(tokenId, gnosisSafeProof)
          → Gnosis Safe 2-of-3 required (Signer 2 + Signer 3, both heirs)
          → RoyaltyDistributor.transferClaimRights(tokenId, estateAddress)
          → ConsentRegistry.transferConsentAuthority(tokenId, estateAddress)

Day 1275+: Ongoing royalties flow to Gnosis Safe estate wallet
           Heirs manage consent grants as joint custodians (2-of-3 required)
```

#### 5.3.3 Partial Sovereignty Delegation

Distinct from full inheritance, partial delegation allows a holder to grant specific rights to another party while retaining full ownership:

```
DELEGATION TYPES
──────────────────────────────────────────────────────────────
READ-ONLY ACCESS DELEGATION
  Use case: Holder grants physician permanent read access for medical care
  Technical: Physician-specific KWAT generated with MEDICAL_RECORD scope
  Revocable: Holder can revoke at any time via ConsentRegistry.revokeAccess()
  Different from inheritance: holder retains all other rights

CONSENT MANAGEMENT DELEGATION
  Use case: Holder is elderly; grants adult child right to manage consents
  Technical: DNaI Delegate role added to Gnosis Safe: delegate can call
             ConsentRegistry but NOT claim royalties or modify heirs
  Revocable: Holder can remove delegate role at any time
  
ROYALTY REDIRECTION (LIVING)
  Use case: Holder directs royalties to a trust or charitable account
  Technical: RoyaltyDistributor.setClaimAddress(tokenId, newAddress)
             Only callable by token owner (holder's wallet)
  Not inheritance: holder still controls consent; only payment address changes
```

#### 5.3.4 Estate Planning Flow

```
COMPLETE ESTATE SETUP FLOW
──────────────────────────────────────────────────────────────
1. HOLDER INITIATES ESTATE SETUP (via DNaI web app or Tauri client)

   a. Holder designates Heir 1 and Heir 2 wallet addresses
   
   b. Cloud Control LLC deploys Gnosis Safe with configuration:
      Signers: [holder, heir1, heir2], threshold: 2
      Module: DNaIInheritanceModule (adds time-lock functionality)
   
   c. Holder links Gnosis Safe to their DNaI token:
      DNaIInheritance.setupEstate(tokenId, gnosisSafeAddress, 3 years, 180 days)
      [Signed by holder wallet — on-chain commitment to estate configuration]
   
   d. On-chain estate record (public, verifiable):
      { tokenId, gnosisSafe, heir1, heir2, 
        inactivity_trigger_years: 3, inheritance_delay_days: 180,
        setupDate, lastActivityDate }

2. HOLDER DOCUMENTS ESTATE WISHES (off-chain, recommended)

   a. DNaI generates a personalized estate planning document (PDF):
      - Summary of on-chain estate configuration
      - Instructions for heirs (how to trigger, what wallet to use)
      - Legal disclaimer text per jurisdiction
      - Reference to DNaI Inheritance Management Service contract
   
   b. Holder stores document with their physical estate planning materials
   
   c. Holder optionally registers heirs' contact info with Cloud Control LLC
      (off-chain, for notification purposes only — not stored on-chain)

3. ANNUAL MAINTENANCE FEE
   $500/year charged to holder's account (credit card or USDC on Base)
   Covers: Gnosis Safe gas costs, relay service operation, heir notification
           service, legal template updates as laws change
   Non-payment: 90-day grace period, then estate configuration suspended
                (heir claims blocked until fees are current or paid by heir)

4. MODIFICATION OF ESTATE CONFIGURATION
   
   Change heirs (anytime, holder alone):
     DNaIInheritance.updateHeir(tokenId, heirSlot, newAddress)
     Signed by holder wallet only (heir can be changed without their consent —
     holder's sovereign right while alive)
   
   Extend inactivity trigger period:
     DNaIInheritance.setInactivityTrigger(tokenId, newYears)
     Signed by holder wallet
   
   Cancel estate setup entirely:
     DNaIInheritance.cancelEstate(tokenId)
     Signed by holder wallet
```

#### 5.3.5 Legal Considerations

```
LEGAL FRAMEWORK CONSIDERATIONS
────────────────────────────────────────────────────────────────────
UNITED STATES

  Property status: Digital assets treated as property under most U.S. state laws
  (Revised Uniform Fiduciary Access to Digital Assets Act, RUFADAA, adopted
  by 47+ states)
  
  Estate law intersection:
  - DNaI inheritance configuration should be referenced in holder's legal will
    ("I direct that my DNaI genomic token inheritance configuration governs
    disposition of digital genomic asset royalties")
  - Gnosis Safe wallet address should be listed as an asset in probate schedule
  - Cloud Control LLC recommends holder consult estate attorney for jurisdictions
    with specific digital asset inheritance laws (e.g., Wyoming DAO LLC Act)
  
  Genomic data ownership:
  - No federal law explicitly addresses inherited genomic data rights (2026)
  - GINA (Genetic Information Nondiscrimination Act) protections do not extend
    to deceased individuals — reduced regulatory risk for heir-managed royalties
  - Recommended: heirs agree to same data use policy as original holder
    (enforced via Gnosis Safe governance policy, not law)

EUROPEAN UNION

  GDPR intersection:
  - GDPR does not apply to deceased individuals (explicit exclusion)
  - Member state laws vary: France, Germany, Spain have digital inheritance laws
  - DNaI's technical model (no Cloud Control LLC data custody) simplifies compliance:
    Cloud Control LLC does not "process" genomic data in GDPR terms post-inheritance
  - Heirs assume GDPR obligations for any data access grants they create
  
  General recommendation:
  - DNaI Inheritance Management Service terms of service include
    governing law clause (Delaware, U.S.) with GDPR acknowledgment for EU holders
  - Annual legal review of EU member state genomic inheritance laws
    included in Inheritance Management Service contract

JURISDICTION-SPECIFIC NOTES (for future expansion)
  Japan: Act on Protection of Personal Information — deceased data excluded
  Canada: PIPEDA applies only to living individuals; provincial laws vary  
  Australia: Privacy Act 1988 — deceased individuals excluded
  Singapore: PDPA — excludes deceased individuals
```

### 5.4 Revenue: Inheritance Management Service

```
INHERITANCE MANAGEMENT SERVICE PRICING
────────────────────────────────────────────────────────────────────
Tier 1 — Basic Estate Setup:           $500/year
  Includes: Gnosis Safe deployment, time-lock configuration,
  annual heartbeat monitoring, heir notification service,
  standard legal template (English, U.S. jurisdiction)

Tier 2 — Premium Multi-Jurisdiction:   $1,500/year
  Includes: Everything in Tier 1 + multi-jurisdiction legal
  template package (EU, UK, Canada, Australia), legal counsel
  review of customized estate terms, priority support

Tier 3 — Enterprise Family Office:     $5,000/year
  Includes: Everything in Tier 2 + 5-wallet Gnosis Safe
  (extended family), dedicated account manager, annual
  estate review call, integration with traditional estate
  planning attorney (Cloud Control LLC referral network)

Revenue projection:
  Phase III:  500 enrollees × $500/year = $250,000 ARR
  Phase IV:  5,000 enrollees × $600 blended avg = $3,000,000 ARR
```

---

## 6. Cross-Layer Data Flow — End-to-End Scenarios

### 6.1 Scenario A: Pharma Company Accesses a Genome Cohort for Drug Response Study

**Context:** GenericPharmaCo needs drug response data for 500 genomes with a specific CYP2D6 variant for a clinical trial. They have a signed Data Use Agreement and an active enterprise subscription.

```
SCENARIO A: PHARMA COHORT ACCESS
──────────────────────────────────────────────────────────────────────────

STEP 1 [LAYER 4 — Base]: Pharma submits cohort access request
  GenericPharmaCo → DNaI Marketplace API:
    scope: DRUG_RESPONSE
    variant_filter: CYP2D6 poor metabolizer
    cohort_size: 500
    access_duration: 90 days
    offer_price: $150/genome = $75,000 total USDC

  MarketplaceContract.submitCohortRequest(filter, cohort_size, price)
  FTSO oracle validates: $150/genome > current DNAI_GENOME_FLOOR_USD floor
  
STEP 2 [LAYER 4 — Base]: Genome holders notified and consent
  The Graph query: "500 holders with active DRUG_RESPONSE listings ≥ $150/genome"
  
  DNaI API sends consent request to 500 matched holders:
    - Holders review via mobile app / web dashboard
    - Each holder approves: ConsentRegistry.grantAccess(tokenId, pharmaAddress,
                                                        DRUG_RESPONSE, 90days, $150)
    - Holders generate KWATs client-side → stored on ConsentRegistry
  
  [Typical consent flow: 80% of pre-listed holders approve within 48 hours]

STEP 3 [LAYER 1 — Fabric]: Consent relayed to consortium
  Flare State Connector detects 500 ConsentGranted events on Base
  → Relays each to Fabric within 2 minutes (per event)
  → GenomicAccessChaincode.ValidateConsentGrant() confirms each grant
  → Fabric records: cohort_request_id → 500 valid grants
  
STEP 4 [LAYER 2 — IPFS]: Data delivery authorization
  GenericPharmaCo's node (certified Fabric participant) requests data:
  
  For each of 500 tokens:
    - Fetches KWAT from ConsentRegistry (on Base, via DNaI API)
    - Decrypts KWAT with pharma private key → CYP2D6 locus chunk DEK
    - Fetches authorized IPFS chunks (chromosome 22, CYP2D6 region only)
    - GenomicAccessChaincode.LogAccessEvent() → Fabric audit log
  
  Total data transferred: 500 genomes × 12 chunks (chromosome 22) × 16 MB
  = ~96 GB encrypted data → ~96 GB decrypted locally at pharma

STEP 5 [LAYER 3 — NOT INVOKED]: Raw data access, no FHE needed
  [FHE would be used if pharma needed compute results without raw data;
   for direct data access, FHE is bypassed — pharma receives plaintext
   after KWAT decryption]

STEP 6 [LAYER 1 — Fabric → LAYER 4 — Base]: Royalty settlement
  RoyaltySettlementChaincode.CreateBatch(500 access events)
  Batch finalized → Flare State Connector relay → Base
  
  RoyaltyDistributor.settleFromFabric():
    500 holders × $150 USDC:
      Each holder: $105 USDC (70%)
      Protocol:    $75 USDC per holder (20%) → $37,500 to Cloud Control LLC
      DAO:         $15 USDC per holder (10%) → $7,500 to DAO Treasury

STEP 7 [LAYER 4 — Base]: Gas-free royalty receipt
  ERC-4337 Paymaster sponsors claimRoyalties() gas for 500 holders
  Each holder receives $105 USDC to their wallet — zero gas cost
  WebSocket push → "You received $105.00 USDC from GenericPharmaCo"
```

### 6.2 Scenario B: AI Company Runs Federated Learning Across 10,000 Encrypted Vaults

**Context:** DeepGenomics AI wants to train a drug response prediction model on the full consented DNaI holder population (10,000 genomes) without accessing raw data.

```
SCENARIO B: AI FEDERATED LEARNING AT SCALE
──────────────────────────────────────────────────────────────────────────

STEP 1 [LAYER 4 — Base]: AI company requests FL training job
  DeepGenomics → DNaI FL Marketplace:
    model_type: genomic_drug_response_predictor_v1
    target_phenotype: metformin_response
    required_cohort: 10,000 genomes minimum
    training_epochs: 50
    fhe_gradients: true  // request FHE-encrypted gradient privacy
    offer: $2,500 per training epoch = $125,000 total

STEP 2 [LAYER 4 — Base]: Genome holders opt-in to FL job
  ConsentRegistry.grantConsent(tokenId, DeepGenomicsAddress,
                               FEDERATED_LEARNING_COMPUTE, 90 days, proRataPrice)
  [10,000 holders × $12.50/genome = $125,000 total]
  
  Holders with Tauri desktop client enabled: 7,500 participate directly
  Institutional vault nodes: 2,500 genomes via consortium institutions

STEP 3 [LAYER 1 — Fabric]: FL job validated and orchestrated
  GenomicAccessChaincode records FL training job:
    job_id: keccak256(modelHash + startTime)
    epoch_count: 50
    participant_vaults: 10,000 CIDs
    fhe_public_key: DeepGenomics FHE public key (Flare-verified on Base)
  
  Fabric announces job to consortium peers:
    Each institutional peer schedules FL client execution on their vault subset

STEP 4 [LAYER 2 — IPFS]: Encrypted data loaded for local training
  Each FL client (Tauri app or institution server):
    - Fetches authorized encrypted chunks from IPFS
    - Decrypts locally using holder's DEK (within secure local environment)
    - Prepares training data in memory — NEVER sends plaintext to network

STEP 5 [LAYER 3 — FHE + FL]: Federated training rounds
  Flower Server (Cloud Control LLC): sends initial model weights
  
  Each of 50 training rounds:
    1. FL clients train local model on decrypted genomic data
    2. Local gradients computed
    3. Gradients encrypted with DeepGenomics FHE public key (CKKS)
    4. Encrypted gradients sent to Flower aggregation server
    5. Flower server aggregates FHE gradients:
       FHE_sum = FHE_Add(gradient_1, gradient_2, ..., gradient_10000)
       [Aggregation happens entirely on ciphertext — server sees nothing]
    6. Aggregated encrypted gradient sent to DeepGenomics
    7. DeepGenomics decrypts with FHE private key → applies gradient update
    8. DeepGenomics sends updated model weights (plaintext) back to server
    
  End result: DeepGenomics holds trained model weights.
  NO individual genome data ever left any participant's local environment.
  
  Fabric logs each training round completion:
    GenomicAccessChaincode.LogFLRound(jobId, roundNumber, participantCount)

STEP 6 [LAYER 1 — Fabric → LAYER 4 — Base]: Royalty settlement
  50 training rounds × 10,000 participants = 500,000 access events
  
  RoyaltySettlementChaincode batches by participant:
    Each holder: $12.50 base + 15% FL compute bonus = $14.38 USDC
    10,000 holders × $14.38 = $143,750 to holders
    Cloud Control LLC: 20% of $125,000 = $25,000
    DAO Treasury: 10% = $12,500
  
  Flare State Connector relays batch → Base
  ERC-4337 Paymaster sponsors 10,000 claimRoyalties() calls
  WebSocket: "FL training complete. You earned $14.38 USDC."
```

### 6.3 Scenario C: Genome Holder's Heir Claims Inheritance After Holder's Death

**Context:** Dr. Sarah Chen passed away 4.5 years after setting up her DNaI token. She had designated her daughter (Emma) and son (Lucas) as heirs in a 2-of-3 Gnosis Safe. Her token had an active royalty stream.

```
SCENARIO C: GENERATIONAL INHERITANCE CLAIM
──────────────────────────────────────────────────────────────────────────

PRE-CONDITION: Estate setup (done by Dr. Chen during her lifetime)
  DNaIInheritance.setupEstate(
    tokenId:              chen_token_id,
    gnosisSafe:           0xChenEstate,  // Safe: Dr. Chen + Emma + Lucas
    inactivity_trigger:   3 years,
    inheritance_delay:    180 days
  )
  Annual $500 fee paid via USDC auto-charge

YEAR 0–3: Dr. Chen active
  Regular consent grants to pharma partners
  Royalty claims approximately quarterly
  lastActivityDate updates with each transaction

YEAR 3.5: Dr. Chen passes away
  No more transactions from her wallet address

YEAR 6.5: (3 years after last activity — inactivity trigger threshold)
  Emma (Heir 1) calls:
    DNaIInheritance.triggerInheritanceTimer(chen_token_id)
    [Signed by Emma's wallet = Gnosis Safe Signer 2]
  
  Emits: InheritanceTimerStarted(tokenId=chen_token_id, 
                                  triggeredBy=Emma, triggerDate=now)
  
  Cloud Control LLC Relay Service detects event:
    → Sends email to Dr. Chen's registered email address
      "Inheritance timer started for your DNaI token. 
       If you are alive and wish to cancel: visit dnai.cloudcontrolllc.com"
    → Sends notification to Emma and Lucas: "180-day waiting period started"
  
  [No response from Dr. Chen — email bounces]

YEAR 6.5 + 180 days: Inheritance claim window opens
  Emma and Lucas coordinate:
    Emma:  Signs Gnosis Safe transaction to claim inheritance
    Lucas: Co-signs (2-of-3 threshold met — Dr. Chen's key no longer needed)
  
  DNaIInheritance.claimInheritance(
    tokenId:      chen_token_id,
    gnosisSafe:   0xChenEstate,
    safeProof:    gnosisSafeSignatureProof  // 2-of-3 signatures
  )
  
  [LAYER 4 — Base] Contract executes:
    RoyaltyDistributor.transferClaimRights(chen_token_id, 0xChenEstate)
    → pendingRoyalties[chen_token_id] now claimable by 0xChenEstate only
    → futureRoyalties[chen_token_id] → 0xChenEstate
    
    ConsentRegistry.transferConsentAuthority(chen_token_id, 0xChenEstate)
    → Future consent grants require 2-of-3 Gnosis Safe signatures (Emma + Lucas)
  
  [LAYER 1 — Fabric] Flare relays authority transfer to Fabric:
    GenomicAccessChaincode.UpdateVaultAuthority(
      tokenId: chen_token_id, 
      newAuthority: 0xChenEstate,
      effectiveDate: now
    )
  
  The BioNFT (ERC-721) REMAINS on Dr. Chen's address:
    DNaIToken.ownerOf(chen_token_id) → 0xDrChen (permanent memorial)
    The soulbound token is an immutable record of Dr. Chen's genomic sovereignty.
    It cannot and should not be moved.

POST-INHERITANCE: Ongoing management by Emma and Lucas
  Active consent grant from PharmaCo continues:
    → Royalties flow to 0xChenEstate (Gnosis Safe)
    → Emma and Lucas control Safe; both must sign for major decisions
    → Either can initiate claimRoyalties() from the Safe
  
  New consent grant (Emma and Lucas decide together):
    0xChenEstate → ConsentRegistry.grantAccess(...) [2-of-3 Gnosis Safe signatures]
  
  Annual Inheritance Management Service fee:
    Cloud Control LLC charges 0xChenEstate $500/year for continued service
    Payable from royalty stream (Gnosis Safe has USDC balance)
```

---

## 7. Technology Selection Delta Analysis

This section documents where the 4-Layer Genomic Sovereignty Stack changes or extends the existing `technical-architecture.md` (v0.1.0) and `token-standard-spec.md` (v0.1). These changes are additive and backwards-compatible — Phase I deliverables remain valid.

### 7.1 Consensus Layer: Pure Ethereum L2 → Hyperledger Fabric + Ethereum/Base

| Dimension | Original Spec (technical-architecture.md) | 4-Layer Stack |
|---|---|---|
| **Primary consensus** | Ethereum L2 (Base or Arbitrum) | Hyperledger Fabric (consortium operations) + Base (token + royalty) |
| **Transaction costs** | Gas on Base ($0.001–$0.10/tx) | Zero for consortium operations on Fabric; gas only for on-chain token events |
| **Privacy** | All state public on Base | Private data collections on Fabric; only hashes on public chain |
| **Throughput** | ~2,000 TPS (Base) | 3,500+ TPS (Fabric) for access event logging |
| **Permissioning** | Permissionless Base | Permissioned Fabric consortium + permissionless Base |
| **Impact on Phase I** | Phase I builds Base contracts — unchanged | Phase I contracts still target Base; Fabric added in Phase II |

**Why this change is necessary:** At Phase III scale (10,000 active genome holders, pharma partners running automated queries), the on-chain consent event volume would generate $50K–$500K/month in Base gas costs, eliminating margin. Hyperledger Fabric's zero-gas consortium operations make the economics viable while preserving on-chain final settlement on Base for trustless royalty distribution.

### 7.2 Proof System: Pure ZK (Noir) → ZK + FHE Combination

| Use Case | Original Spec | 4-Layer Stack | Reason for Change |
|---|---|---|---|
| Ownership proofs | Noir ZK | Noir ZK (unchanged) | ZK is optimal for membership/ownership proofs |
| Variant presence proof | Noir ZK | Noir ZK (unchanged) | Best tool for the job |
| PRS range proof | Noir ZK | Noir ZK (unchanged) | Range proofs are ZK's natural domain |
| GWAS / statistical analysis | Not specified | FHE (CKKS/OpenFHE) | ZK cannot perform multi-party statistics across holder cohorts |
| AI model training | Not specified | FL + FHE gradients | FHE-protected federated learning enables fully private training |
| ZK + FHE combination | Not specified | ZK verifies FHE result | ZK wraps around FHE output for on-chain publishable proofs |

The original architecture correctly identified ZK proofs for individual-holder proofs. The 4-Layer Stack extends this by recognizing that **computation across multiple genomes** (GWAS, FL) requires a different privacy tool — FHE. ZK remains the right tool for single-holder proofs.

### 7.3 Oracle Layer: No Oracle → FTSO Pricing Oracle

| Dimension | Original Spec | 4-Layer Stack |
|---|---|---|
| **Data pricing** | Fixed fee schedule (`$75–$500/genome/month` stated in revenue model) | Dynamic FTSO oracle pricing (adjusts every ~90s based on market demand) |
| **Price discovery** | Manual/admin-set | Decentralized, tamper-proof FTSO data providers |
| **Health data feeds** | Not present | FTSO health outcomes streams as pricing signals |
| **Manipulation resistance** | Not addressed | Flare FTSO supermajority consensus prevents price manipulation |

The original revenue model assumed static pricing. FTSO integration enables market-clearing prices that increase GMV and therefore protocol revenue. Phase I static pricing remains valid as the bootstrap condition.

### 7.4 Storage Architecture: IPFS → IPFS + FTSO Oracle Layer

The original storage architecture remains unchanged. The 4-Layer Stack adds:

- The FTSO oracle layer operates alongside IPFS but does not modify storage architecture
- Filecoin deal parameters unchanged (3 replicas, 520 days, Lighthouse)
- Chunk sizes unchanged (16 MB for BAM, 4 MB for VCF)
- KWAT-based access control unchanged (see technical-architecture.md §2.3.3)

### 7.5 New Addition: Multi-Generational Inheritance

The original specifications do not address inheritance. The 4-Layer Stack adds:

- Gnosis Safe multi-sig for estate management (Layer 4)
- DNaIInheritance.sol contract (new, not in original contract architecture)
- Soulbound token permanence as memorial record (compatible with original soulbound design)
- $500/year inheritance management service (new revenue line)
- Legal framework analysis for U.S., EU, and global jurisdictions

This addition is architecturally clean — it extends Layer 4 contracts without modifying the core BioNFT, ConsentRegistry, or RoyaltyDistributor contracts specified in the original architecture.

### 7.6 Cross-Chain Bridge: Not Present → Flare State Connector

The original specification assumes all operations happen on a single chain (Base). The 4-Layer Stack introduces multi-chain operations:

| Chain | Original Role | 4-Layer Stack Role |
|---|---|---|
| **Base** | All operations | Token ownership, consent registry, royalty distribution, user-facing |
| **Hyperledger Fabric** | Not present | Consortium consensus, access event logging, private data |
| **Flare Network** | Not present | Cross-chain bridge, FTSO oracle, attestation |
| **Ethereum Mainnet** | Finality anchoring | Finality anchoring (unchanged from original fallback specification) |

The Flare bridge is the critical addition that makes the dual-chain architecture trustless rather than relying on Cloud Control LLC as a trusted relay operator.

---

## 8. Implementation Sequence by Phase

### 8.1 Phase I: Layer 4 Smart Contracts + Layer 2 IPFS Storage

**Timeline:** Jul 1 – Aug 15, 2026 (per technical-architecture.md §8)  
**Objective:** Functional BioNFT token + encrypted vault storage on public IPFS/Filecoin  
**Chain:** Base (Sepolia testnet for development)

```
PHASE I DELIVERABLES (4-Layer context)
────────────────────────────────────────────────────────────────────
LAYER 4 (primary Phase I focus):
  - DNaIToken.sol: ERC-721 soulbound BioNFT (token-standard-spec.md §3.2)
  - ConsentRegistry.sol: access grants with time-bound, scoped consent
  - RoyaltyDistributor.sol: USDC split (70/20/10)
  - AccessController.sol: ZK-gated access flow
  - DNaIGovernor.sol: DAO governance skeleton
  - Deploy to Sepolia testnet; verify on Etherscan
  
  [Phase I does NOT include:]
  - DNaIInheritance.sol (Phase IV)
  - DNaIRoyaltyBridge.sol (Phase III — Flare integration)
  - ERC-4337 Paymaster (Phase II)

LAYER 2 (secondary Phase I focus):
  - IPFS chunk upload pipeline (public IPFS before private consortium IPFS)
  - Filecoin storage deals via Lighthouse
  - Client-side AES-256-GCM encryption (technical-architecture.md §2.2)
  - Encrypted manifest format
  [FTSO oracle NOT integrated yet — static pricing in Phase I]

LAYER 1 (Phase I design only):
  - Hyperledger Fabric architecture finalized in this document
  - Consortium membership criteria documented
  - Channel design specified
  - Chaincode interfaces designed (implementation in Phase II)
  [No Fabric infrastructure deployed in Phase I]

LAYER 3 (Phase I design only):
  - FHE scheme selection confirmed (CKKS / OpenFHE)
  - FL framework selected (Flower)
  - Performance benchmarks researched and documented
  [No FHE or FL infrastructure deployed in Phase I]
```

### 8.2 Phase II: Hyperledger Fabric Consortium + Flare FTSO

**Timeline:** Aug 16 – Oct 1, 2026  
**Objective:** 3-node Fabric consortium operational; FTSO pricing live; first enterprise partner  
**Milestone:** First paid pilot agreement ($22,500–$45,000)

```
PHASE II DELIVERABLES (4-Layer context)
────────────────────────────────────────────────────────────────────
LAYER 1 (primary Phase II focus):
  - Hyperledger Fabric network: 3 nodes
    Node 1: Cloud Control LLC (orderer + peer)
    Node 2: Pilot Research Institution
    Node 3: Pilot Sequencing Provider
  - MSP: Cloud Control LLC Root CA + 2 intermediate CAs
  - Channels: dnai-access, dnai-royalty, dnai-governance all active
  - GenomicAccessChaincode v1.0: vault registration + access event logging
  - RoyaltySettlementChaincode v1.0: batch settlement creation
  - Flare State Connector: Base → Fabric ownership verification (one direction)
  - Flare State Connector: Fabric → Base royalty relay (return direction)
  
LAYER 2 (Phase II enhancement):
  - FTSO: Standard feeds consumed (USDC/USD, ETH/USD)
  - FTSO: DNaI custom data provider deployed on Flare testnet
  - Dynamic pricing floor: DNAI_GENOME_FLOOR_USD feed live
  - Marketplace contract: FTSO floor price enforcement

LAYER 4 (Phase II enhancement):
  - ERC-4337 Paymaster: gas-free royalty claims live
  - DNaIRoyaltyBridge.sol: Flare proof verification on Base
  - Mainnet deployment (Base mainnet) — limited to pilot partners

LAYER 3 (Phase II prototype):
  - FHE prototype: PRS calculation on encrypted data (proof of concept)
  - Flower FL: 2-node test network (Cloud Control LLC internal)
  - Not production; not accessible to external partners
```

### 8.3 Phase III: Layer 3 FHE + Full FL + Flare Bridge Production

**Timeline:** Oct 2 – Nov 15, 2026  
**Objective:** Full privacy compute stack; open network launch; $300K MRR  
**Milestone:** Mainnet launch; 10+ enterprise partners

```
PHASE III DELIVERABLES (4-Layer context)
────────────────────────────────────────────────────────────────────
LAYER 3 (primary Phase III focus):
  - FHE production deployment:
    - GWAS per phenotype (batch jobs, 30-min target latency)
    - Drug response prediction (single genome, <60s FHE inference)
    - PRS calculation in production (<10s)
  - Flower FL production:
    - Full cross-institutional training (3+ institutions)
    - FHE-encrypted gradients mandatory for all FL jobs
    - Differential privacy plugin (epsilon=1.0) as optional add-on
  - ZK + FHE combination: publishable FHE result proofs via Noir

LAYER 1 (Phase III expansion):
  - Fabric consortium: 10 organizations (from 3 in Phase II)
  - Channel performance: 1,000 access events/second verified
  - Governance channel: first external member-initiated governance vote
  - Flare State Connector: all attestation providers qualified for DNaI feeds

LAYER 2 (Phase III enhancement):
  - FTSO: 3 independent data providers for genomic price feeds (not just CCL)
  - Filecoin: automated deal renewal at 50,000+ CIDs under management
  - Health outcomes oracle: GWAS activity index live

LAYER 4 (Phase III enhancement):
  - Full marketplace launch: buyers and sellers, FTSO floor pricing
  - Superfluid streaming royalties (replacing batch settlement for high-frequency access)
  - Compliance certification product: audit trail SaaS live
```

### 8.4 Phase IV: Inheritance + Full 50-Node Consortium + FHE at Scale

**Timeline:** Nov 16 – Dec 1, 2026  
**Objective:** Complete 4-layer stack; AI marketplace; $750K MRR  
**Milestone:** Series A fundraising deck ready; $9M ARR run rate

```
PHASE IV DELIVERABLES (4-Layer context)
────────────────────────────────────────────────────────────────────
LAYER 4 (primary Phase IV focus):
  - DNaIInheritance.sol: full inheritance contract deployed on Base
  - Gnosis Safe integration: automated estate setup flow in DNaI app
  - Inheritance Management Service: 500+ enrolled holders
  - AI model marketplace: third-party model listing + royalty sharing

LAYER 1 (Phase IV scale):
  - Fabric consortium: 50 organizations (full target network)
  - Multi-region redundancy: EU, APAC Fabric nodes active
  - Governance: external member voting live (not just Cloud Control LLC)

LAYER 3 (Phase IV scale):
  - FHE neural network inference: overnight batch jobs (100-layer model)
  - Federated learning at 10,000+ genome scale (Scenario B in production)
  - GPU-accelerated FHE (OpenFHE CUDA backend) for 10× speedup
  - Public FL job marketplace: any AI company can submit FL training jobs

LAYER 2 (Phase IV scale):
  - 50,000+ genomes under Filecoin management
  - Open FTSO provider participation for genomic feeds
  - Genomic data price discovery fully decentralized
```

---

## 9. Revenue Impact of the Four-Layer Stack

### 9.1 How Layer 1 (Hyperledger Fabric) Enables Compliance Certification Revenue

The original technical architecture could not support enterprise compliance requirements. Hyperledger Fabric's permissioned network model directly enables the compliance revenue stream identified in `revenue-model.md` §6:

```
LAYER 1 → COMPLIANCE REVENUE PATHWAY
────────────────────────────────────────────────────────────────────
Technical capability:    Fabric's MSP enforces institutional identity
                         → Only certified, verified entities access the network
                         → All access events cryptographically attributed to
                           a verified organization

Business consequence:    Cloud Control LLC can offer "DNaI Consortium Certified"
                         status to pharma/research partners, backed by Fabric
                         consortium membership requirements

Revenue:
  Compliance Certification:   $25K–$100K/year per enterprise (revenue-model.md §6)
  Audit Trail SaaS:           $2K–$10K/month (powered by Fabric access event log)
  HIPAA/GDPR reporting:       $500–$2,500/month per regulatory report type
  
  Phase III projection (from revenue-model.md):
    10 certified enterprise partners × $50K avg = $500K ARR
    This revenue is DIRECTLY ENABLED by Fabric consortium membership model.
    Without Fabric, "certified" status is unverifiable marketing claim.

Additional Fabric revenue enablers:
  - Private data collections allow per-deal pricing confidentiality
    → enables tiered enterprise pricing without public price discovery leakage
  - Zero gas costs → unlimited audit log entries → complete regulatory trails
    → passes HIPAA Technical Safeguard requirements for access control auditing
```

### 9.2 How Layer 2 FTSO Enables Dynamic Pricing and Increases GMV

```
LAYER 2 FTSO → MARKETPLACE GMV PATHWAY
────────────────────────────────────────────────────────────────────
Static pricing (without FTSO):
  Fixed: $150/genome/month
  Limitation: Cannot respond to demand signals; leaves money on table
              when rare variant demand spikes; depresses participation
              when base rates are above what buyers will pay

Dynamic FTSO pricing:
  Floor adjusts every 90 seconds based on actual market demand
  High-demand scenarios (new drug trial launches, GWAS publications):
    DNAI_GENOME_FLOOR_USD spikes up to $300–$500 for relevant variant cohorts
    Holders benefit: higher royalties without any action
  Low-demand scenarios:
    Floor drops temporarily → more buyers enter at lower price point
    Volume compensates for lower unit price → total GMV maintained

GMV Impact Model:
  Static pricing GMV (Phase III, 3,000 active listings, revenue-model.md):
    $150/genome/month × 3,000 × 30% utilization = $135,000/month
    
  Dynamic FTSO pricing GMV (same base, 2×-3× volatility premium):
    Average blended price: $195/genome/month (30% premium from demand spikes)
    $195 × 3,000 × 35% utilization (higher utilization at market price) = $204,750/month
    
  FTSO premium on GMV: +$70K/month = +$840K/year
  Protocol revenue impact (20% of GMV): +$168K/year from FTSO pricing optimization

Rare variant cohort pricing (novel FTSO capability):
  Holder with BRCA1/2 variant during high-demand period:
    DNAI_PHARMA_COHORT_USD at 5× multiplier: $750/genome/month
    vs. static $150/genome/month: 5× more revenue for rare-variant holders
    This is a major differentiation vs. all competitors (none have genomic oracles)
```

### 9.3 How Layer 3 FHE Unlocks the AI Training Revenue Tier

```
LAYER 3 FHE → AI LICENSING REVENUE PATHWAY
────────────────────────────────────────────────────────────────────
Without FHE (ZK-only architecture):
  AI companies can access:
    - Raw genomic data (with consent) → limited market; privacy-concerned holders refuse
    - ZK proofs of properties → useful for narrow queries; cannot train ML models
  
  AI training revenue without FHE:
    Only holders willing to share raw data participate (estimate: 30% of holders)
    AI training dataset of 3,000 genomes at $5,000/dataset = $15,000 per deal

With FHE (4-Layer Stack):
  AI companies can access:
    - FHE compute: train models on ALL 10,000 genomes without anyone sharing raw data
    - 100% holder participation rate (privacy-preserved; no one shares raw data)
    - FL + FHE: collaborative training across entire holder population
  
  AI training revenue with FHE:
    10,000 genome training dataset at $50,000 per training run = $50,000/run
    50 FL training rounds per AI company = $125,000 per AI partnership per quarter
    
    Revenue model implications (from revenue-model.md §4):
      AI Model Training License:  $5,000–$50,000 → $50,000+ per FL job enabled by FHE
      Federated Learning fees:    $125,000/quarter per AI partner vs. $0 without FHE
      
      FHE revenue enablement at Phase IV:
        20 AI training licenses × $2,500 avg: $50,000/month (revenue-model.md KPI)
        But FHE enables FULL POPULATION access → $50,000 per run is conservative
        Revised AI licensing potential at Phase IV: $200K–$500K/month
        
  FHE also enables the "Genomic Inference API" tier (revenue-model.md §4):
    $0.01–$0.10 per inference call on FHE-protected model
    At 1M calls/month: $10K–$100K/month in inference revenue
    This tier is impossible without FHE (raw model inference would expose training data)
```

### 9.4 How Layer 4 Multi-Generational Transfer Enables New Revenue Line

```
LAYER 4 INHERITANCE → NEW REVENUE LINE
────────────────────────────────────────────────────────────────────
Revenue source (new, not in original revenue-model.md):
  Inheritance Management Service: $500/year per enrolled holder

Adoption projections:
  Phase III: 500 enrollees × $500/year = $250,000 ARR (new revenue)
  Phase IV:  5,000 enrollees × $600 blended avg = $3,000,000 ARR

Why this revenue is sustainable and growing:
  - Genomic data royalty streams are perpetual; estates need ongoing management
  - Regulatory complexity increases over time (new laws) → service becomes more valuable
  - Network effect: as genome population ages, inheritance becomes more relevant
  - Switching costs: changing inheritance configuration requires on-chain transactions
    coordinated with Gnosis Safe partners → high retention

Cross-sell potential:
  - Inheritance service clients are high-trust, high-engagement holders
  - Best candidates for premium tier upsell ($1,500 Premium Multi-Jurisdiction)
  - Corporate family office (5-wallet Gnosis Safe) → $5,000/year tier
  
  Premium tier capture:
    10% of enrollees → Premium: 500 × $1,500 = $750K ARR
    2% → Enterprise: 100 × $5,000 = $500K ARR
    Total blended inheritance revenue at 5,000 enrollees: ~$3.7M ARR

Revenue-model.md updated impact:
  Original Phase IV MRR target: $750,000/month ($9M ARR)
  With inheritance service added: +$250,000 ARR (Phase III) to +$3.7M ARR (steady state)
  Revised Phase IV ARR target with inheritance: $12.7M ARR
```

### 9.5 Full Revenue Stack Enabled by 4-Layer Architecture

```
REVENUE WATERFALL COMPARISON: Original vs. 4-Layer Stack (Phase IV)
────────────────────────────────────────────────────────────────────────────
Revenue Line                    Original Spec     4-Layer Stack    Delta
──────────────────────────────  ──────────────    ────────────     ──────
Protocol Access Fee (20% GMV)   $400K/month       $520K/month      +$120K
[FTSO dynamic pricing lifts GMV 30%]

Enterprise API Subscriptions    $300K/month       $300K/month      $0
[No change — Layer 1 Fabric adds compliance tier, not API count]

Compliance Certification        $42K/month        $150K/month      +$108K
[Layer 1 Fabric makes certification verifiable and defensible]

AI Training Data Licensing      $50K/month        $200K/month      +$150K
[Layer 3 FHE unlocks full-population AI training at premium pricing]

Inheritance Management Service  $0/month          $250K/year ARR   +$21K/month
[Layer 4 multi-sig — entirely new revenue line not in original]

ZK Proof API (per-proof)        included above    included above   $0
Marketplace Listing Fees        included in GMV   included in GMV  $0
──────────────────────────────  ──────────────    ────────────     ──────
TOTAL MRR (Phase IV steady)     $750K/month       $1,191K/month    +$441K/month
TOTAL ARR (Phase IV steady)     $9M/year          $14.3M/year      +$5.3M/year

4-Layer Stack revenue premium:  +59% ARR vs. original architecture
[This represents the business case for the architectural investment]
```

---

## Appendix A: Technology Version Reference

| Component | Technology | Version | Layer |
|---|---|---|---|
| Consortium network | Hyperledger Fabric | 2.5.x (LTS) | 1 |
| Chaincode language | Go | 1.21+ | 1 |
| Ordering consensus | Raft | (built into Fabric) | 1 |
| Cross-chain bridge | Flare State Connector | v2.0 | 1 |
| Flare oracle | FTSO v2 | Songbird testnet → Flare mainnet | 2 |
| Storage hot tier | IPFS (Kubo) | 0.27.x | 2 |
| Storage cold tier | Filecoin via Lighthouse | API v1 | 2 |
| FHE library | OpenFHE | 1.1.x | 3 |
| FHE scheme | CKKS (128-bit security) | N/A | 3 |
| FL framework | Flower (flwr) | 1.8.x | 3 |
| Token standard | ERC-721 + EIP-5192 | Solidity 0.8.26 | 4 |
| Royalties | EIP-2981 | Solidity 0.8.26 | 4 |
| Account abstraction | ERC-4337 | EntryPoint v0.7 | 4 |
| Multi-sig inheritance | Gnosis Safe | 1.4.x | 4 |
| Smart contract framework | OpenZeppelin | 5.0.2 | 4 |
| ZK proofs | Noir (Barretenberg) | 0.32.0 | 4 (+ 3) |
| Public chain | Base (Coinbase L2) | Current | 4 |
| Indexing | The Graph | Subgraph Studio | 4 |

---

## Appendix B: Inter-Layer Communication Summary

```
INTER-LAYER COMMUNICATION MATRIX
──────────────────────────────────────────────────────────────────────────
Source      → Destination   Protocol                    Data Transferred
──────────────────────────────────────────────────────────────────────────
Layer 1 Fabric → Layer 4 Base   Flare State Connector      Access events, royalty batches
Layer 4 Base   → Layer 1 Fabric Flare State Connector      Consent grants, ownership proofs
Layer 2 IPFS   → Layer 3 FHE    Encrypted chunk fetch       AES-256-GCM ciphertext
Layer 3 FHE    → Layer 4        ZK proof of FHE result      Noir proof + public inputs
Layer 2 FTSO   → Layer 4        Flare oracle read           DNAI_GENOME_FLOOR_USD price
Layer 4 Base   → Layer 2 IPFS   CID reference (on-chain)    vaultCID (string CID only)
Layer 1 Fabric → Layer 2 IPFS   (no direct connection)      [IPFS accessed by clients]
Layer 3 FL     → Layer 1 Fabric FL round logging            Round completion events
User Device    → Layer 2 IPFS   HTTPS (ciphertext only)     Encrypted chunks
User Device    → Layer 4 Base   JSON-RPC (signed tx)        Consent txns, royalty claims
Pharma Node    → Layer 1 Fabric gRPC (Fabric SDK)           Access event transactions
```

---

## Appendix C: Open Engineering Questions for Phase II Architecture Review

The following questions should be resolved before Phase II implementation begins:

1. **Flare attestation provider count:** How many independent Flare attestation providers are required to verify Fabric events before DNaI accepts the attestation as valid? Recommendation: 12 of 20 (60% supermajority) to match Flare's standard attestation threshold.

2. **Fabric-to-IPFS node relationship:** Should consortium Fabric peer nodes also run IPFS nodes (collocated), or should IPFS remain a separate infrastructure tier? Colocation reduces latency for data access; separation maintains cleaner trust boundaries. Recommendation: separate, with a dedicated IPFS gateway tier.

3. **FHE ciphertext storage:** FHE-encrypted genomic data is ~10× larger than AES-256-GCM encrypted data (due to CKKS noise padding). Should FHE ciphertexts be stored separately from standard vault ciphertexts? Recommendation: separate CID namespace with `fhe:` prefix in manifest; stored on same IPFS/Filecoin infrastructure.

4. **Flower aggregation server decentralization:** The Phase III FL architecture uses a central Flower server (Cloud Control LLC). For Phase IV full decentralization, should Flower aggregation be distributed across Fabric orderer nodes? Recommendation: yes, co-locate Flower aggregation with Fabric ordering service for architectural consistency.

5. **Gnosis Safe version compatibility:** DNaI Inheritance module must be compatible with future Gnosis Safe upgrades. Should inheritance module be a Gnosis Safe module (dependent on Safe version) or a standalone contract that reads Safe state externally? Recommendation: standalone contract with Safe state reads for maximum version independence.

---

*Document: `/home/user/cloudcontrolllc-site/docs/phase-1/four-layer-architecture.md`*  
*Version 1.0.0 — Definitive Engineering Reference*  
*Author: Cloud Control LLC Engineering, July 4, 2026*  
*Next review: Phase II kickoff (August 16, 2026)*  
*Cross-references: `technical-architecture.md` (v0.1.0), `token-standard-spec.md` (v0.1), `revenue-model.md`*  
*Maintained by: Cloud Control LLC — everett@cloudcontrolllc.com*
