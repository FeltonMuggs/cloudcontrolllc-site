# DNaI Tokenized Marketplace Mechanics
**Cloud Control LLC — Project DNaI**
**Document Version:** 0.1.0
**Status:** Phase I Draft
**Date:** July 1, 2026
**Phase:** I — Foundation
**Classification:** Internal — Engineering + Business Development

---

## Table of Contents

1. [Marketplace Architecture Overview](#1-marketplace-architecture-overview)
2. [Data Scope Taxonomy](#2-data-scope-taxonomy)
3. [Listing Mechanics](#3-listing-mechanics)
4. [Buyer Access Request Flow](#4-buyer-access-request-flow)
5. [Dutch Auction Mechanics](#5-dutch-auction-mechanics)
6. [Pricing Engine](#6-pricing-engine)
7. [Marketplace Smart Contracts](#7-marketplace-smart-contracts)
8. [Marketplace UI/UX](#8-marketplace-uiux)
9. [Anti-Abuse and Quality Controls](#9-anti-abuse-and-quality-controls)
10. [Marketplace Revenue Projections](#10-marketplace-revenue-projections)

---

## 1. Marketplace Architecture Overview

### 1.1 System Design Principles

The DNaI Genomic Marketplace is a two-sided exchange where genome holders supply access to cryptographically-gated data scopes, and pharma companies, research institutions, and AI companies demand that access. The architecture is built on three non-negotiable constraints:

- **Sovereignty is not for sale.** The soulbound DNaI token never changes hands. What is listed, priced, and transacted is a time-bound, scope-limited access right — not the genome itself.
- **Settlement is on-chain. Discovery is off-chain.** Consent enforcement, royalty distribution, and access authorization happen via smart contracts with cryptographic finality. Browsing, filtering, and cohort building happen via an off-chain order book backed by indexed data from The Graph.
- **No buyer ever receives raw genomic data by default.** ZK proof attestations allow buyers to verify genomic properties and receive encrypted key fragments. Raw sequence delivery requires explicit full-genome consent scope and is subject to the highest buyer vetting tier.

### 1.2 Supply Side: Genome Holders

A genome holder who has minted a DNaI token controls a cryptographically-sealed vault containing their genomic data partitioned into scope-specific sub-packages (each encrypted with a different derived key). Supply-side participation is voluntary and granular:

- A holder can list one scope without listing others (e.g., ANCESTRY only, never DISEASE_RISK)
- Each scope listing carries an independent price floor, duration cap, and maximum concurrent buyer count
- Listings are revocable at any time; revocation takes effect on the next block
- Holders who do not list any scope remain invisible to the marketplace but retain full sovereignty and DAO voting rights

Supply-side onboarding flow:

```
1. Holder connects wallet → DNaI client confirms token ownership
2. Holder selects scope(s) to list
3. Client-side: for each scope, computes sub-package key fragment (KWAT template)
4. Holder sets price floor, duration options, maxBuyers per scope
5. listAccess() transaction signed and submitted
6. Off-chain indexer (The Graph) picks up Listed event → listing appears in discovery UI
```

Supply-side aggregation targets (from revenue model):

| Phase | Active Genome Holders | Listing Participation Rate | Active Listings |
|-------|----------------------|--------------------------|----------------|
| Phase II | 1,000 | 10% (pilot participants) | 100 |
| Phase III | 10,000 | 30% | 3,000 |
| Phase IV | 50,000 | 35% | 17,500 |

### 1.3 Demand Side: Buyers

Three buyer personas drive marketplace demand with different purchasing patterns:

**Pharmaceutical Companies** (e.g., Pfizer, Roche, AstraZeneca)
- Typical purchase: VARIANT_PANEL or DISEASE_RISK cohort access for a specific trial indication
- Transaction size: $5,000–$500,000 per cohort access agreement
- Duration: 90-day or annual terms
- Require: KYB verification, data use agreement, IRB documentation for human subjects research

**Academic and Government Research Institutions** (e.g., NIH, Broad Institute, UK Biobank partners)
- Typical purchase: ANCESTRY, VARIANT_PANEL, or LONGITUDINAL access for population studies
- Transaction size: $1,000–$50,000 per cohort
- Duration: Annual or multi-year
- Require: KYB verification, IRB protocol number, institutional affiliation verification

**AI and Biotech Companies** (e.g., Tempus, Recursion, DeepMind Health, Insilico Medicine)
- Typical purchase: FULL_GENOME or VARIANT_PANEL cohorts for model training, with AI_TRAINING use scope
- Transaction size: $10,000–$5,000,000 per training dataset license
- Duration: Perpetual-for-version or annual re-licensing
- Require: KYB verification, model training consent scope explicitly selected, 3× AI training premium applied

Buyer registration flow:

```
1. Organization registers at marketplace.dnai.io/buyer
2. KYB verification: company name, jurisdiction, use case, IRB/ethics board documentation
3. Protocol smart contract: buyer address added to verified buyer registry
4. Buyer can now submit access requests and build cohorts
5. Enterprise buyers (>$100K/year spend) assigned dedicated account manager
```

### 1.4 Clearing Mechanism

The marketplace supports two distinct clearing mechanisms depending on listing type:

**Instant-Buy at Listed Price**
Used for: standard single-genome or small cohort access where buyer accepts the listed floor price.

```
Buyer submits accessRequest(tokenId[], scope, duration, price)
→ Contract validates: price ≥ floor, consent scope covered, buyer verified
→ USDC transfer + consent grant + KWAT delivery: single atomic transaction
→ Royalty distribution triggered at settlement
```

**Dutch Auction for Rare Variant Cohorts**
Used for: high-demand, scarce variant cohorts (e.g., specific disease predisposition genotypes with MAF < 0.1%, multi-generational longitudinal sets).

```
Buyer posts auction request: scope, criteria, startPrice, minPrice, duration
→ Protocol assembles matching cohort from willing participants
→ Price decays on Dutch auction curve over 24–72 hours
→ Cohort clears when price reaches holder-floor intersection
→ All matched holders receive the same clearing price (uniform price auction)
```

The choice of mechanism is determined by cohort scarcity score (computed by the pricing engine at listing time):

| Scarcity Score | Clearing Mechanism | Typical Cohort |
|---------------|-------------------|----------------|
| 0–60 | Instant-Buy | Common variants, ancestry, standard panels |
| 61–85 | Instant-Buy with cohort premium | Less common variants, rare conditions |
| 86–100 | Dutch Auction | Ultra-rare variants, exclusive longitudinal cohorts |

### 1.5 Off-Chain Order Book and On-Chain Settlement

The hybrid architecture separates the cost-intensive discovery workload from the trust-requiring settlement workload:

**Off-Chain Order Book (Discovery Layer)**
- Powered by The Graph subgraph indexing all `Listed`, `Delisted`, `PriceUpdated`, and `CohortFormed` events
- Buyer-facing REST/GraphQL API for filtering listings by scope, ancestry metadata, condition flags, price, cohort size
- Order matching engine runs off-chain (Rust service) and assembles cohort proposals before submitting to chain
- Listing metadata searchable without revealing any genome content: only ZK-attested properties are exposed

**On-Chain Settlement (Trust Layer)**
- `GenomicMarketplace.sol` holds the definitive state: active listings, access grants, auction state
- All consent grants, royalty payments, and access key delivery happen atomically in a single transaction
- No buyer can receive data access without an on-chain consent grant record
- No genome holder can be paid without an on-chain royalty distribution record
- The Graph indexes settlement events for the audit trail product

The separation means: the off-chain layer can fail, be upgraded, or be replaced without any data access being forfeited or any royalty being lost. The on-chain layer is the source of truth.

```
                    OFF-CHAIN ORDER BOOK
┌────────────────────────────────────────────────────────┐
│  The Graph Subgraph                                    │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Listing Index  │  │ Buyer Search │  │ Cohort    │  │
│  │ (scope, price, │  │ API (filter, │  │ Assembly  │  │
│  │  metadata)     │  │  sort, page) │  │ Engine    │  │
│  └───────┬────────┘  └──────────────┘  └─────┬─────┘  │
│          │          Read only (no trust)      │        │
└──────────┼──────────────────────────────────-┼────────┘
           │ Events                             │ Cohort proposal
           │                                   ▼
                            ON-CHAIN SETTLEMENT
┌──────────────────────────────────────────────────────────┐
│  GenomicMarketplace.sol                                  │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────┐  │
│  │ Listing      │  │ Access Request │  │ Dutch       │  │
│  │ Registry     │  │ Queue          │  │ Auction     │  │
│  └──────────────┘  └────────────────┘  └─────────────┘  │
│                                                          │
│  ConsentRegistry.sol    RoyaltyDistributor.sol           │
│  (consent grants)       (USDC splits)                    │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Data Scope Taxonomy

### 2.1 Purchasable Scopes

The marketplace defines seven purchasable data scopes, activated across protocol phases. Each scope maps to a distinct sub-package in the encrypted vault, encrypted with a separate derived key so granting one scope never exposes another.

| Scope ID | Name | Phase Active | Base Price Range | Description |
|----------|------|-------------|-----------------|-------------|
| `VARIANT_PANEL` | Variant Panel | Phase II+ | $75–$150/genome/month | A pre-defined set of variants (SNP panel, pharmacogenomic markers, or custom panel agreed in data use agreement). Does not include full sequence. Typical panel: 500K SNPs from 1000 Genomes Phase 3 set or a targeted gene list (e.g., BRCA1/2, CYP2D6, TPMT). |
| `ANCESTRY` | Ancestry Composition | Phase II+ | $50–$100/genome/month | Ancestry composition percentages by population, haplogroup assignment, and migration pattern data. No disease-relevant variants included. Derived from ancestry-informative marker (AIM) subset of the SNP panel. |
| `DISEASE_RISK` | Polygenic Disease Risk | Phase II+ | $150–$300/genome/month | Computed polygenic risk scores (PRS) for specific conditions named in the consent grant. No raw sequence delivered; only score values and confidence intervals. PRS models must be published (e.g., PGS Catalog) and cited in data use agreement. |
| `DRUG_RESPONSE` | Pharmacogenomics | Phase II+ | $100–$200/genome/month | Pharmacogenomic markers for drug metabolism (CYP2D6, CYP2C19, TPMT, DPYD, VKORC1, and SLCO1B1 per CPIC guidelines). Phenotype predictions (poor/intermediate/normal/ultrarapid metabolizer) derived, not raw diplotypes. |
| `FULL_GENOME` | Full Genome Sequence | Phase III+ | $300–$500/genome/month | Complete whole-genome sequence delivery as encrypted VCF/FASTQ. Highest buyer vetting tier required. Maximum privacy surface. Requires explicit holder consent, KYB for buyer, and data use agreement countersigned by DNaI protocol counsel. |
| `LONGITUDINAL` | Longitudinal Access | Phase III+ | 1.5× base per additional year | Access to temporally-ordered genomic and phenotypic data from a holder who has provided multiple data points over time. Requires holder to opt into the LONGITUDINAL scope explicitly and provide updated vault contributions at agreed intervals (annual minimum). |
| `MICROBIOME` | Microbiome (Phase IV) | Phase IV | $50–$150/genome/month | 16S rRNA or shotgun metagenomic microbiome data. Separate vault sub-package. Positioned as a multi-omics expansion scope alongside the core genomic vault. Requires separate sequencing provider integration and holder consent. |

### 2.2 Searchable Metadata (Without Exposing Genome)

The off-chain discovery layer exposes metadata that allows buyers to filter listings without seeing any raw genomic data. All metadata fields are either:
- (a) Directly attested by the sequencing provider at mint time (quality score, sequencing type), or
- (b) Derived from ZK proofs generated by the holder (ancestry bins, condition flags)

Buyers search across the following metadata fields:

| Metadata Field | Type | Source | Example Values |
|---------------|------|--------|---------------|
| `ancestryBins` | Enum array (multi-select) | ZK proof (ancestry range circuit) | `["EUR_25-50%", "AFR_0-25%"]` |
| `conditionFlags` | Binary flag map | ZK proof (variant presence circuit) | `{"T2D_risk_elevated": true, "BRCA1_pathogenic": false}` |
| `ageRangeBin` | Enum | ZK proof (demographic attestation) | `"35-44"`, `"45-54"` |
| `sequencingType` | Enum | Sequencing provider signature at mint | `"WGS_30x"`, `"WES_100x"`, `"SNP_ARRAY_500K"` |
| `sequencingQualityScore` | Integer (0–100) | Sequencing provider signature | `94` (Q30 bases percentage × coverage score) |
| `referenceGenome` | Enum | Vault manifest (on-chain) | `"GRCh38"` |
| `scopesAvailable` | Scope array | On-chain listing registry | `["VARIANT_PANEL", "ANCESTRY"]` |
| `priceFloor` | USDC (per genome/month) | On-chain listing | `150` |
| `maxDuration` | Months | On-chain listing | `12` |
| `longitudinalYears` | Integer | ZK proof (temporal attestation) | `4` (if LONGITUDINAL scope listed) |

**Critical privacy property:** `conditionFlags` are binary (present/absent) and never reveal raw variant data. A flag entry `T2D_risk_elevated: true` means the holder has confirmed via ZK proof that their PRS for Type 2 Diabetes exceeds a published threshold. The specific score value, the underlying SNPs, and the exact risk magnitude are not disclosed.

Ancestry bins use percentage ranges rather than exact values to prevent reverse-engineering of specific variants from ancestry data. Bins are defined as: 0–25%, 25–50%, 50–75%, 75–100%.

### 2.3 ZK Proof Attestations for Metadata Accuracy

Each searchable metadata field exposed in the discovery layer must be backed by a ZK proof or a verified sequencing provider signature. Buyers can verify these attestations before purchasing; the marketplace UI displays attestation status for each field.

**Attestation Registry on-chain:**

```solidity
struct MetadataAttestation {
    uint256 tokenId;
    bytes32 fieldKey;        // keccak256 of metadata field name
    bytes32 fieldValueHash;  // keccak256 of attested value (e.g., ancestry bin)
    bytes   zkProof;         // Noir proof bytes (or provider signature for non-ZK fields)
    uint256 attestedAt;      // block.timestamp
    uint256 validUntil;      // 0 = perpetual; set for time-sensitive attestations
    bool    active;
}

mapping(uint256 => MetadataAttestation[]) public tokenAttestations;
```

**ZK circuits used for metadata attestation:**

| Metadata Field | ZK Circuit | Public Output | Private Input |
|---------------|-----------|---------------|---------------|
| `ancestryBins` | `AncestryRangeProof` | `population_label`, `min_pct_bin`, `genome_commitment` | Full admixture vector |
| `conditionFlags` | `VariantPresenceProof` | `flag_name_hash`, `flag_value (bool)`, `genome_commitment` | Full SNP vector |
| `ageRangeBin` | `DemographicRangeProof` | `age_bin`, `dob_commitment` | Date of birth + identity attestation |
| `sequencingQualityScore` | Provider ECDSA signature | `quality_score`, `sequencing_date`, `provider_address` | None (provider-signed) |

Attestations expire and must be refreshed when a holder updates their vault or when the sequencing provider's verification signature rotates (annual by default). Expired attestations display a warning badge in the discovery UI and are deprioritized in search rankings.

---

## 3. Listing Mechanics

### 3.1 The `listAccess` Function

A genome holder lists their data by calling `listAccess()` on `GenomicMarketplace.sol`. This registers the holder's willingness to accept access requests for a specific scope under defined terms.

```solidity
/// @notice List genomic data access for a specific scope.
/// @param tokenId    The DNaI token representing the holder's genome
/// @param scope      Data scope being listed (enum DataScope)
/// @param priceFloor Minimum USDC per genome per 30 days (6 decimals; e.g., 150_000000 = $150)
/// @param maxBuyers  Maximum concurrent active access grants for this listing
/// @param duration   Duration options offered (encoded as bitmask: 1=30d, 2=90d, 4=180d, 8=365d)
/// @param recurring  Whether to accept subscription renewals automatically
function listAccess(
    uint256  tokenId,
    DataScope scope,
    uint256  priceFloor,
    uint8    maxBuyers,
    uint8    duration,
    bool     recurring
) external returns (bytes32 listingId);
```

**Input validation:**
- Caller must be `ownerOf(tokenId)` — enforced by `GenomicMarketplace.sol` calling `DNaIToken.ownerOf()`
- `scope` must be a valid enum value and must have an active ZK attestation in the MetadataAttestation registry
- `priceFloor` must be ≥ the protocol-enforced minimum floor for the scope (see Section 6.1)
- `maxBuyers` ceiling: 1–500 concurrent buyers per scope per genome (protocol-enforced max: 500)
- The same `tokenId + scope` combination can have only one active listing at a time

**Listing struct on-chain:**

```solidity
struct Listing {
    uint256   tokenId;
    address   owner;
    DataScope scope;
    uint256   priceFloor;   // USDC per genome per 30 days, 6 decimals
    uint8     maxBuyers;
    uint8     durationMask; // Bitmask of accepted duration options
    bool      recurring;
    bool      active;
    uint256   createdAt;
    uint256   activeBuyers; // Current concurrent access grants
}

mapping(bytes32 => Listing) public listings;
// listingId = keccak256(tokenId, scope, createdAt)
```

### 3.2 Subscription Listings: Recurring vs. One-Time

**One-time access:**
- Buyer pays once for the agreed duration
- At expiry, access terminates automatically (no renewal)
- Use case: spot research query, clinical trial phase data window, model training run

**Subscription (recurring monthly):**
- Holder sets `recurring = true` in the listing
- Buyer's first payment activates the access grant
- At each 30-day renewal mark, the smart contract checks:
  - Is the Superfluid stream (or pre-authorized USDC approval) still active?
  - Has the holder not revoked the listing?
  - Has the buyer not been blocklisted?
- If checks pass: access auto-renews and royalties are distributed for the new period
- If any check fails: access lapses without manual intervention

Subscription accounting uses Superfluid Protocol USDCx streams for continuous payment:

```
Buyer opens Superfluid stream to GenomicMarketplace.sol
Flow rate = (priceFloor × 12) / (365 × 24 × 3600) USDC per second
Stream is monitored by ConsentRegistry via Superfluid SuperApp hook
If stream stops → ConsentRevoked event emitted → access terminates
```

For non-Superfluid buyers (enterprise, pharma), subscription is implemented via a pre-authorized USDC allowance pulled monthly by a Chainlink Automation job:

```
Buyer approves USDC.approve(marketplace, priceFloor × numberOfMonths)
Chainlink Automation job: every 30 days, calls marketplace.renewSubscription(grantId)
→ Pulls USDC from buyer → distributes royalties → extends grant expiry by 30 days
```

### 3.3 Cohort Listings: Aggregate Access to Multiple Genomes

Cohort listings aggregate access to 100 or more genomes matching buyer-specified criteria. They are assembled by the protocol's off-chain cohort engine and submitted as a single batch transaction.

**Cohort formation process:**

```
1. Buyer specifies cohort criteria:
   - scope: VARIANT_PANEL
   - conditionFlags: { T2D_risk_elevated: true }
   - ancestryBins: ["EUR_25-50%"]
   - minCohortSize: 150
   - maxCohortSize: 300
   - priceOffer: $180/genome/month
   - duration: 90 days

2. Cohort engine (off-chain):
   - Queries The Graph for active listings matching criteria
   - Filters: priceFloor ≤ priceOffer, scope = VARIANT_PANEL, attestations valid
   - Ranks candidates by: attestation freshness, quality score, price floor
   - Selects top N candidates up to maxCohortSize

3. Protocol submits cohort for consent:
   - Holders in the cohort receive wallet notification
   - Holders have 48-hour window to opt out of this specific cohort
     (without affecting their general listing)
   - Remaining holders form the final cohort

4. If finalCohortSize ≥ minCohortSize:
   - batchAccessRequest(tokenIds[], scope, duration, pricePerGenome) submitted
   - Single transaction grants access to all holders atomically
   - Royalties distributed to all holders simultaneously

5. If finalCohortSize < minCohortSize:
   - Buyer is notified; cohort request fails gracefully
   - No charges; buyer can adjust criteria and retry
```

**Privacy preservation in cohort assembly:**
The cohort engine operates on ZK-attested metadata only. It never accesses raw genomic data to determine cohort membership. A genome holder's inclusion in a cohort can be verified by the buyer without the buyer knowing which specific genomes are in the cohort (cohort membership is disclosed only to permissioned buyers post-access grant). The publicly visible fact is cohort size and aggregate metadata statistics.

**Minimum cohort size floor:** 100 genomes (enforced by contract). Cohorts below 100 can be de-anonymized by a sophisticated buyer through repeated queries; the 100-genome floor is a privacy protection, not a commercial decision.

### 3.4 Price Floor Enforcement

The smart contract enforces a two-tier price floor system:

**Protocol minimum floor** (set by DAO governance, enforced by contract):

| Scope | Protocol Minimum Floor |
|-------|------------------------|
| ANCESTRY | $50/genome/month |
| VARIANT_PANEL | $75/genome/month |
| DRUG_RESPONSE | $100/genome/month |
| DISEASE_RISK | $150/genome/month |
| FULL_GENOME | $300/genome/month |
| LONGITUDINAL | $200/genome/month (base) |
| MICROBIOME | $50/genome/month |

**Holder floor** (set by the holder in `listAccess`, must be ≥ protocol minimum):
The holder's custom floor is the effective floor for their listing. Buyers see the holder floor, not the protocol minimum. Any access request submitted below the holder floor is rejected by the contract without fee.

```solidity
function _validatePrice(
    bytes32 listingId,
    uint256 offeredPrice
) internal view {
    Listing storage listing = listings[listingId];
    require(listing.active, "Marketplace: listing not active");
    require(
        offeredPrice >= listing.priceFloor,
        "Marketplace: price below holder floor"
    );
    require(
        offeredPrice >= protocolMinFloor[listing.scope],
        "Marketplace: price below protocol minimum"
    );
}
```

---

## 4. Buyer Access Request Flow

### 4.1 Access Request Submission

A buyer submits an access request by calling `requestAccess()` on `GenomicMarketplace.sol`. The function is payable; USDC is transferred atomically with consent grant in a single transaction.

```solidity
/// @notice Buyer submits an access request to a specific listing.
/// @param listingId         Target listing (from off-chain discovery)
/// @param scope             Requested data scope (must match listing scope)
/// @param durationDays      Requested duration in days (must be in listing's durationMask)
/// @param priceOffer        USDC offered per genome per 30 days (must be ≥ priceFloor)
/// @param intendedUseHash   keccak256 of the intended use declaration (stored off-chain)
/// @param buyerPubKey       Buyer's public key for KWAT encryption (secp256k1, uncompressed)
/// @param zkProof           Optional: ZK proof for AI_TRAINING scope verification
function requestAccess(
    bytes32  listingId,
    DataScope scope,
    uint32   durationDays,
    uint256  priceOffer,
    bytes32  intendedUseHash,
    bytes    calldata buyerPubKey,
    bytes    calldata zkProof
) external returns (bytes32 grantId);
```

**Intended use declaration:**
Buyers must submit an intended use declaration hashed and stored off-chain (IPFS). The hash anchors the declaration to the on-chain grant, creating an immutable record of what the buyer claimed their use would be. Violation of the declared use constitutes grounds for dispute escalation and buyer blocklisting. Accepted use categories:

| Use Code | Description | Additional Requirements |
|----------|-------------|------------------------|
| `CLINICAL_TRIAL` | Randomized controlled trial data analysis | IRB protocol number required |
| `OBSERVATIONAL_RESEARCH` | Population epidemiology, cohort studies | IRB or ethics board approval |
| `DRUG_DISCOVERY` | Target identification, lead optimization | None beyond KYB |
| `DIAGNOSTIC_DEVELOPMENT` | Developing diagnostic tests or biomarkers | Regulatory clearance pathway disclosure |
| `AI_TRAINING` | Training machine learning / AI models | Triggers 3× AI training premium; model scope declaration required |
| `ANCESTRY_PRODUCT` | Consumer-facing ancestry product | Must not reidentify individuals |
| `INTERNAL_RESEARCH` | Internal company research (non-published) | None beyond KYB |

### 4.2 Smart Contract Validation Sequence

On receipt of `requestAccess()`, the contract executes the following validation checks in order. Each failure reverts the transaction with a descriptive error:

```solidity
function requestAccess(...) external returns (bytes32 grantId) {

    // Step 1: Listing state checks
    Listing storage listing = listings[listingId];
    require(listing.active,              "Marketplace: listing not active");
    require(listing.activeBuyers < listing.maxBuyers, "Marketplace: listing at capacity");

    // Step 2: Scope match
    require(listing.scope == scope,      "Marketplace: scope mismatch");

    // Step 3: Duration validity (must be in listing's duration bitmask)
    require(_isDurationAllowed(listing.durationMask, durationDays),
                                         "Marketplace: duration not offered");

    // Step 4: Price floor enforcement
    _validatePrice(listingId, priceOffer);

    // Step 5: Buyer vetting
    require(verifiedBuyers[msg.sender],  "Marketplace: buyer not KYB verified");
    require(!buyerBlocklist[msg.sender], "Marketplace: buyer is blocklisted");

    // Step 6: FULL_GENOME and DISEASE_RISK require enterprise KYB tier
    if (scope == DataScope.FULL_GENOME || scope == DataScope.DISEASE_RISK) {
        require(enterpriseBuyers[msg.sender],
                                         "Marketplace: scope requires enterprise KYB");
    }

    // Step 7: AI_TRAINING scope requires ZK proof of license scope
    if (intendedUseHash == keccak256("AI_TRAINING")) {
        require(zkProof.length > 0,      "Marketplace: AI_TRAINING requires ZK proof");
        require(zkAITrainingVerifier.verify(zkProof, msg.sender),
                                         "Marketplace: AI_TRAINING proof invalid");
    }

    // Step 8: Rate limit check (max X access grants per genome per month)
    require(
        _monthlyGrantCount(listing.tokenId) < maxGrantsPerGenomePerMonth,
        "Marketplace: genome rate limit exceeded"
    );

    // Step 9: USDC transfer (buyer must have approved marketplace contract)
    uint256 totalPayment = _computePayment(priceOffer, durationDays);
    USDC.transferFrom(msg.sender, address(this), totalPayment);

    // Step 10: Consent registration
    grantId = consentRegistry.grantAccess(
        listing.tokenId,
        msg.sender,
        scope,
        durationDays * 1 days,
        totalPayment
    );

    listing.activeBuyers++;

    emit AccessGranted(listingId, grantId, listing.tokenId, msg.sender, scope, totalPayment);

    // Step 11: Royalty distribution (atomic with consent grant)
    royaltyDistributor.recordAccessPayment(listing.tokenId, msg.sender, totalPayment);
}
```

### 4.3 ZK Proof for Authorized Decryption Key Delivery

After the access grant is recorded on-chain, the buyer receives their Key Wrapped Access Token (KWAT) — a cryptographically-gated decryption key fragment allowing them to decrypt the authorized scope sub-package in the holder's vault.

The KWAT delivery proves to any auditor that:
- The buyer received exactly the scope they paid for
- No raw genomic data passed through any intermediary
- The decryption key is only usable by the buyer's private key

KWAT delivery flow:

```
On-chain event: AccessGranted(listingId, grantId, tokenId, buyer, scope, payment)
                                    │
                                    │ Holder's client monitors own token events
                                    ▼
Holder's client (browser/Tauri app):
1. Detects AccessGranted event for tokenId
2. Derives scope-specific sub-key: DEK_VARIANT_PANEL from master DEK
3. ECDH with buyer's public key (from buyerPubKey in the access request)
4. AES-KeyWrap (RFC 3394): wraps DEK_scope with ECDH shared secret
5. Uploads encrypted KWAT to GenomicMarketplace.sol via deliverKWAT(grantId, kwatBlob)

On-chain: KWAT blob stored in grant record
                                    │
Buyer's client:
1. Reads KWAT blob from on-chain grant record
2. ECDH: own private key + holder's ephemeral public key → shared secret
3. AES-KeyUnwrap: unwrap KWAT → recover DEK_scope
4. Retrieve encrypted vault sub-package from IPFS using chunk CIDs from manifest
5. Decrypt sub-package with DEK_scope → access authorized genomic data
```

The KWAT is generated by the holder's client and uploaded on-chain within the response window (default: 48 hours for manual consent holders; immediate for auto-accept listings). During the delivery window, the buyer's access grant is in `PENDING_KWAT` state and they cannot decrypt anything.

For auto-accept listings (common for recurring subscriptions), the KWAT is pre-generated by the holder's client at listing time and stored encrypted, enabling near-instant delivery on access grant.

### 4.4 Royalty Distribution Triggered Atomically

Royalty distribution is atomic with access grant. In the same transaction as `requestAccess()`, USDC flows to `RoyaltyDistributor.sol`, which immediately executes the fee split:

| Fee Type | Recipient | Share |
|----------|-----------|-------|
| Standard access grant | Genome Holder | 73% |
| Standard access grant | Protocol (Cloud Control LLC) | 20% |
| Standard access grant | DAO Treasury | 7% |
| Auction clearing | Genome Holder | 68% |
| Auction clearing | Protocol | 25% |
| Auction clearing | DAO Treasury | 7% |
| AI Training license | Genome Holder | 63% |
| AI Training license | Protocol | 30% |
| AI Training license | DAO Treasury | 7% |
| Subscription (recurring) | Genome Holder | 75% |
| Subscription (recurring) | Protocol | 18% |
| Subscription (recurring) | DAO Treasury | 7% |

The holder's share accumulates in `pendingRoyalties[tokenId]` and is claimable via `claimRoyalties(tokenId)` at any time. Protocol and DAO shares are transferred immediately to their respective treasury addresses in the same transaction.

---

## 5. Dutch Auction Mechanics

### 5.1 Use Case and Rationale

Dutch auctions clear price-discovery for genomic cohorts where supply is scarce relative to buyer demand. When a specific variant combination has fewer than 1,000 matching genome holders globally, the fair market price cannot be determined from spot listings — the scarcity premium needs to be discovered through competition.

Dutch auctions in the DNaI marketplace invert the standard format: the price starts high and decays over time until buyers are willing to transact. This reflects the economic reality that genome holders are price-inelastic (they will not lower their floor arbitrarily) while buyers are price-sensitive but time-pressured (research timelines are fixed).

### 5.2 Auction Parameters

| Parameter | Description | Default | Governance-Adjustable |
|-----------|-------------|---------|----------------------|
| `startPrice` | Opening price per genome per 30 days | 5× median market price for scope | No (buyer-set) |
| `decayCurve` | Price decay function | Linear over auction duration | Yes |
| `auctionDuration` | Total auction window | 72 hours | Yes (range: 24–168 hours) |
| `minClearingPrice` | Minimum price; auction fails below this | Protocol minimum floor for scope | No |
| `targetCohortSize` | Buyer's desired cohort size | Buyer-specified (min 100) | No |
| `maxCohortSize` | Maximum cohort size for this auction | 10,000 | No |

**Decay curve options (set by buyer at auction creation):**

```
Linear:    price(t) = startPrice - (startPrice - minPrice) × (t / duration)
Quadratic: price(t) = startPrice - (startPrice - minPrice) × (t / duration)²
Step:      price(t) = startPrice × (1 - floor(t / stepInterval) × stepDecrement)
```

Linear decay is the default and most predictable. Quadratic decay front-loads scarcity premium (price drops slowly at first, then rapidly near end). Step decay creates defined price checkpoints that can trigger rapid cohort fill when a step is hit.

### 5.3 Cohort Assembly During Auction

While the auction clock runs, the protocol continuously assembles the matching cohort:

```
Auction clock starts (startPrice posted)
    │
    ├── Price decays per decay curve
    │
    │ At each block (every ~2 seconds on Base):
    │   Protocol checks: which listed holders match buyer criteria AND have priceFloor ≤ current_auction_price?
    │   These holders are "soft-locked" — their listing is reserved for this auction
    │   Holders can opt out of soft-lock via optOutAuction(auctionId) at any time
    │
    ├── As price decays, more holders' price floors are met → cohort grows
    │
    └── Cohort clears when:
        (a) cohortSize ≥ targetCohortSize, OR
        (b) auction duration expires
```

If `cohortSize ≥ targetCohortSize` before auction expires, the auction clears immediately at the current price. If auction expires and `cohortSize < minCohortSize (100)`, the auction fails and no holder is charged.

**Uniform clearing price:** All holders in the final cohort receive the same clearing price — the price at which the targetCohortSize threshold was met. Early-matched holders (whose floor was met when the price was higher) receive the lower clearing price. This creates a fairness property: holders who list at lower floors are not disadvantaged — they receive the same revenue as higher-floor holders.

### 5.4 Solidity Pseudocode: Dutch Auction Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IConsentRegistry.sol";
import "./interfaces/IRoyaltyDistributor.sol";

/// @title DutchAuctionCohort
/// @notice Dutch auction for rare-variant genomic cohort assembly.
///         Integrated into GenomicMarketplace.sol as a module.
contract DutchAuctionCohort {

    // ─── Types ───────────────────────────────────────────────────────────────

    enum AuctionState { ACTIVE, CLEARED, FAILED, CANCELLED }

    enum DecayCurveType { LINEAR, QUADRATIC, STEP }

    struct Auction {
        address      buyer;
        DataScope    scope;
        bytes32      criteriaHash;      // keccak256 of off-chain criteria JSON
        uint256      startPrice;        // USDC per genome per 30 days (6 decimals)
        uint256      minClearingPrice;  // Floor below which auction fails
        uint256      startTime;
        uint256      endTime;
        uint256      targetCohortSize;
        uint256      clearingPrice;     // Set when auction clears; 0 otherwise
        uint256[]    cohortTokenIds;    // Final cleared cohort
        AuctionState state;
        DecayCurveType decayCurve;
        uint256      stepInterval;      // Only for STEP curve; seconds per step
        uint256      stepDecrement;     // Basis points reduction per step
    }

    mapping(bytes32 => Auction) public auctions;
    // auctionId = keccak256(buyer, scope, criteriaHash, startTime)

    // tokenId → auctionId → soft-locked (reserved for this auction)
    mapping(uint256 => mapping(bytes32 => bool)) public softLocked;

    address public consentRegistry;
    address public royaltyDistributor;
    address public usdc;
    address public marketplace;

    uint256 public constant MIN_COHORT_SIZE = 100;
    uint256 public constant MAX_COHORT_SIZE = 10_000;

    // ─── Events ──────────────────────────────────────────────────────────────

    event AuctionCreated(
        bytes32 indexed auctionId,
        address indexed buyer,
        DataScope       scope,
        uint256         startPrice,
        uint256         minClearingPrice,
        uint256         endTime,
        uint256         targetCohortSize
    );

    event AuctionCleared(
        bytes32 indexed auctionId,
        uint256         clearingPrice,
        uint256         cohortSize,
        uint256         totalPayment
    );

    event AuctionFailed(
        bytes32 indexed auctionId,
        uint256         finalCohortSize,
        uint256         reason // 0=below min size, 1=no bids, 2=cancelled
    );

    event HolderSoftLocked(
        bytes32 indexed auctionId,
        uint256 indexed tokenId,
        uint256         holderPriceFloor
    );

    // ─── Auction Creation ─────────────────────────────────────────────────────

    /// @notice Buyer creates a Dutch auction for a rare cohort.
    /// @param scope              Data scope requested
    /// @param criteriaHash       Hash of off-chain criteria JSON (stored on IPFS)
    /// @param startPrice         Opening price (USDC/genome/month, 6 decimals)
    /// @param minClearingPrice   Minimum acceptable clearing price
    /// @param durationSeconds    Auction duration (86400–604800 seconds)
    /// @param targetCohortSize   Desired number of genomes (min 100)
    /// @param decayCurve         Price decay function type
    /// @param depositAmount      USDC deposit: startPrice × targetCohortSize (held in escrow)
    function createAuction(
        DataScope    scope,
        bytes32      criteriaHash,
        uint256      startPrice,
        uint256      minClearingPrice,
        uint256      durationSeconds,
        uint256      targetCohortSize,
        DecayCurveType decayCurve,
        uint256      depositAmount
    ) external returns (bytes32 auctionId) {
        require(targetCohortSize >= MIN_COHORT_SIZE, "Auction: cohort too small");
        require(targetCohortSize <= MAX_COHORT_SIZE, "Auction: cohort too large");
        require(durationSeconds >= 86400 && durationSeconds <= 604800, "Auction: invalid duration");
        require(startPrice > minClearingPrice,       "Auction: start ≤ min");
        require(minClearingPrice >= protocolMinFloor[scope], "Auction: min below protocol floor");

        // Buyer must deposit maximum possible payment upfront (released if auction fails)
        uint256 maxPayment = startPrice * targetCohortSize;
        require(depositAmount >= maxPayment,          "Auction: insufficient deposit");
        IERC20(usdc).transferFrom(msg.sender, address(this), depositAmount);

        auctionId = keccak256(abi.encodePacked(msg.sender, scope, criteriaHash, block.timestamp));

        auctions[auctionId] = Auction({
            buyer:            msg.sender,
            scope:            scope,
            criteriaHash:     criteriaHash,
            startPrice:       startPrice,
            minClearingPrice: minClearingPrice,
            startTime:        block.timestamp,
            endTime:          block.timestamp + durationSeconds,
            targetCohortSize: targetCohortSize,
            clearingPrice:    0,
            cohortTokenIds:   new uint256[](0),
            state:            AuctionState.ACTIVE,
            decayCurve:       decayCurve,
            stepInterval:     0,
            stepDecrement:    0
        });

        emit AuctionCreated(auctionId, msg.sender, scope, startPrice, minClearingPrice,
                           block.timestamp + durationSeconds, targetCohortSize);
    }

    // ─── Price Calculation ────────────────────────────────────────────────────

    /// @notice Compute current auction price based on elapsed time and decay curve.
    function currentPrice(bytes32 auctionId) public view returns (uint256 price) {
        Auction storage auction = auctions[auctionId];
        require(auction.state == AuctionState.ACTIVE, "Auction: not active");

        uint256 elapsed   = block.timestamp - auction.startTime;
        uint256 duration  = auction.endTime - auction.startTime;
        uint256 priceRange = auction.startPrice - auction.minClearingPrice;

        if (elapsed >= duration) return auction.minClearingPrice;

        if (auction.decayCurve == DecayCurveType.LINEAR) {
            // Linear: price = startPrice - priceRange × (elapsed / duration)
            price = auction.startPrice - (priceRange * elapsed / duration);

        } else if (auction.decayCurve == DecayCurveType.QUADRATIC) {
            // Quadratic: price = startPrice - priceRange × (elapsed/duration)²
            // Uses fixed-point arithmetic: multiply by 1e18, then divide
            uint256 t = (elapsed * 1e18) / duration;
            uint256 t2 = (t * t) / 1e18;
            price = auction.startPrice - (priceRange * t2 / 1e18);

        } else {
            // STEP: price decreases by stepDecrement BPS each stepInterval
            uint256 steps = elapsed / auction.stepInterval;
            uint256 totalDecrement = steps * auction.stepDecrement;
            if (totalDecrement > 10_000) totalDecrement = 10_000;
            price = auction.startPrice - (priceRange * totalDecrement / 10_000);
        }

        // Never go below minimum
        if (price < auction.minClearingPrice) price = auction.minClearingPrice;
    }

    // ─── Cohort Soft-Lock (called by off-chain engine via keeper bot) ─────────

    /// @notice Off-chain cohort engine nominates a holder for auction soft-lock.
    ///         Called by the protocol keeper when holder's floor ≤ current auction price.
    /// @dev In production, this is called by a trusted keeper role (Gelato or Chainlink Automation).
    ///      Decentralized: holders can also self-nominate by calling addSelfToAuction().
    function nominateHolder(
        bytes32 auctionId,
        uint256 tokenId
    ) external onlyKeeper {
        Auction storage auction = auctions[auctionId];
        require(auction.state == AuctionState.ACTIVE, "Auction: not active");
        require(!softLocked[tokenId][auctionId],       "Auction: already locked");

        // Verify: this token has an active listing for the auction scope
        bytes32 listingId = activeListingId[tokenId][auction.scope];
        require(listingId != bytes32(0),               "Auction: no active listing");

        Listing storage listing = listings[listingId];
        require(listing.active,                        "Auction: listing not active");
        require(listing.priceFloor <= currentPrice(auctionId),
                                                       "Auction: holder floor above current price");

        softLocked[tokenId][auctionId] = true;
        auction.cohortTokenIds.push(tokenId);

        emit HolderSoftLocked(auctionId, tokenId, listing.priceFloor);

        // Check if target cohort size reached → trigger clearing
        if (auction.cohortTokenIds.length >= auction.targetCohortSize) {
            _clearAuction(auctionId);
        }
    }

    // ─── Auction Clearing ─────────────────────────────────────────────────────

    /// @notice Clear the auction: distribute payments at uniform clearing price.
    ///         Called automatically when targetCohortSize is met, or by keeper at end time.
    function _clearAuction(bytes32 auctionId) internal {
        Auction storage auction = auctions[auctionId];

        uint256 clearing = currentPrice(auctionId);
        uint256 cohortSize = auction.cohortTokenIds.length;

        if (cohortSize < MIN_COHORT_SIZE || clearing < auction.minClearingPrice) {
            // Auction fails: return deposit to buyer
            auction.state = AuctionState.FAILED;
            IERC20(usdc).transfer(auction.buyer, IERC20(usdc).balanceOf(address(this)));
            emit AuctionFailed(auctionId, cohortSize, cohortSize < MIN_COHORT_SIZE ? 0 : 1);
            return;
        }

        auction.clearingPrice = clearing;
        auction.state = AuctionState.CLEARED;

        uint256 totalPayment = clearing * cohortSize;

        // Return excess deposit to buyer
        uint256 deposit = auction.startPrice * auction.targetCohortSize;
        if (deposit > totalPayment) {
            IERC20(usdc).transfer(auction.buyer, deposit - totalPayment);
        }

        // Grant access and distribute royalties to all holders at uniform clearing price
        for (uint256 i = 0; i < cohortSize; i++) {
            uint256 tokenId = auction.cohortTokenIds[i];

            // Grant consent
            IConsentRegistry(consentRegistry).grantAccess(
                tokenId,
                auction.buyer,
                auction.scope,
                30 days,    // Base duration; buyer can renew
                clearing
            );

            // Distribute royalties (auction split: 68% holder, 25% protocol, 7% DAO)
            IRoyaltyDistributor(royaltyDistributor).recordAuctionPayment(
                tokenId,
                auction.buyer,
                clearing
            );

            // Release soft-lock
            softLocked[tokenId][auctionId] = false;
        }

        emit AuctionCleared(auctionId, clearing, cohortSize, totalPayment);
    }

    // ─── Holder Opt-Out ───────────────────────────────────────────────────────

    /// @notice Holder opts out of a specific auction soft-lock.
    ///         Does not affect their general listing status.
    function optOutAuction(bytes32 auctionId) external {
        // Find this holder's token
        uint256 tokenId = IDNaIToken(dnaiToken).tokenOfOwner(msg.sender);
        require(tokenId != 0,                           "Auction: caller has no DNaI token");
        require(softLocked[tokenId][auctionId],         "Auction: not locked in this auction");
        require(auctions[auctionId].state == AuctionState.ACTIVE, "Auction: not active");

        softLocked[tokenId][auctionId] = false;

        // Remove from cohort array
        _removFromCohort(auctionId, tokenId);
    }
}
```

---

## 6. Pricing Engine

### 6.1 Dynamic Floor Pricing

The protocol computes a **recommended floor price** for each scope, updated every 30 days based on trailing demand signals. The recommended floor is advisory — holders can set their own floor above the protocol minimum — but is displayed prominently in the listing UI to help holders price competitively.

**30-day demand signal computation:**

```
DemandSignal(scope) = (accessRequestCount_30d / activeListingCount_30d)
                      × medianRequestedPrice_30d

Where:
  accessRequestCount_30d  = number of successful access grants for scope in last 30 days
  activeListingCount_30d  = average number of active listings for scope in last 30 days
  medianRequestedPrice_30d = median price offered by buyers in last 30 days

RecommendedFloor(scope) = max(
    protocolMinFloor(scope),
    DemandSignal(scope) × 0.85   // 15% discount from median demand price
)
```

The 15% discount from median ensures that holders pricing at the recommended floor are competitively positioned while not underpricing. Holders with rare variant attestations should price above recommended floor using the scarcity premium multiplier.

**Historical recommended floor trajectory (Phase II–IV projections):**

| Scope | Phase II (Pilot) | Phase III (Mainnet) | Phase IV (Scale) |
|-------|-----------------|---------------------|------------------|
| ANCESTRY | $55 | $70 | $90 |
| VARIANT_PANEL | $80 | $120 | $160 |
| DRUG_RESPONSE | $110 | $150 | $200 |
| DISEASE_RISK | $160 | $220 | $300 |
| FULL_GENOME | $320 | $400 | $500 |
| LONGITUDINAL (base) | $220 | $300 | $420 |

### 6.2 Cohort Scarcity Premium

Rare variant cohorts command premium pricing. The scarcity premium multiplier is computed from the variant's minor allele frequency (MAF) and the matching cohort size in the protocol's indexed population.

**MAF-based scarcity premium:**

| MAF Range | Scarcity Classification | Premium Multiplier |
|-----------|------------------------|--------------------|
| MAF > 5% | Common variant | 1.0× (no premium) |
| 1% < MAF ≤ 5% | Low-frequency variant | 1.5× |
| 0.5% < MAF ≤ 1% | Rare variant | 2.0× |
| 0.1% < MAF ≤ 0.5% | Very rare variant | 3.0× |
| MAF ≤ 0.1% | Ultra-rare variant | 5.0× |

**Cohort size scarcity premium** (applied in addition to MAF premium when fewer than 1,000 matching genomes exist in the protocol):

| Available Matching Genomes | Additional Size Premium |
|---------------------------|------------------------|
| 500–1,000 | 1.2× |
| 100–499 | 1.5× |
| 50–99 | 2.0× |
| < 50 | 3.0× (Dutch Auction mandatory) |

**Combined premium example:**
A VARIANT_PANEL listing for a CYP2D6 poor metabolizer (MAF ~0.3%, approximately 800 matching genomes in a 10,000-genome protocol):
- Base recommended floor: $120/genome/month
- MAF premium (0.3%, Very rare): 3.0×
- Size premium (800 genomes, 500–1,000 range): 1.2×
- Combined floor: $120 × 3.0 × 1.2 = **$432/genome/month**

The pricing engine surfaces this recommended premium floor in the holder's listing UI. Holders are free to price above this; pricing below the premium is possible but the UI warns the holder they may be undervaluing their listing.

### 6.3 Longitudinal Premium

Each additional year of temporal data coverage in a LONGITUDINAL listing adds a 1.5× compounding multiplier. Longitudinal data commands premium pricing because it allows researchers to observe disease progression, treatment outcomes, and genetic drift over time — capabilities unavailable from cross-sectional genomic datasets.

```
LongitudinalPrice = BaseFloor(scope) × 1.5^(years - 1)

Example:
  1 year of longitudinal data:   $300 × 1.5^0 = $300/genome/month
  2 years of longitudinal data:  $300 × 1.5^1 = $450/genome/month
  3 years of longitudinal data:  $300 × 1.5^2 = $675/genome/month
  5 years of longitudinal data:  $300 × 1.5^4 = $1,519/genome/month
```

The protocol verifies longitudinal claims via a temporal ZK attestation circuit that proves the holder has vault contributions separated by the claimed temporal interval, anchored to block timestamps of vault updates.

**Phase IV LONGITUDINAL revenue potential:**
- 500 holders with 3+ years longitudinal data at $675/genome/month
- 5 pharma buyers each accessing 100-genome longitudinal cohorts
- Monthly GMV from LONGITUDINAL alone: $3,375,000

### 6.4 AI Training Premium

When a buyer selects `AI_TRAINING` as the intended use scope, a 3× multiplier is applied to the base access price. This premium reflects:

1. AI training creates a persistent artifact (the trained model) that embodies the genome holder's data contribution indefinitely beyond the license term
2. AI companies capture substantially higher economic value from training data than from research use
3. The consent scope for AI training is the most expansive — it grants use of genomic data as features in a model that may be deployed commercially

The AI training premium is enforced at the smart contract level:

```solidity
function _applyUsePremium(
    uint256      basePrice,
    bytes32      intendedUseHash
) internal pure returns (uint256 adjustedPrice) {
    if (intendedUseHash == keccak256("AI_TRAINING")) {
        return basePrice * 3;       // 3× AI training premium
    } else if (intendedUseHash == keccak256("CLINICAL_TRIAL")) {
        return basePrice * 12 / 10; // 1.2× clinical trial premium (regulatory value)
    }
    return basePrice;               // Standard 1× for all other use types
}
```

The AI training ZK proof (required for AI_TRAINING use scope) proves:
- The buyer is a KYB-verified entity
- The buyer has declared the specific model architecture and training objective
- The model's scope is limited to the declared use (e.g., drug response prediction)
- A hash of the model scope declaration is anchored to the on-chain grant

This creates an auditable record of AI training data provenance, enabling holders to receive ongoing royalties if a model is re-licensed or updated — a capability structured as a Phase IV feature.

---

## 7. Marketplace Smart Contracts

### 7.1 Contract Overview

The marketplace layer adds one primary contract and two supporting modules to the existing DNaI protocol stack:

```
GenomicMarketplace.sol     — Listing registry, access request queue, auction integration
DutchAuctionCohort.sol     — Dutch auction module (called by GenomicMarketplace)
MetadataAttestation.sol    — ZK proof registry for searchable metadata attestations

Integrations (existing contracts):
  ConsentRegistry.sol      — Consent grant lifecycle (from token standard spec)
  RoyaltyDistributor.sol   — Fee splits and royalty accounting (from token standard spec)
  DNaIToken.sol            — Token ownership verification (from token standard spec)
```

### 7.2 GenomicMarketplace.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDNaIToken.sol";
import "./interfaces/IConsentRegistry.sol";
import "./interfaces/IRoyaltyDistributor.sol";
import "./DutchAuctionCohort.sol";

/// @title GenomicMarketplace
/// @notice Two-sided marketplace for genomic data access licensing.
///         Integrates with ConsentRegistry and RoyaltyDistributor for atomic settlement.
contract GenomicMarketplace is
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    // ─── Types ───────────────────────────────────────────────────────────────

    enum DataScope {
        VARIANT_PANEL,   // 0
        ANCESTRY,        // 1
        DISEASE_RISK,    // 2
        DRUG_RESPONSE,   // 3
        FULL_GENOME,     // 4
        LONGITUDINAL,    // 5
        MICROBIOME       // 6 — Phase IV
    }

    struct Listing {
        uint256    tokenId;
        address    owner;
        DataScope  scope;
        uint256    priceFloor;      // USDC/genome/month, 6 decimals
        uint8      maxBuyers;       // Max concurrent active grants
        uint8      durationMask;    // Bitmask: bit 0=30d, 1=90d, 2=180d, 3=365d
        bool       recurring;       // Accept subscription auto-renewals
        bool       active;
        uint256    createdAt;
        uint256    activeBuyers;
        uint256    lifetimeGrantCount;
        uint256    lifetimeRevenue;   // Total USDC transacted (for analytics)
    }

    struct AccessRequest {
        bytes32    listingId;
        address    buyer;
        DataScope  scope;
        uint32     durationDays;
        uint256    priceOffer;
        bytes32    intendedUseHash;
        bytes      buyerPubKey;
        uint256    submittedAt;
    }

    // ─── State ───────────────────────────────────────────────────────────────

    // listings[listingId] = Listing
    mapping(bytes32 => Listing)    public listings;

    // activeListingId[tokenId][scope] = listingId (at most one active listing per token+scope)
    mapping(uint256 => mapping(DataScope => bytes32)) public activeListingId;

    // verifiedBuyers[address] = true if KYB verified
    mapping(address => bool)        public verifiedBuyers;

    // enterpriseBuyers[address] = true if enterprise KYB tier (required for FULL_GENOME, DISEASE_RISK)
    mapping(address => bool)        public enterpriseBuyers;

    // buyerBlocklist[address] = true if blocklisted for violations
    mapping(address => bool)        public buyerBlocklist;

    // monthlyGrantCount[tokenId][monthKey] = grant count this calendar month
    // monthKey = block.timestamp / 30 days
    mapping(uint256 => mapping(uint256 => uint256)) public monthlyGrantCount;

    // Protocol minimum floor by scope
    mapping(DataScope => uint256)   public protocolMinFloor;

    // Maximum grants per genome per 30-day window (anti-abuse)
    uint256 public maxGrantsPerGenomePerMonth;

    // KWAT storage: grantId => encrypted KWAT blob
    mapping(bytes32 => bytes)       public grantKWAT;

    // KYC address per token (1 token per KYC'd identity)
    mapping(uint256 => address)     public tokenKYCAddress;
    mapping(address => uint256)     public kycToToken;

    address public dnaiToken;
    address public consentRegistry;
    address public royaltyDistributor;
    address public usdc;
    address public dutchAuction;

    // ─── Events ──────────────────────────────────────────────────────────────

    event Listed(
        bytes32 indexed listingId,
        uint256 indexed tokenId,
        address indexed owner,
        DataScope       scope,
        uint256         priceFloor,
        uint8           maxBuyers,
        bool            recurring
    );

    event Delisted(
        bytes32 indexed listingId,
        uint256 indexed tokenId,
        address indexed owner,
        uint256         timestamp
    );

    event PriceUpdated(
        bytes32 indexed listingId,
        uint256         oldFloor,
        uint256         newFloor
    );

    event AccessGranted(
        bytes32 indexed listingId,
        bytes32 indexed grantId,
        uint256 indexed tokenId,
        address         buyer,
        DataScope       scope,
        uint256         payment,
        uint32          durationDays
    );

    event KWATDelivered(
        bytes32 indexed grantId,
        uint256 indexed tokenId,
        address indexed buyer
    );

    event AuctionCleared(
        bytes32 indexed auctionId,
        uint256         clearingPrice,
        uint256         cohortSize,
        uint256         totalPayment
    );

    event RoyaltyDistributed(
        bytes32 indexed grantId,
        uint256 indexed tokenId,
        address indexed holder,
        uint256         holderAmount,
        uint256         protocolAmount,
        uint256         daoAmount
    );

    event BuyerVerified(address indexed buyer, bool enterprise);
    event BuyerBlocklisted(address indexed buyer, string reason);

    // ─── Initialization ──────────────────────────────────────────────────────

    function initialize(
        address _dnaiToken,
        address _consentRegistry,
        address _royaltyDistributor,
        address _usdc,
        address _dutchAuction
    ) public initializer {
        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        dnaiToken          = _dnaiToken;
        consentRegistry    = _consentRegistry;
        royaltyDistributor = _royaltyDistributor;
        usdc               = _usdc;
        dutchAuction       = _dutchAuction;

        maxGrantsPerGenomePerMonth = 20;

        // Protocol minimum floors (USDC, 6 decimals)
        protocolMinFloor[DataScope.ANCESTRY]       = 50_000000;   // $50
        protocolMinFloor[DataScope.VARIANT_PANEL]  = 75_000000;   // $75
        protocolMinFloor[DataScope.DRUG_RESPONSE]  = 100_000000;  // $100
        protocolMinFloor[DataScope.DISEASE_RISK]   = 150_000000;  // $150
        protocolMinFloor[DataScope.FULL_GENOME]    = 300_000000;  // $300
        protocolMinFloor[DataScope.LONGITUDINAL]   = 200_000000;  // $200
        protocolMinFloor[DataScope.MICROBIOME]     = 50_000000;   // $50
    }

    // ─── Listing Functions ────────────────────────────────────────────────────

    /// @notice List genomic data access for a specific scope.
    function listAccess(
        uint256   tokenId,
        DataScope scope,
        uint256   priceFloor,
        uint8     maxBuyers,
        uint8     durationMask,
        bool      recurring
    ) external whenNotPaused returns (bytes32 listingId) {
        require(
            IDNaIToken(dnaiToken).ownerOf(tokenId) == msg.sender,
            "Marketplace: caller not token owner"
        );
        require(
            activeListingId[tokenId][scope] == bytes32(0),
            "Marketplace: scope already listed"
        );
        require(
            priceFloor >= protocolMinFloor[scope],
            "Marketplace: price below protocol minimum"
        );
        require(maxBuyers > 0 && maxBuyers <= 500, "Marketplace: invalid maxBuyers");
        require(durationMask > 0,                   "Marketplace: no duration options");

        listingId = keccak256(abi.encodePacked(tokenId, scope, block.timestamp));

        listings[listingId] = Listing({
            tokenId:            tokenId,
            owner:              msg.sender,
            scope:              scope,
            priceFloor:         priceFloor,
            maxBuyers:          maxBuyers,
            durationMask:       durationMask,
            recurring:          recurring,
            active:             true,
            createdAt:          block.timestamp,
            activeBuyers:       0,
            lifetimeGrantCount: 0,
            lifetimeRevenue:    0
        });

        activeListingId[tokenId][scope] = listingId;

        emit Listed(listingId, tokenId, msg.sender, scope, priceFloor, maxBuyers, recurring);
    }

    /// @notice Update price floor on an active listing.
    function updatePriceFloor(
        bytes32 listingId,
        uint256 newFloor
    ) external {
        Listing storage listing = listings[listingId];
        require(listing.owner == msg.sender,        "Marketplace: not listing owner");
        require(listing.active,                     "Marketplace: listing not active");
        require(newFloor >= protocolMinFloor[listing.scope], "Marketplace: below protocol min");

        uint256 oldFloor = listing.priceFloor;
        listing.priceFloor = newFloor;

        emit PriceUpdated(listingId, oldFloor, newFloor);
    }

    /// @notice Delist: deactivate a listing. Active access grants are unaffected.
    function delist(bytes32 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.owner == msg.sender,  "Marketplace: not listing owner");
        require(listing.active,               "Marketplace: already inactive");

        listing.active = false;
        activeListingId[listing.tokenId][listing.scope] = bytes32(0);

        emit Delisted(listingId, listing.tokenId, msg.sender, block.timestamp);
    }

    // ─── Access Request ───────────────────────────────────────────────────────

    /// @notice Buyer requests access to a listed genome scope.
    function requestAccess(
        bytes32   listingId,
        DataScope scope,
        uint32    durationDays,
        uint256   priceOffer,
        bytes32   intendedUseHash,
        bytes calldata buyerPubKey
    ) external nonReentrant whenNotPaused returns (bytes32 grantId) {
        Listing storage listing = listings[listingId];

        // Validation sequence (see Section 4.2)
        require(listing.active,                              "Marketplace: listing not active");
        require(listing.scope == scope,                      "Marketplace: scope mismatch");
        require(listing.activeBuyers < listing.maxBuyers,   "Marketplace: listing at capacity");
        require(_isDurationAllowed(listing.durationMask, durationDays),
                                                             "Marketplace: duration not offered");
        require(priceOffer >= listing.priceFloor,            "Marketplace: below holder floor");
        require(priceOffer >= protocolMinFloor[scope],       "Marketplace: below protocol min");
        require(verifiedBuyers[msg.sender],                  "Marketplace: buyer not verified");
        require(!buyerBlocklist[msg.sender],                 "Marketplace: buyer blocklisted");

        if (scope == DataScope.FULL_GENOME || scope == DataScope.DISEASE_RISK) {
            require(enterpriseBuyers[msg.sender],            "Marketplace: requires enterprise KYB");
        }

        uint256 monthKey = block.timestamp / 30 days;
        require(
            monthlyGrantCount[listing.tokenId][monthKey] < maxGrantsPerGenomePerMonth,
            "Marketplace: genome rate limit exceeded"
        );

        // Apply use premiums
        uint256 adjustedPrice = _applyUsePremium(priceOffer, intendedUseHash);
        uint256 totalPayment  = _computePayment(adjustedPrice, durationDays);

        // Transfer USDC from buyer
        IERC20(usdc).transferFrom(msg.sender, address(this), totalPayment);

        // Register consent grant
        grantId = IConsentRegistry(consentRegistry).grantAccess(
            listing.tokenId,
            msg.sender,
            _mapScope(scope),
            uint256(durationDays) * 1 days,
            totalPayment
        );

        // Distribute royalties
        IERC20(usdc).approve(royaltyDistributor, totalPayment);
        IRoyaltyDistributor(royaltyDistributor).recordAccessPayment(
            listing.tokenId,
            msg.sender,
            totalPayment
        );

        // Update counters
        listing.activeBuyers++;
        listing.lifetimeGrantCount++;
        listing.lifetimeRevenue += totalPayment;
        monthlyGrantCount[listing.tokenId][monthKey]++;

        // Store buyer public key for KWAT generation
        grantBuyerPubKey[grantId] = buyerPubKey;

        emit AccessGranted(listingId, grantId, listing.tokenId, msg.sender, scope,
                          totalPayment, durationDays);
    }

    // ─── KWAT Delivery ────────────────────────────────────────────────────────

    /// @notice Holder delivers the encrypted Key Wrapped Access Token to buyer.
    ///         Called by holder's client after detecting AccessGranted event.
    /// @param grantId   The access grant ID
    /// @param kwatBlob  AES-KeyWrapped DEK subset, encrypted for buyer's public key
    function deliverKWAT(
        bytes32 grantId,
        bytes calldata kwatBlob
    ) external {
        // Verify caller is the token owner for this grant
        // (Grant → tokenId → ownerOf)
        uint256 tokenId = IConsentRegistry(consentRegistry).grantTokenId(grantId);
        require(
            IDNaIToken(dnaiToken).ownerOf(tokenId) == msg.sender,
            "Marketplace: caller not token owner"
        );
        require(grantKWAT[grantId].length == 0, "Marketplace: KWAT already delivered");

        grantKWAT[grantId] = kwatBlob;

        address buyer = IConsentRegistry(consentRegistry).grantRequester(grantId);
        emit KWATDelivered(grantId, tokenId, buyer);
    }

    // ─── Internal Helpers ─────────────────────────────────────────────────────

    function _isDurationAllowed(uint8 mask, uint32 days_) internal pure returns (bool) {
        if (days_ == 30  && (mask & 1) != 0) return true;
        if (days_ == 90  && (mask & 2) != 0) return true;
        if (days_ == 180 && (mask & 4) != 0) return true;
        if (days_ == 365 && (mask & 8) != 0) return true;
        return false;
    }

    function _computePayment(uint256 pricePerMonth, uint32 durationDays)
        internal pure returns (uint256)
    {
        return (pricePerMonth * durationDays) / 30;
    }

    function _applyUsePremium(uint256 basePrice, bytes32 intendedUseHash)
        internal pure returns (uint256)
    {
        if (intendedUseHash == keccak256("AI_TRAINING"))   return basePrice * 3;
        if (intendedUseHash == keccak256("CLINICAL_TRIAL")) return (basePrice * 12) / 10;
        return basePrice;
    }
}
```

### 7.3 Integration with Existing Contracts

`GenomicMarketplace.sol` integrates with the consent and royalty contracts defined in the token standard specification (`token-standard-spec.md`) via the following call patterns:

```
GenomicMarketplace.requestAccess()
    │
    ├── IDNaIToken(dnaiToken).ownerOf(tokenId)      — verify listing ownership
    ├── IConsentRegistry.grantAccess(...)            — create on-chain consent record
    └── IRoyaltyDistributor.recordAccessPayment(...) — split and distribute USDC

GenomicMarketplace.delist()
    │
    └── (Does not revoke existing active grants — those remain valid until expiry)

GenomicMarketplace.requestAccess() [on expiry, called by buyer renewal]
    │
    └── IConsentRegistry.hasValidAccess(...)         — check grant before KWAT re-use
```

**Fee split by transaction type** (encoded in `RoyaltyDistributor.sol` as separate distribution functions):

```solidity
// Standard access: 73/20/7
function recordAccessPayment(uint256 tokenId, address requester, uint256 total) external {
    _distribute(tokenId, total, 7300, 2000, 700);
}

// Auction clearing: 68/25/7
function recordAuctionPayment(uint256 tokenId, address requester, uint256 total) external {
    _distribute(tokenId, total, 6800, 2500, 700);
}

// AI training: 63/30/7
function recordAITrainingPayment(uint256 tokenId, address requester, uint256 total) external {
    _distribute(tokenId, total, 6300, 3000, 700);
}

// Subscription: 75/18/7
function recordSubscriptionPayment(uint256 tokenId, address requester, uint256 total) external {
    _distribute(tokenId, total, 7500, 1800, 700);
}
```

### 7.4 Key Events Reference

All marketplace events are indexed by The Graph subgraph for the discovery layer and audit trail:

| Event | Contract | Trigger | Fields Indexed |
|-------|----------|---------|----------------|
| `Listed` | GenomicMarketplace | `listAccess()` | listingId, tokenId, owner, scope, priceFloor, maxBuyers |
| `Delisted` | GenomicMarketplace | `delist()` | listingId, tokenId, owner |
| `PriceUpdated` | GenomicMarketplace | `updatePriceFloor()` | listingId, oldFloor, newFloor |
| `AccessGranted` | GenomicMarketplace | `requestAccess()` | listingId, grantId, tokenId, buyer, scope, payment, durationDays |
| `KWATDelivered` | GenomicMarketplace | `deliverKWAT()` | grantId, tokenId, buyer |
| `AuctionCreated` | DutchAuctionCohort | `createAuction()` | auctionId, buyer, scope, startPrice, endTime |
| `AuctionCleared` | DutchAuctionCohort | `_clearAuction()` | auctionId, clearingPrice, cohortSize, totalPayment |
| `AuctionFailed` | DutchAuctionCohort | `_clearAuction()` | auctionId, finalCohortSize, reason |
| `RoyaltyDistributed` | RoyaltyDistributor | `recordAccessPayment()` | grantId, tokenId, holder, holderAmount, protocolAmount, daoAmount |
| `ConsentGranted` | ConsentRegistry | (via Marketplace) | tokenId, requester, scope, duration, price |
| `ConsentRevoked` | ConsentRegistry | `revokeAccess()` | tokenId, requester |

---

## 8. Marketplace UI/UX

### 8.1 Genome Holder Dashboard

The holder dashboard is the primary interface for managing supply-side participation. It is built as a Next.js page at `/dashboard/genome` using the existing cloudcontrolllc.com stack (Next.js, wagmi v2, viem, TailwindCSS).

**Component sketch — Holder Dashboard:**

```tsx
// pages/dashboard/genome.tsx — Genome Holder Dashboard

import { useAccount } from "wagmi";
import { useDNaIToken } from "@/hooks/useDNaIToken";
import { useActiveListings } from "@/hooks/useActiveListings";
import { useRoyalties } from "@/hooks/useRoyalties";

export default function GenomeDashboard() {
  const { address } = useAccount();
  const { token, isLoading: tokenLoading } = useDNaIToken(address);
  const { listings, refetch } = useActiveListings(token?.tokenId);
  const { pending, lifetime, history } = useRoyalties(token?.tokenId);

  return (
    <DashboardLayout>
      {/* ── Header ── */}
      <DashboardHeader
        title="Genomic Sovereignty Dashboard"
        subtitle={`Token #${token?.tokenId} · Genesis Member: ${token?.isGenesisMember}`}
      />

      {/* ── Earnings Overview ── */}
      <EarningsPanel
        pendingRoyalties={pending}       // Accrued but unclaimed USDC
        lifetimeEarnings={lifetime}      // Total USDC earned all time
        monthlyEarnings={history.slice(0, 30)}  // Last 30 days sparkline
        onClaim={() => claimRoyalties(token.tokenId)}
      />

      {/* ── Active Listings ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <SectionHeader
          title="Active Data Listings"
          action={<AddListingButton tokenId={token?.tokenId} />}
        />
        {listings.map(listing => (
          <ListingCard
            key={listing.listingId}
            listing={listing}
            onUpdatePrice={(newFloor) => updatePriceFloor(listing.listingId, newFloor)}
            onDelist={() => delist(listing.listingId)}
          />
        ))}
        {listings.length === 0 && (
          <EmptyState
            title="No active listings"
            description="Start earning royalties by listing access to your genomic data."
            cta={<AddListingButton tokenId={token?.tokenId} />}
          />
        )}
      </section>

      {/* ── Access History ── */}
      <AccessHistoryTable
        tokenId={token?.tokenId}
        columns={["Buyer", "Scope", "Duration", "Payment", "Date", "Status"]}
      />

      {/* ── Consent Grant Controls ── */}
      <ActiveGrantsPanel
        tokenId={token?.tokenId}
        onRevoke={(grantId) => revokeAccess(token.tokenId, grantId)}
      />

      {/* ── ZK Attestations ── */}
      <AttestationPanel
        tokenId={token?.tokenId}
        onRefreshAttestation={(field) => regenerateAttestation(token.tokenId, field)}
      />
    </DashboardLayout>
  );
}

// ── Component: ListingCard ──────────────────────────────────────────────────
function ListingCard({ listing, onUpdatePrice, onDelist }) {
  return (
    <Card className="border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <ScopeBadge scope={listing.scope} />
          <p className="text-2xl font-bold mt-2">
            ${(listing.priceFloor / 1e6).toFixed(0)}<span className="text-sm font-normal">/genome/month</span>
          </p>
        </div>
        <StatusBadge active={listing.active} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-600">
        <Stat label="Active Buyers"  value={`${listing.activeBuyers} / ${listing.maxBuyers}`} />
        <Stat label="Total Grants"   value={listing.lifetimeGrantCount} />
        <Stat label="Revenue"        value={`$${(listing.lifetimeRevenue / 1e6).toFixed(0)}`} />
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowPriceModal(true)}>
          Update Price
        </Button>
        <Button variant="ghost" size="sm" className="text-red-600" onClick={onDelist}>
          Delist
        </Button>
      </div>
    </Card>
  );
}
```

**Key dashboard features:**
- Real-time royalty balance with WebSocket stream (`wss://api.dnai.io/v1/ws` on `dnai:royalty:{tokenId}`)
- One-click claim royalties button that calls `claimRoyalties(tokenId)` via wagmi `useContractWrite`
- Per-listing revoke controls with confirmation modal and cooling-off warning
- ZK attestation status: shows which metadata fields have valid proofs and when they expire
- Mobile-responsive: primary interaction path is wallet notification → mobile approval

### 8.2 Buyer Dashboard

The buyer dashboard manages demand-side purchasing. Built at `/dashboard/buyer` using the same Next.js stack.

**Component sketch — Buyer Dashboard:**

```tsx
// pages/dashboard/buyer.tsx — Buyer Dashboard

export default function BuyerDashboard() {
  const { address } = useAccount();
  const { activeGrants } = useActiveGrants(address);
  const { spendSummary } = useSpendAnalytics(address);
  const { cohorts, buildCohort } = useCohortBuilder();

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Buyer Dashboard"
        subtitle={`Verified: ${enterpriseTier ? "Enterprise KYB" : "Standard KYB"}`}
      />

      {/* ── Spend Overview ── */}
      <SpendPanel
        totalSpend={spendSummary.lifetime}
        monthlySpend={spendSummary.last30d}
        activeAccessCount={activeGrants.length}
        avgCostPerGenome={spendSummary.avgPerGenome}
      />

      {/* ── Active Access Agreements ── */}
      <section className="mt-8">
        <SectionHeader title="Active Access Agreements" />
        <ActiveGrantsTable
          grants={activeGrants}
          columns={["Scope", "Genomes", "Expires", "Monthly Cost", "Data Delivery"]}
          onDownload={(grantId) => downloadKWAT(grantId)}
          onRenew={(grantId) => renewGrant(grantId)}
        />
      </section>

      {/* ── Cohort Builder ── */}
      <section className="mt-8">
        <SectionHeader
          title="Cohort Builder"
          subtitle="Assemble custom genomic cohorts matching your research criteria"
        />
        <CohortBuilderPanel
          onBuildCohort={buildCohort}
          availableFilters={[
            "scope", "ancestryBins", "conditionFlags",
            "ageRangeBin", "sequencingType", "minCohortSize",
            "maxPricePerGenome", "durationDays"
          ]}
        />
        {cohorts.map(c => (
          <CohortPreview
            key={c.id}
            cohort={c}
            onRequestAccess={() => submitCohortRequest(c)}
          />
        ))}
      </section>

      {/* ── Spend Analytics ── */}
      <SpendAnalyticsChart
        monthly={spendSummary.monthlyBreakdown}
        byScopeBreakdown={spendSummary.byScope}
      />
    </DashboardLayout>
  );
}
```

### 8.3 Discovery Interface

The discovery interface is the public-facing marketplace browse experience, accessible at `marketplace.dnai.io`. Authenticated buyers can filter and purchase; unauthenticated visitors can browse aggregate statistics and scope pricing.

**Component sketch — Discovery Interface:**

```tsx
// pages/marketplace/discover.tsx — Marketplace Discovery

export default function Discover() {
  const [filters, setFilters] = useState<ListingFilters>({
    scopes:           [],
    ancestryBins:     [],
    conditionFlags:   {},
    ageRange:         null,
    minQualityScore:  70,
    maxPriceFloor:    500,
    minCohortSize:    1,
    durationOptions:  [],
    recurring:        null,
  });

  const { listings, totalCount, isLoading } = useListings(filters);
  const { cohortEstimate } = useCohortEstimate(filters);

  return (
    <MarketplaceLayout>
      {/* ── Search Header ── */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-12 px-8">
        <h1 className="text-3xl font-bold text-white">DNaI Genomic Marketplace</h1>
        <p className="text-blue-200 mt-2">
          {totalCount.toLocaleString()} consented genomic data scopes available
        </p>
      </section>

      <div className="flex gap-6 p-8 max-w-7xl mx-auto">

        {/* ── Filter Sidebar ── */}
        <aside className="w-72 flex-shrink-0">
          <FilterPanel>

            {/* Scope selector */}
            <FilterGroup title="Data Scope">
              {SCOPES.map(scope => (
                <FilterCheckbox
                  key={scope.id}
                  label={scope.name}
                  sublabel={`From $${scope.minPrice}/genome/month`}
                  checked={filters.scopes.includes(scope.id)}
                  onChange={(checked) => toggleScope(scope.id, checked)}
                />
              ))}
            </FilterGroup>

            {/* Ancestry filter */}
            <FilterGroup title="Ancestry">
              {ANCESTRY_POPULATIONS.map(pop => (
                <FilterCheckbox
                  key={pop.id}
                  label={pop.label}
                  onChange={(bin) => toggleAncestryBin(pop.id, bin)}
                  options={["0-25%", "25-50%", "50-75%", "75-100%"]}
                />
              ))}
            </FilterGroup>

            {/* Condition flags */}
            <FilterGroup title="Condition Flags (ZK Attested)">
              {CONDITION_FLAGS.map(flag => (
                <FlagToggle
                  key={flag.id}
                  label={flag.displayName}
                  sublabel="ZK-attested presence/absence"
                  value={filters.conditionFlags[flag.id]}
                  onChange={(val) => setConditionFlag(flag.id, val)}
                />
              ))}
            </FilterGroup>

            {/* Price filter */}
            <FilterGroup title="Price (USDC/genome/month)">
              <RangeSlider
                min={50} max={1000} step={10}
                value={filters.maxPriceFloor}
                onChange={(val) => setFilter("maxPriceFloor", val)}
              />
            </FilterGroup>

            {/* Cohort size filter */}
            <FilterGroup title="Minimum Cohort Size">
              <NumberInput
                min={1} value={filters.minCohortSize}
                onChange={(val) => setFilter("minCohortSize", val)}
              />
            </FilterGroup>

          </FilterPanel>

          {/* Cohort Estimate */}
          {filters.minCohortSize >= 100 && (
            <CohortEstimateCard
              estimate={cohortEstimate}
              onRequestCohort={() => openCohortModal(filters)}
            />
          )}
        </aside>

        {/* ── Listing Grid ── */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              {isLoading ? "Searching..." : `${listings.length} listings match your criteria`}
            </p>
            <SortSelector
              options={["Price: Low to High", "Price: High to Low", "Quality Score", "Newest"]}
            />
          </div>

          {isLoading ? (
            <ListingGridSkeleton count={12} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map(listing => (
                <ListingCard
                  key={listing.listingId}
                  listing={listing}
                  onRequestAccess={() => openAccessModal(listing)}
                />
              ))}
            </div>
          )}
        </main>

      </div>
    </MarketplaceLayout>
  );
}

// ── Component: Discovery ListingCard ───────────────────────────────────────
function ListingCard({ listing, onRequestAccess }) {
  return (
    <Card className="rounded-xl border hover:shadow-md transition-shadow cursor-pointer p-5"
          onClick={onRequestAccess}>

      {/* Scope badge + attestation indicator */}
      <div className="flex justify-between items-start">
        <ScopeBadge scope={listing.scope} />
        <AttestationIndicator attestations={listing.attestations} />
      </div>

      {/* Metadata (ZK-attested, no raw data) */}
      <div className="mt-3 space-y-1 text-sm text-gray-700">
        <MetadataRow icon="🧬" label="Sequencing" value={listing.sequencingType} />
        <MetadataRow icon="📊" label="Quality"    value={`${listing.qualityScore}/100`} />
        {listing.ancestryBins.length > 0 && (
          <MetadataRow icon="🌍" label="Ancestry" value={listing.ancestryBins.join(", ")} />
        )}
        {listing.longitudinalYears > 0 && (
          <MetadataRow icon="📅" label="Longitudinal" value={`${listing.longitudinalYears} years`} />
        )}
      </div>

      {/* Price + CTA */}
      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className="text-xl font-bold text-gray-900">
            ${(listing.priceFloor / 1e6).toFixed(0)}
            <span className="text-sm font-normal text-gray-500">/genome/month</span>
          </p>
          {listing.scarcityPremium > 1 && (
            <p className="text-xs text-amber-600 font-medium">
              {listing.scarcityPremium}× scarcity premium
            </p>
          )}
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Request Access
        </Button>
      </div>
    </Card>
  );
}
```

---

## 9. Anti-Abuse and Quality Controls

### 9.1 Sybil Attack Prevention: 1 Token per KYC'd Individual

The DNaI protocol enforces a strict one-genome-per-human constraint at multiple layers:

**Layer 1 — Smart contract:**
```solidity
// DNaIToken.sol: prevents duplicate minting
require(balanceOf(owner) == 0, "DNaI: owner already holds a DNaI token");
require(!_genomeHashMinted[genomeHash], "DNaI: genome already minted");
```

**Layer 2 — KYC binding:**
At mint time, the minting sequencing provider binds the token to the holder's government-ID-verified identity. The `tokenKYCAddress` mapping on `GenomicMarketplace.sol` links:
```
tokenId → KYC hash (keccak256 of provider-attested identity document hash)
KYC hash → tokenId (reverse lookup)
```
If two mint attempts arrive with the same KYC hash, the second is rejected.

**Layer 3 — Genome hash uniqueness:**
Even if a bad actor somehow obtained a second wallet and re-submitted the same genome file, the `_genomeHashMinted` mapping rejects it. The genome hash is derived from the actual genomic sequence; fabricating a different hash requires fabricating different genomic data.

**Layer 4 — Sequencing provider attestation:**
Sequencing providers are approved by the DAO and stake a reputation bond. A provider that submits fraudulent KYC-genome pairings loses their stake and is revoked from `approvedProviders`.

### 9.2 Fake Listing Prevention: Genome Hash Verification

All listings must be backed by a valid DNaI token, and all DNaI tokens are anchored to a sequencing provider's cryptographic attestation of the genome.

The sequencing provider signs the genome hash at the time of sequencing:

```solidity
// At mint time, provider signs:
bytes32 attestation = keccak256(abi.encodePacked(
    genomeHash,         // SHA-256 of encrypted vault CID
    ownerAddress,       // Genome holder's wallet
    sequencingDate,     // Block timestamp of sequencing event
    providerAddress     // Approved sequencing provider
));
// Provider ECDSA signs this attestation; stored in token metadata

// GenomicMarketplace.listAccess verifies:
require(
    _verifyProviderSignature(listing.tokenId, providerSignature),
    "Marketplace: invalid provider attestation"
);
```

Listing fake (synthesized) genomic data is technically impossible because:
1. The token's `genomeHash` is fixed at mint time by the sequencing provider
2. The listing scope sub-package must decrypt to data consistent with the `genomeHash`
3. Buyers receive ZK attestations verifiable against the `genomeHash` on-chain — any inconsistency in delivered data is detectable by rerunning the ZK circuit

### 9.3 Buyer Vetting: KYB Tiers

| KYB Tier | Required For | Verification Requirements | Time to Verify |
|----------|-------------|--------------------------|----------------|
| Standard | ANCESTRY, VARIANT_PANEL, DRUG_RESPONSE | Company registration, contact details, intended use declaration | 24–48 hours |
| Enterprise | DISEASE_RISK, FULL_GENOME | All standard + IRB/ethics board approval, institutional affiliation, data security assessment | 5–10 business days |
| AI Training | AI_TRAINING use scope (any scope) | All enterprise + AI model scope declaration, model deployment plan, compute infrastructure attestation | 5–10 business days |

KYB verification is handled off-chain via a DNaI compliance team workflow using Persona (identity verification SaaS) for document verification and Sanction.io for sanctions screening. On approval:

```solidity
// Admin (later DAO multisig) updates buyer registry:
function verifyBuyer(
    address buyer,
    bool    isEnterprise
) external onlyAdmin {
    verifiedBuyers[buyer]  = true;
    enterpriseBuyers[buyer] = isEnterprise;
    emit BuyerVerified(buyer, isEnterprise);
}
```

Violations result in blocklisting:
```solidity
function blocklistBuyer(address buyer, string calldata reason) external onlyAdmin {
    buyerBlocklist[buyer] = true;
    // Active grants are not automatically revoked; holders must revoke individually
    emit BuyerBlocklisted(buyer, reason);
}
```

### 9.4 Rate Limiting: Maximum Access Grants per Genome per Month

Each genome has a maximum of 20 concurrent access grants per 30-day rolling window. This prevents:
- Re-identification via triangulation: a single genome accessed by 100+ buyers simultaneously creates correlation risk
- Economic manipulation: flooding a genome's access grant queue to block legitimate buyers

```solidity
uint256 public maxGrantsPerGenomePerMonth = 20; // DAO-governable parameter

// Checked in requestAccess():
uint256 monthKey = block.timestamp / 30 days;
require(
    monthlyGrantCount[listing.tokenId][monthKey] < maxGrantsPerGenomePerMonth,
    "Marketplace: genome rate limit exceeded"
);
```

The 20-grant limit is a DAO-governable parameter. Initial value chosen based on:
- Average genome in Phase III: 3–5 buyers in any month
- Peak legitimate demand: Phase III pharma pilot (10–15 buyers per genome possible for high-demand variants)
- Safety margin: 20 allows for surge demand without leaving room for adversarial access pattern

**KWAT delivery rate limit:** A separate rate limit caps KWAT generation at 5 per listing per hour (to prevent client-side key derivation attacks that try to exhaust the holder's key derivation budget).

### 9.5 Data Quality Enforcement

Buyers who receive access to low-quality data (below the sequencing quality score displayed in the listing) can file a quality dispute:

1. Buyer flags dispute via `raiseQualityDispute(grantId, evidenceHash)`
2. DAO mediator reviews: compares attested quality score vs. delivered data metrics
3. If attested quality score was inaccurate: payment held in escrow, holder's attestation registry entry is revoked, `maxGrantsPerGenomePerMonth` reduced for that token
4. If quality score was accurate and buyer's complaint unfounded: dispute dismissed, buyer's reputation score decremented (3 unfounded disputes → automatic KYB re-review)

This creates a quality equilibrium: holders who inflate quality attestations face economic consequences; buyers who file bad-faith disputes face re-review.

---

## 10. Marketplace Revenue Projections

### 10.1 Month-by-Month GMV Projections (Phase II–IV)

The following projections are built from the revenue model's genome holder and buyer counts, applying the pricing engine's recommended floors.

**Phase II (August 16 – October 1, 2026) — Pilot Period**

| Month | Genome Holders | Active Listings | Avg Price/Genome | Buyers | GMV | Protocol Revenue (20%) |
|-------|---------------|----------------|-----------------|--------|-----|----------------------|
| Sep 2026 (pilot) | 200 | 20 | $120 | 3 | $7,200 | $1,440 |
| Oct 2026 (close) | 1,000 | 100 | $130 | 5 | $65,000 | $13,000 |
| **Phase II Total** | | | | | **$72,200** | **$14,440** |

Note: Phase II GMV includes the first pharmaceutical pilot agreement ($22,500 target) as the dominant transaction. Monthly GMV at Phase II close approaches $22,500 MRR milestone.

**Phase III (October 2 – November 15, 2026) — Open Network**

| Month | Genome Holders | Active Listings | Avg Price/Genome | Buyers | GMV | Protocol Revenue (20%) |
|-------|---------------|----------------|-----------------|--------|-----|----------------------|
| Oct 2026 (launch) | 1,500 | 200 | $140 | 8 | $224,000 | $44,800 |
| Nov 2026 | 5,000 | 800 | $145 | 12 | $1,392,000 | $278,400 |
| Nov 15 (close) | 10,000 | 3,000 | $150 | 20 | $9,000,000 ARR run rate | $1,800,000 ARR |
| **Phase III Steady State (monthly)** | 10,000 | 3,000 | $150 | 20 | **$450,000** | **$90,000** |

Phase III steady state ($450,000 monthly GMV, $90,000 protocol revenue) matches the revenue model's Phase III projection precisely.

**Phase IV (November 16 – December 1, 2026) — Genomic Economy**

Phase IV adds the AI training premium tier and expands the buyer count significantly through the open AI marketplace.

| Month | Genome Holders | Active Listings | Blended Avg Price | Buyers | GMV | Protocol Revenue |
|-------|---------------|----------------|-----------------|--------|-----|-----------------|
| Dec 2026 | 20,000 | 7,000 | $180 | 35 | $44,100,000 ARR run rate | ~$9,000,000 ARR |
| Dec 2026 (monthly) | 20,000 | 7,000 | $180 | 35 | **$1,260,000** | **$252,000** |
| Phase IV Steady State (50K holders) | 50,000 | 17,500 | $200 | 80 | **$3,500,000/month** | **$700,000/month** |

Phase IV blended average price ($180–$200) reflects the mix of standard access at $150 + AI training premium (3×) transactions driving up the mean.

**Year 1 Full Projection (Phase II–IV):**

| Period | Monthly GMV | Monthly Protocol Revenue | Cumulative GMV |
|--------|------------|------------------------|----------------|
| Phase II (2 months) | $36,100 avg | $7,220 avg | $72,200 |
| Phase III (6 weeks) | $300,000 avg | $60,000 avg | $450,000 |
| Phase IV (ongoing) | $1,260,000 | $252,000 | Ongoing |
| **Year 1 Total** | | | **~$2,000,000** |

### 10.2 Protocol Fee Revenue at Each GMV Level

| Annual GMV | Standard Fee (20%) | Auction Premium | AI Premium | Blended Protocol Revenue | Cloud Control LLC Net (post-DAO) |
|-----------|-------------------|-----------------|------------|------------------------|----------------------------------|
| $270K (Phase II ARR) | $54,000 | $2,000 | $0 | $56,000 | $42,000 |
| $3.6M (Phase III ARR) | $650,000 | $50,000 | $20,000 | $720,000 | $540,000 |
| $9M (Phase IV ARR) | $1,500,000 | $200,000 | $300,000 | $2,000,000 | $1,500,000 |
| $24M (Scale projection) | $3,600,000 | $600,000 | $1,200,000 | $5,400,000 | $4,050,000 |

Note: "Cloud Control LLC Net" is the protocol fee share (20% of GMV) minus the DAO treasury allocation (7% of GMV). Net retention: 13% of GMV to Cloud Control LLC, 7% to DAO.

### 10.3 Sensitivity Analysis: 10% Price Elasticity Impact

A 10% increase or decrease in average access price, assuming moderate price elasticity (buyers reduce volume when prices rise):

**Assumed demand elasticity:** price elasticity coefficient = -0.6 (inelastic; genomic data has few substitutes for pharma research)

```
At Phase III steady state ($450,000 monthly GMV, $150 avg price, 3,000 active listings):

Scenario A: +10% price increase ($165/genome/month)
  Volume impact: -10% × 0.6 = -6% volume reduction
  New volume: 3,000 × 0.94 = 2,820 genomes accessed
  New GMV: 2,820 × $165 = $465,300 (+3.4% GMV vs. base)
  Protocol revenue: $93,060 (+3.4%)
  Verdict: POSITIVE — inelastic demand means price increases are beneficial to GMV

Scenario B: -10% price decrease ($135/genome/month)
  Volume impact: +10% × 0.6 = +6% volume increase
  New volume: 3,000 × 1.06 = 3,180 genomes accessed
  New GMV: 3,180 × $135 = $429,300 (-4.6% GMV vs. base)
  Protocol revenue: $85,860 (-4.6%)
  Verdict: NEGATIVE — price reductions reduce GMV with inelastic demand

Scenario C: +20% price premium (auction-driven discovery for rare cohorts)
  Applies only to cohorts with scarcity score > 85 (est. 15% of listings)
  Affected listings: 450 genomes × $180 avg
  Additional GMV vs. flat pricing: 450 × $30 = $13,500/month
  Protocol revenue boost from premium tier: $2,700/month
```

**Sensitivity table (Phase III monthly GMV):**

| Avg Price Change | Volume Impact | New GMV | Protocol Revenue | Delta vs. Base |
|-----------------|--------------|---------|-----------------|---------------|
| -20% ($120) | +12% | $403,200 | $80,640 | -$9,360 (-10.4%) |
| -10% ($135) | +6% | $429,300 | $85,860 | -$4,140 (-4.6%) |
| Base ($150) | — | $450,000 | $90,000 | — |
| +10% ($165) | -6% | $465,300 | $93,060 | +$3,060 (+3.4%) |
| +20% ($180) | -12% | $475,200 | $95,040 | +$5,040 (+5.6%) |

**Key insight:** The inelastic demand (elasticity -0.6) means the recommended pricing strategy is to maintain the highest defensible price floor, use dynamic pricing to capture auction premiums, and deploy scarcity multipliers aggressively. Price cuts are GMV-destructive; price increases are GMV-accretive up to the point where buyers defect to competing platforms (estimated at +40–50% above current market rates based on Nebula Genomics comparable pricing).

### 10.4 Enterprise Buyer Revenue Concentration

Revenue in Phase II–III is expected to be concentrated among a small number of high-value enterprise buyers:

| Buyer Tier | Count (Phase III) | Avg Annual Spend | Tier GMV | % of Total GMV |
|-----------|------------------|-----------------|---------|----------------|
| Pharma Enterprise | 10 | $600,000 | $6,000,000 | 55% |
| Research Institution | 5 | $150,000 | $750,000 | 7% |
| AI Company | 3 | $800,000 | $2,400,000 | 22% |
| Biotech | 8 | $120,000 | $960,000 | 9% |
| Long-tail (misc.) | 20 | $22,500 | $450,000 | 4% |
| **Totals** | **46** | | **$10,560,000** | **100%** |

This concentration creates a key business risk: loss of 2–3 enterprise buyers could reduce GMV by 30–40%. Mitigations:
- Multi-year contract terms for enterprise buyers (12–36 month agreements with auto-renewal)
- Volume discounts for annual commitments ($500K+): 10% protocol fee reduction (from 20% to 18%)
- Enterprise SLAs: guaranteed data freshness, priority KWAT delivery, dedicated API infrastructure

---

## Appendix A: Marketplace Fee Schedule Reference

| Transaction Type | Holder % | Protocol % | DAO % | Notes |
|-----------------|---------|------------|-------|-------|
| Standard instant-buy | 73% | 20% | 7% | Most common transaction |
| Dutch auction clearing | 68% | 25% | 7% | Rare cohort premium |
| AI training license | 63% | 30% | 7% | 3× price × higher protocol % |
| Subscription recurring | 75% | 18% | 7% | Lower protocol % for loyalty |
| Cohort listing (batch) | 73% | 20% | 7% | Same as standard; per-genome |

## Appendix B: Phase Activation Checklist

### Phase II (Aug 16 – Oct 1)
- [ ] `GenomicMarketplace.sol` deployed to Sepolia testnet
- [ ] `listAccess()` and `requestAccess()` functions tested end-to-end
- [ ] KWAT delivery flow tested with pilot genome holders
- [ ] KYB buyer verification workflow operational
- [ ] First paid pilot agreement: scope=VARIANT_PANEL, $22,500
- [ ] Holder dashboard `/dashboard/genome` live at staging

### Phase III (Oct 2 – Nov 15)
- [ ] Mainnet deployment of full marketplace contract suite
- [ ] Dutch auction module deployed and tested with synthetic cohort
- [ ] Discovery interface `marketplace.dnai.io` live
- [ ] The Graph subgraph indexing all marketplace events
- [ ] Superfluid subscription streaming integration live
- [ ] 3,000+ active listings target met
- [ ] $450,000 monthly GMV milestone

### Phase IV (Nov 16 – Dec 1)
- [ ] AI training premium enforcement live
- [ ] MICROBIOME scope activated (contracts + vault sub-package)
- [ ] LONGITUDINAL scope with ZK temporal attestation live
- [ ] AI marketplace landing page and licensing flow
- [ ] $1,260,000+ monthly GMV run rate
- [ ] First Dutch auction cleared for ultra-rare cohort

---

*DNaI Tokenized Marketplace Mechanics — v0.1.0*
*Cloud Control LLC — Phase I Documentation*
*July 1, 2026*
*Author: Marketplace Agent — DNaI Protocol Team*
*For technical questions: everett@cloudcontrolllc.com*
