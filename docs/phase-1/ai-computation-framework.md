# DNaI AI and Computation Framework
**Cloud Control LLC — Project DNaI**
**Phase I Specification Document**
**Version:** 1.0
**Date:** July 1, 2026

---

## Executive Summary

The DNaI AI and Computation Framework establishes the technical and commercial infrastructure for genomic AI services atop the sovereign data protocol. This framework transforms consented, encrypted genomic vaults into the world's most valuable AI training resource — while preserving genomic sovereignty through cryptographic enforcement of consent, zero-knowledge proofs, and federated computation.

Revenue flows from three AI compute primitives: federated learning over encrypted vaults, pay-per-inference API calls against genomic foundation models, and a decentralized AI model marketplace where third-party AI companies list and license genomic models. Every AI compute transaction routes through DNaI consent oracle, splits royalties to genome holders automatically, and is auditable on-chain.

**AI Revenue Targets:**
- Phase II: $25,000 (FL pilot agreement)
- Phase III: $50,000–$200,000/month (inference API + enterprise subscriptions)
- Phase IV: $50,000+ MRR (full marketplace activation)

---

## 1. AI Revenue Opportunity in Genomics

### Market Context

The genomic AI market represents a structural bottleneck: AI companies with the most sophisticated models are blocked from training on the only data that matters — real, consented human genomic sequences. Existing datasets are small, biased, and impermissibly reused. DNaI breaks this bottleneck by creating the first cryptographically consented, legally permissible, commercially structured genomic AI training market.

**Market Size:**
- Global genomic AI market: $2.1B in 2024 → $8.4B by 2030 (22% CAGR)
- AI drug discovery genomic data spend: $450M/year and growing
- Foundation model training budgets at target companies: $50M–$500M/year
- Current addressable spend on genomic training data: <$100M/year (fragmented, gray market)

**DNaI Structural Advantages:**
- Only platform with cryptographically verifiable consent on-chain
- ZK proof layer enables privacy-preserving model training without decryption
- Smart contract licensing eliminates manual data licensing negotiations
- Royalty auto-distribution creates self-reinforcing supply-side incentive

### Target AI Customer Segments

| Segment | Representative Companies | Primary Use Case | Revenue Tier |
|---------|------------------------|-----------------|-------------|
| **Drug Discovery AI** | Recursion Pharmaceuticals, Insilico Medicine, Exscientia | Drug-genome interaction training | Enterprise ($100K+/year) |
| **Clinical Genomics AI** | Tempus AI, Foundation Medicine | Oncology variant interpretation | Enterprise ($50K–$100K/year) |
| **Protein Structure AI** | DeepMind (AlphaFold team), Baker Lab | Genotype-phenotype correlation | Research ($25K–$50K/year) |
| **Biotech AI** | BioNTech Digital, Moderna Digital | mRNA/vaccine genomic optimization | Enterprise ($100K+/year) |
| **Longevity AI** | Calico, Altos Labs | Aging genomics, epigenetic modeling | Research ($25K–$50K/year) |
| **Consumer Health AI** | Color Health, Genome Medical | Polygenic risk score refinement | SMB ($5K–$25K/year) |

### Competitive Moat

```
EXISTING LANDSCAPE                    DNaI ADVANTAGE
─────────────────────────────────────────────────────
UK Biobank        → static, no consent control
All of Us         → centralized, government-gated      ← DNaI: consent-dynamic,
23andMe data      → owner bankrupt, data at risk           decentralized, always live
deCODE genetics   → Iceland only, non-transferable    ← DNaI: global, multi-ancestry
Genomics England  → NHS-only, no commercial license   ← DNaI: open commercial market
```

---

## 2. Federated Learning Architecture

### Design Principle

Federated Learning (FL) is the core compute paradigm: AI models train on genomic data WITHOUT the data ever leaving the genome holder's encrypted vault. The model comes to the data. DNaI orchestrates the FL rounds, enforces consent scope, and distributes royalties per training round.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DNaI FEDERATED LEARNING SYSTEM                   │
└─────────────────────────────────────────────────────────────────────┘

  AI COMPANY (CLIENT)                    DNaI ORCHESTRATION LAYER
  ┌──────────────────┐                   ┌──────────────────────────┐
  │  Training Job    │                   │   FL Coordinator (Rust)  │
  │  Specification   │──── Job Submit ──▶│   - Round management     │
  │  - Model arch    │                   │   - Participant selection │
  │  - Cohort filter │                   │   - Aggregation server   │
  │  - Budget (USDC) │◀── License NFT ───│   - Consent verification │
  └──────────────────┘                   └──────────┬───────────────┘
                                                     │
                          ┌──────────────────────────┼─────────────────────────┐
                          │                          │                         │
                          ▼                          ▼                         ▼
              ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
              │  GENOME VAULT A │       │  GENOME VAULT B │       │  GENOME VAULT N │
              │  ┌───────────┐  │       │  ┌───────────┐  │       │  ┌───────────┐  │
              │  │Encrypted  │  │       │  │Encrypted  │  │       │  │Encrypted  │  │
              │  │Genome     │  │       │  │Genome     │  │       │  │Genome     │  │
              │  │(AES-256)  │  │       │  │(AES-256)  │  │       │  │(AES-256)  │  │
              │  └─────┬─────┘  │       │  └─────┬─────┘  │       │  └─────┬─────┘  │
              │        │        │       │        │        │       │        │        │
              │  ┌─────▼─────┐  │       │  ┌─────▼─────┐  │       │  ┌─────▼─────┐  │
              │  │ Local FL  │  │       │  │ Local FL  │  │       │  │ Local FL  │  │
              │  │ Worker    │  │       │  │ Worker    │  │       │  │ Worker    │  │
              │  │ (TEE)     │  │       │  │ (TEE)     │  │       │  │ (TEE)     │  │
              │  └─────┬─────┘  │       │  └─────┬─────┘  │       │  └─────┬─────┘  │
              └────────┼────────┘       └────────┼────────┘       └────────┼────────┘
                       │                         │                         │
                       └────────────┬────────────┘                         │
                                    │         Gradient Updates Only         │
                                    │         (no raw genomic data)         │
                                    └──────────────────────────────────────┘
                                                     │
                                                     ▼
                                        ┌────────────────────┐
                                        │  Secure Aggregator  │
                                        │  FedAvg + DP noise  │
                                        │  (ε=1.0, δ=1e-5)   │
                                        └──────────┬─────────┘
                                                   │
                                                   ▼
                                        ┌────────────────────┐
                                        │  Global Model       │
                                        │  Update (weights)   │
                                        │  → AI Company       │
                                        └────────────────────┘
