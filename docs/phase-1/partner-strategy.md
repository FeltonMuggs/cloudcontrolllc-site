# DNaI Partner Strategy
**Cloud Control LLC — Project DNaI**
**Document Version:** 1.0
**Date:** July 1, 2026
**Classification:** Confidential — Internal Strategy Document

---

## Executive Summary

This document defines DNaI's go-to-market partner strategy for Phase I and Phase II. DNaI creates a consent-sovereign genomic data economy where individuals own, control, and earn royalties from access to their genetic data. To achieve network effects and revenue in the Phase II-III window (August–November 2026), DNaI must secure anchor partnerships across five categories: Pharmaceutical, Research Institution, EHR Platform, Sequencing Provider, and AI/Genomics.

The strategy prioritizes **high-value, fast-moving partners** who face acute pain from the current fragmented, legally exposed consent-and-compensation ecosystem. Cloud Control LLC's GBA Blockchain Maturity Model certification provides a critical trust signal for enterprise and institutional buyers who require governance rigor.

**Phase II Revenue Target:** $500K–$2M from pilot agreements
**Priority:** Secure 1 pharma pilot + 1 research institution pilot by October 1, 2026

---

## 1. Partner Categories & Value Propositions

### 1.1 Pharmaceutical Partners

**The Problem They Live With Today**

Large pharmaceutical companies spend between $50,000 and $500,000 per genomic dataset acquisition through data brokers, CROs, and population genomics companies. These datasets are:

- **Consent-unverifiable at the point of acquisition.** HIPAA de-identification compliance is asserted, not audited. When regulators or litigants demand a consent audit trail, it often does not exist.
- **Static snapshots with no longitudinal update mechanism.** A dataset purchased today cannot be refreshed when participants generate new health events.
- **Variant panel-limited.** Brokers package standard panels. Pharma researchers who need rare variant populations or disease-specific cohorts must pay premium prices for curated extractions.
- **Legally exposed under GDPR and emerging US state laws.** Re-consent for secondary use is increasingly required and nearly impossible to obtain retroactively from anonymized cohorts.

The regulatory trend is clear: the EU AI Act, emerging FDA guidance on AI-assisted drug discovery, and the proliferation of biometric privacy statutes (BIPA in Illinois, expanding to 15+ states) are tightening requirements around provably consented training and research data.

**DNaI Value Proposition for Pharma**

| Pain Point | DNaI Solution |
|---|---|
| No consent audit trail | Every data access transaction is logged on-chain with the token holder's cryptographic consent signature |
| Overpaying data brokers | Direct-to-genome-holder marketplace eliminates broker margin; competitive pricing with transparent royalties |
| Static datasets | Genome holders can opt in to longitudinal health event updates |
| Rare variant sourcing is slow | Query interface allows pharma to specify variant panels and recruit exactly the population they need |
| Re-identification legal risk | ZK proofs enable aggregate genomic queries without exposing individual sequence data |
| IRB secondary use complications | Consent is structured for specific use categories at minting time; secondary consent is re-issued via the protocol |

**Target Engagement Level:** Data Partnership Agreements, Research Collaboration Agreements, and future API subscription contracts.

---

### 1.2 Research Institution Partners

**The Problem They Live With Today**

Academic research institutions and government genomic initiatives face a different but equally acute problem: **consent management is a compliance burden, not a competitive advantage.** The current state:

- IRB consent forms are paper or PDF documents stored in siloed institutional systems.
- Consent is non-portable: a participant who consented to a University of Michigan study cannot easily extend that consent to a Broad Institute collaboration.
- Participant compensation is manual, slow, and subject to payment processing overhead (gift cards, checks, ACH delays).
- Cohort recruitment is expensive: $200–$800 per genomic participant in advertising and screening costs.
- Longitudinal studies suffer from dropout; participants who move, change contact information, or lose interest cannot be re-engaged.

**DNaI Value Proposition for Research Institutions**

| Pain Point | DNaI Solution |
|---|---|
| Manual, siloed IRB consent | Blockchain-verified consent record satisfies institutional IRB requirements; consent is portable across institutions with participant approval |
| Slow, costly participant compensation | Smart contract royalty distribution delivers compensation instantly at the point of data access; no accounts payable overhead |
| Expensive cohort recruitment | DNaI token holders are self-selected genomic data contributors; research institutions can post recruitment criteria and match directly |
| Study dropout / re-engagement | Wallet-based identity allows persistent contact; participants can update consent status without administrative overhead |
| Consent auditability for journal publication | On-chain consent log provides immutable proof for data availability statements required by Nature, Science, NEJM |

**Target Engagement Level:** Pilot Data Access Agreements, NIH grant co-investigator arrangements, institutional data commons partnerships.

---

### 1.3 EHR Platform Partners

**The Problem They Live With Today**

Electronic Health Record platforms have become the primary point of care coordination, but genomic data remains largely disconnected from the clinical record. The gap is structural:

- Genomic data is generated by direct-to-consumer companies (23andMe, AncestryDNA) or clinical lab systems (LabCorp, Quest Diagnostics) and stored in isolated silos.
- FHIR R4 includes genomic data resource types (MolecularSequence, Observation), but there is no standard for anchoring a patient's genomic identity across EHR systems.
- When a patient transfers care, their genomic data does not transfer.
- Precision medicine initiatives (pharmacogenomics, oncology) require real-time genomic query at the point of prescribing, which is not possible without a persistent genomic identity layer.

**DNaI Value Proposition for EHR Platforms**

| Pain Point | DNaI Solution |
|---|---|
| No persistent genomic identity | DNaI token serves as genomic identity anchor — one token, one genome, portable across care settings |
| FHIR integration gap | DNaI protocol provides FHIR-compatible genomic identity layer with MolecularSequence resource mapping |
| Patient-controlled data sharing | Consent-gated access means patients, not institutions, control which providers see genomic data |
| Precision medicine at point of care | EHR integration enables real-time pharmacogenomics query via consent-gated vault API |
| Regulatory exposure from genomic data storage | DNaI offloads genomic data storage to the sovereign vault; EHR holds only the identity reference |

**Target Engagement Level:** Technical integration partnerships, FHIR app certification partnerships, health network data commons agreements.

---

### 1.4 Sequencing Provider Partners

**The Problem They Live With Today**

DNA sequencing companies — both clinical-grade and direct-to-consumer — face a commoditization crisis. Whole genome sequencing costs have dropped to $200–$500 per sample. The differentiation battle is no longer about sequencing quality; it is about what customers can **do** with their genomic data after sequencing.

Current post-sequencing customer experience:
- Customer receives a report (ancestry, health predispositions, or clinical variants).
- Customer cannot use the raw data for anything.
- Customer cannot monetize the data.
- If the company is acquired or closes, the customer's data is at risk.
- There is no mechanism for the customer to revoke or selectively share access.

**DNaI Value Proposition for Sequencing Providers**

| Pain Point | DNaI Solution |
|---|---|
| Product commoditization | Sequencing + DNaI minting creates a differentiated offering: "Own your genome + earn royalties from it" |
| Post-sequencing customer churn | DNaI wallet gives customers a persistent, valuable relationship with their genomic data — increasing platform stickiness |
| No ongoing revenue from sequenced customers | Revenue share from royalty flows creates recurring revenue for the sequencing provider (configurable at integration) |
| Customer data liability | Sovereign vault architecture means DNaI holds the encrypted data; sequencing provider reduces their storage liability |
| No participation in research economy | Sequencing provider becomes a distribution channel for DNaI, earning referral fees when their customers participate in research datasets |

**Target Engagement Level:** White-label integration partnerships, co-marketing agreements, revenue share arrangements.

---

### 1.5 AI Company Partners

**The Problem They Live With Today**

AI companies building genomic foundation models, drug discovery models, and precision medicine tools face a ticking legal clock. The regulatory environment is closing:

- The EU AI Act (effective August 2026) requires documentation of training data provenance and consent for high-risk AI systems, which includes most medical AI applications.
- The FDA's proposed framework for AI-enabled medical devices requires traceability of training data.
- Class action litigation risk from using publicly scraped or broker-purchased genomic data without explicit consent is growing.
- The practical problem: building a genomic training dataset of meaningful size (100K+ genomes) with verified consent has been prohibitively slow and expensive.

DeepMind's AlphaFold has demonstrated the transformative potential of genomic AI. The next generation of models — targeting drug target identification, rare disease diagnosis, and pharmacogenomics — will require **phenotype-linked, consent-verified, ethnically diverse** training data that currently does not exist at scale.

**DNaI Value Proposition for AI Companies**

| Pain Point | DNaI Solution |
|---|---|
| Training data consent verification | Every genome in a DNaI-sourced dataset carries an on-chain consent record; provenance is cryptographically auditable |
| EU AI Act compliance | DNaI consent logs satisfy Article 10 training data documentation requirements for high-risk AI |
| FDA AI training data traceability | Immutable on-chain consent trail provides the audit record FDA frameworks will require |
| Diverse, phenotype-linked datasets | DNaI marketplace enables specific cohort queries (ancestry, disease indication, variant panel) |
| Litigation exposure from unconsented training | Cryptographic consent eliminates the "we didn't know" defense risk; shifts liability to the consent layer |

**Target Engagement Level:** Training Data Licensing Agreements, Research Partnership MOUs, API subscription contracts.

---

## 2. Top 20 Priority Targets

