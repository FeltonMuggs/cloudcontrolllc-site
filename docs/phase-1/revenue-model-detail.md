# DNaI Revenue Model — CFO Deep Dive
**Cloud Control LLC — Project DNaI**
**Document Type:** Series A Financial Due Diligence Package
**Version:** 1.0 — July 1, 2026
**Prepared for:** CFO Function / Series A Investors

---

## Table of Contents

1. Unit Economics
2. Pricing Strategy
3. Revenue Forecasting Model (Jul–Dec 2026)
4. Revenue Recognition (ASC 606 / IFRS 15)
5. Churn and Retention
6. Cohort Analysis Framework
7. Sensitivity Analysis
8. Path to Series A
9. DAO Treasury Revenue

---

## 1. Unit Economics

### 1.1 Per-Genome Lifetime Value (LTV)

The core supply-side unit of DNaI is a vaulted, tokenized genome. Every genome that enters the protocol is a persistent revenue-generating asset so long as the holder participates.

**LTV Formula (Genome Holder as Revenue Asset):**

```
Monthly GMV per genome = Access rate × Average access price
Monthly protocol revenue per genome = Monthly GMV per genome × Protocol fee rate
Annual protocol revenue per genome = Monthly protocol revenue × 12
LTV (genome) = Annual protocol revenue per genome × Expected tenure (years)
```

**Phase III Steady-State Inputs:**

| Input | Value | Source |
|-------|-------|--------|
| Access rate (% of vaulted genomes actively licensed) | 30% | Marketplace model assumption |
| Average access price per genome per month | $150 | Weighted avg of VARIANT_PANEL ($75) and FULL_GENOME ($300) |
| Protocol fee rate | 20% | Smart contract-enforced |
| Expected active tenure of genome holder | 4 years | Churn model: 25%/yr annualized |

**Per-Genome LTV Calculation:**

```
Monthly GMV per genome (active)       = $150
Monthly protocol revenue per active   = $150 × 20% = $30
Annualized per active genome          = $30 × 12 = $360
LTV per active genome (4 yr tenure)   = $360 × 4 = $1,440

Blended LTV (all vaulted, 30% active) = $1,440 × 30% = $432 per genome vaulted
```

**LTV by Data Scope:**

| Scope | Monthly Price | Protocol Fee (20%) | Annual Rev/Genome | 4-Yr LTV |
|-------|--------------|-------------------|------------------|----------|
| VARIANT_PANEL | $75 | $15 | $180 | $720 |
| DISEASE_RISK | $100 | $20 | $240 | $960 |
| DRUG_RESPONSE | $125 | $25 | $300 | $1,200 |
| FULL_GENOME | $300 | $60 | $720 | $2,880 |
| AI TRAINING LICENSE (one-time) | $2,500 avg | $500 | — | $500 |

**Blended LTV (assuming scope mix: 40% VARIANT_PANEL, 30% DISEASE_RISK, 20% DRUG_RESPONSE, 10% FULL_GENOME):**

```
$720 × 0.40 + $960 × 0.30 + $1,200 × 0.20 + $2,880 × 0.10
= $288 + $288 + $240 + $288
= $1,104 per genome (access-weighted, 4-year horizon)
```

**Enterprise LTV (Pharma Partner):**

```
Annual enterprise API subscription            = $120,000 (avg)
Annual compliance certification               = $50,000 (avg)
Genome access volume (1,000 genomes × $150)   = $150,000 GMV/mo
Protocol fee from that partner's access       = $30,000/mo = $360,000/yr
Total annual revenue per pharma partner       = $530,000
Expected tenure                               = 5 years (2-year minimum deal terms)
Pharma Partner LTV                            = $2,650,000
```

### 1.2 Customer Acquisition Cost (CAC) by Channel

**Genome Holder CAC:**

| Channel | CAC | Method | Notes |
|---------|-----|--------|-------|
| Sequencing Partner Embed (e.g., Dante, Nebula) | $8–$15 | Royalty share + integration cost amortized | Lowest CAC; embedded at point of sequencing |
| Direct Web3 Onboarding | $25–$45 | Community management, gas subsidy, content | Crypto-native early adopters |
| EHR Integration | $3–$12 | Near-zero marginal; patient opts in at test order | Lowest marginal once integration is live |
| DTC Health App Partnership | $10–$20 | Revenue share to partner; per-convert cost | 23andMe/AncestryDNA retroactive vaulting |
| Paid Digital Advertising | $60–$120 | Google/Meta health + biotech verticals | Highest CAC; use sparingly in Phase II |

**Enterprise Partner CAC:**

| Segment | CAC | Sales Cycle | Notes |
|---------|-----|-------------|-------|
| Pharma (top 20) | $15,000–$45,000 | 6–18 months | Direct enterprise sales; legal/procurement overhead |
| Research Institution | $5,000–$15,000 | 3–9 months | Academic procurement; grant cycle alignment |
| AI Company | $8,000–$25,000 | 3–6 months | Technical sales; shorter procurement; faster close |
| EHR Platform | $20,000–$80,000 | 12–24 months | Integration-heavy; clinical validation required |

### 1.3 Payback Period

**Genome Holder (Blended Channel Mix):**

```
Blended genome holder CAC         = $18 (weighted average)
Monthly protocol revenue/genome   = $30 (active) × 30% access rate = $9/genome vaulted
Payback period                    = $18 / $9 = 2.0 months
LTV:CAC ratio                     = $432 / $18 = 24:1
```

**Enterprise Pharma Partner:**

```
Average pharma CAC                = $30,000
Monthly revenue per pharma partner = $530,000 / 12 = $44,167
Payback period                    = $30,000 / $44,167 = 0.68 months (~3 weeks post-close)
LTV:CAC ratio                     = $2,650,000 / $30,000 = 88:1
```

The enterprise payback is effectively immediate upon contract execution because annual subscriptions and access agreements are billed upfront or quarterly. The genome-holder payback at 2 months is excellent for a marketplace-side acquisition.

### 1.4 Gross Margin by Revenue Stream

**Protocol Access Fee:**

```
Revenue: 20% of GMV transacted
Direct costs: Gas/compute for ZK proof generation (~$0.02/proof), smart contract execution
Estimated gross margin: 88–92%
```

**Enterprise API Subscription:**

```
Revenue: $50K–$250K/year
Direct costs: Infrastructure ($2,000–$8,000/yr per enterprise subscriber), support (5% of ARR)
Estimated gross margin: 82–88%
```

**Sequencing Partner License:**

```
Revenue: $10K onboarding + $5/genome minted
Direct costs: Integration engineering (amortized $3,000/partner), legal (NDA, licensing: $2,000)
First-year gross margin (1,000 genomes minted): ~65%
Subsequent years gross margin: 92%+ (pure royalty flow)
```

**AI Training License:**

```
Revenue: $500–$5,000 per dataset license
Direct costs: Dataset curation/ZK-gating compute ($50–$200), legal template ($0 marginal)
Gross margin: 90–95%
```

**Compliance Certification:**