```

### FL Framework: Flower (flwr) Integration

DNaI uses the **Flower (flwr)** open-source FL framework as the orchestration backbone, extended with:
1. ZK-gated consent verification per participant per round
2. TEE (Trusted Execution Environment) local compute
3. Differential privacy (DP) noise injection at aggregation
4. On-chain royalty triggering per completed FL round

**FL Worker Stack (per vault):**
```
Local FL Worker (runs in TEE — Intel SGX or AMD SEV)
├── Consent Verifier: checks on-chain consent for current job license
├── Genome Decryptor: decrypts relevant genome scope (never persists plaintext)
├── Feature Extractor: parses VCF/FASTQ to tensor representation
├── Local Trainer: runs N epochs of model training on local data
├── Gradient Clipper: clips gradients before transmission (DP prerequisite)
├── Gradient Compressor: quantization + sparsification for bandwidth
└── Gradient Transmitter: sends to aggregator (TLS + TEE attestation)
```

**Aggregation Server:**
```
FL Aggregator (DNaI-operated, audited)
├── Participant Authenticator: verifies TEE attestations
├── Round Manager: coordinates global FL rounds
├── FedAvg Engine: weighted averaging of participant gradients
├── DP Engine: adds calibrated Gaussian noise (Rényi DP accounting)
├── Royalty Trigger: calls RoyaltyDistributor.sol per completed round
└── Model Publisher: delivers updated model weights to AI company
```

### Differential Privacy Parameters

| Privacy Level | ε (epsilon) | δ (delta) | Gradient Clip Norm | Typical Use Case |
|--------------|-------------|-----------|-------------------|-----------------|
| **Maximum Privacy** | 0.1 | 1e-6 | 0.5 | Rare disease cohorts |
| **High Privacy** | 1.0 | 1e-5 | 1.0 | Standard genomic research |
| **Standard Privacy** | 3.0 | 1e-5 | 2.0 | Population-scale GWAS |
| **Research Grade** | 8.0 | 1e-4 | 5.0 | Published dataset benchmarks |

All training runs are DP-audited. Privacy budget consumed per genome per training job is tracked on-chain and factors into consent expiry.

### TEE Implementation

- **Intel SGX:** Primary TEE for x86 cloud instances (AWS, GCP, Azure)
- **AMD SEV:** Secondary TEE for AMD EPYC instances
- **Remote Attestation:** DCAP attestation verified by DNaI Consent Oracle before each FL round
- **Memory Encryption:** All in-enclave processing is memory-encrypted; no plaintext exits the enclave

---

## 3. Compute-Over-Data Protocol

### Protocol Design

The Compute-Over-Data (CoD) protocol defines the sequence by which AI computation occurs over encrypted genomic vaults. No raw genomic data ever transits the network. Only computation artifacts (gradients, inference results, aggregate statistics) leave the vault environment.

### Protocol Flow

```
COMPUTE-OVER-DATA SEQUENCE

Step 1: LICENSE ACQUISITION
  AI Company → DNaI License Registry
  ├── Submit: cohort spec, model arch hash, compute budget (USDC)
  ├── Receive: FederatedLearningLicense NFT (ERC-1155)
  └── On-chain: license terms, consent scope, DP parameters recorded

Step 2: COHORT ASSEMBLY
  DNaI Orchestrator → Consent Oracle
  ├── Query: genome holders matching cohort spec + consented for FL
  ├── Verify: on-chain consent for each participant (ZK proof check)
  └── Return: anonymized participant set (wallet addresses only)

Step 3: ROUND INITIALIZATION
  DNaI Orchestrator → Participant FL Workers
  ├── Broadcast: model weights (current global state)
  ├── Broadcast: training hyperparameters
  └── Broadcast: DP parameters (clip norm, noise multiplier)

Step 4: LOCAL TRAINING (in TEE)
  Each Participant Vault
  ├── Decrypt: relevant genome scope (scoped by license)
  ├── Extract: genomic feature tensors
  ├── Train: N local epochs on decrypted data
  ├── Clip: gradients to specified norm
  └── Return: clipped gradient update (plaintext data never leaves TEE)

Step 5: SECURE AGGREGATION
  DNaI Aggregator
  ├── Collect: gradient updates from all participants
  ├── Verify: TEE attestations
  ├── Aggregate: FedAvg (weighted by genome count contribution)
  ├── DP Noise: add calibrated Gaussian noise
  └── Produce: new global model weights

Step 6: ROYALTY DISTRIBUTION
  RoyaltyDistributor.sol (triggered automatically)
  ├── Calculate: per-participant royalty (pro-rata by contribution weight)
  ├── Deduct: protocol fee (15% to DNaI treasury)
  ├── Deduct: DAO fee (5% to governance treasury)
  └── Transfer: USDC to each participant wallet

Step 7: MODEL DELIVERY
  DNaI Orchestrator → AI Company
  ├── Deliver: updated model weights
  ├── Emit: on-chain training receipt (job hash, participant count, DP budget used)
  └── Update: license NFT (training epochs consumed)