### Priority Scoring
- **Priority 1:** Engage immediately in Weeks 5–6; highest strategic value and likelihood to move
- **Priority 2:** Engage in Weeks 7–9; strong value but longer sales cycle or institutional complexity
- **Priority 3:** Engage in Weeks 10–12; important for Phase III but not blocking Phase II pilot

---

### 2.1 Pharmaceutical Partners (5 Targets)

| # | Company | Why They're a Priority | Key Decision-Maker Title | Estimated Deal Size | Priority |
|---|---|---|---|---|---|
| 1 | **Pfizer** | Pfizer's oncology and rare disease divisions run some of the largest real-world evidence programs in the industry. Their 2023 acquisition of Seagen signals aggressive genomic medicine investment. They have documented consent audit issues from the Moderna mRNA patent disputes and are actively seeking compliant real-world genomic data infrastructure. | VP, Real World Evidence & Data Science; Chief Data Officer | $250K–$1.5M/year (data access subscription) | 1 |
| 2 | **Roche / Genentech** | Roche's Foundation Medicine subsidiary makes them the world's leading consumer of tumor genomic data. Their precision oncology pipeline requires matched germline-somatic pairs with consent documentation for companion diagnostic submissions to FDA. Foundation Medicine's existing partnership model makes them comfortable with structured data access agreements. | SVP, Data Science & Digital Health (Roche); VP, Translational Oncology (Genentech) | $500K–$2M/year | 1 |
| 3 | **Regeneron** | Regeneron's Genetics Center has sequenced over 3 million exomes through their UK Biobank and Geisinger Health System partnerships. They understand the consent infrastructure problem better than almost any pharma company. The Geisinger partnership created the model; DNaI extends that model to a sovereign, portable architecture. | Chief Scientific Officer; VP, Regeneron Genetics Center | $1M–$3M/year | 1 |
| 4 | **AstraZeneca** | AstraZeneca's Centre for Genomics Research (CGR) has committed to 2 million patient genomes as a discovery engine. Their 2025 AI-drug discovery initiative specifically cited consent-verified training data as a gap. Their existing collaboration with the Broad Institute makes them familiar with research-grade genomic data governance. | SVP, Data Science & AI; Head, Centre for Genomics Research | $300K–$1.2M/year | 2 |
| 5 | **Illumina** (Pharma/Clinical arm) | Illumina's GRAIL subsidiary (multi-cancer early detection) and their clinical genomics services division generate vast amounts of actionable genomic data from clinical sequencing. Illumina has a unique dual role — they are both a sequencing provider and a clinical genomics data user. They face consent audit requirements from GRAIL's oncology data programs. | Chief Medical Officer; VP, Clinical Genomics | $200K–$800K/year | 2 |

---

### 2.2 Research Institution Partners (5 Targets)

| # | Company/Institution | Why They're a Priority | Key Decision-Maker Title | Estimated Deal Size | Priority |
|---|---|---|---|---|---|
| 6 | **Broad Institute of MIT & Harvard** | The Broad is the world's most influential genomics research institution and has led the development of the gnomAD variant database. Their Terra data commons platform is the reference architecture for cloud genomic research. A Broad pilot would provide immediate scientific credibility and open the door to NIH-funded programs. | Chief Data Officer; Director of Data Sciences Platform | $100K–$500K (pilot) + NIH grant co-PI revenue | 1 |
| 7 | **NIH — National Human Genome Research Institute (NHGRI)** | NHGRI funds the All of Us Research Program ($1.4B committed), which is the largest US genomic data initiative and is actively struggling with participant consent portability and longitudinal re-engagement. NHGRI has public procurement channels, reducing BD complexity for the initial pilot. | Director, Division of Policy, Communications, and Education; Chief Privacy Advisor | $500K–$2M (pilot) + subsequent All of Us integration | 1 |
| 8 | **Wellcome Sanger Institute** | The Sanger Institute is the UK's anchor genomic research institution and manages the international data sharing agreements for the Human Cell Atlas and the 100,000 Genomes Project. Post-Brexit GDPR considerations and international data transfer complexities make DNaI's consent portability specifically valuable to them. | Data Sharing and Governance Lead; Head of Genomic Informatics | $150K–$600K/year (access agreement) | 2 |
| 9 | **Jackson Laboratory (JAX)** | JAX is the world's leading provider of mouse models for genomic research and has a growing human genomics division. Their Clinical Genomics program is expanding and faces exactly the consent management pain DNaI addresses. JAX's size ($400M+ annual revenue) and research-industry bridge position makes them a strong pilot candidate. | VP, Research & Enterprise Development; Chief Innovation Officer | $100K–$400K/year | 2 |
| 10 | **UK Biobank** | UK Biobank holds 500,000 participant genomes and is the reference dataset for polygenic risk score research. Their current consent model is static — participants cannot update, extend, or commercialize their consent. The Biobank Returning Results initiative is actively seeking participant engagement mechanisms. DNaI is the infrastructure answer to their long-term vision. | Director; Head of Participant Engagement | £200K–£800K/year (partnership) | 3 |

---

### 2.3 EHR Platform Partners (4 Targets)

| # | Company | Why They're a Priority | Key Decision-Maker Title | Estimated Deal Size | Priority |
|---|---|---|---|---|---|
| 11 | **Epic Systems** | Epic controls approximately 37% of the US hospital EHR market and 78% of large academic medical centers. Their MyChart patient portal has 250M+ patient records. Epic's App Orchard program provides a structured path for genomic app integration. A DNaI integration with Epic would reach the majority of US academic medical center genomic programs. | VP, Genomics & Precision Medicine; MyChart Platform Lead | $500K–$2M (integration partnership) | 1 |
| 12 | **Oracle Health (Cerner)** | Oracle acquired Cerner in 2022 and has committed Oracle Cloud Infrastructure to health data. Their Millennium EHR serves 25%+ of US hospitals. Oracle's explicit AI and cloud strategy for health data creates alignment with DNaI's API architecture. Oracle Health's federal contracts (VA, DoD) include large genomic programs. | Chief Medical Officer, Oracle Health; VP, Clinical Data Strategy | $400K–$1.5M/year | 2 |
| 13 | **Veradigm (Allscripts)** | Veradigm's real-world data network spans 180M+ patient records and their Life Sciences division sells data access to pharma — they are already in the data marketplace business. DNaI can integrate as a consent-verified genomic layer on top of their existing real-world data product. This is a data product partnership, not just an EHR integration. | Chief Scientific Officer; VP, Life Sciences Data Products | $200K–$700K/year | 2 |
| 14 | **Meditech** | Meditech serves community hospitals (1,200+ clients) where precision medicine adoption is growing fastest. Their Expanse platform's cloud-native architecture makes API integration straightforward. Community hospital networks are underserved by genomic data infrastructure — DNaI could establish category leadership in this segment before Epic-focused competitors. | Chief Strategy Officer; VP, Platform & Integration | $100K–$400K/year | 3 |

---

### 2.4 Sequencing Provider Partners (3 Targets)

| # | Company | Why They're a Priority | Key Decision-Maker Title | Estimated Deal Size | Priority |
|---|---|---|---|---|---|
| 15 | **Illumina** (DTC / NovaSeq Platform) | Illumina powers >90% of global sequencing throughput. A partnership with Illumina's Connected Software division could make DNaI vault minting a native post-sequencing workflow for any Illumina customer. Their DRAGEN software pipeline is the reference standard — a DNaI integration here has multiplier effects across the entire industry. | VP, Connected Software & Informatics; Chief Commercial Officer | $1M–$5M (platform integration + revenue share) | 1 |
| 16 | **Nebula Genomics** | Nebula is the most aligned competitor-to-partner candidate: they already promote genome ownership and data monetization but lack the blockchain consent infrastructure and enterprise data marketplace that DNaI provides. A partnership or white-label arrangement would accelerate Nebula's roadmap while giving DNaI an immediate base of sequenced customers. | CEO / Co-Founder; Chief Product Officer | $300K–$1M/year (revenue share + integration fee) | 1 |
| 17 | **Dante Labs** | Dante Labs is a European whole genome sequencing provider with 200K+ customers across 100+ countries. Their pan-European customer base is especially valuable given GDPR constraints on genomic data — DNaI's consent architecture directly solves their data monetization compliance problem. Their B2B clinical sequencing business is also growing. | CEO; Chief Business Development Officer | $150K–$600K/year | 2 |

---

### 2.5 AI / Genomics Partners (3 Targets)

| # | Company | Why They're a Priority | Key Decision-Maker Title | Estimated Deal Size | Priority |
|---|---|---|---|---|---|
| 18 | **DeepMind (Google) — AlphaFold/AlphaGenome Team** | DeepMind's AlphaFold revolutionized protein structure prediction. Their active research into genomic sequence interpretation (AlphaGenome) requires phenotype-linked, consent-verified training data at population scale. Google's regulatory exposure under EU AI Act for high-risk AI makes consent documentation commercially urgent, not just ethically preferable. | Research Director, Genomics; Head of External Research Partnerships | $2M–$10M/year (training data licensing) | 1 |
| 19 | **Tempus AI** | Tempus has built the world's largest library of clinical and molecular data (over 7 million de-identified patient records). They sell AI-powered genomic analytics to oncology centers and pharma. Their data acquisition problem is continuous — they need ongoing consent-verified genomic data to train and update their models. DNaI is infrastructure for their data supply chain. | Chief Data Officer; SVP, Data Partnerships | $500K–$3M/year | 1 |
| 20 | **Recursion Pharmaceuticals** | Recursion uses AI to map biology at scale for drug discovery. They have disclosed genomic training data as a critical gap in their phenomics-genomics integration roadmap. Their 2025 partnership with Nvidia on BioNeMo genomic model training creates a specific entry point: DNaI-sourced training data for BioNeMo-compatible models. | Chief Scientific Officer; VP, External Data & Partnerships | $300K–$1.5M/year | 2 |