```
Revenue: $25K–$100K/year
Direct costs: Audit labor (10 hrs × $200/hr = $2,000), report generation infrastructure ($500)
Gross margin: 90–92%
```

**Blended Gross Margin (Phase III Steady State):**

| Stream | MRR | Gross Margin | Gross Profit |
|--------|-----|--------------|-------------|
| Protocol access fee | $90,000 | 90% | $81,000 |
| Enterprise API subscription | $100,000 | 85% | $85,000 |
| AI licensing | $50,000 | 92% | $46,000 |
| Compliance certification | $31,250 | 91% | $28,438 |
| Sequencing partner (royalties) | $28,500 | 93% | $26,505 |
| **Total** | **$299,750** | **~89%** | **$266,943** |

**Blended gross margin: ~89%** — consistent with best-in-class SaaS (Veeva: 72%, Snowflake: 67%, Palantir: 80%). The marketplace + protocol fee model with near-zero marginal cost of transaction is the key driver.

---

## 2. Pricing Strategy

### 2.1 Value-Based Pricing Rationale

DNaI pricing is anchored to buyer value, not cost-plus. The data buyer (pharma, research, AI) captures enormous economic value from genomic access; DNaI captures a fraction of that value at each transaction.

**Value Chain Math for a Pharma Buyer:**

```
Drug development cost (avg): $2.6 billion (Tufts CSDD)
Genomic data contributes to target identification and patient stratification
Conservative value of 1,000-genome cohort for a Phase II trial: $5M–$50M in trial efficiency
DNaI charges: $150/genome/month = $150,000/month for 1,000 genomes
Pharma pays <3% of the value the data unlocks
```

This pricing leaves the vast majority of economic value with the buyer, making DNaI easy to justify in procurement. The genome holder receives $112.50/genome/month (75%), the DAO treasury receives $10.50 (7%), and the protocol receives $30 (20%) — a distribution that aligns incentives across all parties.

### 2.2 Competitive Benchmarks

**Nebula Genomics:**
- Consumer pricing: $299 one-time sequencing fee; $19.99/month subscription for ongoing analysis
- Research access: Undisclosed enterprise terms; estimated $50–$100/genome/month for bulk access
- Data ownership model: Company retains data rights unless users explicitly opt out
- DNaI differentiation: Genome holders earn royalties; Nebula users receive no ongoing compensation

**Shivom (Blockchain Genomics Pioneer):**
- Historical pricing: $99 consumer sequencing (subsidized); data monetization via OmiX token
- Research access: 1,000-genome cohort packages priced at $50,000–$200,000 flat fee (not per-genome monthly)
- Current status: Pivoted; original marketplace never reached scale
- DNaI differentiation: Smart contract enforcement of consent; ZK proof verification; real-time royalty distribution vs. Shivom's manual batch licensing

**23andMe / Ancestry (Consumer Reference):**
- Consumer price: $79–$299 kit; no royalty to consumer for data licensing
- GSK genomics collaboration (2018): $300M for 5-year access to 5M genomes = $12/genome/year = $1/genome/month
- AstraZeneca deal (2014): $18M for 750K genomes = $24/genome
- DNaI pricing premium justified: Real-time consent, ZK-verified access, ongoing royalties attract higher-quality, actively maintained data

**Genomics England / UK Biobank (Research Reference):**
- Academic access: £2,500/year for basic access to 500K whole genomes = £0.004/genome/month
- Commercial access: £100,000–£500,000/year for commercial research rights
- DNaI positioning: Complements biobank infrastructure; targets commercial applications where value capture justifies higher per-genome pricing

**DNaI Pricing Position:**

| Segment | DNaI Price | Nebula Research Est. | 23andMe/GSK Effective | Premium Factor |
|---------|-----------|----------------------|----------------------|---------------|
| Standard pharma access | $150/genome/mo | $75–$100 | $1 | 1.5–2× vs. Nebula; 150× vs. 23andMe/GSK |
| AI training license | $2,500 flat | N/A | N/A | New category |
| Enterprise API sub | $120K/yr avg | N/A | N/A | New category |

The 150× premium over the 23andMe/GSK deal is justified by: (1) explicit ongoing consent tracked on-chain; (2) genome holder is compensated (avoids adverse selection / legal exposure for buyer); (3) ZK proof verification enables regulatory compliance documentation; (4) real-time access vs. batch licensed datasets. Enterprise legal and compliance teams assign substantial value to consent auditability, particularly post-GDPR enforcement actions.

### 2.3 Tier Pricing Architecture

**Genome Holder Tiers (Supply Side):**

| Tier | Data Scope | Buyer Pays | Holder Receives (75%) | Protocol (20%) | Treasury (7%) |
|------|-----------|-----------|----------------------|----------------|---------------|
| Basic | ANCESTRY + VARIANT_PANEL | $75/mo | $56.25/mo | $15/mo | $5.25/mo |
| Standard | + DISEASE_RISK + DRUG_RESPONSE | $150/mo | $112.50/mo | $30/mo | $10.50/mo |
| Premium | FULL_GENOME | $300/mo | $225.00/mo | $60/mo | $21/mo |
| AI Training | Curated dataset license | $2,500 one-time | $1,575 one-time | $750 one-time | $175 one-time |

**Enterprise Tiers (Demand Side):**

| Tier | Annual Fee | Genome Access Volume | Includes |
|------|-----------|---------------------|----------|
| Starter Research | $50,000/yr | Up to 500 genomes | API access, consent dashboard, 1 jurisdiction |
| Professional | $120,000/yr | Up to 5,000 genomes | + ZK proof API, compliance dashboard, 5 jurisdictions |
| Enterprise | $250,000/yr | Unlimited API calls | + Custom cohorts, dedicated support, all jurisdictions |
| AI Premium | $500,000/yr | Federated learning access | + Training data curation, model marketplace listing |

---

## 3. Revenue Forecasting Model — Jul 2026 to Dec 2026

### 3.1 Bottom-Up Formula

```
Monthly Protocol Fee Revenue =
  Σ (Genome_Holders_Active × Access_Rate × Avg_Price × Protocol_Fee_Rate)
  by segment (pharma, research, AI)

Monthly Subscription Revenue =
  Enterprise_Subscribers × Avg_Monthly_Subscription_Value

Monthly Licensing Revenue =
  AI_Licenses_Sold × Avg_License_Price × Protocol_Take_Rate

Total MRR = Protocol Fee Revenue + Subscription Revenue + Licensing Revenue + Compliance Revenue
```

### 3.2 Key Assumptions Table

| Assumption | Jul | Aug | Sep | Oct | Nov | Dec |
|------------|-----|-----|-----|-----|-----|-----|
| Genome holders (cumulative) | 0 | 0 | 500 | 1,000 | 5,000 | 10,000 |
| Access rate (% actively licensed) | — | — | 15% | 20% | 25% | 30% |
| Active genomes | 0 | 0 | 75 | 200 | 1,250 | 3,000 |
| Avg price/genome/month | — | — | $150 | $150 | $150 | $150 |
| Protocol fee rate | 20% | 20% | 20% | 20% | 20% | 20% |
| Enterprise API subscribers | 0 | 0 | 0 | 1 | 3 | 6 |
| Avg enterprise MRR/subscriber | — | — | — | $8,333 | $8,333 | $10,000 |
| AI licenses sold (cumulative) | 0 | 0 | 0 | 0 | 1 | 3 |
| Avg AI license value | — | — | — | — | $5,000 | $5,000 |
| Compliance certs sold | 0 | 0 | 0 | 0 | 1 | 2 |
| Avg compliance MRR/cert | — | — | — | — | $4,167 | $4,167 |
| Pilot agreement revenue | $0 | $22,500 | $0 | $0 | $0 | $0 |