```

### Consent Scope Enforcement

The protocol enforces data minimization by scope. An AI company can only access the genomic features covered by the consented scope:

| Scope Token | Genomic Access | Features Available | Premium Multiplier |
|------------|---------------|-------------------|-------------------|
| `FULL_GENOME` | Full WGS sequence | All 3B base pairs, all variants | 4× |
| `VARIANT_PANEL` | Common variants only | ~1M SNPs (standard GWAS panel) | 1× |
| `DISEASE_RISK` | Risk loci only | Polygenic risk score variants | 1.5× |
| `DRUG_RESPONSE` | Pharmacogenomic loci | PGx variants (CPIC genes) | 2× |
| `ANCESTRY` | Ancestry-informative markers | Population structure AIMs | 1× |
| `EPIGENOME` | Methylation data (if available) | CpG methylation arrays | 3× |

---

## 4. Model Training License Framework

### License Architecture

Every AI training job requires an on-chain license. Licenses are structured as ERC-1155 tokens with embedded training terms. Smart contract enforcement prevents unauthorized training runs.

### Solidity Pseudocode: FederatedLearningLicense.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IConsentOracle.sol";
import "./interfaces/IRoyaltyDistributor.sol";

/**
 * @title FederatedLearningLicense
 * @notice Issues and governs AI training licenses for genomic FL jobs
 * @dev License NFTs (ERC-1155) encode training rights, DP parameters, and consent scope
 */
contract FederatedLearningLicense is ERC1155, AccessControl, ReentrancyGuard {

    bytes32 public constant ORCHESTRATOR_ROLE = keccak256("ORCHESTRATOR_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    IConsentOracle public immutable consentOracle;
    IRoyaltyDistributor public immutable royaltyDistributor;

    // Protocol fee: 15% of all training budgets
    uint256 public constant PROTOCOL_FEE_BPS = 1500;
    // DAO fee: 5% of all training budgets
    uint256 public constant DAO_FEE_BPS = 500;
    // Genome holder share: 80%
    uint256 public constant HOLDER_SHARE_BPS = 8000;

    address public protocolTreasury;
    address public daoTreasury;

    uint256 private _licenseIdCounter;

    enum LicenseType {
        FEDERATED_LEARNING,    // Compute-over-data FL job
        DATASET_EXPORT,        // Consented dataset export (premium)
        INFERENCE_ONLY,        // Model inference, no training
        PERPETUAL_MODEL        // Full perpetual license for specific model version
    }

    enum PrivacyLevel {
        MAXIMUM,    // ε=0.1
        HIGH,       // ε=1.0
        STANDARD,   // ε=3.0
        RESEARCH    // ε=8.0
    }

    struct TrainingLicense {
        uint256 licenseId;
        address licensee;           // AI company wallet
        LicenseType licenseType;
        bytes32 cohortSpecHash;     // Hash of cohort specification
        bytes32 modelArchHash;      // Hash of model architecture
        string genomicScope;        // "VARIANT_PANEL", "FULL_GENOME", etc.
        uint256 maxParticipants;    // Maximum genome holders in training
        uint256 maxEpochs;          // Maximum global FL rounds
        uint256 epochsConsumed;     // Epochs completed so far
        PrivacyLevel privacyLevel;  // DP parameters tier
        uint256 budgetUsdc;         // Total USDC escrowed for this license
        uint256 budgetConsumed;     // USDC paid out so far
        uint256 issuedAt;           // Block timestamp
        uint256 expiresAt;          // License expiry (max 1 year)
        bool active;                // License is currently executable
        bool completed;             // Training job completed
    }

    mapping(uint256 => TrainingLicense) public licenses;
    mapping(address => uint256[]) public licensesByLicensee;
    mapping(bytes32 => bool) public cohortSpecRegistered;

    // Royalty tracking per license per genome holder
    mapping(uint256 => mapping(address => uint256)) public royaltiesEarned;
    mapping(uint256 => uint256) public totalRoyaltiesDistributed;

    event LicenseIssued(
        uint256 indexed licenseId,
        address indexed licensee,
        LicenseType licenseType,
        string genomicScope,
        uint256 budgetUsdc,
        uint256 expiresAt
    );

    event TrainingRoundCompleted(
        uint256 indexed licenseId,
        uint256 roundNumber,
        uint256 participantCount,
        uint256 royaltiesDistributed
    );

    event LicenseRevoked(uint256 indexed licenseId, string reason);

    /**
     * @notice Issue a new AI training license
     * @param licensee AI company address
     * @param licenseType Type of license (FL, export, inference, perpetual)
     * @param cohortSpecHash Hash of the cohort specification document
     * @param modelArchHash Hash of the model architecture
     * @param genomicScope Scope of genomic data access
     * @param maxParticipants Maximum participants in training
     * @param maxEpochs Maximum global FL rounds
     * @param privacyLevel Differential privacy tier
     * @param durationDays License duration in days (max 365)
     * @param budgetUsdc Total USDC budget escrowed
     */
    function issueLicense(
        address licensee,
        LicenseType licenseType,
        bytes32 cohortSpecHash,
        bytes32 modelArchHash,
        string calldata genomicScope,
        uint256 maxParticipants,
        uint256 maxEpochs,
        PrivacyLevel privacyLevel,
        uint256 durationDays,
        uint256 budgetUsdc
    ) external nonReentrant returns (uint256 licenseId) {
        require(licensee != address(0), "Invalid licensee");
        require(durationDays > 0 && durationDays <= 365, "Invalid duration");
        require(budgetUsdc >= minimumBudget(licenseType, maxParticipants), "Budget too low");
        require(_validateScope(genomicScope), "Invalid genomic scope");

        // Transfer USDC to escrow (this contract)
        // IERC20(USDC_ADDRESS).transferFrom(msg.sender, address(this), budgetUsdc);

        licenseId = ++_licenseIdCounter;

        licenses[licenseId] = TrainingLicense({
            licenseId: licenseId,
            licensee: licensee,
            licenseType: licenseType,
            cohortSpecHash: cohortSpecHash,
            modelArchHash: modelArchHash,
            genomicScope: genomicScope,
            maxParticipants: maxParticipants,
            maxEpochs: maxEpochs,
            epochsConsumed: 0,
            privacyLevel: privacyLevel,
            budgetUsdc: budgetUsdc,
            budgetConsumed: 0,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + (durationDays * 1 days),
            active: true,
            completed: false
        });

        licensesByLicensee[licensee].push(licenseId);
        _mint(licensee, licenseId, 1, "");

        emit LicenseIssued(
            licenseId,
            licensee,
            licenseType,
            genomicScope,
            budgetUsdc,
            block.timestamp + (durationDays * 1 days)
        );
    }

    /**
     * @notice Record completion of one FL training round
     * @dev Called by ORCHESTRATOR_ROLE after each verified global round
     * @param licenseId The license ID for this training job
     * @param participants Array of genome holder addresses who participated
     * @param contributionWeights Array of contribution weights (sum to 10000 BPS)
     * @param roundBudgetUsdc USDC to distribute for this round
     */
    function recordTrainingRound(
        uint256 licenseId,
        address[] calldata participants,
        uint256[] calldata contributionWeights,
        uint256 roundBudgetUsdc
    ) external onlyRole(ORCHESTRATOR_ROLE) nonReentrant {
        TrainingLicense storage license = licenses[licenseId];
        require(license.active, "License not active");
        require(!license.completed, "License already completed");
        require(block.timestamp <= license.expiresAt, "License expired");
        require(license.epochsConsumed < license.maxEpochs, "Max epochs reached");
        require(participants.length == contributionWeights.length, "Array length mismatch");
        require(
            license.budgetConsumed + roundBudgetUsdc <= license.budgetUsdc,
            "Budget exceeded"
        );

        // Verify consent for each participant via Consent Oracle
        for (uint256 i = 0; i < participants.length; i++) {
            require(
                consentOracle.verifyConsentForFL(
                    participants[i],
                    licenseId,
                    license.genomicScope
                ),
                "Participant consent invalid"
            );
        }

        // Calculate fee splits
        uint256 protocolFee = (roundBudgetUsdc * PROTOCOL_FEE_BPS) / 10000;
        uint256 daoFee = (roundBudgetUsdc * DAO_FEE_BPS) / 10000;
        uint256 holderPool = roundBudgetUsdc - protocolFee - daoFee;

        // Distribute to genome holders
        for (uint256 i = 0; i < participants.length; i++) {
            uint256 holderAmount = (holderPool * contributionWeights[i]) / 10000;
            royaltiesEarned[licenseId][participants[i]] += holderAmount;
            // Transfer USDC to participant
            // IERC20(USDC_ADDRESS).transfer(participants[i], holderAmount);
        }

        // Transfer protocol and DAO fees
        // IERC20(USDC_ADDRESS).transfer(protocolTreasury, protocolFee);
        // IERC20(USDC_ADDRESS).transfer(daoTreasury, daoFee);

        license.epochsConsumed++;
        license.budgetConsumed += roundBudgetUsdc;
        totalRoyaltiesDistributed[licenseId] += holderPool;

        emit TrainingRoundCompleted(
            licenseId,
            license.epochsConsumed,
            participants.length,
            holderPool
        );

        // Auto-complete if max epochs reached
        if (license.epochsConsumed >= license.maxEpochs) {
            license.completed = true;
            license.active = false;
        }
    }

    /**
     * @notice Minimum budget calculation by license type and scale
     */
    function minimumBudget(
        LicenseType licenseType,
        uint256 maxParticipants
    ) public pure returns (uint256) {
        if (licenseType == LicenseType.FEDERATED_LEARNING) {
            // $5 per participant minimum
            return maxParticipants * 5e6; // 5 USDC (6 decimals)
        } else if (licenseType == LicenseType.DATASET_EXPORT) {
            return maxParticipants * 150e6; // $150 per genome
        } else if (licenseType == LicenseType.INFERENCE_ONLY) {
            return 1000e6; // $1,000 minimum
        } else {
            return 25000e6; // $25,000 minimum for perpetual
        }
    }

    /**
     * @notice Validate genomic scope string
     */
    function _validateScope(string calldata scope) internal pure returns (bool) {
        bytes32 scopeHash = keccak256(bytes(scope));
        return (
            scopeHash == keccak256("FULL_GENOME") ||
            scopeHash == keccak256("VARIANT_PANEL") ||
            scopeHash == keccak256("DISEASE_RISK") ||
            scopeHash == keccak256("DRUG_RESPONSE") ||
            scopeHash == keccak256("ANCESTRY") ||
            scopeHash == keccak256("EPIGENOME")
        );
    }

    /**
     * @notice Revoke a license for policy violation
     */
    function revokeLicense(
        uint256 licenseId,
        string calldata reason
    ) external onlyRole(AUDITOR_ROLE) {
        licenses[licenseId].active = false;
        emit LicenseRevoked(licenseId, reason);
    }
}
```

