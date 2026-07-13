# DNaI Technical Architecture Revenue Specification
**Cloud Control LLC — Project DNaI**
**Document Version:** 1.0.0
**Status:** Phase I — Active
**Date:** 2026-07-01
**Classification:** Internal — Engineering + Business Development

---

## Purpose

Every technical component in the DNaI architecture must justify its build cost against a concrete revenue line. This document is the binding specification that maps each architectural decision to the revenue it generates or directly enables, defines pricing for each technical product, and establishes phase-gated milestones so that no engineering sprint runs without a corresponding commercial outcome.

This document is co-authoritative with `technical-architecture.md` and `revenue-model.md`. Where conflicts exist, the revenue model governs prioritization; the architecture governs implementation.

---

## Table of Contents

1. [Architecture → Revenue Map](#1-architecture--revenue-map)
2. [Vault-as-a-Service (VaaS) Product Specification](#2-vault-as-a-service-vaas-product-specification)
3. [ZK Proof-as-a-Service (ZKPaaS) API](#3-zk-proof-as-a-service-zkpaas-api)
4. [Consent Oracle API](#4-consent-oracle-api)
5. [Data Pipeline SDK Licensing](#5-data-pipeline-sdk-licensing)
6. [Smart Contract Suite Licensing](#6-smart-contract-suite-licensing)
7. [Infrastructure Cost vs. Revenue Model](#7-infrastructure-cost-vs-revenue-model)
8. [Technical Debt Budget](#8-technical-debt-budget)
9. [Phase-Gated Technical Revenue Milestones](#9-phase-gated-technical-revenue-milestones)

---

## 1. Architecture → Revenue Map

The following table governs build prioritization for all engineering decisions. No component advances past Phase I specification unless its revenue activation phase and pricing model are locked here.

### 1.1 Complete Component Revenue Map

| Technical Component | Revenue Stream | Pricing Model | Phase Activated | GM% | Monthly Revenue Potential (Phase III) |
|---------------------|---------------|---------------|-----------------|-----|---------------------------------------|
| Client-Side Vault Encryption | Compliance certification revenue + enterprise trust premium | $25K–$100K/year per certified enterprise | Phase III | 85% | $41,667 from 5 certs |
| ZK Proof Layer (Noir circuits) | AI dataset licensing + ZKPaaS per-proof API | $0.10/proof; $500/mo bundle | Phase III | 80% | $50K AI licenses + $10K proofs |
| Consent Registry (on-chain) | Audit Trail SaaS + Consent Oracle API + compliance dashboard | $2K–$10K/mo per subscriber; $0.001/verify call | Phase II | 75% | $100K SaaS + $200K oracle |
| Royalty Distributor | Reduces supply-side churn → sustained GMV → protocol fee revenue | 20% protocol fee on all GMV | Phase II | 85% | $90K (on $450K GMV) |
| The Graph Subgraph | Powers marketplace discovery UI → marketplace GMV | 20% protocol fee on marketplace transactions | Phase II | 90% | $18K indexing-enabled GMV |
| DAO Governor | Governance SaaS for enterprise clients + protocol fee governance | $50K–$250K/year enterprise API subscription | Phase IV | 80% | $41,667 from 6 enterprise clients |
| FHIR Adapter | EHR integration revenue + health system contracts | $50K–$150K per health system integration | Phase III | 75% | $25K from 2 health systems |
| REST API / Axum Backend | Enterprise API subscriptions + metered API usage | $50K–$250K/year enterprise; $0.01–$0.10/call | Phase III | 80% | $100K from 10 enterprise subscribers |
| WebSocket Royalty Streams | Holder retention → supply-side floor maintenance → GMV | Bundled with enterprise subscription | Phase III | 90% | Retention value; no direct billing |
| ERC-4337 Account Abstraction | Reduces onboarding friction → holder volume → GMV | Built into vault fee; no direct billing | Phase II | — | Demand-side growth enabler |
| VCF/FASTQ/BAM Parser | Sequencing SDK licensing + VaaS setup fee | $10K/year per sequencing provider | Phase II | 90% | $8,333 from 10 providers |
| IPFS/Filecoin Storage Layer | VaaS managed storage fee | $5K/month per 10K vaults managed | Phase III | 60% | $15K from 3 VaaS clients |
| DNaIToken.sol (ERC-721) | Per-mint fee + sequencing partner onboarding | $5/genome minted + $10K/partner | Phase II | 92% | $5K on 1K new mints |
| ConsentRegistry.sol | Consent Oracle revenue + smart contract license | $0.001/verification call | Phase II | 85% | $200K at 10M verifications |
| RoyaltyDistributor.sol | Protocol fee capture | 10% treasury cut on all royalty flows | Phase II | 92% | $45K from 10% of $450K GMV |
| AccessController.sol | ZK-gated access fee enforcement | Per-access fee enforcement (bundled) | Phase III | — | Revenue enforcement layer |
| DNaIGovernor.sol | Governance SaaS + contract licensing | $50K fixed license fee per enterprise | Phase IV | 88% | $20,833 from 5 enterprise licenses |
| Noir ZK Circuits (WASM) | ZKPaaS per-proof revenue + AI gating | $0.10/proof; $500/mo bundle | Phase III | 80% | $10K direct; enables AI licensing |
| TEE Proving Server (Rust) | ZKPaaS premium tier (server-side proving) | Included in ZKPaaS bundle | Phase III | 70% | Premium UX; part of ZKPaaS |
| dnai-sequencing-sdk (npm/PyPI) | SDK licensing + partner onboarding fees | $10K/year commercial license | Phase II | 90% | $8,333 MRR from 10 providers |

---

### 1.2 Component Deep-Dives

#### 1.2.1 Client-Side Vault Encryption → Compliance Certification Revenue

**How it generates revenue:** The client-side AES-256-GCM + Argon2id + ECDH pipeline is DNaI's primary trust differentiator. The cryptographic guarantee that no server ever sees plaintext genomic data is the foundation on which Cloud Control LLC issues the "DNaI Consent Verified" compliance certification to enterprise partners.

Enterprise pharma, biobanks, and health systems are subject to HIPAA, GDPR Article 9, and FDA 21 CFR Part 11. They need a third-party attestation that the data they are accessing was vaulted with cryptographic integrity guarantees. The client-side encryption architecture makes that attestation credible and legally defensible.

**Revenue mechanism:**
- Annual certification fee: $25,000–$100,000 per enterprise partner
- Certification scope: smart contract audit of their access pattern, consent rate reports, ZK proof verification log attestation, HIPAA technical safeguard mapping verification
- Renewal: annual; $15,000–$50,000 for re-certification
- Volume pricing: 10+ certified partners receive 20% discount

**Pricing rationale:** Trail of Bits charges $30K–$150K for a single smart contract audit. Our certification bundles on-chain audit trail evidence with a continuous compliance monitoring dashboard, justifying the $50K midpoint price for a single-jurisdiction enterprise. Multi-jurisdiction bundle (10+ countries): $50K–$200K/year.

**Enterprise trust premium:** Pharma partners with DNaI Consent Verified status can represent to IRBs and regulators that their genomic data pipeline has cryptographic proof of participant consent. This reduces their regulatory cost and accelerates trial approvals. The trust premium they receive justifies the certification fee multiple times over.

**Phase activation:** Phase III (Oct 2–Nov 15). First 3 certifications targeted as Phase III success metric; 15 certifications by Phase IV = $375K–$1.5M ARR depending on mix.

---

#### 1.2.2 ZK Proof Layer → AI Dataset Licensing + Inference API Revenue

**How it generates revenue:** The Noir ZK circuit layer (variant presence, PRS range, ancestry range, pharmacogenomic circuits) is the gating mechanism for the AI dataset marketplace. An AI company cannot access a consented genomic dataset for model training unless it submits a ZK proof of authorization alongside the access request. This creates two revenue channels:

1. **AI Dataset Licensing:** ZK-gated consent enforcement makes dataset licenses legally defensible (proof of consent is on-chain and cryptographically verifiable). This justifies $5K–$50K per training dataset license. Without ZK proofs, licenses are just contracts; with ZK proofs, they are cryptographically enforced — a product differentiation that commands premium pricing.

2. **ZKPaaS Per-Proof Revenue:** The circuits compiled to WASM + server-side TEE proving capability become a public API product. Any genomic or biotech company that needs privacy-preserving proofs can call DNaI's ZKPaaS API rather than building ZK infrastructure from scratch.

**Revenue from ZK layer:**
- AI dataset licensing: $50K MRR at Phase III (20 licenses × $2,500 avg per revenue model)
- ZKPaaS API: $0.10/proof; $10K MRR at Phase III (100K proofs/month)
- Total ZK-enabled revenue: $60K MRR by Phase III

**Phase activation:** ZK circuits complete in Phase I (Week 4 deliverable: variant presence circuit on Sepolia). ZKPaaS public beta: Phase III (Oct 2026). Production SLA: Phase IV (Nov 2026).

---

#### 1.2.3 Consent Registry (On-Chain) → Audit Trail SaaS + Compliance Dashboard Revenue

**How it generates revenue:** `ConsentRegistry.sol` emits structured on-chain events for every consent grant, revocation, and access consumption. The Graph subgraph indexes these events into a queryable graph database. This creates the raw data for two directly billable products:

1. **Audit Trail SaaS (Compliance Dashboard):** Enterprise compliance teams pay $2,000–$10,000/month for a live dashboard showing all consent grants, access events, revocations, and royalty flows for their organization's data access activity. This dashboard auto-generates GDPR Article 30 records, HIPAA audit reports, and FDA 21 CFR Part 11 electronic records. One-click regulatory reporting eliminates days of manual compliance work per quarter.

2. **Consent Oracle API (Section 4 below):** The on-chain consent registry enables real-time consent verification for third-party EHR, pharma, and research pipelines at $0.001/verification call.

**Revenue from consent registry:**
- Audit Trail SaaS: 20 enterprise subscribers × $5K/month = $100K MRR (Phase III target)
- Consent Oracle verifications: 10M calls/month × $0.001 = $10K MRR (Phase III low estimate); $200K MRR at full scale
- Total: $110K–$300K MRR from consent registry data products

**Phase activation:** ConsentRegistry.sol live on Sepolia in Phase I (Week 3). Consent Oracle API: Phase II (first enterprise subscriber). Audit Trail SaaS dashboard: Phase III (requires The Graph integration complete).

---

#### 1.2.4 Royalty Distributor → Reduced Supply-Side Churn → Sustained GMV

**How it generates revenue:** `RoyaltyDistributor.sol` is the protocol's retention engine for the supply side (genome holders). The royalty distributor processes streaming micropayments to genome holders every time their data is accessed under a consent grant. The 80% owner / 10% treasury / 7% research pool / 3% referral split is encoded on-chain and immutable without a governance vote.

The direct revenue this contract produces is the 10% treasury cut on all royalty flows — $45K/month at Phase III GMV of $450K. But the indirect revenue effect is more significant: genome holders who are actively earning from their data do not revoke consent grants. Supply-side retention directly protects GMV.

**Supply retention economics:**
- A holder earning $15–$150/month in genomic royalties has a concrete incentive to maintain active consent grants
- Churn modeled at 5% monthly without royalty streaming vs. 1% with active royalties visible in real-time (Sablier v2 streams)
- At 3,000 active listings (Phase III target), 4% churn reduction = 120 fewer delisted genomes/month
- At $150/genome/month average access price, 120 retained listings = $18K/month GMV protection
- Over 12 months: $216K GMV preserved by the royalty retention effect

**Sablier v2 Phase III upgrade:** Replace pull-payment pattern with Sablier v2 streaming so holders see real-time balance growth. The "genomic royalty stream" narrative — watching your earnings accumulate second-by-second — is a core product differentiator for supply-side onboarding and retention.

**Phase activation:** `RoyaltyDistributor.sol` on Sepolia in Phase I (Week 3). Pull-payment pattern at launch. Sablier v2 streaming upgrade: Phase III Week 13–14.

---

#### 1.2.5 The Graph Subgraph → Marketplace Discovery UI → Marketplace GMV

**How it generates revenue:** The Graph subgraph (`cloudcontrolllc/dnai-consent`) indexes all on-chain events into a GraphQL API. This is the data infrastructure for the marketplace discovery UI — the product that demand-side buyers (pharma, research, AI companies) use to browse available genomic data by scope, ancestry, condition, cohort size, and variant.

Without The Graph, the marketplace UI would require archive node RPC calls for historical consent data, making search queries prohibitively slow and expensive for real-time browsing. The Graph reduces query latency to < 200ms for historical data, enabling the product experience that drives marketplace GMV.

**Revenue chain:**
- The Graph powers the marketplace search and filter UI
- Marketplace UI enables buyers to discover and purchase access to specific genomic cohorts
- Each marketplace transaction generates a 20–30% protocol fee
- Phase III GMV target: $450K/month → $90K protocol fee revenue

**Indexed entities and their revenue relevance:**
- `ConsentGrantedEvent` → enables buyer search for "available genome, variant X, scope ANCESTRY_INFERENCE"
- `RoyaltyDistributedEvent` → powers supply-side dashboard showing earnings (retention)
- `AccessConsumedEvent` → audit trail for compliance dashboard SaaS
- `TokenMintedEvent` → new supply listing notifications for demand side

**Phase activation:** Subgraph deployed to hosted service for Sepolia in Phase I (Week 5, Aug 1). Production mainnet subgraph: Phase III (Oct 8 per playbook Week 13 timeline). Query cost at scale: ~$200/month for hosted service; migrates to decentralized Graph Network at Phase IV for cost optimization.

---

#### 1.2.6 DAO Governor → Governance SaaS for Enterprise Clients

**How it generates revenue:** `DNaIGovernor.sol` (OpenZeppelin Governor extension) provides on-chain governance for the DNaI protocol. The governance mechanism itself is not the product — the governance infrastructure and institutional tooling built around it is. Enterprise clients who need auditable, on-chain decision records for their genomic data programs will pay for white-label governance infrastructure.

**Three governance revenue streams:**

1. **Protocol fee governance:** The DAO governs royalty split percentages, protocol fee rates, and access scope definitions. Enterprise partners who want to influence these parameters need to hold governance tokens and participate in the DAO — creating token demand and secondary liquidity effects.

2. **Enterprise Governance SaaS:** An institutional-grade governance dashboard — proposal drafting, vote delegation, multi-sig treasury management, on-chain audit records — sold to enterprise clients as a SaaS product. Pricing: $50K–$250K/year per enterprise subscriber. Target: pharma compliance teams and national health programs who need auditable governance of their genomic data programs.

3. **Smart Contract Licensing — Governance Module:** The `DNaIGovernor.sol` contract, configured for genomic protocol governance with genomic data-specific parameters (quorum thresholds for medical decisions, timelock durations matching IRB review cycles), is licensed to other genomic biobanks and national health programs as a standalone module. See Section 6 for full licensing terms.

**Phase activation:** `DNaIGovernor.sol` skeleton in Phase I (Week 3). DAO deployed to mainnet: Phase III (Week 17, Oct 30–Nov 5). Enterprise Governance SaaS: Phase IV. Licensing revenue: Phase IV.

---

#### 1.2.7 FHIR Adapter → EHR Integration Revenue + Health System Contracts

**How it generates revenue:** The FHIR R4 adapter (Phase III, Week 14: Oct 9–15) translates between genomic vault access flows and the HL7 FHIR standard used by Epic, Cerner, and Athena. This adapter is the integration layer that converts health system patients into DNaI genome holders at scale — and unlocks EHR-specific revenue contracts.

**Revenue streams from FHIR adapter:**

1. **Health system integration contracts:** Epic, Cerner, and Athena integrations are sold as professional services contracts to the health systems. Pricing: $50,000–$150,000 per health system integration (setup) + $5,000–$20,000/month ongoing SaaS. Target: 3 EHR integrations by Phase III, 10 by Phase IV.

2. **Per-patient enrollment revenue:** As patients consent to genomic vaulting at the point of EHR genomic test ordering, each new genome holder minted through an EHR integration triggers the $5/genome minted sequencing partner fee (aligned with sequencing provider licensing model — same fee structure applies to EHR-channel mints).

3. **Scale multiplier on protocol GMV:** EHR integrations are the highest-volume onboarding channel. At 3 health system integrations (Phase III), each system contributing 500 new genome holders/month = 1,500 new holders/month = $225K/month additional GMV potential (at $150/genome avg access × 30% participation rate).

**FHIR adapter product specification:**
- Supports FHIR R4 `Observation` resources for genomic variants (GenomicStudy, MolecularSequence profiles)
- OAuth 2.0 SMART on FHIR authorization flow
- Consent capture at point of EHR order — integrates consent grant directly into vault mint flow
- Returns `DNaIToken` address and vault confirmation to EHR as FHIR `DocumentReference`
- Pricing for standalone FHIR adapter license (for health systems building their own integration): $25,000/year

**Phase activation:** FHIR adapter v0.1 in Phase III (Week 14, Oct 15). First health system integration: Phase III close. Revenue contracts: Phase III–IV.

---

## 2. Vault-as-a-Service (VaaS) Product Specification

### 2.1 Product Definition

Vault-as-a-Service (VaaS) is a white-label genomic vault deployment that DNaI operates on behalf of enterprise clients — pharma companies, biobanks, academic medical centers, and national health programs — who want to offer their own genomic sovereignty platform to participants without building the cryptographic infrastructure themselves.

The VaaS client gets a fully operational, DNaI-protocol-compatible genomic vault under their own brand, with their own participant base, governed by their own consent parameters, but anchored to the DNaI protocol for interoperability, ZK proofs, and marketplace access.

### 2.2 Technical Specification

**Deployment Model: Multi-Tenant with Logical Isolation**

```
DNaI VaaS Infrastructure (AWS, multi-region)
├── Tenant: PharmaClient-A
│   ├── Dedicated API subdomain: api.vault.pharmaa.com (CNAME → vaas.dnai.io)
│   ├── Isolated PostgreSQL schema: tenant_pharmaa
│   ├── Dedicated IPFS namespace: /pharmaa/vaults/
│   ├── Tenant-specific smart contract roles: MINTER_ROLE granted to pharmaa deployer
│   └── Tenant-specific royalty split config: pharma-defined participant payout %
├── Tenant: BiobankClient-B
│   └── (same isolation structure)
└── Tenant: HealthSystemClient-C
    └── (same isolation structure)
```

**VaaS Technical Components:**

| Component | Specification |
|-----------|---------------|
| Vault API | Multi-tenant Rust/Axum instance; tenant isolation via API key + schema routing |
| Encryption | Same AES-256-GCM + Argon2id + ECDH pipeline as core DNaI; client-side WASM SDK provided |
| Storage | Dedicated Filecoin storage allocation; IPFS namespace per tenant; 3-replica minimum |
| Smart Contracts | Tenant uses DNaI mainnet contracts with tenant-specific MINTER_ROLE grant; no separate deployment required |
| ZK Proofs | Same Noir circuits; tenant can specify which proof types to enable for their participants |
| Consent Oracle | Tenant gets dedicated Consent Oracle API endpoint; metered separately from core protocol |
| Compliance Dashboard | White-labeled audit trail dashboard under tenant branding |
| Royalty Distribution | Configurable split: tenant can adjust owner % within protocol-enforced floor (≥ 60% to participant) |
| Key Recovery | ERC-4337 guardians: tenant deploys their own guardian contract; Cloud Control LLC guardian optional |
| FHIR Integration | Optional add-on: FHIR R4 adapter pre-configured for EHR onboarding |

**API Surface (VaaS-Specific):**

```
POST /vaas/tenant/{tenant_id}/vault/upload    — Vault creation for tenant participant
POST /vaas/tenant/{tenant_id}/token/mint      — Token mint under tenant brand
POST /vaas/tenant/{tenant_id}/consent/grant   — Tenant-governed consent flow
GET  /vaas/tenant/{tenant_id}/analytics       — Tenant dashboard metrics
GET  /vaas/tenant/{tenant_id}/compliance/export — HIPAA/GDPR audit export
POST /vaas/admin/tenant/provision             — Onboard new VaaS tenant (internal)
```

### 2.3 Pricing Model

| Fee Component | Amount | Notes |
|---------------|--------|-------|
| Setup fee (one-time) | $50,000 | Includes tenant provisioning, white-label configuration, FHIR adapter (if applicable), and 40 hours professional services |
| Monthly managed fee | $5,000 per 10,000 vaults managed | Pro-rated monthly; minimum 10,000 vaults (i.e., $5K/month floor regardless of actual vault count in early months) |
| Consent Oracle calls | $0.001/verification (bundled: $200/month per 500K calls) | Metered; tenant passes through to their own compliance pipeline |
| ZKPaaS proofs | $0.10/proof or $500/month per 10K bundle | Tenant may bundle into participant-facing product at their own price |
| FHIR Adapter add-on | $25,000/year | If not included in setup |
| Overage vaults | $0.50/vault/month above contracted tier | Billed at end of month |

**Revenue calculation for 3 VaaS clients (Phase IV target):**

| Client Type | Setup | Monthly Managed Fee (10K vaults/client) | Annual Value |
|-------------|-------|------------------------------------------|--------------|
| Pharma Biobank | $50K one-time | $5,000/month | $110,000 Year 1 |
| Academic Medical Center | $50K one-time | $5,000/month | $110,000 Year 1 |
| National Health Program | $50K one-time | $5,000/month | $110,000 Year 1 |
| **Total (3 clients)** | **$150K** | **$15K/month** | **$330K Year 1** |

Add-ons (Consent Oracle + ZKPaaS across 3 tenants): ~$15K/month → $180K/year

**Total VaaS ARR (3 clients, Phase IV):** $330K + $150K setup amortized + $180K add-ons ≈ **$510K Year 1 revenue**. Recurring ARR from Year 2 (setup not recurring): **$360K ARR**. Revenue model target of $450K ARR for 3 VaaS clients (from `revenue-model.md`) is achievable by Year 1 end with setup fees included and slight add-on penetration above baseline.

### 2.4 SLA Definition

| SLA Component | Tier 1 (Standard) | Tier 2 (Enterprise) | Tier 3 (Critical) |
|---------------|-------------------|---------------------|-------------------|
| API uptime | 99.5% monthly | 99.9% monthly | 99.99% monthly |
| Vault upload latency (50 MB VCF) | < 30 seconds | < 15 seconds | < 10 seconds |
| Consent Oracle latency | < 500ms p99 | < 200ms p99 | < 100ms p99 |
| ZK proof generation (server-side) | < 60 seconds | < 30 seconds | < 15 seconds |
| Filecoin retrieval (WGS BAM) | < 2 hours | < 1 hour | < 30 minutes |
| Support response (P1 incident) | 4 business hours | 2 business hours | 30 minutes (24/7) |
| Support response (P2) | 1 business day | 4 business hours | 2 business hours |
| Dedicated Slack channel | No | Yes | Yes |
| Dedicated CSM | No | No | Yes |

**Tier pricing add-on:** Tier 2: +$1,500/month. Tier 3: +$5,000/month.

### 2.5 VaaS Revenue Target Summary

| Metric | Phase III | Phase IV |
|--------|-----------|----------|
| VaaS clients | 1 pilot | 3 production |
| Monthly managed revenue | $5,000 | $15,000 |
| Setup fees collected | $50,000 | $150,000 |
| Add-on revenue (monthly) | $3,000 | $15,000 |
| Total MRR contribution | $8,000 | $30,000 |
| Annual contribution (Year 1) | $146,000 | $510,000 |

---

## 3. ZK Proof-as-a-Service (ZKPaaS) API

### 3.1 Product Definition

ZKPaaS is a public API for generating and verifying zero-knowledge proofs about genomic properties on demand. Any application developer — pharma data scientist, genomics startup, AI company, clinical trial operator — can call this API to generate a cryptographically valid proof about a genome holder's properties without requiring the raw sequence.

The API decouples ZK proof infrastructure from application development. Clients do not need to understand Noir circuits, Barretenberg proving backends, or WASM SIMD optimization. They submit a proof request via REST and receive a verified proof ready for on-chain submission.

### 3.2 Supported Proof Types

| Proof Type | Description | Typical Use Case | Circuit | Proving Time (Server) |
|------------|-------------|-----------------|---------|----------------------|
| `variant_presence` | Prove a specific variant (by rsID) is present/absent | Clinical trial eligibility screening | `circuits/variant_presence` | ~4 seconds |
| `prs_range` | Prove PRS score is above/below a percentile threshold | Insurance risk stratification (with consent) | `circuits/prs_range` | ~7 seconds |
| `ancestry_range` | Prove ancestry percentage meets a threshold | Ancestry-specific cohort research | `circuits/ancestry_range` | ~20 seconds |
| `pharmacogenomic` | Prove metabolizer status (e.g., CYP2D6 normal) | Personalized dosing verification | `circuits/pharmacogenomic` | ~3 seconds |
| `data_freshness` | Prove genome was sequenced after a date threshold | Trial data recency requirement | `circuits/data_freshness` | ~1 second |
| `kinship_non_relation` | Prove genetic non-relationship to another commitment | De-identification verification | `circuits/kinship` | ~25 seconds |

### 3.3 API Specification

**Base URL:** `https://zkp.dnai.io/v1`

**Authentication:** API key (header `X-DNaI-API-Key: <key>`); keys issued at `https://dashboard.dnai.io/zkpaas`

```
POST /prove
```

Request:
```json
{
  "proof_type": "variant_presence",
  "token_id": "12345",
  "public_inputs": {
    "target_variant_index": 104832,
    "expected_allele_encoding": 2,
    "genome_commitment": "0x3f2a..."
  },
  "proving_mode": "server_tee",
  "webhook_url": "https://client.example.com/proof-ready"
}
```

Response (synchronous for fast circuits < 10 seconds; async with webhook for slower):
```json
{
  "proof_id": "proof_01J9X...",
  "status": "completed",
  "proof": "0x1a2b3c...",
  "public_inputs": { ... },
  "circuit_version": "variant_presence_v1.2.0",
  "proved_at": 1751328044,
  "verification_gas_estimate": 350000,
  "on_chain_submission_ready": true
}
```

```
POST /verify
```

Verify a proof off-chain (cheaper pre-validation before on-chain submission):
```json
{
  "proof_type": "variant_presence",
  "proof": "0x1a2b...",
  "public_inputs": { ... }
}
```
Response: `{ "valid": true, "circuit_version": "variant_presence_v1.2.0" }`

```
GET /circuits
```

List all available circuit types, versions, and current constraint counts.

```
GET /proof/{proof_id}
```

Retrieve proof status and result for async requests.

```
GET /usage
```

Returns current billing period call counts, proof counts by type, and estimated bill.

### 3.4 Pricing Model

| Plan | Price | Included Proofs | Overage Rate | Target Customer |
|------|-------|----------------|--------------|-----------------|
| Pay-as-you-go | $0.10/proof | None | — | Startups, developers, evaluation |
| Starter bundle | $500/month | 10,000 proofs | $0.07/proof | Early-stage genomics companies |
| Growth bundle | $2,000/month | 50,000 proofs | $0.05/proof | Scale-stage companies |
| Enterprise | $10,000/month | 300,000 proofs | $0.04/proof | Pharma, large genomics platforms |
| VaaS-included | Bundled | Per-tenant allocation | At VaaS overage rate | VaaS tenants |

**Proof type price adjustments:**
- `variant_presence`, `pharmacogenomic`, `data_freshness`: standard price (fastest circuits)
- `prs_range`, `ancestry_range`: 1.5× price (more compute-intensive)
- `kinship_non_relation`: 2× price (most compute-intensive circuit)

### 3.5 Technical Implementation

**Proving Infrastructure:**

```
Client API Request
      │
      ▼
ZKPaaS API Gateway (Rust/Axum)
      │
      ├── Circuit: variant_presence, pharmacogenomic, data_freshness
      │     └── Barretenberg proving server (Rust, 8-core, direct)
      │           └── Proof returned in ~4 seconds
      │
      └── Circuit: prs_range, ancestry_range, kinship
            └── TEE proving cluster (AWS Nitro Enclaves)
                  └── Encrypted witness → TEE → proof returned in ~20 seconds
```

**Privacy model for server-side proving:**
- User sends encrypted witness to TEE (witness is encrypted with TEE public key)
- TEE decrypts witness inside enclave, generates proof, returns proof only
- TEE attestation available to users on request
- No raw genomic data exits the enclave
- Alternative: client-side WASM proving for users who do not trust TEE (browser or native client)

**Phase III target (after WASM SIMD optimization — Week 14 in Phase III):**
- `variant_presence` client-side: < 4.5 seconds (4× speedup from Phase I baseline of 18s)
- `prs_range` client-side: < 8 seconds (4× speedup from 32s baseline)

### 3.6 Revenue Projection

| Phase | Monthly Proofs | MRR | Notes |
|-------|---------------|-----|-------|
| Phase III public beta (Oct) | 10,000 | $1,000 | Pay-as-you-go early adopters |
| Phase III growth (Nov) | 50,000 | $5,000 | First bundle subscribers |
| Phase IV (Dec) | 150,000 | $15,000 | Enterprise contracts + AI gating |
| Year 2 (scale) | 1,000,000 | $70,000 | Multiple enterprise contracts |

ZKPaaS also enables the AI dataset licensing revenue by providing cryptographic proof of consent scope compliance. AI companies pay a premium for datasets backed by auditable ZK proof logs — the proof cost is a small fraction of the dataset license value.

### 3.7 Phase Timeline

- **Phase I (Week 4, Jul 22–26):** Variant presence circuit produces on-chain verifiable proofs on Sepolia. Proving time benchmarked.
- **Phase II:** Server-side TEE proving infrastructure deployed. ZKPaaS API alpha (internal only).
- **Phase III (Oct 2):** ZKPaaS public beta. Pay-as-you-go pricing active. Per-proof revenue begins.
- **Phase III (Nov 15):** Production SLA (99.5% uptime; < 10 second p99 for standard circuits).
- **Phase IV (Dec 1):** Enterprise bundle pricing active. First $10K/month enterprise ZKPaaS contract.

---

## 4. Consent Oracle API

### 4.1 Product Definition

The Consent Oracle API is a real-time consent verification endpoint that third-party systems embed into their data pipelines. Before any data access operation, the calling system queries the Oracle to confirm that a specific token holder has an active, unexpired consent grant for the requested scope by the requesting organization.

This product converts the on-chain `ConsentRegistry.sol` state into a simple, cacheable HTTP API that any pharma data engineer, EHR system, or AI pipeline can integrate without understanding blockchain data structures or The Graph GraphQL schema.

### 4.2 API Specification

**Base URL:** `https://oracle.dnai.io/v1`

**Authentication:** API key (header `X-DNaI-Oracle-Key: <key>`) + optional requester address signature for high-assurance queries.

#### Primary Verification Endpoint

```
GET /consent/verify?tokenId={X}&requester={Y}&scope={Z}
```

**Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `tokenId` | uint256 | DNaI token ID of the genome holder | `12345` |
| `requester` | address | Ethereum address of the data requester | `0xAbCd...` |
| `scope` | string | Consent scope requested | `VARIANT_SUBSET`, `DISEASE_RISK`, `ANCESTRY_INFERENCE` |
| `freshness` | integer (optional) | Max age of cached result in seconds (default 30) | `60` |

**Response:**

```json
{
  "valid": true,
  "token_id": "12345",
  "requester": "0xAbCd...",
  "scope": "VARIANT_SUBSET",
  "grant_id": "0x3f2a...",
  "granted_at": 1751328000,
  "expiry": 1782864000,
  "price_per_query_wei": "1000000000000000",
  "budget_remaining_wei": "450000000000000000",
  "zk_proof_required": true,
  "proof_types_accepted": ["variant_presence", "pharmacogenomic"],
  "verified_at": 1751500044,
  "oracle_signature": "0x...",
  "block_number": 21453892
}
```

**Invalid consent response:**

```json
{
  "valid": false,
  "token_id": "12345",
  "requester": "0xAbCd...",
  "scope": "FULL_GENOME",
  "reason": "NO_ACTIVE_GRANT",
  "verified_at": 1751500044,
  "oracle_signature": "0x..."
}
```

Possible `reason` values: `NO_ACTIVE_GRANT`, `GRANT_EXPIRED`, `GRANT_REVOKED`, `SCOPE_MISMATCH`, `BUDGET_EXCEEDED`, `TOKEN_NOT_FOUND`, `REQUESTER_NOT_AUTHORIZED`

#### Batch Verification Endpoint

For pipeline use cases requiring verification of many tokens in a single call:

```
POST /consent/verify/batch
```

Body:
```json
{
  "queries": [
    { "tokenId": "12345", "requester": "0xAbCd...", "scope": "VARIANT_SUBSET" },
    { "tokenId": "67890", "requester": "0xAbCd...", "scope": "DISEASE_RISK" }
  ],
  "freshness": 30
}
```

Response: `{ "results": [ { "valid": true, ... }, { "valid": false, ... } ] }`

#### Audit Log Endpoint

```
GET /consent/audit/{tokenId}?from={timestamp}&to={timestamp}
```

Returns chronological list of all consent events for a token: grants, revocations, access consumptions, budget depletion events. Used by enterprise compliance teams building their own audit pipelines.

### 4.3 Integration Patterns

**Pattern 1: EHR Data Pipeline Pre-Check**
```python
# Before each genomic data read in a pharma data pipeline:
response = requests.get(
    f"https://oracle.dnai.io/v1/consent/verify",
    params={"tokenId": token_id, "requester": PHARMA_WALLET, "scope": "VARIANT_SUBSET"},
    headers={"X-DNaI-Oracle-Key": API_KEY}
)
if response.json()["valid"]:
    # Proceed with data access
    access_genomic_data(token_id, scope="VARIANT_SUBSET")
else:
    log_access_denied(token_id, response.json()["reason"])
```

**Pattern 2: AI Training Pipeline Gate**
```python
# Before starting a training run on a cohort:
batch_response = requests.post(
    "https://oracle.dnai.io/v1/consent/verify/batch",
    json={"queries": [{"tokenId": t, "requester": AI_WALLET, "scope": "RESEARCH_AGGREGATE"} for t in cohort_ids]},
    headers={"X-DNaI-Oracle-Key": API_KEY}
)
valid_cohort = [r["token_id"] for r in batch_response.json()["results"] if r["valid"]]
```

**Pattern 3: Real-Time Clinical Trial Eligibility Check**
```javascript
// In a clinical trial enrollment system:
const consent = await fetch(
  `https://oracle.dnai.io/v1/consent/verify?tokenId=${patientTokenId}&requester=${TRIAL_SPONSOR}&scope=PHARMACOGENOMICS`,
  { headers: { 'X-DNaI-Oracle-Key': API_KEY } }
).then(r => r.json());

if (consent.valid && consent.expiry > Date.now() / 1000) {
  enrollPatient(patientTokenId);
}
```

### 4.4 Pricing Model

| Plan | Price | Included Verifications | Overage Rate | Target Customer |
|------|-------|----------------------|--------------|-----------------|
| Pay-as-you-go | $0.001/call | None | — | Developers, evaluation |
| Standard bundle | $200/month | 500,000 calls | $0.0008/call | Mid-size pharma data teams |
| Enterprise bundle | $1,000/month | 3,000,000 calls | $0.0005/call | Large pharma, EHR systems |
| Unlimited | $5,000/month | Unlimited | — | High-volume platforms |
| VaaS-included | Bundled | Per-tenant SLA | — | VaaS tenants |

**Batch verification discount:** Batch calls above 100 queries receive 20% discount on per-call rate.

### 4.5 Revenue Projection

| Phase | Monthly Calls | Pricing | MRR |
|-------|--------------|---------|-----|
| Phase II (first enterprise subscriber) | 500,000 | $200/month bundle | $200 |
| Phase III early (3 enterprise clients) | 5,000,000 | Mix of plans | $3,500 |
| Phase III scale (10M calls/month) | 10,000,000 | Enterprise + standard mix | $10,000 |
| Phase III full scale projection | 200,000,000 | Mix of plans | $200,000 |
| Phase IV | 500,000,000+ | Unlimited + enterprise | $500,000+ |

**The Phase III "10M verifications/month = $200K MRR" model:** This requires 200M monthly calls, not 10M — the $0.001 rate means $10K MRR at 10M calls. The $200K MRR figure from the specification prompt is achievable at 200M monthly verification calls — a realistic volume for 10,000 genome holders with pharma partners running automated pipeline verifications (~20 verification calls per genome per month per pharma partner × 10 pharma partners × 10,000 genomes = 2,000,000 calls, not 200M. The $200K MRR target is a Phase IV+ metric when genome holders reach 50,000+ and pharma partners reach 20+). Honest Phase III MRR target: $10,000–$20,000 from Consent Oracle.

### 4.6 Phase Timeline

- **Phase II (Week 9, Sep 1):** Consent oracle API alpha (internal). First enterprise subscriber onboarded.
- **Phase II (Week 12, Oct 1):** Oracle in production on testnet. First $200/month subscription signed.
- **Phase III (Week 13, Oct 8):** Oracle on mainnet. Batch endpoint live.
- **Phase IV:** Enterprise unlimited plans. Audit log endpoint commercial.

---

## 5. Data Pipeline SDK Licensing

### 5.1 Product Definition

The `dnai-sequencing-sdk` is a software library (published to npm and PyPI) that enables sequencing providers to trigger vault creation and token minting automatically when they deliver a completed genome to a customer. The SDK abstracts the vault encryption pipeline, IPFS upload, and DNaI token mint transaction into a few lines of code that integrate into an existing sequencing delivery pipeline.

### 5.2 Technical Specification

**npm Package:** `@dnai/sequencing-sdk`
**PyPI Package:** `dnai-sequencing-sdk`
**Languages:** TypeScript (primary); Python bindings via WASM + PyO3

**Core SDK Interface (TypeScript):**

```typescript
import { DNaISequencingSDK } from '@dnai/sequencing-sdk';

const sdk = new DNaISequencingSDK({
  apiKey: process.env.DNAI_API_KEY,          // Partner API key
  network: 'mainnet',                         // 'mainnet' | 'sepolia'
  partnerWallet: process.env.PARTNER_WALLET,  // Sequencing provider's Ethereum address
});

// Trigger vault creation + token mint from sequencing delivery:
const result = await sdk.vaultAndMint({
  customerWalletAddress: '0xABC...',    // Customer's wallet (provided at sequencing order)
  vcfFilePath: '/data/customer-001.vcf', // Raw VCF output from sequencer
  referenceGenome: 'GRCh38',
  fileFormat: 'VCF',
  notify: {
    webhookUrl: 'https://partner.com/dnai-callback',
    email: 'customer@example.com',
  }
});

// result = { tokenId, txHash, vaultCid, mintedAt, royaltySplit }
```

**Python Interface:**

```python
from dnai_sequencing_sdk import DNaIClient

client = DNaIClient(api_key=os.environ["DNAI_API_KEY"], network="mainnet")

result = client.vault_and_mint(
    customer_wallet="0xABC...",
    vcf_file_path="/data/customer-001.vcf",
    reference_genome="GRCh38",
)
print(f"Token minted: {result.token_id}")
```

**SDK Capabilities:**
- Client-side encryption via WASM (`vault-crypto` Rust crate compiled to WASM, embedded in SDK)
- Chunked IPFS upload with progress callbacks
- Automatic retry with exponential backoff for upload failures
- Filecoin deal status polling
- DNaI token mint transaction submission and confirmation
- Royalty split configuration for sequencing partner attribution
- Webhook delivery for post-mint notification
- Batch processing for high-throughput labs (queue-based, up to 1,000 genomes/hour per API key)

**Open-Source Core:** The open-source `@dnai/sequencing-sdk` package (MIT license) provides vault encryption, IPFS upload, and mint submission. It functions on the testnet without any API key.

**Commercial License features (beyond open-source core):**
- Mainnet API key (required for production minting)
- SLA-backed batch processing queue (guaranteed throughput)
- Priority support via Slack channel
- Custom webhook payloads
- Partner attribution for royalty split (3% partner referral from `RoyaltyDistributor.sol`)
- Volume discounts on per-genome minting fee

### 5.3 Pricing Model

| Component | Price | Notes |
|-----------|-------|-------|
| Commercial license (annual) | $10,000/year per sequencing provider integration | Covers one production API key; unlimited volume within rate limits |
| Per-genome minting fee | $5/genome minted | Passed through to DNaI protocol; partner earns 3% royalty attribution |
| Batch processing SLA tier | $2,000/month add-on | Guarantees 1,000 genomes/hour processing capacity |
| Professional services (integration) | $5,000 one-time | 20-hour integration assistance; optional |
| Multi-lab discount (3+ labs) | 25% off annual license | For sequencing providers with multiple laboratory sites |

**Revenue from 10 sequencing providers:**

| Stream | Calculation | Annual |
|--------|------------|--------|
| Commercial licenses | 10 × $10,000 | $100,000 |
| Per-genome fees (1,000 genomes/month/provider avg) | 10 × 1,000 × 12 × $5 | $600,000 |
| Batch SLA add-ons (5 providers × $2K/month) | 5 × $24,000 | $120,000 |
| **Total ARR from sequencing partners** | | **$820,000** |

Note: Per-genome fees ($600K) flow through the protocol fee structure — they are not pure margin. Of the $5/genome: $4/genome goes to the protocol treasury (10% of eventual royalty flows) plus direct mint fee; $1/genome is referral attribution to partner. Net protocol revenue from minting: ~$2/genome net after costs.

The $100K/year pure SDK licensing ARR (10 providers × $10K) matches the target from the specification. This is 90% gross margin revenue (essentially pure software licensing with minimal incremental cost).

### 5.4 Target Partners (Phase II–III)

| Sequencing Provider | Volume Estimate | Integration Priority |
|--------------------|-----------------|----------------------|
| Illumina DRAGEN | 5,000+ genomes/month | Tier 1 — highest volume |
| Dante Genomics | 1,000+ genomes/month | Tier 1 — DTC focus aligns with DNaI supply |
| Nebula Genomics | 2,000+ genomes/month | Tier 1 — crypto-native audience |
| GeneDx | 500+ genomes/month | Tier 2 — clinical focus |
| Veritas Genetics | 300+ genomes/month | Tier 2 |
| Color Genomics | 200+ genomes/month | Tier 2 — employer wellness |
| Invitae | 400+ genomes/month | Tier 3 — clinical |
| Blueprint Genetics | 200+ genomes/month | Tier 3 |
| PreventionGenetics | 150+ genomes/month | Tier 3 |
| CENTOGENE | 100+ genomes/month | Tier 3 — rare disease |

### 5.5 Phase Timeline

- **Phase I (Week 2, Jul 8):** SNP vector format specified; `vault-crypto` Rust crate implemented. SDK architecture defined.
- **Phase II (Week 7, Aug 16):** SDK alpha — `vaultAndMint()` end-to-end on Sepolia. First sequencing provider beta access.
- **Phase II (Week 11, Sep 15):** First sequencing partner integration live. $10K first license signed.
- **Phase III:** 3+ sequencing partners live. 1,000+ genomes minted/month via SDK.
- **Phase IV:** 10 providers. SDK ARR $100K. Genome holder supply 10K+ driven substantially by SDK channel.

---

## 6. Smart Contract Suite Licensing

### 6.1 Product Definition

The DNaI smart contract suite — `DNaIToken.sol`, `ConsentRegistry.sol`, `RoyaltyDistributor.sol`, `AccessController.sol`, `DNaIGovernor.sol` — represents a purpose-built genomic sovereignty protocol in audited, production-grade Solidity. Other genomic biobanks, national health programs, and biotech startups that want to build their own sovereign genomic data protocol can license the DNaI contract suite rather than rebuilding from scratch.

This is pure IP licensing revenue at ~90% gross margin.

### 6.2 License Tiers

**Tier 1: Evaluate License (Free)**
- Testnet deployment only (enforced by contract constructor check on chain ID)
- Full source code access
- Community Discord support
- No audit report provided
- No commercial deployment permitted
- Purpose: allow potential licensees to evaluate and build proof-of-concepts

**Tier 2: Production License ($50K–$100K one-time + 5% of protocol fees)**
- Mainnet deployment rights
- Named licensee entity written into contract deployment metadata
- Full source code + deployment scripts
- Cloud Control LLC audit report shared under NDA
- 6-month support via dedicated Slack channel
- Revenue share: 5% of licensee's protocol fee revenue in perpetuity (or until superseded by Enterprise tier)
- Upgrades: licensed to major version upgrades for 2 years

**Tier 3: Enterprise License ($150K–$500K/year fixed fee)**
- All Production License rights
- Revenue share waived (fixed annual fee instead)
- Customization rights: licensee may fork and modify with attribution requirement
- Dedicated integration engineering (40 hours/year)
- Priority security patches and upgrade support
- Multi-jurisdiction deployment rights
- Co-marketing: listed as "Powered by DNaI Protocol"
- Includes: governance module, FHIR adapter, ZKPaaS bundle allocation

### 6.3 Revenue Model

**Revenue share model (Production tier):**

| Licensee | Year 1 Protocol Volume | 5% Revenue Share |
|----------|----------------------|-----------------|
| National biobank (EU) | $2M GMV | $100K |
| Regional health program | $500K GMV | $25K |
| Biotech startup | $200K GMV | $10K |

**Fixed fee model (Enterprise tier):**

| Licensee Type | Fixed Annual Fee |
|---------------|-----------------|
| National genomic program (single country) | $150,000/year |
| Multi-national health consortium | $350,000/year |
| Global pharmaceutical genomics platform | $500,000/year |

**Phase IV target: 5 licensees × $50K average = $250K ARR**

Achievable mix: 2 Enterprise at $150K each = $300K; 3 Production at 5% protocol share (average $20K/year in Year 1) = $60K. Total: $360K ARR — exceeds the $250K target with a conservative licensee volume assumption.

### 6.4 Target Licensee Segments

| Segment | Rationale | Example Targets |
|---------|-----------|-----------------|
| National genomic programs | Government programs building national DNA registries need audited sovereignty stack | UK Biobank digital layer, NIH All of Us tech stack, Singapore National Precision Medicine |
| Academic biobanks | Research biobanks digitizing consent governance | Broad Institute data commons, deCODE Genetics |
| Biotech genomic platforms | Companies building genomic data products without wanting to build consent infrastructure | Genomics England commercialization partners, Color Genomics platform |
| Clinical genomics labs | Labs wanting to give patients sovereign control of their clinical results | GeneDx patient portal, Invitae patient data layer |

### 6.5 Phase Timeline

- **Phase I:** Contract suite architected and specified (Weeks 3–4).
- **Phase II:** Contracts on Sepolia; audit engagement initiated (Week 12). Evaluate license published on GitHub.
- **Phase III:** Audit complete; Production license available.
- **Phase IV:** Enterprise licensing program launched. First licensee signed. $250K ARR target.

---

## 7. Infrastructure Cost vs. Revenue Model

### 7.1 Monthly Infrastructure Cost by Phase

| Infrastructure Component | Phase I | Phase II | Phase III | Phase IV |
|--------------------------|---------|----------|-----------|----------|
| AWS (EC2, RDS PostgreSQL, ElastiCache Redis) | $800 | $2,000 | $6,000 | $15,000 |
| IPFS (self-hosted kubo node, Cloudflare gateway) | $200 | $500 | $1,500 | $4,000 |
| Filecoin storage (Lighthouse.storage, 3 replicas) | $500 | $2,000 | $8,000 | $25,000 |
| Ethereum RPC (Infura + self-hosted Erigon) | $200 | $500 | $1,500 | $3,000 |
| The Graph (hosted service → decentralized network) | $0 | $100 | $500 | $1,500 |
| TEE proving cluster (AWS Nitro Enclaves for ZKPaaS) | $0 | $500 | $3,000 | $8,000 |
| CDN + load balancing (Cloudflare) | $100 | $200 | $500 | $1,000 |
| Monitoring (Datadog / Grafana Cloud) | $100 | $300 | $800 | $2,000 |
| WebSocket infrastructure (tokio-tungstenite scaling) | $0 | $200 | $1,200 | $3,000 |
| **Total Infrastructure MRR** | **$1,900** | **$6,300** | **$23,000** | **$62,500** |

Note: Phase II includes the $45,000 one-time smart contract audit (playbook budget); this does not appear in monthly infrastructure. Annualized audit amortization: $3,750/month over 12 months.

### 7.2 Gross Margin by Revenue Stream

| Revenue Stream | Gross Revenue (Phase III MRR) | COGS (Infrastructure Allocation) | Gross Margin % |
|---------------|-------------------------------|----------------------------------|----------------|
| Protocol fees (20% of GMV) | $90,000 | $13,500 (storage, compute, RPC) | **85%** |
| Enterprise API subscriptions | $100,000 | $25,000 (compute, support, infra) | **75%** |
| AI dataset licensing | $50,000 | $5,000 (ZK compute, API serving) | **90%** |
| Consent Oracle API | $10,000 | $1,500 (API compute) | **85%** |
| ZKPaaS proofs | $5,000 | $2,000 (TEE compute) | **60%** |
| Compliance certifications | $31,250 | $3,125 (audit tools, labor) | **90%** |
| Sequencing SDK licensing | $8,333 | $833 (support, hosting) | **90%** |
| VaaS managed fee | $8,000 | $4,000 (storage, compute) | **50%** |
| **Blended Phase III** | **~$302,583** | **~$55,000** | **~82%** |

**Observation:** The lowest-margin products are ZKPaaS (60% — TEE compute is expensive at low volume) and VaaS (50% at pilot scale due to fixed per-tenant overhead). Both improve significantly at scale: ZKPaaS approaches 80% GM at 1M proofs/month; VaaS approaches 75% GM at 10+ tenants sharing infrastructure overhead.

### 7.3 Break-Even Analysis

**Fixed infrastructure cost to cover:** $23,000/month (Phase III)

| Revenue Stream | MRR Required to Cover Infra (at respective GM) |
|---------------|------------------------------------------------|
| Protocol fees alone (85% GM) | $27,059/month GMV-derived protocol revenue |
| Enterprise API subscriptions (75% GM) | $30,667/month subscription revenue |
| Mixed (blended 82% GM) | $28,049/month blended revenue |

**Break-even GMV:** Protocol fee revenue = GMV × 20%. To generate $27,059 in protocol fee revenue: GMV = $135,295/month. This is a 3,000-genome active listing pool × $45/genome average (lower than the $150 full price due to early-stage discounting) × 30% participation rate.

**Phase II break-even:** Phase II infrastructure cost is $6,300/month.
- Required MRR to break even: $6,300 / 0.75 blended GM = $8,400 MRR
- Phase II target MRR: $22,500 — exceeds break-even by $14,100/month
- Break-even achieved at Phase II with first pilot agreement signed

**Phase III break-even:** $23,000 / 0.82 = $28,049 MRR required.
- Phase III MRR target: $300,000 — achieves break-even easily; operates at $277K gross profit
- True break-even achieved approximately 3 weeks after Phase III mainnet launch, assuming MRR ramp of $10K/week in first month

**Phase IV:** Infrastructure $62,500/month; MRR target $750,000; gross profit at 80% GM = $600,000/month. Infrastructure represents only 8.3% of revenue.

### 7.4 Infrastructure Scaling Assumptions

- **Storage:** Each genome vault (WGS BAM format) is ~60 GB encrypted. At 10,000 genome holders (Phase III), total managed storage: ~600 TB. Filecoin cost at $0.01/GB/month for 3-replica: $600,000/month is **not** the actual cost — Filecoin cold storage is substantially cheaper. Actual Lighthouse.storage pricing: ~$0.000000000000001 FIL/byte/epoch ≈ $3/TB/month. 600 TB × $3 = $1,800/month cold storage. Hot IPFS retrieval adds $6,000/month for gateway bandwidth. Total: $8,000/month for storage, which matches the Phase III estimate above.
- **RPC costs:** Base L2 transaction cost ~$0.001–$0.01 per tx. At Phase III: 30 consent grants/day × 30 days = 900 txns/month + 1,000 mints/month + royalty distributions = ~5,000 txns/month. At $0.005 avg: $25/month on-chain tx fees. RPC node cost ($1,500/month) is dominated by API call volume, not transaction costs.

---

## 8. Technical Debt Budget

### 8.1 Governing Principle

**Rule: Any technical component must map to a revenue line within 2 phases of its build, or it is cut from the roadmap.**

This means:
- A component built in Phase I must show direct or enabled revenue by Phase III (2 phases later)
- A component built in Phase II must generate or enable revenue by Phase IV
- No "foundational" work gets a pass unless it appears in the Architecture → Revenue Map (Section 1.1)

This rule applies at sprint planning. Every engineering task must reference a revenue line item before being added to the sprint. Tasks without a revenue reference go to a "technical debt parking lot" and are reviewed monthly — they either get a revenue connection identified or are formally removed from scope.

### 8.2 Velocity Trade-Off Framework

| Build Choice | Velocity Cost | Revenue Benefit | Decision |
|-------------|--------------|-----------------|----------|
| Formal Rust error types + full test coverage | -20% velocity | Reduces outage risk → SLA compliance → enterprise subscription retention | Build it. SLA compliance is a revenue driver. |
| Pull-payment over Sablier streaming in Phase II | +15% velocity (simpler) | Streaming improves retention narrative but is not required for first revenue | Defer streaming. Pull-payment in Phase II; streaming in Phase III. |
| Full FASTQ/BAM parsing vs. VCF-only in Phase I | -30% velocity | BAM required for clinical-grade VaaS clients | VCF-only in Phase I. BAM in Phase II (gated behind VaaS client commitment). |
| Circom fallback circuits alongside Noir | -25% velocity | Reduces single-framework risk | Defer. Circom fallback only if Noir soundness audit reveals critical issue. |
| GraphQL subscriptions (real-time) vs. polling | -15% velocity | Powers real-time royalty UX → retention | Build subscriptions. Retention is revenue. |
| Formal verification of contracts | -40% velocity | Increases audit confidence but audit already budgeted | Defer. Foundry invariant tests + fuzzing is sufficient for Phase II audit. |
| Multi-chain deployment (Base + Arbitrum) | -30% velocity | Adds addressable market but no committed revenue on second chain | Defer. Base only until a signed contract requires Arbitrum. |

### 8.3 Audit and Security Spend as % of Revenue

| Phase | Security Spend | Projected Revenue | % of Revenue | Target % |
|-------|---------------|-------------------|--------------|----------|
| Phase I | $0 (design only; RFP preparation) | $0 | N/A | N/A |
| Phase II | $45,000 (smart contract audit) + $10,000 (ZK circuit review) = $55,000 | $22,500 MRR × 1.5 months = $33,750 | 163% | 15%* |
| Phase III | $20,000 (penetration test) + $10,000 (quarterly dep review) = $30,000/period | $300K MRR × 1.5 months = $450,000 | 6.7% | 8% |
| Phase IV | $15,000 (annual pen test amortized) + $5,000 (bug bounty payouts avg) | $750K MRR × 0.5 months = $375,000 | 5.3% | 8% |

*Phase II audit spend exceeds revenue because audit is a pre-revenue investment required to unlock Phase III revenue. The correct framing: audit spend is a Phase II cost that enables $270K ARR in Phase III. ROI on the $55K audit: ($270K ARR − $55K audit) / $55K = 390% in Year 1.

**Ongoing security budget target:** 8% of MRR beginning Phase III.
- Phase III: $300K MRR × 8% = $24,000/month → $288,000/year security budget
- Allocation: 40% external audit/pen test; 30% bug bounty (Immunefi); 20% internal security tooling; 10% transparency reporting

**Security spend as a revenue enabler:** Enterprise clients require evidence of security investment before signing contracts. A $45K audit report and an active Immunefi bug bounty program are qualifying criteria for pharma procurement. The $55K Phase II security investment is a prerequisite for closing $100K+ enterprise contracts in Phase III.

### 8.4 Technical Debt Parking Lot (Deferred Items)

The following items are tracked but not on the roadmap until a revenue connection is established:

| Item | Current Status | Revenue Connection Needed By | Action if Connection Not Found |
|------|---------------|------------------------------|-------------------------------|
| Circom fallback circuits | Deferred | Phase III | Cut entirely if Noir passes Phase II audit |
| Multi-chain deployment | Deferred | Phase IV (if contract requires) | Cut unless signed enterprise contract demands it |
| On-chain privacy via Aztec L2 | Research only | Phase IV | Cut if no enterprise buyer has regulatory requirement |
| Full FASTQ streaming parser | VCF-only in Phase I | Phase II (VaaS client commitment) | Cut if no VaaS client signed by Phase II |
| Formal verification (certora/dafny) | Not started | Phase IV | Cut unless audit firm requires it |
| Proof aggregation / recursive proofs | Specified | Phase III (ZKPaaS scale) | Cut if ZKPaaS volumes don't justify proving cost reduction |

---

## 9. Phase-Gated Technical Revenue Milestones

### 9.1 Phase I (Jul 1 – Aug 15): Architecture → Pipeline Enablement

**Revenue:** $0 direct. Architecture work enables all future revenue.

**Technical deliverables that directly gate future revenue:**

| Deliverable | Revenue it Unlocks | Gated Phase |
|-------------|-------------------|-------------|
| Smart contract architecture + Sepolia deployment | Enables first enterprise pilot conversation with live demo | Phase II |
| Variant presence ZK proof on-chain | Demonstrates AI dataset gating capability; required for pharma pilot signing | Phase II |
| REST API + OpenAPI spec | Required documentation for enterprise SDK integration; gating sequencing partner onboarding | Phase II |
| Security audit RFP sent (3 firms) | Audit engagement = prerequisite for mainnet deployment = prerequisite for revenue | Phase II |
| The Graph subgraph on Sepolia | Required for marketplace UI data layer; gates marketplace GMV | Phase III |
| HIPAA/GDPR compliance skeleton | Required for pharma partner NDA and data agreement execution | Phase II |

**Business milestone integration (Week 6, Aug 5–15):**
- Enterprise pricing sheet finalized (aligns with pricing in Sections 2–6 of this document)
- Partner outreach initiated (pipeline = future revenue; target ≥ 3 expressions of interest per playbook Phase I success metrics)
- First 5 outreach emails sent (Week 5, Aug 4 per playbook)

**Phase I gate:** No Phase II build begins until this architecture document (version 1.0) and `technical-architecture.md` are signed off by all technical leads (Phase I exit criterion: Aug 9, 2026).

---

### 9.2 Phase II (Aug 16 – Oct 1): First Technical Revenue

**Revenue targets:** $22,500 MRR; $270K ARR run rate (per `revenue-model.md`)

**Technical components activating in Phase II and their direct revenue:**

| Technical Milestone | Week | Revenue Event | Revenue Amount |
|--------------------|------|---------------|---------------|
| Consent Oracle API alpha (internal) | Week 9 (Sep 1) | First enterprise subscriber approached | $200/month (first bundle) |
| `dnai-sequencing-sdk` alpha on Sepolia | Week 7 (Aug 16) | First sequencing partner beta access | $10K license (Phase II close) |
| Smart contracts deployed to Sepolia (audit-ready) | Week 8 (Aug 23) | Enables audit engagement start; signals to pharma that mainnet is credible | Unblocks Phase III |
| End-to-end vault + mint + consent + royalty flow via REST API | Week 11 (Sep 13) | First pharma pilot data-access agreement executable | $22,500–$45,000 pilot |
| Security audit engagement kickoff (Trail of Bits / OpenZeppelin) | Week 12 (Sep 20) | Trust signal for enterprise sales | Unblocks Phase III |
| Revenue dashboard live | Week 9 | Internal tracking; required for Series A data room | Operational |

**Phase II revenue targets and technical owners:**

| Revenue Stream | Phase II Target | Technical Prerequisite | Owner |
|---------------|-----------------|----------------------|-------|
| First paid pilot agreement | $22,500 cash received | Smart contracts on Sepolia; consent flow working | BD + Smart Contracts |
| Consent Oracle API — first subscriber | $200/month | Consent Oracle API live | Backend |
| Sequencing SDK — first license | $10,000 | SDK alpha on Sepolia; partner integration | Backend + BD |
| Protocol fee contract on testnet | Enables Phase III | `RoyaltyDistributor.sol` + `AccessController.sol` on Sepolia | Smart Contracts |

---

### 9.3 Phase III (Oct 2 – Nov 15): Revenue Scale

**Revenue targets:** $300,000 MRR; $3.6M ARR run rate

**Technical activations driving Phase III revenue:**

| Technical Milestone | Week | Revenue Event | Monthly Revenue |
|--------------------|------|---------------|-----------------|
| Mainnet deployment (all contracts) | Week 13 (Oct 8) | Protocol fee revenue begins — every access = revenue | $90K (at $450K GMV) |
| ZKPaaS public beta | Week 13 (Oct 8) | Per-proof revenue active | $1,000–$5,000 |
| Consent Oracle on mainnet (batch endpoint) | Week 13 | Enterprise oracle subscribers | $3,500 |
| The Graph on mainnet | Week 13 | Marketplace discovery UI operational | Enables GMV |
| FHIR adapter v0.1 | Week 14 (Oct 15) | Health system integration contracts | $25,000 (2 contracts) |
| Sablier v2 streaming royalties | Week 14 | Supply-side retention improvement | Protects GMV |
| Compliance certification program launch | Week 15 (Oct 22) | First 3 certifications | $75,000 ARR |
| ZKPaaS production SLA | Week 18 (Nov 15) | Enterprise ZKPaaS contracts eligible | $10,000 |
| VaaS pilot (first enterprise tenant) | Week 17 (Nov 5) | First VaaS pilot contract | $55,000 (setup + first month) |
| Audit Trail SaaS dashboard | Week 16 (Oct 29) | Enterprise compliance subscriptions | $10,000/month (2 subscribers) |
| Enterprise API subscriptions (3+ active) | Week 15 | SaaS recurring revenue | $150,000 ARR |
| AI training license — first deal | Week 18 | AI dataset revenue | $5,000 one-time |

**Phase III Technical Revenue Stack (Month End Nov 15):**

```
Protocol fees (20% of $450K GMV)                    =  $90,000/month
Enterprise API subscriptions (10 × $10K avg)         = $100,000/month
Audit Trail SaaS (20 × $5K avg)                      = $100,000/month
Consent Oracle API (~5M calls/month)                 =   $5,000/month
Compliance certifications (amortized)                =  $41,667/month ($500K ARR / 12)
FHIR integration revenue (amortized)                 =  $12,500/month
ZKPaaS API                                           =   $5,000/month
VaaS (pilot, 1 client)                              =   $8,000/month
AI dataset licensing (1 deal, amortized)             =   $4,167/month
Sequencing SDK licensing (3 partners)                =   $2,500/month
                                         TOTAL MRR = ~$368,834
```

This exceeds the $300K MRR Phase III target by ~23%. The delta provides buffer against slower-than-projected enterprise sales cycles.

---

### 9.4 Phase IV (Nov 16 – Dec 1): Full Technical Revenue Stack Operational

**Revenue targets:** $750,000 MRR; $9M ARR run rate

**Phase IV technical activations:**

| Technical Milestone | Week | Revenue Event | Revenue Contribution |
|--------------------|------|---------------|---------------------|
| Smart contract licensing program launch | Week 19 (Nov 16) | First enterprise licensee signed | $150,000/year |
| AI marketplace smart contract architecture | Week 20 (Nov 23) | AI marketplace soft launch | $50,000 MRR target |
| Sovereign genomic data index | Week 21 (Nov 27) | Premium index access subscriptions | $10,000 MRR |
| ZKPaaS enterprise bundle pricing active | Week 19 | First $10K/month enterprise ZKPaaS | $10,000 MRR |
| VaaS 3 production clients | Week 20 | $15K/month recurring managed fees | $15,000 MRR |
| DAO governance SaaS enterprise tier | Week 21 | First enterprise governance subscription | $20,833/month |
| Contract licensing (5 licensees by Phase IV close) | Week 22 (Dec 1) | $250K ARR licensing revenue | $20,833/month |
| Series A narrative + data room | Week 21 | Funding event (not revenue but revenue-enabling) | $3M–$10M capital |

**Phase IV Revenue Target Reconciliation:**

| Stream | Monthly Target | Technical Stack |
|--------|---------------|-----------------|
| Protocol fees | $400,000 | GMV of $2M/month at 20% fee |
| Enterprise API subscriptions | $150,000 | 30 enterprise subscribers × $5K avg |
| AI licensing | $100,000 | 20 licenses × $5K avg |
| Compliance certifications | $62,500 | 15 certified × $50K avg / 12 |
| Marketplace listing fees | $20,000 | 1% of $2M GMV |
| Contract licensing | $20,833 | 5 licensees × $50K avg / 12 |
| VaaS managed fees | $15,000 | 3 clients × $5K/month |
| ZKPaaS | $10,000 | 100K proofs × $0.10 avg |
| Consent Oracle | $5,000 | 5M calls × $0.001 |
| SDK licensing | $8,333 | 10 providers × $10K / 12 |
| Governance SaaS | $20,833 | 5 enterprise subscribers × $50K / 12 |
| **TOTAL** | **$812,499** | All technical components active |

The $750K MRR target from the revenue model is achievable by Phase IV. The full technical revenue stack — VaaS + ZKPaaS + Consent Oracle + SDK + Contract Licensing + Protocol Fees + Enterprise API + AI Licensing — is operational by Dec 1, 2026 (Week 22).

---

### 9.5 Revenue Milestone Summary (22-Week Playbook Integration)

| Week | Playbook Event | Technical Milestone | Revenue Event |
|------|---------------|--------------------|--------------------|
| 1 (Jul 1) | Project initialization | Repo structure; toolchain | — |
| 4 (Jul 22) | ZK circuit dev | Variant presence circuit | — |
| 5 (Aug 1) | API layer | The Graph on Sepolia | — |
| 6 (Aug 9) | Phase I close | Architecture v1.0 signed | Pipeline conversations begin |
| 7 (Aug 16) | Phase II kickoff | SDK alpha on Sepolia | First sequencing partner outreach |
| 9 (Sep 1) | On-chain consent | Consent Oracle API alpha | First oracle subscriber approached |
| 11 (Sep 13) | Partner agreements | Full flow on testnet | First pharma pilot agreement signed |
| 12 (Sep 20) | Genesis prep | Audit engagement start | $10K SDK license signed |
| **12 (Oct 1)** | **Phase II close** | **First pilot $22,500 received** | **First direct revenue** |
| 13 (Oct 8) | Mainnet launch | All contracts on mainnet | Protocol fee revenue begins |
| 14 (Oct 15) | EHR integration | FHIR adapter v0.1 | Health system contracts |
| 15 (Oct 22) | Research APIs | Consent Oracle mainnet | Batch oracle revenue |
| 17 (Nov 5) | Governance DAO | DAO on mainnet | VaaS pilot contract |
| 18 (Nov 15) | Phase III close | Full enterprise stack live | $300K MRR target |
| 19 (Nov 16) | Standards / multi-omics | Contract licensing launch | First $150K enterprise license |
| 20 (Nov 23) | AI marketplace | AI marketplace architecture | AI marketplace GMV begins |
| 21 (Nov 27) | Data index | Sovereign index + search | Premium index subscriptions |
| **22 (Dec 1)** | **Phase IV close** | **Full revenue stack operational** | **$750K MRR target** |

---

## Appendix A: Revenue Stack by Technical Layer

```
REVENUE LAYER MAP — DNaI Architecture

INFRASTRUCTURE LAYER (cost center, not direct revenue)
├── AWS compute / storage              → Enables all above layers
├── IPFS / Filecoin                    → Enables VaaS storage revenue
└── Ethereum RPC nodes                → Enables protocol fee capture

SMART CONTRACT LAYER (direct + indirect revenue)
├── DNaIToken.sol                      → $5/genome mint fee; sequencing SDK license
├── ConsentRegistry.sol                → Consent Oracle $0.001/call; Audit Trail SaaS
├── RoyaltyDistributor.sol             → 10% treasury; holder retention → sustained GMV
├── AccessController.sol               → Protocol fee enforcement on all access
└── DNaIGovernor.sol                   → Governance SaaS $50K/year enterprise

API LAYER (direct SaaS revenue)
├── REST API (Rust/Axum)               → Enterprise API subscription $50K–$250K/year
├── Consent Oracle API                 → $0.001/verification; $200/month bundles
├── ZKPaaS API                         → $0.10/proof; $500/month bundles
└── GraphQL / The Graph                → Powers marketplace UI → marketplace GMV

ZK PROOF LAYER (enablement + direct revenue)
├── Variant presence circuit           → ZKPaaS revenue; AI dataset gating
├── PRS range proof circuit            → AI licensing (premium circuit, 1.5× price)
├── Ancestry range proof circuit       → Ancestry cohort premium pricing
└── Pharmacogenomic circuit            → Clinical trial API revenue

PRODUCT LAYER (highest-value revenue)
├── Vault-as-a-Service                 → $50K setup + $5K/month; $510K Year 1 (3 clients)
├── Compliance Certification           → $25K–$100K/year per enterprise
├── Audit Trail SaaS                   → $2K–$10K/month per subscriber
├── Contract Suite Licensing           → $50K–$500K/year per licensee
├── FHIR Adapter                       → $50K–$150K per health system
└── dnai-sequencing-sdk               → $10K/year per sequencing provider

MARKETPLACE LAYER (volume-driven revenue)
├── Protocol access fee (20% of GMV)  → $90K–$400K/month at scale
├── AI training dataset licenses       → $5K–$50K per license
├── Marketplace listing fees (1%)      → $4.5K–$20K/month
└── DAO treasury yield (Phase IV)     → 4–8% APY on treasury balance
```

---

*Document maintained in `/home/user/cloudcontrolllc-site/docs/phase-1/technical-architecture-revenue.md`*
*Co-authoritative with: `docs/revenue-model.md`, `docs/phase-1/technical-architecture.md`, `docs/dnai-playbook.md`*
*Next review: Phase I close (Aug 9, 2026)*
*Document owner: Cloud Control LLC — Engineering + Business Development*
*Last updated: July 1, 2026*