**Assumption Notes:**

- **Genome holders ramp:** Phase I (Jul–mid-Aug) has zero; Phase II closed beta begins mid-Aug targeting 1,000 by Oct 1; Phase III mainnet (Oct) targets 10,000 by Nov 15; projection is conservative at 5,000 by end of Nov, 10,000 by end of Dec.
- **Access rate ramp:** Early participants are self-selected early adopters with higher willingness to license (15% initial) ramping to 30% steady state as marketplace becomes liquid.
- **Pilot revenue:** First pharma pilot agreement ($22,500) counted as one-time revenue in Aug (Phase II milestone); this is not recurring protocol revenue.
- **Enterprise subscribers:** Phase III (Oct mainnet) is earliest point for enterprise API contracts; assumes 1 pilot subscriber at $100K ARR, growing to 6 by Dec at blended $120K ARR.
- **AI licenses:** First AI training license in Nov (Phase IV); one-time fees recognized when data access is granted.
- **Compliance:** First compliance certification revenue begins Nov at $25K/cert/year billed quarterly ($4,167/quarter recognized monthly after delivery).

### 3.3 Month-by-Month MRR Projection

**July 2026 (Phase I — Foundation)**

```
Protocol fee revenue:     $0
Enterprise subscriptions: $0
AI licensing:             $0
Compliance:               $0
One-time pilot revenue:   $0
───────────────────────────
MRR:                      $0
Cumulative ARR run rate:  $0
```

*Activities: Architecture, legal framework, partner outreach. No revenue-generating assets live.*

**August 2026 (Phase I → Phase II transition)**

```
Protocol fee revenue:     $0     (testnet only; no mainnet transactions)
Enterprise subscriptions: $0     (pilot NDA signed, not yet paid subscription)
AI licensing:             $0
Compliance:               $0
One-time pilot payment:   $22,500 (pharma data-access agreement cash received)
───────────────────────────────
MRR (recurring):          $0
One-time cash:            $22,500
Cumulative recurring ARR: $0
```

*Activities: 500–1,000 genomes vaulted on testnet; first pharma pilot agreement executed; pilot payment received as one-time cash (recognized under ASC 606 as revenue in the month data access is granted).*

**September 2026 (Phase II — Proof of Sovereignty)**

```
Active genomes:           75 (500 vaulted × 15% access rate)
Protocol fee revenue:     75 × $150 × 20% = $2,250
Enterprise subscriptions: $0
AI licensing:             $0
Compliance:               $0
───────────────────────────
MRR:                      $2,250
ARR run rate:             $27,000
```

*Activities: Testnet access agreements generating initial protocol fees; security audit in progress; mainnet prep.*

**October 2026 (Phase II → Phase III — Mainnet Launch)**

```
Active genomes:           200 (1,000 vaulted × 20% access rate)
Protocol fee revenue:     200 × $150 × 20% = $6,000
Enterprise subscriptions: 1 subscriber × $8,333/mo = $8,333
AI licensing:             $0
Compliance:               $0
───────────────────────────
MRR:                      $14,333
ARR run rate:             $172,000
MoM growth:               +537%
```

*Activities: Mainnet genesis event (Oct 2 Week 13); public portal live; first enterprise API subscriber onboarded at $100K ARR deal; EHR integration work begins.*

**November 2026 (Phase III — Open Network)**

```
Active genomes:           1,250 (5,000 vaulted × 25% access rate)
Protocol fee revenue:     1,250 × $150 × 20% = $37,500
Enterprise subscriptions: 3 subscribers × $8,333/mo = $25,000
AI licensing:             1 license × $5,000 (one-time, recognized this month) = $5,000
Compliance certifications: 1 cert × $4,167/mo = $4,167
───────────────────────────────────────────
MRR (recurring):          $66,667
One-time AI license:      $5,000
Total recognized:         $71,667
ARR run rate (recurring): $800,000
MoM growth (recurring):   +365%
```

*Activities: 10,000 genome milestone campaign; DAO activated; Phase IV kickoff; AI marketplace planning; EHR integrations live.*

**December 2026 (Phase IV — Genomic Economy Launch)**

```
Active genomes:           3,000 (10,000 vaulted × 30% access rate)
Protocol fee revenue:     3,000 × $150 × 20% = $90,000
Enterprise subscriptions: 6 subscribers × $10,000/mo = $60,000
AI licensing:             2 licenses × $5,000 (one-time) = $10,000
Compliance certifications: 2 certs × $4,167/mo = $8,334
ZK proof API (per-proof): 50,000 proofs × $0.05 = $2,500
───────────────────────────────────────────
MRR (recurring):          $160,834
One-time AI licenses:     $10,000
Total recognized:         $170,834
ARR run rate (recurring): $1,930,000
MoM growth (recurring):   +141%
```

*Activities: AI marketplace soft launch; Vault-as-a-Service; Series A deck complete; ZK proof API public beta.*

### 3.4 Summary Projection Table

| Month | Genome Holders | Active | MRR (Recurring) | One-Time | ARR Run Rate | MoM Growth |
|-------|---------------|--------|-----------------|----------|--------------|-----------|
| Jul 2026 | 0 | 0 | $0 | $0 | $0 | — |
| Aug 2026 | 500 (testnet) | 0 | $0 | $22,500 | $0 | — |
| Sep 2026 | 500 | 75 | $2,250 | $0 | $27,000 | n/a |
| Oct 2026 | 1,000 | 200 | $14,333 | $0 | $172,000 | +537% |
| Nov 2026 | 5,000 | 1,250 | $66,667 | $5,000 | $800,000 | +365% |
| Dec 2026 | 10,000 | 3,000 | $160,834 | $10,000 | $1,930,000 | +141% |

**Total H2 2026 Cash Revenue:** $259,584 (recurring + one-time)
**Exit ARR Run Rate (Dec 31, 2026):** $1,930,008

### 3.5 Bull / Base / Bear Scenarios (Dec 2026 ARR Run Rate)

| Scenario | Genome Holders | Access Rate | Avg Price | Enterprise Subs | ARR Run Rate |
|----------|---------------|-------------|-----------|----------------|--------------|
| Bear | 5,000 | 15% | $120 | 3 | $636,000 |
| **Base** | **10,000** | **30%** | **$150** | **6** | **$1,930,000** |
| Bull | 20,000 | 35% | $165 | 12 | $5,100,000 |

---

## 4. Revenue Recognition — ASC 606 / IFRS 15