### License Pricing Tiers

| Tier | License Type | Price | Genomic Scope | Max Participants | DP Level |
|------|-------------|-------|--------------|-----------------|---------|
| **Starter** | FL – VARIANT_PANEL | $5,000 | VARIANT_PANEL | 100 | HIGH (ε=1.0) |
| **Professional** | FL – FULL_GENOME | $25,000 | FULL_GENOME | 1,000 | STANDARD (ε=3.0) |
| **Enterprise** | FL – Multi-scope | $100,000 | All scopes | 10,000 | RESEARCH (ε=8.0) |
| **Dataset Export** | DATASET_EXPORT | $150/genome | Custom | Unlimited | N/A (consented) |
| **Perpetual Model** | PERPETUAL_MODEL | Custom | Negotiated | N/A | N/A |

### License Lifecycle

```
ISSUED → ACTIVE → [TRAINING ROUNDS] → COMPLETED
                         │
                         ├── Consent revoked by holder → PARTIAL COMPLETION
                         ├── Budget exhausted → AUTO-COMPLETE
                         ├── Expiry reached → EXPIRED
                         └── Policy violation → REVOKED (refund pro-rata)
```

---

## 5. Genomic Inference API

### API Overview

The Genomic Inference API provides pay-per-query access to DNaI-licensed genomic foundation models. Queries are ZK-gated: the requester proves they hold a valid API license without revealing query specifics to the data source. Results are computed over consented, pooled genomic data with per-query attribution.

**Base URL:** `https://api.dnai.io/v1/inference`
**Auth:** Bearer token (API key tied to on-chain license)
**Pricing:** $0.05 per inference call (standard); variable for specialized models
**Rate Limit:** 1,000 calls/hour (standard tier); 10,000/hour (enterprise)

### REST API Specification

#### POST /v1/inference/drug-response

Predict drug response phenotype from genomic variants.

**Request:**
```http
POST /v1/inference/drug-response HTTP/1.1
Host: api.dnai.io
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "genome_token_id": "0x1a2b...3c4d",
  "consent_proof": "0xabc...def",
  "drug": "warfarin",
  "model_version": "pgx-v2.1",
  "scope": "DRUG_RESPONSE",
  "output_format": "probability_distribution"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
X-DNaI-Job-ID: job_9f3a2c1b
X-DNaI-Royalty-Txn: 0xfed...321
X-DNaI-Cost-USDC: 0.05

{
  "job_id": "job_9f3a2c1b",
  "drug": "warfarin",
  "model": "pgx-v2.1",
  "result": {
    "predicted_metabolizer_status": "poor_metabolizer",
    "confidence": 0.94,
    "recommended_dose_adjustment": "-50%",
    "relevant_variants": ["CYP2C9*2", "CYP2C9*3", "VKORC1 -1639G>A"],
    "evidence_tier": "CPIC_A"
  },
  "privacy": {
    "dp_applied": true,
    "epsilon_budget_used": 0.01,
    "cohort_size": 847,
    "synthetic_noise_added": false
  },
  "consent": {
    "scope_verified": "DRUG_RESPONSE",
    "zk_proof_hash": "0xabc...def",
    "consent_registry_block": 21847392
  },
  "billing": {
    "cost_usdc": 0.05,
    "royalty_distributed_usdc": 0.035,
    "protocol_fee_usdc": 0.010,
    "dao_fee_usdc": 0.005
  }
}
```