---

## 3. Outreach Sequences & Email Templates

> **Cloud Control LLC trust signal to include in all outreach:** Reference our GBA (Government Blockchain Association) Blockchain Maturity Model certification, which signals enterprise-grade governance, security, and operational rigor — relevant to procurement teams and compliance officers at regulated institutions.

---

### 3.1 Pharmaceutical Partner Outreach

**Email 1 — Cold Outreach / Introduction**

> **Subject:** Consent-verified genomic data access — removing the audit trail problem for [Company] data programs

> Dear [First Name],
>
> I'm reaching out from Cloud Control LLC, the team behind DNaI — the first blockchain-native genomic consent and data access protocol.
>
> I'll be direct about why I'm contacting [Company] specifically: your [Real World Evidence / Oncology / Rare Disease] data programs depend on genomic datasets where the consent audit trail — the thing regulators, IRBs, and litigants now ask for first — either doesn't exist or can't be produced in a usable form. That's not a vendor problem. It's a structural problem with how genomic data has been monetized historically.
>
> DNaI fixes the structure. Every genomic dataset accessed through the protocol is backed by an on-chain consent signature from the genome holder, a timestamped access log, and a scope-limited data access agreement that specifies exactly what the data can be used for. When your compliance team or the FDA asks for the consent audit trail, you export it — cryptographically verified, in seconds.
>
> Cloud Control LLC holds GBA Blockchain Maturity Model certification, and the DNaI architecture has been designed to HIPAA, GDPR Article 9, and emerging EU AI Act documentation standards from day one. This is not a prototype; it is an enterprise-ready protocol being piloted with [research institution/pharma partner class] in Q4 2026.
>
> I'd welcome a 30-minute call to walk through the architecture and discuss whether a pilot data access program for one of your [pharmacogenomics / oncology / rare disease] initiatives could be a fit.
>
> Would any time in the next two weeks work for you?
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 2 — Follow-Up with Proof of Concept / Demo Offer** *(Send 7 days after Email 1)*

> **Subject:** RE: DNaI genomic consent protocol — quick demo for [Company] data team?