This section is written for the CFO function and external auditors. DNaI operates across multiple revenue streams with distinct performance obligation structures. Proper revenue recognition is critical for Series A due diligence and potential future public market access.

### 4.1 Applicable Standard

DNaI (Cloud Control LLC) will apply ASC 606 (Revenue from Contracts with Customers) for US GAAP reporting. International subsidiary entities will apply IFRS 15, which is converged with ASC 606 in all material respects. The five-step model governs all streams:

1. Identify the contract with a customer
2. Identify the performance obligations
3. Determine the transaction price
4. Allocate the transaction price
5. Recognize revenue when (or as) obligations are satisfied

### 4.2 Protocol Access Fee Revenue

**Nature:** DNaI earns 20% of every data-access royalty transaction between a genome holder and a data buyer. This is a marketplace transaction fee.

**Principal vs. Agent Analysis:** DNaI acts as agent in the marketplace transaction (not principal). The genome holder retains control of the genomic asset; DNaI facilitates the access grant and collects a fee. **Revenue is recognized net** (the 20% protocol fee only, not the gross GMV).

**Performance Obligation:** DNaI's single performance obligation is to facilitate the authorized access event — verification of consent, ZK proof generation, and smart contract-enforced data access. This is a point-in-time obligation satisfied when the access grant is confirmed on-chain.

**Timing:** Revenue is recognized at the moment of on-chain confirmation of each access grant. For subscription-style access pools (monthly recurring access), revenue is recognized ratably over the access period (daily or monthly, consistent with the access pool contract).

**Variable Consideration:** Auction clearing prices are variable. DNaI should estimate variable consideration using the expected value method and constrain recognition to amounts unlikely to result in significant reversal. In practice, Dutch auction clearing is deterministic at settlement — no constraint required post-settlement.

**Journal Entry (Standard Access Grant):**

```
Dr. Accounts Receivable (or USDC Wallet) ......... $30
  Cr. Protocol Fee Revenue ........................ $30
(At moment of on-chain access grant confirmation)
```

**Deferred Revenue:** If a data buyer pre-funds a multi-month access agreement, the unearned portion is deferred:

```
Dr. Cash/USDC ...................................... $360 (12-month prepay)
  Cr. Deferred Revenue (Protocol Fee) ............. $360
Then monthly:
Dr. Deferred Revenue ............................... $30
  Cr. Protocol Fee Revenue ......................... $30
```

### 4.3 Enterprise API Subscriptions

**Nature:** Annual SaaS-style contracts for unlimited API access, consent dashboard, and compliance tools.

**Performance Obligation:** Ongoing access to the platform — a stand-ready obligation. This is a series of distinct services delivered over time.

**Timing:** Revenue is recognized ratably (straight-line) over the contract term. Annual contracts billed upfront create deferred revenue that releases monthly.

**Contract Modifications:** Upsells (e.g., adding jurisdictions mid-term) are treated as a modification creating a separate contract if the added service is distinct and priced at standalone selling price. Most upsells will qualify as separate contracts.

**Journal Entry (Annual $120,000 subscription, paid upfront):**

```
Month 0:
Dr. Cash ........................................... $120,000
  Cr. Deferred Revenue (Enterprise API) ........... $120,000

Each month (1–12):
Dr. Deferred Revenue ............................... $10,000
  Cr. Enterprise API Subscription Revenue .......... $10,000
```

**Contract Asset / Liability Disclosure:** Material deferred revenue balances (>$50,000 at period end) must be disclosed with a rollforward schedule in financial statement footnotes. This is a common Series A diligence item.

### 4.4 Sequencing Partner Licensing

**Nature:** (a) One-time onboarding fee of $10,000 + (b) $5/genome minted (usage-based royalty).

**Two Performance Obligations:**
- PO1: Integration and onboarding support (one-time services, delivered over 30–60 days)
- PO2: License to use DNaI Data Pipeline SDK (ongoing right-to-use)

**Allocation:** Standalone selling price (SSP) for onboarding = $8,000; SSP for license = $2,000 of the $10,000 (relative SSP allocation). The $5/genome royalty is 100% allocated to the ongoing license PO.

**Timing:**
- Onboarding services: Recognized over the delivery period (e.g., 60 days)
- License: Recognized when each genome is minted (usage-based variable consideration — recognized as the usage occurs per ASC 606-10-55-65)

**Journal Entry (Genome minted event):**

```
Dr. Accounts Receivable ........................... $5
  Cr. Sequencing Partner License Revenue .......... $5
(At each genome mint event, automated via smart contract)
```

### 4.5 AI Training Data Licensing

**Nature:** One-time license fees ($500–$5,000) for AI companies to access specific consented genomic datasets for model training.

**Performance Obligation:** Granting access to the licensed dataset — a point-in-time obligation (the IP license is a right-to-access for a defined training run or model version).

**IP License Classification:** Under ASC 606-10-55-58, a license of IP is recognized at a point in time if the license is distinct and the customer can direct the use and obtain substantially all benefits at the time of transfer. AI training licenses are point-in-time licenses — recognized at dataset delivery/access grant.

**Usage-Based Royalties Exception:** If a license fee is structured as a per-epoch or per-inference royalty tied to the licensee's revenue, the sales-and-usage-based royalty exception (ASC 606-10-55-65A) applies — recognize only when the underlying usage occurs.

**Journal Entry (Dataset license, $5,000 flat fee):**

```
Dr. Cash/USDC ...................................... $5,000
  Cr. AI Training License Revenue ................. $5,000
(At point of dataset access grant)
```

### 4.6 Compliance Certification

**Nature:** Annual certification service ($25,000–$100,000) — audit, report, issuance of "DNaI Consent Verified" trust mark.

**Performance Obligations:**
- PO1: Certification audit and report (delivered over 2–4 weeks)
- PO2: Right to display trust mark for 12 months (stand-ready obligation over time)

**Allocation (example, $50K cert):** SSP for audit/report = $10,000; SSP for trust mark license = $40,000. Recognize audit revenue over delivery; recognize trust mark license ratably over 12 months ($3,333/month).

### 4.7 DAO Treasury Yield

**Nature:** Protocol fees accumulated in the DAO treasury generate DeFi yield. Cloud Control LLC's share of treasury yield (if any) would be recognized as investment income, not operating revenue, under ASC 320 (debt securities) or ASC 323 (equity method). Governance structure of the DAO determines whether Cloud Control LLC consolidates treasury — this requires legal analysis and may affect revenue recognition.

**Recommendation:** Structure DAO treasury as a separate legal entity (Cayman Foundation or Marshall Islands DAO LLC) to achieve off-balance-sheet treatment for treasury assets and liabilities. DNaI's protocol fee revenue stream remains clean; treasury yield does not co-mingle with operating revenue.

### 4.8 Crypto / Token Considerations

**USDC payments:** Stablecoin receipts (USDC) are treated as cash equivalents if readily convertible to USD within 90 days. No foreign currency accounting required for USDC-denominated revenue.

**DNaI token revenue:** Do not recognize revenue denominated in DNaI tokens received as fees unless and until the tokens are converted to USD or a reliable fair value can be established. Premature recognition of native token income is a common audit failure point and will be scrutinized in Series A diligence.