#### POST /v1/inference/disease-risk

Compute polygenic risk score for specified disease.

**Request:**
```http
POST /v1/inference/disease-risk HTTP/1.1
Host: api.dnai.io
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "genome_token_id": "0x1a2b...3c4d",
  "consent_proof": "0xabc...def",
  "disease": "type2_diabetes",
  "model_version": "prs-t2d-v1.3",
  "ancestry_correction": "EUR",
  "scope": "DISEASE_RISK",
  "percentile_reference": "ukb_2024"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "job_id": "job_8e2b4d7c",
  "disease": "type2_diabetes",
  "result": {
    "prs_score": 1.47,
    "percentile": 89,
    "relative_risk": 2.3,
    "lifetime_risk_estimate": 0.42,
    "top_contributing_variants": [
      {"rsid": "rs7903146", "gene": "TCF7L2", "effect_size": 0.31},
      {"rsid": "rs1111875", "gene": "HHEX", "effect_size": 0.14}
    ]
  },
  "model_metadata": {
    "training_cohort_size": 8429,
    "auc": 0.73,
    "ancestry_matched": true,
    "last_updated": "2026-03-15"
  }
}
```

#### POST /v1/inference/ancestry

Compute ancestry composition from ancestry-informative markers.

**Request:**
```http
POST /v1/inference/ancestry HTTP/1.1
Host: api.dnai.io
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "genome_token_id": "0x1a2b...3c4d",
  "consent_proof": "0xabc...def",
  "scope": "ANCESTRY",
  "resolution": "continental",
  "reference_panel": "1000g_phase3"
}
```

#### POST /v1/inference/cohort-query

Query aggregate statistics over a consented cohort (no individual-level data).

**Request:**
```http
POST /v1/inference/cohort-query HTTP/1.1
Host: api.dnai.io
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "cohort_filter": {
    "consented_scopes": ["VARIANT_PANEL", "DISEASE_RISK"],
    "ancestry": ["EUR", "EAS"],
    "min_age": 40,
    "max_age": 70
  },
  "query": {
    "type": "allele_frequency",
    "variants": ["rs7903146", "rs1111875", "rs4430796"],
    "stratification": "ancestry"
  },
  "privacy": {
    "dp_epsilon": 1.0,
    "min_cell_size": 10
  }
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "cohort_size": 3847,
  "query_cost_usdc": 2.50,
  "results": {
    "rs7903146": {
      "EUR": {"risk_allele_freq": 0.294, "n": 2103},
      "EAS": {"risk_allele_freq": 0.152, "n": 1744}
    },
    "rs1111875": {
      "EUR": {"risk_allele_freq": 0.531, "n": 2103},
      "EAS": {"risk_allele_freq": 0.488, "n": 1744}
    }
  },
  "dp_metadata": {
    "epsilon_applied": 1.0,
    "noise_magnitude": "laplace_scale_0.47",
    "suppressed_cells": 0
  }
}
```

### API Pricing Structure

| Endpoint | Price per Call | Bulk Pricing (10K+ calls/mo) | Enterprise |
|----------|---------------|------------------------------|-----------|
| `/inference/drug-response` | $0.10 | $0.07 | $0.05 |
| `/inference/disease-risk` | $0.05 | $0.035 | $0.02 |
| `/inference/ancestry` | $0.03 | $0.02 | $0.01 |
| `/inference/cohort-query` | $0.50–$5.00 | Variable | Negotiated |
| `/inference/variant-annotation` | $0.01 | $0.007 | $0.005 |

**Monthly Revenue Projection (Phase III):**
```
Drug response queries:   50,000 × $0.07 = $3,500/month
Disease risk queries:   200,000 × $0.035 = $7,000/month
Ancestry queries:       100,000 × $0.02 = $2,000/month
Cohort queries:           1,000 × $2.00 = $2,000/month
Enterprise contracts:       5 × $5,000 = $25,000/month
                              TOTAL API MRR ≈ $39,500/month
```

---

## 6. AI Model Marketplace

### Marketplace Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               DNaI AI MODEL MARKETPLACE                      │
└─────────────────────────────────────────────────────────────┘

  AI COMPANIES (SELLERS)              BUYERS (Pharma/Research/AI)
  ┌──────────────────┐               ┌──────────────────────────┐
  │  Submit Model    │               │  Browse Models            │
  │  + Provenance    │               │  Filter: task, scope,     │
  │  + Training cert │               │  ancestry, accuracy       │
  │  + Pricing       │               │  Purchase license         │
  └────────┬─────────┘               └──────────┬───────────────┘
           │                                    │
           ▼                                    ▼
  ┌──────────────────────────────────────────────────────────┐
  │                  MARKETPLACE REGISTRY                     │
  │  ModelRegistry.sol                                        │
  │  ├── Model NFT (ERC-721) — uniquely identified model     │
  │  ├── Provenance hash — links to training license         │
  │  ├── Performance benchmarks (on-chain attestation)       │
  │  ├── License terms (usage, epochs, exclusivity)          │
  │  └── Revenue split: 70% seller / 15% DNaI / 15% holders │
  └──────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
  ┌──────────────────┐               ┌──────────────────────────┐
  │  Model Storage   │               │  Smart Contract Licensing │
  │  (IPFS + TEE)   │               │  - Automatic royalties    │
  │  Encrypted       │               │  - Usage tracking         │
  │  weights         │               │  - Expiry enforcement     │
  └──────────────────┘               └──────────────────────────┘