> Hi [First Name],
>
> Following up on my note last week about DNaI's consent-verified genomic data protocol.
>
> I wanted to share one specific thing that tends to be most useful for teams at [Company's] level: we've built a live demonstration of the on-chain consent log that shows how a pharma data team would query for a specific variant panel (e.g., BRCA1/2, APOE, or a rare disease cohort), receive cryptographically signed consent confirmations from each genome holder, and export the consent audit trail in a format compatible with FDA data submission packages.
>
> The demo takes 20 minutes. It includes:
> - Live query of the DNaI marketplace for a sample cohort (rare variant specification)
> - Consent log export in JSON-LD and FHIR-compatible formats
> - ZK proof demonstration: aggregate genomic query without exposing individual sequences
> - Pricing model walkthrough: per-genome-per-query vs. subscription access
>
> This is the architecture Cloud Control LLC has built under our GBA Blockchain Maturity Model certification — governance-grade infrastructure designed for regulated industry use cases.
>
> I can make time for a call this week or next. Would [Day, Time] work?
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 3 — Final Follow-Up with Urgency** *(Send 14 days after Email 2)*

> **Subject:** DNaI pilot slots — closing enrollment for Q4 2026 pharma cohort

> Hi [First Name],
>
> One final note from me on DNaI. I don't want to overstay my welcome in your inbox, but I did want to share something relevant before I close out our pharma pilot enrollment for Q4 2026.
>
> We are running a structured 90-day pilot with a single pharmaceutical partner starting October 2026. The pilot provides:
> - Access to 100 de-identified whole genome sequences with on-chain consent records
> - Custom variant panel specification (you define the cohort criteria)
> - Full consent audit trail in FDA-submission-compatible format
> - Pricing: $150 per genome per month ($15,000/month for the 90-day pilot)
>
> We have two pharma organizations in final conversation for this slot. I want to give [Company] the first right to engage before we finalize with one of them.
>
> The regulatory environment is moving fast — EU AI Act documentation requirements go live August 2026, and FDA AI guidance on training data provenance is expected in Q1 2027. The cost of addressing consent audit trail gaps retroactively is much higher than building the right infrastructure now.
>
> If there is any interest at all, a 15-minute call this week is all it takes to determine fit. If the timing isn't right, I completely understand — and I'd welcome a conversation when it is.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

### 3.2 Research Institution Outreach

**Email 1 — Cold Outreach / Introduction**

> **Subject:** Portable blockchain consent for genomic research — relevant to [Institution]'s IRB workflows?

> Dear [First Name],
>
> I'm writing from Cloud Control LLC, where we've built DNaI — a blockchain-native consent management and data access protocol for genomic research.
>
> I'll frame why [Institution] is on our priority list: your research programs generate and consume genomic data across collaborating institutions, funding agencies, and commercial partners. Every one of those handoffs requires re-verification of consent scope. The current mechanism — paper or PDF consent records stored in institutional systems — creates compliance overhead, limits data sharing velocity, and makes longitudinal consent updates nearly impossible.
>
> DNaI addresses this directly. Participant consent is recorded on-chain at the point of enrollment, is portable across institutions with participant authorization, and automatically triggers compensation (crypto or fiat equivalent) at the point of data access. For journal publication, the on-chain consent log satisfies data availability statement requirements from Nature, Science, and NEJM with a verifiable citation.
>
> Cloud Control LLC holds GBA Blockchain Maturity Model certification. The DNaI architecture has been built to satisfy IRB requirements from the ground up — we've mapped consent data structures to the Common Rule's requirements for secondary research use, and the protocol supports dynamic consent modification (participant can update scope without re-enrollment).
>
> Would a call with your data sciences or IRB compliance team make sense? I'd like to understand [Institution]'s specific consent management pain points and explore whether a pilot cohort program could provide real value.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 2 — Follow-Up with Proof of Concept / Demo Offer** *(Send 7 days after Email 1)*

> **Subject:** RE: DNaI consent protocol — IRB-compliant demo for [Institution] research team

> Hi [First Name],
>
> Following up on my earlier note about DNaI's blockchain consent infrastructure for genomic research.
>
> I wanted to share something specific: we have built a live demonstration environment that walks through how a research institution would onboard participants to DNaI, how the consent record is structured to satisfy Common Rule 45 CFR 46 requirements, and how participant compensation is distributed automatically when their genomic data is accessed by a downstream researcher or pharmaceutical partner.
>
> The demo is 25 minutes and covers:
> - Participant enrollment flow (consent capture + genome vault minting)
> - IRB consent record export in machine-readable and human-readable formats
> - Cross-institutional consent portability: how a [Institution] participant's consent travels to a Broad Institute collaboration without requiring re-enrollment
> - Automatic compensation: how royalty distribution works when pharma partners access the cohort
> - On-chain audit log: the exact format journal editors and NIH would receive as a data provenance citation
>
> For context: Cloud Control LLC's GBA Blockchain Maturity Model certification means our governance architecture has been externally validated — this matters for NIH-funded programs where data governance standards are a grant eligibility requirement.
>
> Happy to schedule this for your data sciences team, your IRB compliance officer, or both. Would any time in the next two weeks work?
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 3 — Final Follow-Up with Case Study / Urgency** *(Send 14 days after Email 2)*

> **Subject:** DNaI research institution pilot — Q4 2026 cohort enrollment closing

> Hi [First Name],
>
> Last note from me on DNaI — I want to keep this brief and give you a specific reason to respond if there's interest.
>
> We are finalizing our Q4 2026 research institution pilot cohort. The program:
> - **Structure:** 90-day paid pilot with a participating research institution
> - **Data scope:** 100 de-identified whole genome sequences with on-chain consent records, sourced to the institution's specified research indication
> - **Pricing:** $75 per genome per month ($7,500/month for the pilot cohort)
> - **IRB deliverable:** Full consent audit report in Common Rule-compatible format, suitable for NIH progress reports and journal data availability statements
> - **Compensation:** Participant royalties distributed automatically; institution receives a summary report of all compensation events for participant records
>
> We are in final conversation with two research institutions for this pilot slot. I wanted to give [Institution] the opportunity to engage before we finalize.
>
> If genomic participant consent management, cross-institutional data sharing, or participant compensation infrastructure is on your team's roadmap for 2026-2027, a 15-minute call is the right next step. If the timing isn't right, I'd genuinely welcome a conversation when your next grant cycle creates the opportunity.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

### 3.3 EHR Platform Outreach

**Email 1 — Cold Outreach / Introduction**

> **Subject:** Genomic identity layer for [Platform] — FHIR-compatible sovereign vault integration

> Dear [First Name],
>
> I'm reaching out from Cloud Control LLC regarding DNaI — a genomic consent and identity protocol we've built that we believe is a natural fit for [Platform]'s precision medicine roadmap.
>
> The gap we're addressing: genomic data generated by clinical labs, direct-to-consumer sequencing, and health system genomic programs has no standard identity anchor in the EHR. A patient's BRCA2 result from LabCorp doesn't follow them to a new oncologist using [Platform]. A pharmacogenomics panel ordered at a community hospital can't be referenced when the same patient transfers to an academic medical center. The clinical value of genomic data is stranded in silos.
>
> DNaI provides the identity layer. A patient's DNaI token is a cryptographic anchor for their genomic data — portable, consent-gated, and FHIR-compatible. The vault API exposes MolecularSequence and Observation resources that map directly to [Platform]'s FHIR R4 implementation. Clinicians get real-time genomic query at the point of care. Patients control which providers access which data.
>
> Cloud Control LLC holds GBA Blockchain Maturity Model certification. The DNaI protocol has been designed to integrate with enterprise EHR architectures from day one — not as a bolt-on, but as a FHIR-native genomic identity layer.
>
> Would a technical call with your platform integration team make sense? I'd like to understand [Platform]'s current FHIR genomic resource implementation and discuss where DNaI fits.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 2 — Follow-Up with Proof of Concept / Demo Offer** *(Send 7 days after Email 1)*

> **Subject:** RE: DNaI genomic identity layer — FHIR integration demo for [Platform] team

> Hi [First Name],
>
> Following up on my note about DNaI's genomic identity integration for [Platform].
>
> I've prepared a technical demo that I think will be immediately useful for your platform team. It covers:
> - Live FHIR R4 API walkthrough: how DNaI's vault API exposes MolecularSequence, Observation, and Consent resources compatible with [Platform]'s existing FHIR implementation
> - Patient-controlled consent flow: how a patient uses their DNaI token to grant specific providers access to specific genomic data categories (full genome vs. variant panel vs. disease-specific)
> - Pharmacogenomics point-of-care demonstration: a prescriber queries a patient's CYP2D6 status at the point of prescribing; the query triggers a consent check, returns the result, and logs the access event on-chain
> - Data liability architecture: how DNaI's sovereign vault removes genomic data from [Platform]'s storage obligation while maintaining clinical access
>
> The demo is 30 minutes and is designed for a joint technical + clinical informatics audience.
>
> Cloud Control LLC's GBA Blockchain Maturity Model certification ensures the integration governance meets enterprise procurement requirements — SOC 2 mapping and BAA framework available for review.
>
> Could we find 30 minutes with your platform integration lead and clinical informatics director?
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 3 — Final Follow-Up with Urgency** *(Send 14 days after Email 2)*

> **Subject:** DNaI + [Platform] integration — closing technical partnership conversations for Q4 2026

> Hi [First Name],
>
> One final note on DNaI's EHR integration program.
>
> We are finalizing our Q4 2026 technical integration partnerships. For EHR platforms, we are selecting one primary partner for a structured integration pilot that includes:
> - FHIR-native genomic identity API integration with [Platform]'s existing genomic data workflows
> - Patient-facing consent management interface compatible with [Platform]'s patient portal
> - Joint pilot at a [Platform]-client health system with an active precision medicine program
> - Go-to-market collaboration: co-authored case study, joint conference presentation at HIMSS 2027
>
> The precision medicine EHR integration space is moving quickly — we're aware of at least two competitive initiatives targeting the same integration gap. We'd prefer to partner with [Platform] given your market position, but we need to make our integration partner decision within the next 30 days.
>
> If this aligns with [Platform]'s roadmap, I'd welcome a direct conversation this week. If the timing doesn't work for a Q4 pilot, I'd still value understanding your genomic data integration roadmap for 2027.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

### 3.4 Sequencing Provider Outreach

**Email 1 — Cold Outreach / Introduction**

> **Subject:** Turning [Company] sequenced genomes into an ongoing revenue stream for customers

> Dear [First Name],
>
> I'm reaching out from Cloud Control LLC about DNaI — a genomic sovereignty protocol that we believe can meaningfully differentiate [Company]'s sequencing offering and create a new revenue stream for both [Company] and your customers.
>
> The problem we're solving for sequencing providers: after a customer receives their genome report, their relationship with [Company] effectively ends. The customer has raw data they can't use, can't monetize, and can't easily share with their physician. There's no mechanism for the customer to participate in the genomic research economy that their data could fuel.
>
> DNaI changes this. After sequencing, [Company] customers mint a DNaI token — a cryptographic claim of sovereign ownership over their genome. From that point, the customer can:
> - Earn royalties when pharmaceutical companies or research institutions access their genomic data (with their explicit consent)
> - Selectively share genomic data with physicians and research studies
> - Revoke access at any time
> - Build a persistent, valuable relationship with their genomic data
>
> For [Company], DNaI integration means: a differentiated post-sequencing experience, ongoing customer engagement, and a revenue share from royalty flows when your customers participate in research datasets.
>
> Cloud Control LLC holds GBA Blockchain Maturity Model certification. The DNaI protocol is built for enterprise sequencing workflow integration — we have API documentation and a white-label integration architecture ready for review.
>
> Would a 30-minute call with your product team make sense?
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 2 — Follow-Up with Proof of Concept / Demo Offer** *(Send 7 days after Email 1)*

> **Subject:** RE: DNaI + [Company] integration — customer genome monetization demo

> Hi [First Name],
>
> Following up on my note about DNaI's post-sequencing integration for [Company].
>
> I've prepared a demo that shows exactly what the customer experience looks like when DNaI is integrated into [Company]'s post-sequencing workflow:
>
> - Sequencing completion → vault minting: how a completed genome is encrypted and stored in the DNaI sovereign vault; what the customer receives (a token, a wallet, a report)
> - First royalty event: a pharmaceutical company queries the DNaI marketplace for a specific variant; the customer approves access via their DNaI wallet; royalty is distributed automatically
> - [Company] revenue share: how the integration fee and revenue share is structured for each royalty event originating from a [Company]-sequenced genome
> - Customer retention analytics: engagement data showing that DNaI-integrated customers return to their genomic data 4x more frequently than customers with a static report
>
> The demo takes 20 minutes. It is designed for a product + business development audience.
>
> We're also prepared to share our white-label integration specification — [Company] can present DNaI's capabilities under your own brand if preferred.
>
> When would work for your team this week or next?
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 3 — Final Follow-Up with Urgency** *(Send 14 days after Email 2)*

> **Subject:** DNaI sequencing integration — finalizing Q4 2026 launch partner

> Hi [First Name],
>
> Last note from me. I want to be transparent: we are finalizing our launch sequencing integration partner for Q4 2026 and have active conversations with [Competitor Name / "two other sequencing platforms"]. We'd genuinely prefer [Company] given your [customer base / global reach / platform position].
>
> The partnership structure we're offering to our launch partner:
> - **Integration:** DNaI vault minting integrated into [Company]'s post-sequencing report delivery workflow
> - **Revenue share:** [Company] earns 10% of all royalty flows from [Company]-sequenced genomes (estimated $50–$200 per genome per year at full market participation)
> - **Co-marketing:** Joint press release, shared presence at ASHG Annual Meeting, co-branded customer communication
> - **Exclusivity window:** 6-month preferred partner status in the sequencing provider category
>
> If there is any appetite for this conversation at [Company], a 20-minute call this week is the right next step.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

### 3.5 AI Company Outreach

**Email 1 — Cold Outreach / Introduction**

> **Subject:** Provably consented genomic training data — EU AI Act compliant, ready for [Company]'s models

> Dear [First Name],
>
> I'm writing from Cloud Control LLC about DNaI — a genomic consent and data access protocol that addresses what I believe is the most acute compliance gap in genomic AI development right now.
>
> The EU AI Act's training data documentation requirements (Article 10) are now in effect for high-risk AI systems, which includes most medical AI applications. FDA's expected 2027 guidance on AI-enabled device training data provenance follows the same logic. The question for [Company]'s genomic AI program is not whether you'll need provably consented, auditable training data — it's whether you'll have it when you're asked for it.
>
> DNaI provides the infrastructure. Every genome in a DNaI-sourced dataset carries an on-chain consent record: who consented, when, to what use category (research, AI training, clinical), and for how long. The consent record is cryptographically verifiable — it cannot be forged, altered, or lost. When your regulatory team needs to document training data provenance, the audit export takes seconds.
>
> Beyond compliance: DNaI's marketplace enables [Company] to query for specific cohort characteristics — ancestry, disease indication, variant panel, phenotype links — rather than accepting generic pre-packaged datasets. If your model needs 10,000 ethnically diverse whole genomes with Type 2 diabetes phenotype linkage, DNaI is the mechanism to source exactly that.
>
> Cloud Control LLC holds GBA Blockchain Maturity Model certification. We'd welcome a conversation with your research data and legal teams.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 2 — Follow-Up with Proof of Concept / Demo Offer** *(Send 7 days after Email 1)*

> **Subject:** RE: DNaI genomic training data — live cohort query demo for [Company] research team

> Hi [First Name],
>
> Following up on my note about DNaI's consent-verified genomic training data for [Company]'s AI programs.
>
> I've prepared a demo focused on the research data acquisition workflow your team would actually use:
>
> - Cohort query interface: specify ancestry, disease phenotype, variant panel requirements, and data format; receive a real-time count of matching consented genome holders
> - Consent scope verification: how [Company] confirms that each genome holder has explicitly consented to AI training use (not just research use — training is a distinct consent category in DNaI)
> - Training data package delivery: VCF, FASTQ, or annotated variant format; consent audit manifest included as a structured JSON-LD file
> - EU AI Act compliance export: the exact format of the Article 10 documentation package generated automatically for each training dataset
> - Pricing model: per-genome flat fee ($50–$150 depending on data type) or subscription access for ongoing model training
>
> This is 25 minutes. I can run it for your research data team, your legal/compliance team, or both simultaneously — the compliance framing is different from the technical research framing and I can tailor accordingly.
>
> Cloud Control LLC's GBA Blockchain Maturity Model certification provides the governance baseline your procurement team will ask about.
>
> When would work for a call?
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

**Email 3 — Final Follow-Up with Urgency** *(Send 14 days after Email 2)*

> **Subject:** DNaI AI training data partnership — closing Q4 2026 enrollments

> Hi [First Name],
>
> Final note on DNaI. I want to share something specific before I close out our AI company partner enrollment for Q4 2026.
>
> The EU AI Act Article 10 enforcement calendar is now active. Companies deploying high-risk AI systems — which includes genomic diagnostic and drug discovery AI — without documented training data provenance face penalties up to €30M or 6% of global annual revenue. We're now seeing legal teams at AI companies ask for retroactive training data consent documentation. That documentation doesn't exist for most genomic AI training sets built before 2025.
>
> DNaI cannot fix retroactive gaps — but we can ensure that every training dataset acquired through DNaI from Q4 2026 forward is fully documented and audit-ready.
>
> For [Company]'s Q4 2026 program, we are offering:
> - **Pilot dataset:** 100 whole genome sequences with full phenotype linkage, EU AI Act-compliant consent documentation
> - **Custom cohort:** [Company] specifies the ancestry, disease, and variant requirements
> - **Pricing:** $10,000 flat for the pilot dataset ($100/genome)
> - **Deliverable:** Training data package + complete consent audit manifest + Article 10 compliance documentation
>
> We have capacity for two AI company pilots in Q4. I'd like to hold a slot for [Company] if there's interest.
>
> Best,
> Everett
> Cloud Control LLC | DNaI Protocol
> everett@cloudcontrolllc.com

---

## 4. NDA Framework

### 4.1 Recommended NDA Structure

**Default Position: Mutual Non-Disclosure Agreement (MNDA)**

For all partner categories, DNaI should default to a **mutual NDA** because:
- DNaI is disclosing proprietary protocol architecture, ZK circuit designs, vault encryption specifications, and pilot data structures
- Partners are disclosing their proprietary data workflows, research pipelines, pricing expectations, and strategic roadmaps
- Mutual structure signals equal partnership footing — important for research institutions and large pharma who have strong legal teams and are accustomed to mutual terms
- Asymmetric NDAs (one-way, protecting only DNaI) create friction in enterprise procurement and may be rejected outright by legal teams at Pfizer, Epic, or DeepMind

**Exception: One-Way NDA (DNaI as Receiving Party)**
Appropriate only when engaging with a sequencing provider or research institution that is sharing clinical protocols or participant data structures before DNaI shares any proprietary architecture. Rare; use judgment.

---

### 4.2 Key NDA Clauses for Genomic Data + Blockchain Projects

**Clause 1: Definition of Confidential Information (Genomic-Specific)**

Standard NDA definitions do not adequately cover blockchain projects with genomic data. The definition must explicitly include:

> "Confidential Information includes, without limitation: (a) genomic vault architecture specifications, including but not limited to encryption schemes, key derivation protocols, and access control models; (b) zero-knowledge circuit designs and proving system configurations; (c) smart contract source code and ABI specifications prior to public deployment; (d) pilot participant data structures, de-identification methodologies, and cohort selection criteria; (e) token economic models, royalty distribution algorithms, and marketplace pricing structures; (f) any genomic, health, or phenotypic data shared for the purpose of pilot program design or evaluation, whether de-identified or not."

**Clause 2: Public Blockchain Data Carve-Out**

This is critical and must be explicit to avoid disputes about what "public" means in a blockchain context:

> "Notwithstanding the foregoing, Confidential Information shall not include data or transactions that have been recorded on a public blockchain network and are accessible to any member of the public without restriction, provided that: (a) such information was intentionally recorded as a public transaction by the disclosing party or its authorized users; (b) the fact of such recording does not reveal underlying private data stored off-chain in encrypted vaults; and (c) cryptographic hashes or zero-knowledge proofs recorded on-chain do not constitute disclosure of the underlying data they represent, regardless of public accessibility."

**Clause 3: ZK Circuit and Protocol Architecture Protection**

> "Zero-knowledge proof circuits, constraint systems, trusted setup parameters, and proving/verification key materials constitute Confidential Information of the highest sensitivity. The receiving party shall not: (a) attempt to reverse-engineer, decompile, or reconstruct ZK circuit designs from compiled artifacts; (b) disclose ZK circuit architectures, even in anonymized form, to any third party; (c) use knowledge of ZK circuit designs to construct competing systems or to identify vulnerabilities in the disclosing party's deployed systems."

**Clause 4: Genomic Data Handling Restrictions (Beyond Standard Confidentiality)**

> "Any genomic, genetic, or phenotypic data shared under this Agreement is subject to the following restrictions in addition to standard confidentiality obligations: (a) the receiving party shall not use shared genomic data for any purpose other than evaluating the potential partnership described in this Agreement; (b) the receiving party shall not attempt to re-identify any individual from de-identified genomic data; (c) the receiving party shall not retain any copies of shared genomic data beyond the evaluation period specified herein; (d) the receiving party acknowledges that genomic data constitutes special category personal data under GDPR Article 9 and biometric/genetic data under applicable US state laws, and shall comply with all applicable regulations governing such data."

**Clause 5: Pilot Data and Pilot Design Protection**

> "The design, structure, pricing, and results of any pilot program discussed or conducted under this Agreement constitute Confidential Information. This includes: (a) pilot cohort selection criteria and participant characteristics; (b) pilot pricing terms and economic models; (c) pilot performance metrics and outcomes; (d) any technical integration specifications developed specifically for the pilot. Neither party shall disclose pilot terms or results to third parties without the other party's written consent, except as required by law or regulation."

**Clause 6: Residuals Limitation**

Include an explicit residuals clause to protect both parties from disputes about incidental memory:

> "Notwithstanding anything to the contrary, each party may use Residual Information (information retained in the unaided memory of its personnel who had authorized access to Confidential Information) for any purpose, provided that: (a) such personnel did not intentionally memorize Confidential Information for such purpose; (b) such use does not constitute a breach of any separate agreement; and (c) such use does not infringe any patent or copyright of the disclosing party."

**Clause 7: Permitted Disclosures (Regulatory Carve-Out)**

> "Either party may disclose Confidential Information to the extent required by applicable law, regulation, or court order, including disclosures required by the FDA, NIH, IRB, or any regulatory authority with jurisdiction over genomic data or blockchain-based health systems, provided that: (a) the disclosing party provides the other party with prompt written notice of such requirement (to the extent legally permissible); (b) the disclosing party cooperates with the other party's reasonable efforts to seek a protective order or other appropriate relief; and (c) the disclosing party discloses only that portion of Confidential Information that is legally required to be disclosed."

---

### 4.3 Term and Survival

- **Recommended NDA Term:** 3 years (longer than the standard 2 years, reflecting the sensitivity of genomic data and the long development cycles in genomics partnerships)
- **Survival:** Obligations with respect to genomic data and ZK circuit designs should survive termination indefinitely, not just for the standard 3-5 year post-termination period
- **Destruction on Termination:** Include an explicit data destruction clause requiring certified destruction of any shared genomic data within 30 days of NDA termination, with written confirmation

---

### 4.4 What to Protect — Priority Hierarchy

| Priority | Asset | Rationale |
|---|---|---|
| Critical | ZK circuit designs and constraint systems | Core IP; enables the entire consent verification system |
| Critical | Vault encryption architecture and key management model | Security foundation; any leak creates attack surface |
| Critical | Pilot participant data structures (even de-identified) | Regulatory exposure; genomic data has unique re-identification risk |
| High | Smart contract source code (pre-deployment) | Competitive advantage until public deployment |
| High | Marketplace pricing models and royalty algorithms | Commercial terms; reveals economic strategy |
| High | Partner pilot terms and pricing | Competitive positioning |
| Medium | Technical integration specifications | Standard enterprise IP protection |
| Low | General protocol concept and public architecture documentation | These will be public; NDA should not impede necessary disclosures |

---

## 5. Pilot Program Structure

### 5.1 Phase II Pilot Design

**Target Configuration:** 1 Pharmaceutical Partner + 1 Research Institution Partner running simultaneously in Q4 2026 (October 1 – December 31, 2026)

**Why Two Simultaneous Pilots:**
- Demonstrates the two-sided marketplace (supply side: research institution contributors; demand side: pharma buyer)
- Generates testimonials from both buyer and intermediary perspectives
- Creates a data flow that mimics the production architecture, validating the full consent-to-royalty loop
- Doubles the case study material for Phase III sales

---

### 5.2 Pilot Terms

**Duration:** 90 days (October 1 – December 31, 2026)

**Dataset:** 100 de-identified whole genome sequences per pilot partner
- Minimum 30X coverage
- Variant annotation in GRCh38/hg38 reference
- Phenotype linkage: minimum 15 structured data fields (age range, ancestry, primary disease indication, relevant phenotypic measures)
- All genomes with on-chain consent records specifying pilot use category

**Consent Scope for Pilot Genomes:**
- Research use: YES
- AI training use: Optional (genome holder preference)
- Commercial pharmaceutical use: YES (category-limited)
- Re-identification prohibition: Explicit
- Duration: 12 months post-pilot (genomes do not expire from the dataset after the 90-day pilot)

---

### 5.3 Pilot Pricing Model

**Pharmaceutical Pilot Partner:**
- **Rate:** $150 per genome per month
- **Pilot total:** 100 genomes × $150/month × 3 months = **$45,000**
- **Included:** Full consent audit trail, FHIR-compatible data package, variant query API access (100 queries/month), ZK aggregate query interface, dedicated integration support
- **Excluded:** Raw sequencing data re-export, genome holder identity (never available), secondary use beyond agreed indication

**Research Institution Pilot Partner:**
- **Rate:** $75 per genome per month (reduced rate reflecting non-commercial research use and co-branding value)
- **Pilot total:** 100 genomes × $75/month × 3 months = **$22,500**
- **Included:** Common Rule-compatible consent documentation, IRB-ready audit trail, participant compensation tracking, FHIR-compatible data package, research integration support
- **Excluded:** Patient identity, commercial redistribution rights, post-pilot data retention beyond agreed scope

**Genome Holder Royalty Distribution:**
- 70% of access fees distributed to genome holders (protocol standard)
- 20% to Cloud Control LLC (platform fee)
- 10% to sequencing provider partner (if genome originated through a DNaI sequencing partner; otherwise to Cloud Control LLC)

---

### 5.4 Pilot Success Metrics

**Technical Metrics:**
- [ ] Consent audit trail export completed within 5 seconds for any requested genome
- [ ] Zero data integrity failures across 100-genome pilot dataset
- [ ] FHIR API uptime ≥ 99.5% during pilot period
- [ ] ZK proof generation time ≤ 30 seconds per aggregate query
- [ ] Smart contract royalty distribution executed within 24 hours of data access event

**Business Metrics (Pharma Pilot):**
- [ ] Pharma partner compliance team formally approves consent audit trail format for internal use
- [ ] Pharma partner data science team executes minimum 3 variant panel queries using DNaI interface
- [ ] Pharma partner legal team completes review of Data Access Agreement framework
- [ ] Pilot NPS score ≥ 8/10 from pharma data science team

**Business Metrics (Research Institution Pilot):**
- [ ] IRB officer at institution formally evaluates consent documentation (written feedback required)
- [ ] At least one journal data availability statement draft includes DNaI consent citation
- [ ] Participant compensation events processed with zero errors
- [ ] Pilot NPS score ≥ 8/10 from research data team

**Path-to-Production Trigger:**
A pilot transitions to a production agreement when: (a) all technical metrics are met, (b) NPS ≥ 8/10, and (c) the partner's legal team has completed DAA review.

---

### 5.5 Path from Pilot to Production Agreement

**Week 12 of Pilot (Last 2 Weeks):** Pilot wrap-up and production conversation initiation
- Deliver pilot report (technical performance, consent audit summary, royalty distribution report)
- Executive business review with sponsor
- Present production agreement term sheet

**Production Agreement Structure:**
- **Term:** 12 months (auto-renewing)
- **Minimum commitment:** 500 genomes/year (pharma); 250 genomes/year (research)
- **Pricing:** Volume discount from pilot rate (500 genomes: $120/genome/month pharma; $60/genome/month research)
- **SLA:** 99.9% API uptime, 24-hour consent audit response, dedicated account manager
- **Expansion:** Additional variant panel access, priority cohort recruitment, co-branded genome recruitment campaigns

---

## 6. Data Access Agreement (DAA) Key Terms

### 6.1 Permitted Use Scope

All Data Access Agreements must specify one of the following access tiers. Access is limited to the tier purchased; secondary use in a higher tier requires a new agreement and new consent from genome holders.

| Tier | Label | Permitted Data | Permitted Use | Pricing Tier |
|---|---|---|---|---|
| 1 | VARIANT_PANEL | Specified variant loci only (e.g., 500 SNPs for cardiovascular risk) | Research or clinical analytics for specified indication only | Base |
| 2 | DISEASE_INDICATION | All variants associated with a specified disease category | Research and drug discovery for that indication only | 1.5x base |
| 3 | EXOME | Whole exome (protein-coding regions only) | Broad research use within specified therapeutic area | 2x base |
| 4 | FULL_GENOME | Whole genome sequence | Research and AI training as separately consented; must specify use categories | 3x base |
| 5 | LONGITUDINAL | Full genome + health event updates over time | Longitudinal research programs; requires annual re-consent notification | 4x base |

**Indication Specificity Requirement:** Tier 2 and above must specify the therapeutic area or disease indication at the time of agreement execution. The DAA is void for use outside the specified indication.

---

### 6.2 Duration and Renewal Terms

- **Standard Term:** 12 months from effective date
- **Auto-Renewal:** 30-day notice required to terminate; auto-renews at then-current pricing with 10% cap on year-over-year increases
- **Maximum Initial Term:** 3 years (requires renegotiation of consent scope at renewal — genome holders must re-affirm consent for multi-year agreements)
- **Cohort Refresh:** New genome holders may be added to the licensed cohort at any time during the term at the per-genome pricing. Existing genomes cannot be removed from the licensed cohort mid-term (stability of research dataset).
- **Suspension:** Cloud Control LLC may suspend access (with 48-hour notice) if partner is found in breach of prohibited use terms. Full termination requires 30-day cure period.

---

### 6.3 Pricing Model Options

Partners may select one of three pricing structures at agreement execution:

**Option A: Per-Genome Per-Query**
- Charge per data access event (query)
- Ideal for: low-frequency, high-specificity research queries
- Rate: $5–$25 per query (varies by tier and data volume returned)
- Minimum annual commitment: $25,000

**Option B: Per-Genome Per-Month Subscription**
- Flat monthly fee per genome in licensed cohort; unlimited queries within permitted scope
- Ideal for: continuous access programs, longitudinal research, AI training data pipelines
- Rate: $50–$200 per genome per month (varies by tier)
- Minimum cohort size: 100 genomes

**Option C: Revenue Share**
- No upfront subscription; Cloud Control LLC earns a percentage of revenue generated by the partner from products or services that used DNaI data in development
- Ideal for: AI companies and startups with limited upfront capital but significant potential upside
- Rate: 2%–5% of gross revenue from qualifying products; 5-year cap
- Minimum annual guarantee: $50,000 (to protect genome holder royalty floor)

---

### 6.4 Prohibited Uses

The following uses are prohibited for all access tiers and are grounds for immediate agreement termination:

1. **Re-identification:** Any attempt to identify, infer, or associate genomic data with a specific individual using external data sources, statistical methods, or machine learning inference.

2. **Unauthorized Resale or Sublicensing:** Transfer, sale, licensing, or sublicensing of DNaI-sourced genomic data to any third party without explicit written consent of Cloud Control LLC and the relevant genome holders.

3. **Secondary AI Training Without Additional Consent:** Using genomic data licensed for research purposes to train AI or machine learning models without a separate AI Training Consent agreement executed with the relevant genome holders.

4. **Cross-Indication Use:** Using data licensed for one disease indication in research or development for a different indication.

5. **Discriminatory Use:** Using genomic data in any manner that could result in genetic discrimination in insurance, employment, or housing, in violation of GINA, ADA, or applicable state laws.

6. **Aggregated Dataset Resale:** Combining DNaI-sourced genomic data with other datasets to create a new product or dataset for commercial sale without a separate DNaI Data Commons Agreement.

7. **Retention Beyond Term:** Retaining copies of genomic data after agreement termination (see Data Destruction requirements below).

---

### 6.5 Audit Rights for Genome Holders

A core principle of DNaI is that genome holders retain permanent visibility into who has accessed their data and for what purpose. The following audit rights are non-negotiable and are encoded in the smart contract consent layer:

**On-Chain Access Log (Automated):**
- Every data access event is recorded on-chain with: timestamp, accessing party identifier (hashed), access tier, data elements accessed, and purpose code
- Genome holders can query their complete access log at any time via the DNaI wallet interface
- Access logs are permanent and immutable — they cannot be altered or deleted by any party, including Cloud Control LLC

**Annual Transparency Report (Required of Partners):**
- Partners must provide Cloud Control LLC with an annual report confirming: total queries executed, purpose of queries, data elements accessed, any downstream products or publications resulting from use of DNaI data
- This report is shared in aggregate (non-identifying partner detail) with participating genome holders upon request

**Consent Modification Rights:**
- Genome holders may modify the scope of their consent at any time, with 30-day notice to existing licensees
- Existing licensed periods are honored; consent modifications apply to renewals and new licenses
- Genome holders may request complete access history export in JSON-LD format at any time

---

### 6.6 Termination and Data Destruction

**Termination Events:**
- Breach of prohibited use provisions (immediate, 48-hour notice, 30-day cure for non-critical breaches)
- Partner insolvency or acquisition by a prohibited entity (as defined in the DAA)
- Regulatory action against the partner related to genomic data misuse
- Mutual written agreement

**Data Destruction Requirements:**
- Within 30 days of agreement termination, partner must:
  1. Delete all copies of licensed genomic data from all systems (production, backup, development, test)
  2. Delete all derived datasets that include identifiable genomic content from DNaI sources
  3. Provide written certification of destruction to Cloud Control LLC, signed by the partner's Chief Data Officer or equivalent
  4. Provide a detailed destruction log specifying systems, dates, and methods

**Data Destruction Exceptions:**
- Publications and reports that cite or contain aggregate, non-identifiable results from DNaI data (peer-reviewed publications, regulatory submissions) are not subject to destruction requirements
- AI model weights trained on DNaI data are not required to be destroyed; however, the training data itself must be destroyed per the above requirements
- Regulatory records required by law (FDA, IRB) may be retained for the legally required period with notification to Cloud Control LLC

---

## 7. Conference & Event Strategy

### 7.1 Priority Conferences for Phase II-III (August–December 2026)

---

**ASHG Annual Meeting (American Society of Human Genetics)**
*Typical timing: October | Location: Varies annually*

**Why ASHG:** ASHG is the premier academic genomics conference. The audience includes the exact research institution decision-makers and genomic scientists who influence data governance at the Broad, NHGRI, Sanger, and NIH. This is where credibility in the genomics research community is established.

**Target Activities:**
- Workshop presentation: "Blockchain-Native Consent Portability: A New Standard for Genomic Research Data Governance"
- Poster session: DNaI protocol architecture and consent data model
- Networking: Hosted dinner with Chief Data Officers from target research institutions
- Speaking pitch focus: Technical credibility with the research community; this is NOT a sales pitch venue — it is a scientific credibility venue

**Speaking Pitch Template:**

> *Submission Title:* Sovereign Genomic Consent: A Blockchain-Native Framework for Portable, Auditable IRB Compliance
>
> *Abstract (workshop session):*
> The genomic research community has made extraordinary progress in data generation but has not solved the foundational consent portability problem. Consent obtained for a single institution's IRB protocol cannot travel with the participant to a multi-site collaboration without administrative re-consent that is slow, costly, and introduces participant dropout. We present DNaI, a blockchain-native consent management protocol that anchors genomic participant consent to a cryptographically sovereign token. We describe the consent data model (structured to satisfy Common Rule 45 CFR 46 requirements), the on-chain audit mechanism (providing immutable consent records for journal data availability statements), and the automatic compensation infrastructure (enabling real-time royalty distribution to participants at the point of data access). We present results from our Phase II pilot with [Institution] demonstrating [X]% reduction in consent management overhead and [Y]% improvement in longitudinal participant retention. We invite discussion of how the DNaI protocol could serve as open infrastructure for the genomic research community.

---

**JPMorgan Healthcare Conference**
*Typical timing: January | Location: San Francisco, CA*

**Why JPMorgan:** The JPMorgan Healthcare Conference is the most important healthcare investment and business development event of the year. Every major pharma company, health system, and health IT company sends executive leadership. This is the premier venue for announcing commercial partnerships and Phase III traction.

**Target Activities:**
- 1:1 partner meetings (pre-scheduled through conference platform)
- Investor pitch track (if applicable to DNaI capital strategy)
- Announcement of Phase II pilot results and Phase III partner agreements
- Speaking pitch focus: Commercial traction, revenue numbers, enterprise partnership credibility

**Speaking Pitch Template:**

> *Session Pitch — Biotech/Digital Health Innovation Track:*
> Cloud Control LLC will present DNaI's genomic data economy results from our Phase II commercial pilot: the first consent-verified, royalty-distributing genomic data marketplace operating at clinical research scale. We will share: (1) pilot results from our pharmaceutical and research institution partners; (2) the economic model that makes genomic data monetization viable for individual genome holders; (3) the regulatory compliance architecture that enables pharma and AI companies to source training and research data that satisfies EU AI Act and emerging FDA documentation requirements; (4) our Phase III roadmap for scaling to 10,000+ consented genomes by Q2 2027.

---

**Bio International Convention**
*Typical timing: June | Location: Varies annually*

**Why Bio:** Bio International is the world's largest biotech business development conference. Pharma business development executives, CRO leadership, and genomic data companies all attend. The partnering system generates high-quality 1:1 meetings.

**Target Activities:**
- Partnering system: Schedule 20+ 1:1 meetings with pharma BD teams and genomic data company executives
- Exhibition presence (Phase III): DNaI booth in the digital health / data economy section
- Panel participation: "Data Governance and AI Compliance in Drug Discovery"
- Speaking pitch focus: Business development and commercial partnership

**Speaking Pitch Template:**

> *Panel Proposal — "The Consent Infrastructure Gap in AI-Powered Drug Discovery":*
> AI-powered drug discovery is advancing faster than the data governance infrastructure that should underpin it. This panel will explore the practical compliance challenges facing pharma AI teams as EU AI Act Article 10 enforcement begins and FDA training data guidance is expected. Cloud Control LLC will present DNaI's approach: a blockchain-native consent and data access protocol that makes every genomic training dataset provably consented, cryptographically auditable, and EU AI Act-compliant from the point of data creation. We'll discuss: what provably consented genomic data actually looks like technically; why ZK proofs enable aggregate genomic queries without individual exposure; and how the economics of direct genome-holder compensation make high-quality consented data economically sustainable for both pharma and participants.

---

**HIMSS (Healthcare Information and Management Systems Society)**
*Typical timing: March | Location: Varies annually*

**Why HIMSS:** HIMSS is the primary conference for health IT executives, EHR platform leadership, and hospital CIOs and CMIOs. This is the correct venue for EHR platform partnership announcements and precision medicine integration case studies.

**Target Activities:**
- Innovation theater presentation: "FHIR-Native Genomic Identity: The Missing Layer in Precision Medicine EHR Integration"
- Partner announcement: Joint presentation with Epic or Oracle Health integration partner
- Exhibition presence: Digital health section
- Speaking pitch focus: Technical EHR integration, FHIR compatibility, clinical workflow value

**Speaking Pitch Template:**

> *Session Proposal — Precision Medicine and Genomic Data Integration Track:*
> Pharmacogenomics at the point of prescribing requires real-time genomic query. Today, that genomic data is stranded in siloed systems — direct-to-consumer platforms, clinical lab databases, hospital genomics departments — disconnected from the EHR where prescribing decisions are made. DNaI provides the identity and consent layer that connects genomic data to the clinical workflow. We present our FHIR-native integration architecture: how DNaI's vault API exposes MolecularSequence, Observation, and Consent FHIR resources compatible with Epic, Oracle Health, and Meditech implementations; how patient-controlled consent enables selective sharing with treating providers; and how ZK proofs enable aggregate pharmacogenomics queries without exposing individual sequence data. We present results from our EHR integration pilot demonstrating [X] pharmacogenomics queries per month at the point of prescribing.

---

**ETHDenver / Consensus (Blockchain Conferences)**
*ETHDenver: February | Consensus: May | ETHDenver Location: Denver, CO | Consensus: Austin, TX*

**Why Blockchain Conferences:** These conferences serve two strategic purposes for DNaI: (1) recruiting developer talent for the open-source protocol layer and DeSci ecosystem; (2) establishing credibility in the blockchain/Web3 community, which drives token adoption and secondary market liquidity.

**Target Activities at ETHDenver:**
- Hackathon sponsorship: "Build on DNaI" track with $25,000 in prizes
- Main stage presentation: DNaI tokenomics and genomic sovereignty vision
- Developer workshop: ZK proof integration with the DNaI vault SDK

**Target Activities at Consensus:**
- DeSci (Decentralized Science) track: position DNaI as the infrastructure layer for the DeSci movement
- Panel: "Tokenizing Health Data: Sovereignty, Privacy, and the Genomic Economy"
- Speaking pitch focus: Vision, tokenomics, DeSci ecosystem building

**Speaking Pitch Template (ETHDenver):**

> *Main Stage Proposal — "The Genomic Sovereign Token: Building the Consent Layer for the Bioeconomy":*
> Every human genome is a trillion-dollar asset waiting to be unlocked — but only if the individual holding it has cryptographic sovereignty over who uses it, for what, and at what price. DNaI is the genomic sovereign token: an ERC-721 extension that anchors cryptographic proof of ownership to a human genome, enables ZK-verified consent-gated data access, and distributes royalties automatically via smart contract. We'll demo the full stack live: from genome vault minting to pharmaceutical data access to royalty distribution in a single on-chain transaction sequence. We'll also announce the DNaI developer SDK and open-source ZK consent circuit library for the DeSci community to build on.

---

## 8. Week-by-Week Outreach Calendar (Weeks 5–12)

*Note: Week 5 begins July 29, 2026, per the Phase I Sprint Plan.*

---

### Week 5 (July 29 – August 4): Pharma Outreach — Wave 1

**Focus Category:** Pharmaceutical Partners
**Rationale:** Pharma has the largest deal sizes and the longest sales cycles. Starting pharma outreach in Week 5 gives maximum runway to close a pilot by October 1.

**Targets This Week:**
- Pfizer (VP Real World Evidence)
- Roche/Genentech (SVP Data Science)
- Regeneron (VP Genetics Center)

**Outreach Volume:** 6 emails (2 contacts per company — reach the decision-maker title + one senior scientific leader)
**Action Items:**
- [ ] Personalize Email Template 1 for each pharma target (include specific program or dataset reference)
- [ ] Research correct contact names via LinkedIn and conference speaker lists
- [ ] Schedule 3 placeholder slots on calendar for demo calls (Week 6-7)
- [ ] Finalize one-page DNaI pharma capabilities overview (attach to email or use in follow-up)

---

### Week 6 (August 5–11): Pharma Outreach — Wave 2 + Research Wave 1

**Focus Categories:** Pharmaceutical Partners (continued) + Research Institution Outreach begins
**Rationale:** Continue building pharma pipeline while opening research institution conversations in parallel. Research institutions have procurement cycles that require more lead time.

**Pharma Targets This Week:**
- AstraZeneca (SVP Data Science & AI)
- Illumina Clinical arm (CMO)

**Research Institution Targets This Week:**
- Broad Institute (Chief Data Officer)
- NIH NHGRI (Division Director)

**Outreach Volume:** 4 pharma emails + 4 research emails = 8 total
**Action Items:**
- [ ] Send Email 2 (follow-up) to Week 5 pharma targets who have not responded
- [ ] Personalize research institution Email Template 1 (reference specific programs: gnomAD for Broad, All of Us for NHGRI)
- [ ] Prepare demo environment for first pharma calls expected this week or next
- [ ] GBA certification reference: confirm documentation is ready to share upon request

---

### Week 7 (August 12–18): Research Wave 2 + First Demo Calls

**Focus Category:** Research Institution Outreach (continued) + Live demos with pharma contacts who responded
**Rationale:** Close the research institution first-wave outreach. Begin converting pharma interest to demo calls.

**Research Institution Targets This Week:**
- Wellcome Sanger Institute (Data Sharing Lead)
- Jackson Laboratory (VP Research & Enterprise Development)

**Outreach Volume:** 4 research emails + send pharma Email 2 follow-ups (6 emails)
**Target Demo Calls This Week:** 1–2 pharma demo calls (30 minutes each)
**Action Items:**
- [ ] Run first pharma demo call; log feedback; update demo script
- [ ] Personalize Sanger Institute outreach (reference Brexit GDPR data transfer complexity)
- [ ] Send Email 2 follow-up to Week 5 pharma targets still unresponsive
- [ ] Begin drafting pilot term sheet for pharma (in anticipation of interested party)

---

### Week 8 (August 19–25): EHR Platform Outreach + Sequencing Provider Wave 1

**Focus Categories:** EHR Platform Partners + Sequencing Provider outreach begins
**Rationale:** EHR platform deals have the longest technical evaluation cycles. Starting in Week 8 targets a Phase II integration announcement by Q1 2027. Sequencing providers are faster to close and provide immediate token holder growth.

**EHR Targets This Week:**
- Epic Systems (VP Genomics & Precision Medicine)
- Oracle Health (VP Clinical Data Strategy)

**Sequencing Provider Targets This Week:**
- Illumina Connected Software (VP)
- Nebula Genomics (CEO)

**Outreach Volume:** 4 EHR emails + 4 sequencing emails = 8 total
**Also This Week:** Send pharma Email 3 (final) to non-responsive Week 5 targets
**Action Items:**
- [ ] Research Epic's App Orchard FHIR certification requirements (relevant to email personalization)
- [ ] Research Nebula Genomics' current monetization offering (to position DNaI as complementary, not competitive)
- [ ] Prepare FHIR-specific demo script for EHR calls
- [ ] Send research institution Email 2 follow-ups (to Week 6 targets)

---

### Week 9 (August 26 – September 1): AI Company Outreach + EHR Follow-Ups

**Focus Categories:** AI/Genomics Company Outreach begins + EHR follow-ups
**Rationale:** AI companies have the most urgent compliance pressure (EU AI Act now in effect). Opening conversations in Week 9 allows for a Q4 training data agreement alongside the pharma/research pilots.

**AI/Genomics Targets This Week:**
- DeepMind — AlphaFold/AlphaGenome team (Research Director, Genomics)
- Tempus AI (Chief Data Officer)
- Recursion Pharmaceuticals (Chief Scientific Officer)

**Outreach Volume:** 6 AI company emails + EHR Email 2 follow-ups (4 emails) = 10 total
**Also This Week:** Send research institution Email 3 (final) to non-responsive Week 6 targets
**Action Items:**
- [ ] Personalize DeepMind outreach (reference AlphaGenome specifically; do not conflate with AlphaFold protein structure work)
- [ ] Personalize Tempus AI outreach (reference their 7M patient record library as context for why consent-verified data is the missing layer)
- [ ] Confirm EU AI Act Article 10 documentation requirements for email accuracy (cite the specific article)
- [ ] Prepare EU AI Act compliance one-pager for AI company follow-up materials

---

### Week 10 (September 2–8): Pilot Partner Negotiation + Remaining Sequencing Outreach

**Focus Category:** Convert interested parties to pilot term sheet conversations + Dante Labs outreach
**Rationale:** By Week 10, pharma and research institution conversations started in Weeks 5–7 should be in demo or early negotiation stages. Prioritize converting the most interested parties to signed pilot agreements.

**New Outreach This Week:**
- Dante Labs (CEO)
- UK Biobank (Director)
- Veradigm (Chief Scientific Officer)

**Outreach Volume:** 6 new emails
**Pipeline Management:**
- [ ] For any pharma or research contact who has completed a demo: send pilot term sheet within 48 hours of demo completion
- [ ] Send pharma and research Email 3 (final) to any remaining unresponsive targets
- [ ] Begin drafting NDA and DAA for anticipated pilot partners
- [ ] Target: at least 1 NDA in negotiation by end of Week 10

---

### Week 11 (September 9–15): NDA Execution + Meditech / Remaining EHR Outreach

**Focus Category:** NDA execution with pilot candidates + complete EHR outreach wave
**Rationale:** Push to have NDAs signed before end of September to allow for pilot agreement negotiation in time for October 1 start.

**New Outreach This Week:**
- Meditech (Chief Strategy Officer)

**Outreach Volume:** 2 new emails + AI company Email 2 follow-ups (6 emails) = 8 total
**Pipeline Management:**
- [ ] NDA redlines: review and respond within 48 hours for pilot candidates
- [ ] Schedule executive calls with any NDA-signed pharma or research partners to advance to pilot DAA
- [ ] Send all sequencing provider Email 2 follow-ups
- [ ] Target: 2 NDAs signed by end of Week 11

---

### Week 12 (September 16–22): Pilot Agreement Close + Phase II Preparation

**Focus Category:** Close pilot agreements; shift to Phase II execution preparation
**Rationale:** October 1 pilot start requires signed Data Access Agreements in place by September 25. Week 12 is the critical closing window.

**Outreach Volume:** Minimal new outreach; focus entirely on pipeline conversion
- Final follow-up emails to any AI company targets who have not responded (Email 3)
- Warm introduction requests to any priority targets who remain unreached

**Closing Actions:**
- [ ] Target: 1 pharma Data Access Agreement signed
- [ ] Target: 1 research institution Data Access Agreement signed
- [ ] Pilot dataset preparation: confirm 100 genome holder cohort is assembled and on-chain consent records are complete
- [ ] Pilot kickoff materials: prepared and distributed to both pilot partners
- [ ] Phase II operational readiness: vault API, FHIR endpoints, consent log interface all tested and ready for October 1

---

### Outreach Calendar Summary

| Week | Date Range | Primary Focus | New Emails | Follow-Ups | Target Milestone |
|---|---|---|---|---|---|
| 5 | Jul 29–Aug 4 | Pharma Wave 1 | 6 | 0 | 3 pharma contacts reached |
| 6 | Aug 5–11 | Pharma Wave 2 + Research Wave 1 | 8 | 6 | 5 pharma + 2 research contacts reached |
| 7 | Aug 12–18 | Research Wave 2 + Demo calls | 4 | 6 | 1-2 pharma demos completed |
| 8 | Aug 19–25 | EHR + Sequencing Wave 1 | 8 | 4 | First EHR + sequencing contacts reached |
| 9 | Aug 26–Sep 1 | AI Company Wave 1 | 6 | 10 | AI company pipeline opened; research finals |
| 10 | Sep 2–8 | Pilot negotiation + remaining targets | 6 | 8 | First pilot term sheet delivered |
| 11 | Sep 9–15 | NDA execution + EHR completion | 8 | 6 | 2 NDAs signed |
| 12 | Sep 16–22 | Pilot agreement close | 2 | 8 | 2 pilot DAAs signed |
| **Total** | | | **48** | **48** | **2 signed pilots** |

---

## Appendix A: Key Contacts Research Guidance

For each priority target, use the following research sequence to identify the correct decision-maker contact:
1. LinkedIn: Search "[Company] + VP + Genomics" or "[Company] + Chief Data Officer" or "[Company] + Real World Evidence"
2. Conference speaker lists: ASHG, Bio International, JPMorgan Healthcare speakers from 2024-2026 often list the right people
3. PubMed: Find senior authors on recent publications from the company's genomics programs — these are often the scientific decision-makers
4. Press releases: Announcements of data partnerships, genomic initiatives, or AI programs will name the executive sponsor
5. If no direct contact is found: Address to "Head of [Genomics/Data Science/Precision Medicine]" at the company — it will be routed

---

## Appendix B: Quick Reference — Deal Size Estimates

| Partner Category | Low End | High End | Contract Type |
|---|---|---|---|
| Pharmaceutical | $200K/year | $3M/year | Data Access Agreement + API subscription |
| Research Institution | $75K/year | $600K/year | Data Access Agreement + grant co-PI revenue |
| EHR Platform | $100K/year | $2M/year | Integration partnership + per-query fees |
| Sequencing Provider | $150K/year | $5M/year | Revenue share + integration fee |
| AI Company | $100K dataset | $10M/year | Training data license + subscription |

---

*Document maintained by: Cloud Control LLC — DNaI Strategy Team*
*Next review: August 15, 2026 (Phase I completion)*
*Classification: Confidential — Do not distribute outside Cloud Control LLC without NDA*