**SEC considerations:** Consult securities counsel before treating any token-denominated transaction as revenue. The Howey test analysis in the Regulatory Framework document is prerequisite to revenue recognition policy for token flows.

---

## 5. Churn and Retention

### 5.1 Genome Holder Churn — Causes and Metrics

**Definition:** Genome holder churn = an active genome holder stops authorizing any data access for 90+ consecutive days, or permanently revokes all consents.

**Projected Churn Rate:**

| Phase | Monthly Churn | Annual Churn | Notes |
|-------|--------------|-------------|-------|
| Phase II (closed beta) | 2% | 22% | High engagement, self-selected |
| Phase III (open network) | 4% | 40% | Broader, less engaged cohort |
| Phase IV (mature) | 2% | 22% | Retention mechanics in place |

**Root Causes of Genome Holder Churn:**

1. **Royalty income too low to motivate re-engagement** — If a genome holder earns $56/month at Standard tier but loses their wallet access, friction to re-engage exceeds the motivation. Mitigation: ERC-4337 account abstraction eliminates seed phrase loss; wallet recovery via biometric.

2. **Privacy concern escalation** — A genomics data breach at a third party (not DNaI) triggers fear contagion and mass revocation. Mitigation: ZK proof architecture means buyer never receives plaintext genomic data; breach at buyer side does not expose actual genomic data.

3. **Complexity of consent management** — If the UX to manage consent scopes is too complex, holders default to revoking all. Mitigation: Mobile-first consent dashboard; one-tap scope management; AI assistant explains what each consent grants.

4. **Token price depreciation** — Genome holders who are crypto-native may churn if DNaI token price drops significantly, as the royalty cash value becomes less attractive. Mitigation: Royalties paid in USDC (stablecoin), not DNaI token — eliminates crypto volatility from holder income.

5. **Competitive alternatives emerge** — If Nebula or a new entrant offers higher royalty rates. Mitigation: First-mover network effect; DAO governance gives holders direct voice in protocol economics; switching costs (re-sequencing, re-vaulting, consent history loss) are significant.

**Retention Mechanics Built Into Protocol:**

| Mechanism | How It Works | Retention Effect |
|-----------|-------------|-----------------|
| Continuous royalty stream | Holders receive USDC each month they have active consents | Financial lock-in; recurring income creates habit |
| Governance rights | DNaI token = voting rights in DAO; holders who disengage lose governance voice | Engagement incentive beyond pure financial |
| Tenure multiplier (planned Phase IV) | Holders who maintain active consent for 24+ months earn 1.25× royalty rate | Long-tenure loyalty reward |
| Revocation grace period | 30-day window where partial revocation doesn't cancel all access agreements | Reduces rage-quit; allows partial re-engagement |
| Data portability | Holder can migrate vault to another service; genome hash remains anchored to DNaI token | Reduces lock-in complaints; paradoxically increases trust and retention |

### 5.2 Enterprise Partner Churn — Causes and Metrics

**Projected Enterprise Annual Churn:**

| Phase | Annual Churn | Reason |
|-------|-------------|--------|
| Phase II (1 pilot partner) | 0% (2-year commitment) | Contractual lock-in |
| Phase III (3–10 partners) | 10–15% | 1–2 partners may not renew at end of first term |
| Phase IV (10–30 partners) | 8–12% | Mature market; churn reduces as protocol becomes standard |

**Root Causes of Enterprise Churn:**

1. **Insufficient genome supply in required cohort** — Pharma needs 10,000 genomes with BRCA variant for oncology study; DNaI only has 800. Mitigation: Supply-side recruitment targets aligned with enterprise pipeline; DAO grants for targeted recruitment campaigns.

2. **Regulatory change (pharma jurisdiction)** — FDA or EMA changes rules on AI-generated genomic data, making DNaI-licensed data unusable for regulatory submission. Mitigation: Ongoing regulatory monitoring; compliance certification product keeps DNaI ahead of requirements.

3. **Internal platform build** — Large pharma builds own genomic data marketplace and exits DNaI. Mitigation: Network effect moat; DNaI's cross-pharma dataset is more diverse than any single company's internal collection; white-label Vault-as-a-Service keeps them in ecosystem.

4. **Budget cuts** — Research budgets reduced in a down cycle. Mitigation: Modular pricing (starter tiers available); data access fees are variable and scale down automatically with reduced use.

**Enterprise Retention Mechanics:**

| Mechanism | How It Works |
|-----------|-------------|
| 2-year minimum enterprise contracts | Annual churn is contractually impossible in Year 1; meaningful switching costs at renewal |
| Compliance certification dependency | Enterprise clients build internal compliance workflows on DNaI audit trail; switching means rebuilding those workflows |
| Cohort exclusivity options | Enterprise can pay a premium to "reserve" a cohort for exclusive access for 90 days; creates positive lock-in |
| Consortium membership | Enterprise partners who sign 3-year agreements become founding consortium members with governance input on data standards |

### 5.3 Net Revenue Retention (NRR) Projection

**Formula:** NRR = (Beginning MRR + Expansion MRR - Contraction MRR - Churned MRR) / Beginning MRR

**Phase III → Phase IV NRR estimate:**

```
Beginning MRR (Phase III cohort of enterprise partners): $100,000
Expansion (upsells, more genome access, compliance add-ons): +$35,000 (35% expansion)
Contraction (one partner downgrades to Starter): -$5,000
Churn (one partner does not renew): -$10,000
────────────────────────────────────────────────────────
Ending MRR from same cohort: $120,000
NRR: 120%
```

Target NRR of 115–130% is achievable and is a critical Series A metric. Investors benchmark NRR >120% as world-class for data/marketplace businesses.

---

## 6. Cohort Analysis Framework

### 6.1 Why Cohort Analysis Matters for DNaI

DNaI's revenue model has two flywheel sides — genome holders (supply) and enterprise buyers (demand). Cohort analysis must track both sides separately and then measure how supply-side cohort growth translates to demand-side revenue. Series A investors will want to see at least two quarters of cohort data demonstrating retention and expansion patterns.

### 6.2 Genome Holder Cohort Framework

**Cohort Definition:** All genome holders who vaulted their genome and minted their DNaI token during a specific calendar month.

**Cohort Metrics to Track:**

| Metric | Measurement | Frequency |
|--------|-------------|-----------|
| Cohort size (N) | Genomes minted in that month | Monthly |
| Month-1 activation rate | % with ≥1 active consent by end of Month 1 | Monthly |
| 30/60/90-day retention | % still having ≥1 active consent | Monthly |
| Average monthly royalty earned | USDC/genome in cohort | Monthly |
| Scope upgrade rate | % who expand from Basic to Standard or Premium tier | Monthly |
| Governance participation rate | % voting in DAO proposals | Quarterly |

**Cohort Revenue Table (illustrative — Phase II vs. Phase III minters):**

Phase II Minters (Aug–Sep 2026 cohort, N=500):