```

### Marketplace Fee Structure

| Transaction Type | DNaI Protocol Fee | Model Creator | Data Contributors (Genome Holders) |
|----------------|------------------|---------------|-----------------------------------|
| Standard model license | 15% | 70% | 15% |
| Exclusive license | 20% | 65% | 15% |
| Per-inference royalty | 15% | 55% | 30% |
| Model auction clearing | 20% | 63% | 17% |

### Model Listing Requirements

For a model to be listed on the DNaI marketplace, the submitting AI company must:

1. **Provenance Certificate:** Provide a valid `FederatedLearningLicense` NFT as proof of consented training
2. **Audit Report:** Submit a third-party safety and bias audit (DNaI-approved auditors)
3. **Performance Attestation:** Benchmark results on DNaI-hosted holdout sets (on-chain result hash)
4. **Consent Chain:** Full documentation of genome holder consent scope used in training
5. **DP Certificate:** Proof of differential privacy parameters applied during training
6. **Usage Terms:** Declare permitted downstream uses (clinical, research, commercial, etc.)

### Model Categories

| Category | Examples | Typical License Price | Revenue Share to Holders |
|----------|----------|----------------------|--------------------------|
| **Drug Response** | PGx models (warfarin, clopidogrel) | $5K–$50K | 15–20% |
| **Disease Risk** | PRS models (T2D, CAD, CRC) | $10K–$100K | 15–20% |
| **Protein Structure** | AlphaFold genomic extensions | $50K–$500K | 15–25% |
| **Drug Discovery** | Binding affinity, toxicity | $100K–$1M | 20–30% |
| **Clinical Interpretation** | Variant pathogenicity | $25K–$250K | 15–20% |
| **Ancestry/Admixture** | Population genetics | $5K–$25K | 15% |

---

## 7. Claude/Anthropic Integration

### Use Cases

Claude serves as the AI reasoning layer for DNaI's human-facing interfaces, compliance systems, and orchestration intelligence. Claude is not used for genomic model training (that uses purpose-built genomic models). Claude handles interpretation, synthesis, communication, and governance reasoning.

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  DNaI × CLAUDE INTEGRATION                   │
└─────────────────────────────────────────────────────────────┘

  DNaI PLATFORM                     CLAUDE API (claude-opus-4-8)
  ┌─────────────────┐               ┌──────────────────────────┐
  │ Genome Holder   │──Consent Q──▶ │  Consent Explainer        │
  │ Dashboard       │◀─Plain Eng.── │  "Your data was used..."  │
  └─────────────────┘               └──────────────────────────┘

  ┌─────────────────┐               ┌──────────────────────────┐
  │ Enterprise API  │──Legal Q───▶  │  Compliance Advisor       │
  │ Partner Portal  │◀─Analysis──── │  "This request requires..."│
  └─────────────────┘               └──────────────────────────┘

  ┌─────────────────┐               ┌──────────────────────────┐
  │ DAO Governance  │──Proposal──▶  │  Governance Synthesizer   │
  │ Interface       │◀─Summary───── │  Proposal analysis, risks │
  └─────────────────┘               └──────────────────────────┘

  ┌─────────────────┐               ┌──────────────────────────┐
  │ Partner Sales   │──Outreach──▶  │  Partner Intelligence     │
  │ Pipeline        │◀─Research──── │  Company research, fit    │
  └─────────────────┘               └──────────────────────────┘
```

### Implementation: Consent Explainer (Python)

```python
import anthropic
import json
from typing import Optional

client = anthropic.Anthropic()

def explain_consent_event(
    event_type: str,
    requester_name: str,
    genomic_scope: str,
    royalty_amount_usdc: float,
    duration_days: int,
    purpose: str,
    holder_pseudonym: Optional[str] = None
) -> str:
    """
    Generate a plain-language explanation of a consent/access event
    for a genome holder. Uses streaming for responsive UI display.
    """

    prompt = f"""You are a helpful, plain-language explainer for DNaI, a genomic sovereignty platform.
A genome holder needs to understand what just happened with their genomic data.

Event details:
- Event type: {event_type}
- Requester: {requester_name}
- Data scope accessed: {genomic_scope}
- Royalty earned: ${royalty_amount_usdc:.2f} USDC
- Access duration: {duration_days} days
- Stated purpose: {purpose}

Write a clear, non-technical explanation (3-4 sentences) that:
1. Tells them exactly what happened in plain language
2. Confirms their data was used WITH their consent and remains encrypted
3. Notes the royalty they earned
4. Reminds them they can revoke access at any time

Do not use jargon. Be warm but informative. Do not exceed 150 words."""

    with client.messages.stream(
        model="claude-opus-4-8",
        max_tokens=300,
        thinking={"type": "adaptive"},
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        full_text = ""
        for text in stream.text_stream:
            full_text += text
        return full_text


def analyze_governance_proposal(proposal_text: str, on_chain_context: dict) -> dict:
    """
    Analyze a DAO governance proposal for risks, benefits, and vote recommendation.
    Uses adaptive thinking for complex governance reasoning.
    """

    context_str = json.dumps(on_chain_context, indent=2)

    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=2000,
        thinking={"type": "adaptive"},
        messages=[{
            "role": "user",
            "content": f"""You are the DNaI DAO governance analyst. Analyze this governance proposal.

ON-CHAIN CONTEXT:
{context_str}

PROPOSAL TEXT:
{proposal_text}

Provide a structured analysis with:
1. SUMMARY: One paragraph plain-language summary
2. RISKS: Bullet list of risks (technical, financial, regulatory, community)
3. BENEFITS: Bullet list of expected benefits
4. PRECEDENT: Any relevant precedents from other genomic/DeFi DAOs
5. RECOMMENDATION: SUPPORT / OPPOSE / ABSTAIN with rationale
6. SUGGESTED_AMENDMENTS: Any modifications that would improve the proposal

Return as JSON matching this schema:
{{
  "summary": "string",
  "risks": ["string"],
  "benefits": ["string"],
  "precedent": "string",
  "recommendation": "SUPPORT|OPPOSE|ABSTAIN",
  "recommendation_rationale": "string",
  "suggested_amendments": ["string"]
}}"""
        }]
    )

    # Extract JSON from response
    for block in response.content:
        if block.type == "text":
            return json.loads(block.text)

    raise ValueError("No text response from Claude")


def generate_partner_research(
    company_name: str,
    company_website: str,
    use_case: str
) -> dict:
    """
    Research a potential AI partner company and generate outreach intelligence.
    """

    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1500,
        thinking={"type": "adaptive"},
        messages=[{
            "role": "user",
            "content": f"""Research the AI company "{company_name}" (website: {company_website}) 
as a potential partner for DNaI's AI training data marketplace.

The proposed use case is: {use_case}

Provide:
1. COMPANY_OVERVIEW: Brief description of what they do
2. GENOMIC_AI_ACTIVITY: Their current genomic AI work and datasets they use
3. BUDGET_SIGNALS: Public funding, revenue, or budget signals for data acquisition
4. KEY_CONTACTS: Likely decision-maker roles/titles (not names — just roles)
5. FIT_SCORE: 1-10 score for DNaI partnership potential with rationale
6. OUTREACH_ANGLE: The most compelling angle to open a partnership conversation
7. RISK_FLAGS: Any reasons this partnership might be problematic

Return as JSON."""
        }]
    )

    for block in response.content:
        if block.type == "text":
            return json.loads(block.text)

    raise ValueError("No response from Claude")
```