```
Month 1 (Sep):  Activation 15%, Avg royalty $22/genome, MRR from cohort = $1,650
Month 2 (Oct):  Retention 88%, Avg royalty $28/genome, MRR from cohort = $6,160
Month 3 (Nov):  Retention 82%, Avg royalty $35/genome, MRR from cohort = $14,350
Month 4 (Dec):  Retention 78%, Avg royalty $38/genome, MRR from cohort = $14,820
```

Phase III Minters (Oct–Nov 2026 cohort, N=4,500 new):

```
Month 1 (Nov):  Activation 20%, Avg royalty $25/genome, MRR from cohort = $22,500
Month 2 (Dec):  Retention 85%, Avg royalty $30/genome, MRR from cohort = $114,750
```

**Comparison Insight:** Phase III minters show higher Month-1 activation (20% vs. 15%) because the public marketplace is more liquid — more buyers available, more consent types available at launch. This is evidence of network effect.

### 6.3 Enterprise Partner Cohort Framework

**Cohort Definition:** Enterprise partners that signed their first contract in a given quarter.

**Cohort Metrics to Track:**

| Metric | Measurement | Frequency |
|--------|-------------|-----------|
| Initial ACV (Annual Contract Value) | At signing | At signing |
| Genome access volume | Genomes accessed per month | Monthly |
| Renewal rate | % renewing at end of initial term | At renewal |
| Expansion ACV | Incremental spend in Year 2 | At renewal |
| Compliance add-on attachment rate | % buying compliance cert + audit trail | Quarterly |
| Cohort NRR | Ending ACV / Beginning ACV | Annually |

**Q4 2026 Enterprise Cohort (deal size segmentation):**

| Tier | Partners | Avg ACV | Cohort ACV | Expected Y2 NRR |
|------|---------|---------|-----------|----------------|
| Starter Research (≤$75K) | 3 | $60,000 | $180,000 | 105% |
| Professional ($75K–$200K) | 2 | $120,000 | $240,000 | 120% |
| Enterprise (>$200K) | 1 | $250,000 | $250,000 | 135% |
| **Total** | **6** | | **$670,000** | **120% blended** |

### 6.4 Pharma Partner Segmentation by Deal Size

Track separate revenue cohorts for:

- **Exploratory partners** (≤$50K first deal): Likely academic medical centers or small biotech; high churn risk, low expansion potential; acceptable as proof-of-concept
- **Scale partners** ($50K–$500K): Mid-size pharma or research consortiums; key expansion target
- **Strategic partners** (>$500K): Top-20 pharma; high retention, high expansion, longest sales cycle; focus of Q1 2027 sales effort

Monitor within each cohort: time-to-second-purchase, cohort NRR, and whether they become compliance certification buyers (high-value cross-sell).

---

## 7. Sensitivity Analysis

The following scenarios analyze the impact on projected December 2026 ARR run rate and on the theoretical Phase III steady-state ARR of $3.6M.

### 7.1 Baseline Assumptions (Phase III Steady State)

```
Genome holders:         10,000
Access rate:            30%
Active genomes:         3,000
Avg price/genome/mo:    $150
Protocol fee rate:      20%
Monthly protocol GMV:   $450,000
Monthly protocol rev:   $90,000

Enterprise subscribers: 10
Avg enterprise MRR:     $10,000
Enterprise MRR:         $100,000

Compliance MRR:         $31,250
AI licensing MRR:       $50,000
──────────────────────────────
Baseline MRR:           $271,250
Baseline ARR:           $3,255,000
```

### 7.2 Scenario A — Access Rate Drops from 30% to 10%

**Trigger:** Low marketplace liquidity; genome holders cannot find buyers; or privacy panic reduces willingness to consent.

```
Active genomes:       10,000 × 10% = 1,000 (vs. 3,000 baseline)
Protocol fee rev:     1,000 × $150 × 20% = $30,000 (vs. $90,000)
Revenue impact:       -$60,000 MRR = -$720,000 ARR

Enterprise and compliance unaffected (subscription-based, not per-genome):

Stress-case MRR:      $211,250 (vs. $271,250 baseline)
Stress-case ARR:      $2,535,000 (vs. $3,255,000 baseline)
ARR reduction:        -$720,000 (-22%)
```

**Mitigation levers:** Automated demand-matching (marketplace recommendation engine); targeted enterprise recruitment in high-demand cohorts; DAO grants to incentivize supply-side activation campaigns.

**Key Insight:** Because protocol fee revenue is only ~33% of baseline MRR (subscription and compliance revenue is more resilient), a 67% drop in access rate only reduces total ARR by 22%. This is the critical advantage of a diversified revenue model.

### 7.3 Scenario B — Protocol Fee Drops from 20% to 10%

**Trigger:** Competitive pressure from a rival protocol; DAO governance vote to reduce fee; regulatory requirement to reduce intermediation.

```
Active genomes:       3,000 (unchanged)
Avg price:            $150 (unchanged)
Protocol fee rate:    10% (vs. 20%)
Monthly protocol rev: 3,000 × $150 × 10% = $45,000 (vs. $90,000)
Revenue impact:       -$45,000 MRR = -$540,000 ARR

Stress-case MRR:      $226,250 (vs. $271,250 baseline)
Stress-case ARR:      $2,715,000 (vs. $3,255,000 baseline)
ARR reduction:        -$540,000 (-17%)
```

**Mitigation levers:** At 10% protocol fee, the marketplace is more competitive vs. direct negotiation, which may increase volume (genome holder payouts rise from $112.50 to $120/genome — attracting more supply; buyer costs drop slightly). The fee reduction may be net-positive for GMV. Sensitivity to be modeled: if 10% fee rate drives 50%+ increase in active genomes (supply-side attraction), revenue is net-flat or up.

**Key Insight:** Protocol fee is an elastic price. The DAO should model fee elasticity before reducing; the 7% treasury allocation provides a buffer — treasury revenue is not affected by reducing the protocol fee if the DAO votes to absorb the cut from the Cloud Control protocol share only.

### 7.4 Scenario C — Average Price Drops 30% (from $150 to $105/genome/month)

**Trigger:** Commodity pricing pressure; Nebula or new entrant undercuts on price; buyer consolidation reduces pricing power; economic downturn cuts pharma R&D budgets.

```
Active genomes:       3,000 (unchanged)
Avg price:            $105 (vs. $150; -30%)
Protocol fee rate:    20% (unchanged)
Monthly protocol rev: 3,000 × $105 × 20% = $63,000 (vs. $90,000)
Revenue impact:       -$27,000 MRR = -$324,000 ARR

Enterprise subscriptions: Unaffected (fixed fee model, not per-genome)
Compliance: Unaffected
AI licensing: Partially affected if training data prices also drop 30% → $35,000 MRR

Stress-case MRR:      $232,250 (vs. $271,250 baseline)
Stress-case ARR:      $2,787,000 (vs. $3,255,000 baseline)
ARR reduction:        -$468,000 (-14%)
```

**Key Insight:** Price compression of 30% only reduces total ARR by 14% due to the subscription and compliance revenue floors. The protocol should maintain a minimum floor price ($75/genome/month for VARIANT_PANEL) enforced by the smart contract — this prevents a race to zero.

### 7.5 Combined Stress Test (All Three Adverse Scenarios Simultaneously)

```
Access rate:    10% → 1,000 active genomes
Protocol fee:   10%
Avg price:      $105
Monthly protocol rev: 1,000 × $105 × 10% = $10,500

Enterprise subs (assuming 20% churn from budget pressure): 8 × $10,000 = $80,000
Compliance (assuming 30% reduction): $21,875
AI licensing (assuming 50% reduction): $25,000

Stress-case MRR: $137,375
Stress-case ARR: $1,648,500
```

Even in a combined severe stress scenario, the protocol generates $1.65M ARR — sufficient to demonstrate revenue traction for Series A and maintain operations. The $115,000 Phase I–IV budget is recovered within 2 months of Phase III revenue.

---

## 8. Path to Series A

### 8.1 What Revenue Metrics Series A Investors Expect

Series A investors in genomics / biotech / web3 evaluate revenue differently than pure SaaS. The following benchmarks apply based on comparable company financials and investor frameworks current as of 2025–2026.

**Series A Revenue Expectations (Genomics + Data Marketplace):**

| Metric | Minimum Threshold | Target (DNaI) | World-Class |
|--------|------------------|---------------|-------------|
| ARR at raise | $500K–$1M | $1.5M–$2.5M | $3M+ |
| MoM growth rate (trailing 3 months) | 15% | 30–50% | 80%+ |
| Gross margin | 60%+ | 85–90% | 90%+ |
| NRR (enterprise) | 100% | 115–120% | 130%+ |
| Payback period (enterprise CAC) | <18 months | <3 months | <1 month |
| LTV:CAC | >3:1 | 24:1 (genome holders) | >10:1 |
| Number of paying enterprise customers | 3–5 | 6 | 15+ |
| Revenue diversity | ≥2 streams >10% of ARR | 4 streams | 5+ streams |

**DNaI projected position at Dec 31, 2026 Series A raise:**

```
ARR run rate:              $1.93M (base case) / $5.1M (bull case)
MoM growth (Oct–Dec):      ~237% CAGR equivalent (early stage; acceptable)
Gross margin:              ~89%
NRR (enterprise cohort):   ~120% (projected, 1 quarter of data)
Enterprise customers:      6 paying
Revenue streams active:    4 (protocol fee, enterprise API, AI licensing, compliance)
Genome holders:            10,000
```

**Gap Analysis:** The primary weakness for Series A at Dec 2026 is limited cohort depth — investors want to see 2–4 quarters of data. The base case ARR of $1.93M is on the lower end for a $10M–$15M Series A. Strategies to strengthen the raise:

1. Target a Q1 2027 close (not Dec 2026) to include 2 full quarters of post-mainnet revenue
2. Secure a strategic anchor investor (e.g., a pharma corporate VC that becomes both investor and enterprise customer)
3. Prioritize NRR data quality over raw ARR — 120% NRR with $1.5M ARR is more compelling than 100% NRR with $2M ARR

### 8.2 Target ARR for $5M–$15M Series A

**Revenue Multiple Benchmarks (Comparable Companies, 2024–2026):**

| Company | Stage | ARR at Raise | Round Size | Revenue Multiple | Notes |
|---------|-------|-------------|-----------|-----------------|-------|
| Tempus AI | Series E (pre-IPO) | $600M | $200M | 0.33× | Genomic data + AI; lower multiple at scale |
| Recursion Pharmaceuticals | Series C | $50M ARR | $239M | 4.8× | Biotech + AI; comparable model |
| Olink Proteomics | Series B/C | $30M ARR | $135M | 4.5× | Omics data platform |
| Ciitizen (acq. by Invitae) | Series A/B | $8M ARR | $35M | 4.4× | Patient genomic data ownership — closest comparable |
| Biobank-as-a-Service (general) | Series A | $2M ARR | $12M | 6× | Standard range |
| Data marketplace / web3 | Series A | $1M ARR | $8M | 8× | Web3 premium for network effect assets |

**DNaI Blended Multiple Rationale:**

DNaI spans three high-value categories: (1) genomic data marketplace, (2) compliance SaaS, and (3) web3 protocol. A blended 6–8× ARR multiple is defensible:

```
At $1.5M ARR (conservative):  $1.5M × 7× = $10.5M valuation → $5M–$7M Series A at 33–45% dilution
At $2.0M ARR (base case):     $2.0M × 7× = $14M valuation  → $7M–$10M Series A at 35–40% dilution
At $3.0M ARR (bull case):     $3.0M × 8× = $24M valuation  → $10M–$15M Series A at 35–45% dilution
```

**Recommended target for DNaI Series A:** $8M–$12M at $18M–$28M post-money valuation, achievable with $2M–$3M ARR run rate, strong gross margins, and a strategic anchor.

### 8.3 Investor Narrative Framework

**The 30-Second Version:**
"DNaI is the protocol layer for the genomic data economy. We tokenize genome ownership, enforce consent on-chain with ZK proofs, and power a marketplace where pharma and AI companies pay genome holders directly for authorized data access. We take a 20% protocol fee on every transaction. 10,000 genome holders are live. 6 enterprise customers are paying. ARR is $2M and growing 3× quarter-over-quarter."

**Three Investor Archetypes to Target:**

| Archetype | Examples | DNaI Pitch Angle | Expected Check Size |
|-----------|---------|-----------------|-------------------|
| Biotech/genomics specialist | a16z Bio, Andreessen Horowitz Bio, Atlas Venture | Genomic data liquidity layer; comparable to Tempus but sovereign | $5M–$10M |
| Web3 / DeSci | Paradigm, Multicoin, Balaji-affiliated funds | DeSci infrastructure; first genomic data DAO at scale | $3M–$8M |
| Corporate strategic (pharma VC) | Pfizer Ventures, J&J Innovation, Roche Ventures | Preferred data access + governance rights + investment upside | $2M–$5M |

**Critical diligence preparation checklist for CFO:**
- Audited or reviewed financials (at minimum Q3 2026 reviewed statements)
- ARR bridge from $0 to current (month-by-month, by revenue stream)
- Cohort retention curves (even 2–3 months of data is meaningful)
- Pipeline of enterprise deals with weighted ACV
- Smart contract audit report (Trail of Bits or OpenZeppelin)
- ZK proof performance benchmarks at scale
- Key person risk analysis and hiring plan

---

## 9. DAO Treasury Revenue

### 9.1 How Protocol Fees Accumulate in the DAO Treasury