### Integration Points by DNaI Surface

| DNaI Surface | Claude Role | Model | Streaming |
|-------------|------------|-------|-----------|
| Genome Holder Dashboard | Consent event explainer | claude-opus-4-8 | Yes |
| Enterprise Partner Portal | Compliance Q&A, contract interpretation | claude-opus-4-8 | Yes |
| DAO Governance UI | Proposal analysis, vote summaries | claude-opus-4-8 | No (batch) |
| Partner Sales Pipeline | Company research, outreach drafting | claude-opus-4-8 | No (batch) |
| Regulatory Agent | HIPAA/GDPR/FDA analysis | claude-opus-4-8 | No (batch) |
| Customer Support | Genomic data rights explanation | claude-opus-4-8 | Yes |
| Phase I Agents | Architecture/token/legal research | claude-opus-4-8 | No (batch) |

---

## 8. AI Ethics and Governance

### Ethical Framework

DNaI's AI ethics framework is codified in smart contract constraints, auditable on-chain, and governed by the DAO. Ethics is not a policy document — it is protocol-enforced.

### Core Ethical Principles (Protocol-Enforced)

**1. Genomic Data Sovereignty**
- No AI training occurs without explicit, granular consent
- Consent can be revoked at any time, with immediate effect on active licenses
- Smart contract enforcement: `ConsentOracle.verifyConsentForFL()` runs before every FL round

**2. Differential Privacy by Default**
- Every training run applies minimum DP (ε ≤ 8.0)
- DP budget is tracked per genome, per license, on-chain
- Genome holders can set their own maximum ε threshold

**3. Bias Monitoring and Reporting**
- All marketplace models must include training demographic breakdown
- Ancestry imbalance flags (< 5% any major ancestry group) block listing
- Quarterly on-chain bias reports for listed models

**4. Prohibited Uses (Hardcoded in Protocol)**
- Genetic discrimination (insurance, employment)
- Law enforcement identification without warrant
- Military targeting applications
- Re-identification of pseudonymized data
- Germline editing optimization

```solidity
// ProhibitedUseRegistry.sol (excerpt)
mapping(bytes32 => bool) public prohibitedUsePurposes;

constructor() {
    prohibitedUsePurposes[keccak256("INSURANCE_DISCRIMINATION")] = true;
    prohibitedUsePurposes[keccak256("EMPLOYMENT_SCREENING")] = true;
    prohibitedUsePurposes[keccak256("LAW_ENFORCEMENT_ID")] = true;
    prohibitedUsePurposes[keccak256("MILITARY_TARGETING")] = true;
    prohibitedUsePurposes[keccak256("GERMLINE_OPTIMIZATION")] = true;
}

function isPermittedPurpose(string calldata purpose) external view returns (bool) {
    return !prohibitedUsePurposes[keccak256(bytes(purpose))];
}
```

### EU AI Act Compliance (Article 6 — High Risk)

DNaI's genomic AI systems fall under the EU AI Act's **high-risk** classification (Annex III, Category 5: biometric systems). Compliance requirements:

| Requirement | DNaI Implementation | Status |
|------------|--------------------|----|
| Risk management system | DAO-governed risk register, quarterly review | Phase I design |
| Data governance | On-chain consent registry, ZK audit trail | Phase II build |
| Technical documentation | Automated from on-chain model provenance | Phase III |
| Transparency to users | Consent explainer (Claude integration) | Phase II build |
| Human oversight | DAO vote required for high-risk model categories | Phase III |
| Accuracy, robustness | Mandatory benchmark attestation for marketplace | Phase IV |
| Conformity assessment | Third-party AI auditor partnership | Phase III |

### Governance: DAO AI Ethics Committee

- **Composition:** 7 elected seats (3 genome holders, 2 AI researchers, 1 legal expert, 1 patient advocate)
- **Powers:** Model listing approval/rejection, prohibited use updates, DP parameter minimums
- **Quorum:** 5/7 for standard motions; 6/7 for prohibited use list changes
- **Review cadence:** Quarterly model audits; urgent review within 72 hours of reported violation

### Genetic Non-Discrimination Compliance

| Jurisdiction | Law | DNaI Compliance Mechanism |
|-------------|-----|--------------------------|
| United States | GINA (Genetic Information Nondiscrimination Act) | Prohibited use registry + license terms |
| European Union | GDPR Article 9 + EU AI Act | Consent oracle + DPA |
| Canada | GNDA (Genetic Non-Discrimination Act) | License prohibition clause |
| Australia | Privacy Act + Disability Discrimination Act | Scope restriction |

---

## 9. Phase-by-Phase AI Revenue

### Phase I (July 1 – August 15, 2026): AI Foundation
**Revenue:** $0 (setup)
**AI Deliverables:**
- [ ] AI and Computation Framework specification (this document)
- [ ] `FederatedLearningLicense.sol` specification complete
- [ ] Target AI partner shortlist: top 10 companies with contact strategy
- [ ] FL framework selection (Flower vs. PySyft evaluation)
- [ ] TEE vendor evaluation (Intel SGX vs. AMD SEV vs. AWS Nitro)
- [ ] Claude integration architecture specified
- [ ] AI ethics framework drafted and included in legal review

**Partner Outreach Initiated:**
- DeepMind (AlphaFold team) — genome-phenotype correlation use case
- Tempus AI — oncology genomic interpretation
- Recursion Pharmaceuticals — drug discovery FL pilot
- Insilico Medicine — aging genomics
- BioNTech Digital — mRNA optimization