Per the marketplace fee structure, 7% of every data-access transaction is routed directly to the DAO treasury smart contract. This is separate from the 20% protocol fee (Cloud Control LLC's operating revenue).

**Treasury Accumulation Formula:**

```
Monthly DAO treasury inflow = Total GMV × 7%
                            = Active_Genomes × Avg_Price × 7%
```

**Monthly Treasury Projections:**

| Month | Active Genomes | Avg Price | GMV | Treasury Inflow (7%) | Cumulative Treasury |
|-------|---------------|-----------|-----|---------------------|-------------------|
| Sep 2026 | 75 | $150 | $11,250 | $788 | $788 |
| Oct 2026 | 200 | $150 | $30,000 | $2,100 | $2,888 |
| Nov 2026 | 1,250 | $150 | $187,500 | $13,125 | $16,013 |
| Dec 2026 | 3,000 | $150 | $450,000 | $31,500 | $47,513 |
| Jun 2027 (Phase IV steady) | 10,000 | $150 | $1,500,000 | $105,000 | ~$700,000 |

By end of Phase IV (Jun 2027), the DAO treasury holds approximately $700,000 in USDC, plus any yield earned on prior balances. This is a material governance asset.

### 9.2 DeFi Yield Strategy

**Guiding Principles:**
1. Capital preservation above yield maximization — treasury is a governance asset, not a yield fund
2. No exposure to undercollateralized lending protocols (Celsius risk precedent)
3. No exposure to algorithmic stablecoins (UST risk precedent)
4. Yield sources must be liquid (withdrawable within 7 days) to meet operational needs
5. Maximum 30% of treasury in any single protocol

**Approved DeFi Yield Tiers:**

| Tier | Strategy | Expected APY | Risk Level | Max Treasury Allocation |
|------|---------|-------------|-----------|------------------------|
| Tier 1 (Core) | USDC in Aave V3 (Ethereum mainnet) | 4–6% | Low (over-collateralized only) | 50% |
| Tier 1 (Core) | USDC in Compound V3 | 3–5% | Low | 30% |
| Tier 2 (Enhanced) | USDC/USDT LP on Curve (3pool) | 5–8% | Low-Medium (smart contract risk) | 15% |
| Tier 3 (Strategic) | wBTC/ETH exposure for protocol alignment | Variable | Medium | 5% |
| Reserve | Held in DAO multisig (Gnosis Safe) — no yield | 0% | None | Never below 20% of treasury |

**Annual Yield Projection (Phase IV steady state, $700K treasury):**

```
Aave (50%): $350,000 × 5% APY     = $17,500/yr
Compound (30%): $210,000 × 4% APY = $8,400/yr
Curve (15%): $105,000 × 6.5% APY  = $6,825/yr
Reserve (20%): $0 yield
────────────────────────────────────────────────
Annual treasury yield:              ~$32,725
Monthly yield:                       ~$2,727
```

This yield compounds — by Year 2 with $5M+ treasury, annual yield of $200,000+ becomes a meaningful governance resource.

### 9.3 Governance Over Treasury Deployment

**Decision Authority Matrix:**

| Treasury Action | Authority Required | Timelock | Notes |
|-----------------|-------------------|----------|-------|
| Yield strategy change (within approved tiers) | DAO vote (simple majority, 10% quorum) | 48 hrs | Low risk; frequent |
| Protocol grants (ecosystem development) | DAO vote (simple majority, 15% quorum) | 72 hrs | Incentive programs, developer grants |
| Adding new yield protocol to approved tiers | DAO vote (supermajority, 67%, 25% quorum) | 7 days | Risk assessment required |
| Emergency withdrawal (security event) | Multisig Guardian (3-of-5) | 0 hrs | Emergency only; auto-triggers DAO post-vote |
| Treasury allocation >$500K to single purpose | DAO vote (supermajority, 67%, 30% quorum) | 14 days | Material allocation; maximum deliberation |

**Guardian Multisig Composition (3-of-5):**
- 2 Cloud Control LLC principals
- 1 independent security council member (selected by DAO)
- 1 lead pharma enterprise partner representative
- 1 elected community representative (rotating, 6-month terms)

**DAO Proposal Types for Treasury:**

1. **Ecosystem Grants** — Funding developer tools, integrations, or research that grows the protocol's supply or demand. Target 20% of annual treasury yield deployed as grants.

2. **Protocol Incentives** — Temporary fee reductions or bonus multipliers to attract specific cohorts (e.g., 90-day zero-fee access for oncology genome holders to attract pharma demand). Funded from treasury, not operating revenue.

3. **Buyback & Burn (Phase IV consideration)** — Purchasing DNaI tokens on open market and burning them to reduce supply. Requires supermajority. Not recommended until ARR exceeds $5M and token market cap is sufficiently developed.

4. **Reserve Fund** — Minimum 6 months of Cloud Control LLC's operational expenses ($115,000 / 5 months × 6 = $138,000) held in treasury as operational buffer. This reserve must be maintained before any discretionary treasury deployment.

### 9.4 Treasury Transparency and Reporting

The DAO treasury address is public on-chain. Cloud Control LLC commits to:

- Monthly treasury balance report published to governance forum
- Quarterly yield report with DeFi positions and realized yield
- Annual independent treasury audit (included in Series A diligence package)
- Real-time Dune Analytics dashboard for all treasury flows

**Treasury metrics for Series A investors:**

| Metric | Dec 2026 | Jun 2027 (proj.) |
|--------|----------|-----------------|
| Treasury balance | $47,513 | ~$700,000 |
| Monthly inflow | $31,500 | ~$105,000 |
| Annualized treasury ARR | $378,000 | $1,260,000 |
| Yield earned | $0 (too early) | ~$16,000 |
| Grants deployed | $0 | $20,000 |

The treasury balance is an asset that Series A investors value as a protocol health signal — it demonstrates that the marketplace is generating real transaction volume and that the DAO has sustainable governance resources independent of Cloud Control LLC's operating budget.

---

## Appendix A — Revenue Model Key Formulas

```
Monthly Protocol Revenue = Σ (Active_Genomes_i × Price_i × ProtocolFee_i)
Monthly Treasury Inflow  = Σ (Active_Genomes_i × Price_i × TreasuryFee_i = 7%)
Monthly Holder Payout    = Σ (Active_Genomes_i × Price_i × HolderShare_i = 73%)
LTV (per genome)         = Avg_Monthly_Protocol_Revenue × Access_Rate × Tenure_Months
CAC                      = Total_Acquisition_Cost / New_Genome_Holders
Payback Period           = CAC / (Monthly_Protocol_Revenue_per_Genome)
Gross Margin             = (Revenue - Direct_COGS) / Revenue
NRR                      = (Beginning_MRR + Expansion - Contraction - Churn) / Beginning_MRR
ARR Run Rate             = MRR × 12
```

## Appendix B — Competitive Landscape Data Sources

- Nebula Genomics pricing: nebula.org/whole-genome-sequencing (July 2026)
- 23andMe/GSK collaboration: SEC filings, 2018 press release ($300M, 5-year, 5M genomes)
- Genomics England commercial terms: genomicsengland.co.uk/partnerships (2025)
- Ciitizen acquisition by Invitae: Crunchbase, 2021 ($65M acquisition on ~$8M ARR implied)
- Series A benchmarks: Pitchbook genomics SaaS comps, 2024–2025 vintage

---

*Document maintained by: CFO Function, Cloud Control LLC*
*Reviewed: July 1, 2026*
*Next update: After Phase II pilot revenue event (Aug 2026)*
*Distribution: Internal (CFO, CEO, Board) + Series A data room*