### Phase II (August 16 – October 1, 2026): First AI Revenue
**Revenue Target:** $25,000 (1 FL pilot agreement)
**AI Deliverables:**
- [ ] FL orchestration layer MVP (Flower + DNaI consent oracle)
- [ ] TEE local compute worker v0.1 (Intel SGX)
- [ ] `FederatedLearningLicense.sol` deployed to Sepolia testnet
- [ ] FL pilot with 1 AI company — closed beta (100 genome participants)
- [ ] DP noise injection library integrated and audited
- [ ] **First FL license sold — $25,000 USDC**
- [ ] Inference API v0.1 — internal only (not public)
- [ ] Claude consent explainer integrated into beta dashboard

**Phase II AI Revenue Waterfall:**
```
FL Pilot License (1 × $25,000)         = $25,000 (one-time)
Protocol fee retained (15%)            =  $3,750
Genome holder royalties (80%)          = $20,000 → distributed
DAO treasury (5%)                      =  $1,250
```

### Phase III (October 2 – November 15, 2026): AI Revenue Scale
**Revenue Target:** $50,000–$200,000/month
**AI Deliverables:**
- [ ] Inference API public beta launch (`drug-response`, `disease-risk`, `ancestry`)
- [ ] Enterprise API subscription packages active
- [ ] FL orchestration supporting 1,000+ genome participants
- [ ] AI model marketplace MVP (Phase III — listing + browse, not full auction)
- [ ] First 3 marketplace model listings by external AI companies
- [ ] Claude governance integration live (proposal analysis)
- [ ] EU AI Act high-risk compliance documentation filed

**Phase III AI Revenue Waterfall (Monthly Projection):**
```
Enterprise FL licenses (2 × $25K/month avg)    = $50,000
Inference API revenue (39,500/month)            = $39,500
AI model marketplace listing fees (3 models)   =  $5,000
Compliance certification (AI model audits)     = $15,000
                                   TOTAL MRR   = $109,500
```

### Phase IV (November 16 – December 1, 2026): AI Marketplace Activation
**Revenue Target:** $50,000+ MRR (initial), scaling to $400,000+/month
**AI Deliverables:**
- [ ] Full AI model marketplace launch (listing, search, auction, licensing)
- [ ] Federated learning open to all licensed AI companies (not just pilots)
- [ ] Inference API public (no whitelist) with rate-limiting by tier
- [ ] Per-inference royalty distribution to contributing genome holders
- [ ] DAO AI Ethics Committee first formal governance vote
- [ ] Series A narrative: genomic AI TAM, DNaI market position, AI revenue run rate

**Phase IV AI Revenue Waterfall (Month 1 Projection):**
```
FL licenses: 5 enterprise × $20K/month avg     = $100,000
Inference API: 500K calls × $0.05 avg          =  $25,000
Marketplace listing fees                        =  $10,000
Marketplace transaction fees (15%)             =  $20,000
AI model audit/certification                   =  $15,000
                                   TOTAL MRR   = $170,000

→ Scaling to $400K+ MRR by Q1 2027 (20 FL licenses + 2M API calls/month)
```

### AI Revenue KPI Tracker

| KPI | Phase I | Phase II | Phase III | Phase IV |
|-----|---------|----------|-----------|----------|
| FL Licenses Issued | 0 | 1 | 5 | 20+ |
| Inference API Calls/Month | 0 | 0 | 500K | 2M+ |
| Marketplace Model Listings | 0 | 0 | 3 | 20+ |
| AI Partner Companies | 0 | 1 | 5 | 20+ |
| Genome Holders Earning AI Royalties | 0 | 100 | 3,000 | 25,000+ |
| AI MRR | $0 | $25K (one-time) | $109K | $170K–$400K |
| Cumulative AI Revenue | $0 | $25K | $220K | $590K+ |

---

## Appendix A: Technology Stack — AI Layer

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| FL Framework | Flower (flwr) 1.x | Mature, production-tested, TEE-compatible |
| TEE Runtime | Intel SGX + AWS Nitro Enclaves | Best cloud ecosystem support |
| DP Library | Google DP library + Opacus (PyTorch) | Battle-tested, DP accounting |
| Gradient Aggregation | Custom Rust aggregator | Performance at scale |
| ZK Consent Proofs | Noir (Aztec) circuits | Genomic range proofs, fast proving |
| Inference Runtime | ONNX Runtime + Rust API layer | Cross-framework model serving |
| Model Registry | IPFS + on-chain hash attestation | Decentralized, tamper-evident |
| AI Reasoning Layer | Claude (`claude-opus-4-8`) | Adaptive thinking, streaming |
| Smart Contracts | Solidity + Foundry | `FederatedLearningLicense.sol`, auditable |

---

## Appendix B: Security Considerations for AI Compute

### Threat Model: AI-Specific Attacks

| Attack Vector | Description | Mitigation |
|-------------|-------------|-----------|
| **Model Inversion** | Attacker reconstructs training data from model weights | DP noise injection; gradient clipping |
| **Membership Inference** | Attacker determines if specific genome was in training set | DP guarantees (ε ≤ 8.0); minimum cohort size (n ≥ 50) |
| **Gradient Leakage** | Gradient updates leak individual-level information | TEE execution; gradient compression; DP |
| **Byzantine Attack** | Malicious FL participant sends poisoned gradients | Krum aggregation; anomaly detection on gradients |
| **Sybil Attack** | Attacker creates many fake genome holders to control training | Token-bound participation; stake-weighted contribution |
| **License Fraud** | AI company trains beyond license scope | Smart contract enforcement; on-chain epoch counter |
| **Re-identification** | Aggregate statistics used to re-identify individuals | Minimum cell size thresholds; DP suppression |

### Security Audit Requirements (AI Components)

- `FederatedLearningLicense.sol`: Trail of Bits audit (Phase II)
- TEE attestation pipeline: Intel PSIRT review
- DP implementation: Differential privacy expert review (likely Damien Desfontaines or Google DP team)
- Gradient aggregator: Independent cryptographic review

---

*Last updated: July 1, 2026 — Cloud Control LLC, DNaI Project*
*Author: AI & Computation Agent*
*Next review: Phase II kickoff (August 16, 2026)*
*Maintained by: everett@cloudcontrolllc.com*
