# DNaI Deployment and Distribution Plan
**Cloud Control LLC — Project DNaI**
**Document Version:** 1.0
**Date:** July 1, 2026
**Author:** Deployment & Distribution Agent
**Owner:** everett@cloudcontrolllc.com

---

## Document Purpose

This document governs the end-to-end deployment of the DNaI protocol — from first testnet contract to public mainnet — and defines every distribution channel through which genome holders acquire tokens, enterprises gain API access, and sequencing partners embed DNaI into their delivery workflows. All timelines are keyed to the 22-week playbook (July 1 – December 1, 2026).

---

## 1. Smart Contract Deployment Strategy

### 1.1 Testnet Deployment Sequence

The deployment sequence follows a three-environment progression: Sepolia (Ethereum testnet) → Base Sepolia (L2 testnet) → Base Mainnet. This sequence validates contract logic on the canonical EVM before migrating to the production L2 environment.

```
ENVIRONMENT          CHAIN ID   PURPOSE                         PLAYBOOK WEEK
─────────────────────────────────────────────────────────────────────────────
Sepolia              11155111   Initial contract logic tests    Week 8
Base Sepolia         84532      L2 gas & bridge behavior        Week 8–9
Base Mainnet         8453       Production — genesis event      Week 13
```

**Sepolia (Week 8, Aug 23–29)**

All five core contracts are deployed to Sepolia first:
- `DNaIToken.sol` — ERC-721 extension with genome hash anchoring
- `ConsentRegistry.sol` — on-chain consent event log
- `RoyaltyDistributor.sol` — EIP-2981 + custom multi-party splitter
- `GenomicVaultFactory.sol` — deterministic vault address creation per genome holder
- `AccessController.sol` — pharma/research partner permissioned data access

Each contract is deployed by the development EOA (externally owned account). Sepolia deployment is scripted with Foundry `forge script`. All five contracts are verified on Etherscan Sepolia within 24 hours of deployment.

**Base Sepolia (Week 8–9, Aug 29–Sep 5)**

After Sepolia integration tests pass with full coverage, the same scripts target Base Sepolia (chain ID 84532). This environment validates:
- L2 gas costs against the cost model (target: < $0.01 per mint)
- Bridge contract interaction if ETH collateral is required
- Coinbase wallet and Base-native tooling compatibility
- The Graph Base subgraph indexing

**Base Mainnet (Week 13, Oct 2–8)**

Mainnet deployment is gated by:
1. Security audit complete and all critical/high findings remediated
2. Multisig wallet funded and operational (see Section 1.4)
3. Pre-deployment gas optimization checklist passed (see Section 1.6)
4. Legal sign-off on token distribution mechanics
5. 72-hour team review of final contract bytecode against audited source

### 1.2 Deployment Scripts — Foundry

The primary deployment toolchain is **Foundry** (forge + cast + anvil). Hardhat is retained as a secondary toolchain for plugin compatibility with OpenZeppelin's upgrade tooling.

**Repository structure:**

```
contracts/
├── src/
│   ├── DNaIToken.sol
│   ├── ConsentRegistry.sol
│   ├── RoyaltyDistributor.sol
│   ├── GenomicVaultFactory.sol
│   ├── AccessController.sol
│   └── upgrades/
│       └── DNaITokenV2.sol          (stub for future upgrade)
├── script/
│   ├── Deploy.s.sol                 (Foundry deployment script)
│   ├── DeployTestnet.s.sol
│   ├── VerifyContracts.s.sol
│   └── UpgradeToken.s.sol
├── test/
│   ├── DNaIToken.t.sol
│   ├── ConsentRegistry.t.sol
│   ├── RoyaltyDistributor.t.sol
│   └── integration/
│       └── FullFlow.t.sol
├── foundry.toml
└── hardhat.config.ts               (secondary, upgrade plugins)
```

**`Deploy.s.sol` — core deployment script outline:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {DNaIToken} from "../src/DNaIToken.sol";
import {ConsentRegistry} from "../src/ConsentRegistry.sol";
import {RoyaltyDistributor} from "../src/RoyaltyDistributor.sol";
import {GenomicVaultFactory} from "../src/GenomicVaultFactory.sol";
import {AccessController} from "../src/AccessController.sol";

contract Deploy is Script {
    address constant GNOSIS_SAFE = 0x...; // 3-of-5 multisig (set before mainnet)

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        // 1. Deploy implementation contracts
        DNaIToken tokenImpl = new DNaIToken();
        ConsentRegistry consentImpl = new ConsentRegistry();

        // 2. Deploy UUPS proxies
        bytes memory tokenInit = abi.encodeCall(DNaIToken.initialize, (GNOSIS_SAFE));
        ERC1967Proxy tokenProxy = new ERC1967Proxy(address(tokenImpl), tokenInit);

        bytes memory consentInit = abi.encodeCall(ConsentRegistry.initialize, (GNOSIS_SAFE));
        ERC1967Proxy consentProxy = new ERC1967Proxy(address(consentImpl), consentInit);

        // 3. Deploy non-upgradeable contracts with proxy addresses
        RoyaltyDistributor royaltyDistributor = new RoyaltyDistributor(
            address(tokenProxy), GNOSIS_SAFE
        );
        GenomicVaultFactory vaultFactory = new GenomicVaultFactory(
            address(tokenProxy), address(consentProxy)
        );
        AccessController accessController = new AccessController(
            address(consentProxy), GNOSIS_SAFE
        );

        // 4. Wire contracts together
        DNaIToken(address(tokenProxy)).setVaultFactory(address(vaultFactory));
        DNaIToken(address(tokenProxy)).setRoyaltyDistributor(address(royaltyDistributor));

        // 5. Transfer ownership from deployer EOA to Gnosis Safe
        DNaIToken(address(tokenProxy)).transferOwnership(GNOSIS_SAFE);
        ConsentRegistry(address(consentProxy)).transferOwnership(GNOSIS_SAFE);

        vm.stopBroadcast();
    }
}
```

**Deployment commands:**

```bash
# Sepolia testnet
forge script script/DeployTestnet.s.sol:Deploy \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv

# Base Sepolia
forge script script/DeployTestnet.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvvv

# Base Mainnet (requires multisig confirmation for broadcast)
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvvv
```

### 1.3 UUPS Upgrade Proxy Setup

All upgradeable contracts use **OpenZeppelin's UUPS (Universal Upgradeable Proxy Standard)** pattern rather than Transparent Proxy. UUPS places upgrade logic in the implementation, reducing gas cost for all non-upgrade calls.

**Rationale for UUPS over Transparent Proxy:**
- Lower gas per call (no admin slot check on every call)
- Upgrade authorization is explicit in the implementation (`_authorizeUpgrade` override)
- Compatible with the Gnosis Safe as upgrade authority

**Upgrade authorization pattern:**

```solidity
// In DNaIToken.sol
function _authorizeUpgrade(address newImplementation)
    internal
    override
    onlyRole(UPGRADER_ROLE)
{}
```

The `UPGRADER_ROLE` is assigned exclusively to the Gnosis Safe 3-of-5 multisig. No EOA holds upgrade authority post-deployment.

**Upgrade flow for future versions:**
1. New implementation contract deployed (immutable — no proxy wraps it)
2. Implementation address reviewed by all 5 multisig signers
3. 3-of-5 signatures collected via Gnosis Safe UI
4. `upgradeToAndCall()` executed through the Safe transaction
5. Storage layout compatibility verified via OpenZeppelin's `storageLayout` checker before execution
6. 48-hour timelock between upgrade proposal and execution (implemented in Safe module)

**Storage layout discipline:** All implementation contracts use `@custom:storage-location` annotations and OpenZeppelin's storage namespacing pattern (ERC-7201) to prevent slot collisions across upgrades.

### 1.4 Contract Verification — Etherscan and Basescan

Verification is automated within the Foundry deployment scripts using `--verify` flag. The following verification steps are completed for every environment:

**Automated verification (Foundry):**

```bash
# Verify a specific contract after deployment
forge verify-contract \
  <DEPLOYED_ADDRESS> \
  src/DNaIToken.sol:DNaIToken \
  --chain-id 8453 \
  --etherscan-api-key $BASESCAN_API_KEY \
  --watch
```

**Verification checklist per deployment:**
- [ ] DNaIToken implementation verified on Basescan
- [ ] DNaIToken UUPS proxy verified on Basescan (with proxy detection enabled)
- [ ] ConsentRegistry implementation verified
- [ ] ConsentRegistry proxy verified
- [ ] RoyaltyDistributor verified
- [ ] GenomicVaultFactory verified
- [ ] AccessController verified
- [ ] All source files flatten-verified (backup) using `forge flatten`
- [ ] ABI published to `contracts/abis/` in the repository
- [ ] Proxy-to-implementation linkage confirmed in Etherscan/Basescan UI

**Additional verification artifacts:**
- NatSpec documentation generated: `forge doc` → `contracts/docs/`
- Gas snapshot baseline: `forge snapshot` → `contracts/.gas-snapshot`
- Code4rena-style flat file submitted to security audit firm alongside Basescan link

### 1.5 Multisig Deployment Wallet — Gnosis Safe 3-of-5

**Why 3-of-5:** A 3-of-5 threshold provides resilience against key loss (any 2 signers can be unavailable) while requiring meaningful consensus for protocol changes. Five signers across different custody arrangements eliminates single-key risk.

**Signer configuration:**

| Signer | Role | Key Storage | Hardware |
|--------|------|------------|----------|
| Signer 1 | Cloud Control LLC CEO (Everett) | Ledger Nano X | Primary |
| Signer 2 | Cloud Control LLC CTO | Ledger Nano X | Primary |
| Signer 3 | External Security Counsel | Trezor Model T | Independent |
| Signer 4 | Legal Counsel | Ledger Nano S Plus | Independent |
| Signer 5 | Key Custodian (backup) | Ledger Nano X + encrypted backup | Redundant |

**Safe setup sequence (Week 7, Aug 16–22):**

```
1. Deploy Gnosis Safe on Base Sepolia first — test all 5 signer flows
2. Execute 3 test transactions requiring 3-of-5 confirmation
3. Verify transaction simulation works for each signer's hardware wallet
4. Deploy Gnosis Safe on Base Mainnet
5. Safe address recorded in all deployment scripts before mainnet deploy
6. Fund Safe with 0.5 ETH for initial gas operations
7. Enable Safe modules: Delay Modifier (48-hour timelock for upgrades)
```

**Safe transaction types and thresholds:**

| Transaction Type | Threshold | Delay |
|-----------------|-----------|-------|
| Protocol parameter update | 3-of-5 | 24 hours |
| Contract upgrade | 3-of-5 | 48 hours |
| Treasury withdrawal > 10 ETH | 4-of-5 | 48 hours |
| Emergency pause | 2-of-5 | None (emergency) |
| Emergency unpause | 4-of-5 | 24 hours |

**Emergency pause:** The `PAUSER_ROLE` is held by both the Safe and a designated 2-of-5 emergency committee (CEO + CTO + any 1 signer). Pause can be triggered immediately in case of active exploit. Unpause requires 4-of-5 after incident review.

### 1.6 Gas Optimization Pre-Deployment Checklist

Run this checklist before every mainnet deployment. All items must pass.

**Solidity-level optimizations:**
- [ ] Solidity version pinned to `^0.8.24` (latest stable with PUSH0 and transient storage support)
- [ ] Optimizer enabled: `optimizer = true`, `optimizer_runs = 200` (deployment-size optimized for upgradeable contracts)
- [ ] `via-ir = true` enabled for cross-function optimization
- [ ] All `uint256` loop indices replaced with `uint96` or `uint32` where value range permits
- [ ] `mapping` preferred over `array` for genome-hash lookups (O(1) access)
- [ ] `bytes32` genome hash used instead of `string` for immutable genomic anchors
- [ ] Events used for audit trail data instead of storage (90% gas reduction vs. SSTORE)
- [ ] `unchecked {}` blocks applied to safe arithmetic in royalty distribution loops
- [ ] `immutable` keyword used for factory-set addresses (cheaper than SLOAD)
- [ ] `constant` used for fixed protocol parameters (fee percentages, etc.)
- [ ] Packed struct fields for ConsentRecord (timestamp + scope + duration fit in 2 slots)
- [ ] `calldata` used for all external function array parameters

**Deployment-level optimizations:**
- [ ] `forge snapshot` baseline run — no function exceeds 200,000 gas for standard operations
- [ ] Mint operation gas target: < 85,000 gas on Base (translates to < $0.002 at 1 Gwei)
- [ ] Consent registry write target: < 60,000 gas
- [ ] Royalty distribution target: < 120,000 gas per distribution event
- [ ] Contract bytecode size verified: each contract < 24KB (EIP-170 limit)
- [ ] Proxy deployment gas estimated and Safe funded accordingly

**Base L2-specific:**
- [ ] Blob data (EIP-4844) used for batch consent proofs where applicable
- [ ] Batch mint function tested: 100 mints per transaction for sequencing partner bulk delivery
- [ ] L1 data availability cost modeled for all contract interactions
- [ ] Base gas price oracle queried — deployment scheduled during off-peak (< 5 Gwei L1 base fee)

**Pre-mainnet gate:**
- [ ] All tests pass: `forge test --gas-report -vv`
- [ ] Slither static analysis: zero high-severity findings
- [ ] Echidna fuzzing: 10,000 runs per contract, no invariant violations
- [ ] Security audit final report received, all critical/high findings remediated
- [ ] Audit firm co-signs deployment readiness

---

## 2. Token Distribution Plan

### 2.1 Allocation Table

Total supply: **100,000,000 DNaI tokens** (100M fixed cap, no inflationary minting beyond the genome-minting mechanism).

The genome-minting mechanism issues 1 DNaI token per verified unique human genome. The 100M supply ceiling assumes the platform scales to 100M verified genome holders — consistent with the long-term vision. The allocations below cover the non-genome-holder supply reserved for operational, governance, and incentive purposes.

**Reserve Allocation (30% of total supply — 30,000,000 DNaI):**

| Recipient | Allocation | DNaI Tokens | Vesting | Cliff |
|-----------|-----------|-------------|---------|-------|
| Genome Holders (earned mint) | 70% | 70,000,000 | Immediate on mint (1 per genome) | None |
| Protocol Treasury (DAO) | 10% | 10,000,000 | 4-year linear release, DAO-governed | None |
| Cloud Control LLC | 15% | 15,000,000 | 2-year linear with 6-month cliff | 6 months |
| Sequencing Partners | 5% | 5,000,000 | 18-month linear with 3-month cliff | 3 months |

**Notes on the 70% genome holder allocation:**
- Tokens in this pool are not pre-minted. They are minted on-demand as each genome is verified and vaulted.
- Each verified genome produces exactly 1 DNaI token to the vault owner's wallet.
- The 70M ceiling enforces scarcity — once 70M genomes are verified, the genome-mint mechanism closes and future holders acquire tokens through the marketplace.
- Genome uniqueness is enforced via SHA-256 hash of the genome's canonical representation, stored on-chain. Duplicate hash submissions revert.

### 2.2 Vesting Schedules

**Cloud Control LLC — 15,000,000 DNaI:**
- Cliff: 6 months from mainnet genesis (cliff date: April 2, 2027)
- Vesting: 24-month linear release from genesis date
- Monthly release post-cliff: 15,000,000 / 24 = 625,000 DNaI/month
- Accelerated vesting trigger: None (no change-of-control acceleration — prevents governance gaming)
- Implementation: `VestingWallet.sol` (OpenZeppelin) deployed per beneficiary with Safe as admin

**Sequencing Partners — 5,000,000 DNaI (aggregate):**
- Cliff: 3 months from each partner's onboarding date (not a fixed global date)
- Vesting: 18-month linear release from each partner's onboarding date
- Partner allocation: prorated based on genome delivery volume at end of each calendar quarter
- Minimum allocation per partner: 100,000 DNaI (prevents dust allocations)
- Implementation: `MerkleVesting.sol` — Merkle-proof-based claims allow partners to claim their allocation without on-chain enumeration of all partner addresses

**Protocol Treasury — 10,000,000 DNaI:**
- No cliff — DAO can deploy treasury funds from day one via governance vote
- Release: DAO governance proposals authorize specific allocations from treasury
- Release rate cap: maximum 500,000 DNaI (5%) deployable per 90-day governance cycle without supermajority
- Supermajority (67%) required to deploy > 500,000 DNaI in any single proposal
- Treasury held in the Gnosis Safe until DAO Governor contract is activated (Week 17)

**Vesting contract addresses** are published to the DNaI documentation site and verified on Basescan before genesis event.

### 2.3 Genesis Event Mechanics

**Genesis event date: Wednesday, October 7, 2026 (Week 13 — mainnet launch day)**

**Whitelist mechanics:**
- Whitelist compiled from closed beta participants (Phase II — target 1,000 addresses)
- Whitelist stored as Merkle root on-chain in `GenesisMinter.sol`
- Whitelist proof generation: front-end fetches proof from DNaI API (`GET /api/v1/genesis/proof?address=0x...`)
- Priority mint window: 24 hours exclusively for whitelist addresses
- Public mint window: Opens 24 hours after whitelist window (Oct 8, 2026)

**Mint mechanics:**
- Mint requires proof of genome delivery (signed attestation from accredited sequencing partner, OR self-upload with genomic hash verification)
- Mint price: **0 ETH** — genome holders do not pay to mint (gas is sponsored via ERC-4337 Paymaster, see Section 4.3)
- One token per unique genome hash — contract reverts on duplicate hash
- Mint window: 30 days (closes November 7, 2026) — after this date, new holders mint through the standard sequencing partner flow, not the genesis event contract
- Genesis tokens receive a `GENESIS` attribute in token metadata (distinguishing early adopters)

**Expected genesis event outcomes:**
- Whitelist: 1,000 genomes minted in first 24 hours
- Public window (30 days): 4,000 additional genomes — targeting 5,000 total genesis holders
- Sequencing partner-triggered mints continue beyond genesis window with no ceiling

### 2.4 Anti-Whale and Anti-Sybil Protections

**Anti-whale:**
- Hard cap: 1 DNaI token per unique genome. Biologically enforced — one human genome = one token. No wallet can hold more than one self-minted token.
- Secondary market holdings: Wallets may acquire additional tokens via secondary market, but governance voting weight is capped at 1% of circulating supply per address.
- Governance cap implemented in `DNaIGovernor.sol`: `votingPower = min(balance, totalSupply / 100)`

**Anti-sybil:**
- Genome hash uniqueness: SHA-256 of the genome's canonical VCF representation is stored on-chain. Identical genomes produce identical hashes — the contract prevents duplicate minting.
- Sequencing partner attestation: Tokens minted through sequencing partners require a signed attestation from the partner's SDK (signed with the partner's registered key). Attestation includes the sequencing run ID, making fabrication detectable.
- ZK-genome uniqueness proof (Phase III+): Users who self-upload genomes must submit a ZK proof that their genome hash is distinct from all previously registered hashes — implemented via a ZK accumulator (Noir circuit). This prevents uploading of publicly available genome datasets as Sybil identities.
- KYC gating (optional, enterprise tracks): For regulated data-access transactions, the consent oracle enforces a KYC flag on the genome holder's address, verified through an on-chain KYC registry populated by a licensed identity provider (Persona, Jumio).

---

## 3. Sequencing Partner Distribution Channel

### 3.1 Integration Specification — Target Partners

**Priority integration partners:**

| Partner | Sequencing Volume | Integration Type | Phase | Revenue Model |
|---------|-----------------|-----------------|-------|---------------|
| Illumina | OEM (powers labs worldwide) | B2B SDK + lab software plugin | Phase II | $10K onboard + $5/genome |
| Dante Labs | Direct-to-consumer | White-label vault at delivery | Phase II | $10K onboard + $5/genome |
| Nebula Genomics | Direct-to-consumer, WGS | API embed in results portal | Phase II | $10K onboard + $5/genome |
| GeneDx | Clinical genetic testing | EHR-adjacent integration | Phase III | Custom enterprise pricing |
| Color Health | Population genomics | Bulk vault creation | Phase III | Volume-tiered pricing |

**Integration priority: Dante Labs and Nebula Genomics first (Phase II) — both are DTC, Web3-friendly, and smaller organizations that can move faster than Illumina on partnership decisions.**

### 3.2 `dnai-sequencing-sdk` — Technical Specification

The `dnai-sequencing-sdk` is an NPM package (TypeScript) and Python package published to PyPI. It is the only supported integration path for sequencing partners. Direct API calls without the SDK are not permitted in Phase II (enforced by API key scope restrictions).

**Installation:**

```bash
# Node.js / TypeScript
npm install @cloudcontrol/dnai-sequencing-sdk

# Python
pip install dnai-sequencing-sdk
```

**SDK initialization:**

```typescript
import { DNaISequencingClient } from '@cloudcontrol/dnai-sequencing-sdk';

const client = new DNaISequencingClient({
  partnerId: process.env.DNAI_PARTNER_ID,      // Issued at onboarding
  partnerKey: process.env.DNAI_PARTNER_KEY,    // Ed25519 signing key
  environment: 'production',                   // 'testnet' | 'production'
  chain: 'base',                               // 'base' | 'base-sepolia'
});
```

**Core SDK method — trigger mint after genome delivery:**

```typescript
// Called after sequencing run completes and VCF file is ready
const mintResult = await client.mintGenomicToken({
  customerEmail: 'patient@example.com',          // Used to route token to wallet
  customerWalletAddress: '0x...',                // If customer already has a wallet
  genomeFileHash: sha256(vcfFileBuffer),         // SHA-256 of canonical VCF
  sequencingRunId: 'RUN-2026-08-29-001',         // Partner's internal run identifier
  genomeScope: 'FULL_WGS',                       // Enum: FULL_WGS | EXOME | PANEL
  deliveryConfirmationId: 'DELIVERY-001',        // Partner's delivery confirmation ID
});

// mintResult.txHash       — Base transaction hash
// mintResult.tokenId      — Minted DNaI token ID
// mintResult.vaultAddress — Deterministic vault address for this genome
// mintResult.status       — 'MINTED' | 'PENDING_WALLET' | 'ERROR'
```

**Wallet routing logic:** If `customerWalletAddress` is provided, the token is minted directly to that address. If not provided (most first-time customers), the SDK creates an ERC-4337 account abstraction wallet for the customer using their email as a social recovery seed, and sends a wallet claim link to their email. The customer can upgrade to a full self-custody wallet at any time.

**Genomic hash anchoring:**

```typescript
// SDK handles canonical VCF normalization before hashing
// to ensure identical genomes produce identical hashes regardless of VCF formatting
const canonicalHash = await client.computeGenomicHash(vcfFileBuffer, {
  normalization: 'GRCh38',    // Reference genome build
  sortVariants: true,
  includeMetadata: false,     // Metadata excluded from hash — only variant calls
});
```

**Partner attestation signing:** Every mint call is accompanied by an Ed25519 signature from the partner's registered key. The on-chain `GenomicVaultFactory` verifies this signature against the partner's registered public key before minting. This prevents unauthorized minting using a stolen partner API key (the on-chain key registry is the final authority).

**Batch mint for high-volume labs:**

```typescript
// For labs processing 100+ genomes per day
const batchResult = await client.batchMintGenomicTokens({
  mints: [
    { customerEmail: '...', genomeFileHash: '...', sequencingRunId: '...', ... },
    // up to 100 per batch
  ],
});
// Single transaction, 100 mints — gas cost ~150,000 gas total on Base
```

**SDK error handling and retry logic:**
- Automatic retry with exponential backoff on network errors (3 retries, max 30s delay)
- Idempotency: Each `sequencingRunId` maps to at most one mint. Re-submitting the same run ID returns the original mint result, not a duplicate.
- Webhook support: `client.webhooks.register(url)` — partner receives callbacks on mint confirmation, vault creation, and royalty events

**SDK versioning:** Semantic versioning. Breaking API changes will be in minor version bumps during Phase II (pre-stable). Post-mainnet launch (Phase III), the SDK is stable — breaking changes require major version bump with 90-day deprecation notice.

### 3.3 White-Label Vault Creation Flow at Point of Genome Delivery

Partners can present genome vault creation as a native part of their own product experience — no DNaI branding required unless the partner opts into co-branding.

**Flow at point of genome delivery (from the customer's perspective):**

```
1. Customer receives "Your genome is ready" email from sequencing partner
2. Email contains "Secure Your Genome Data" CTA (partner-branded)
3. Customer clicks → partner's results portal (white-labeled DNaI vault UI)
4. Customer connects wallet OR enters email for ERC-4337 social recovery wallet creation
5. Partner portal calls dnai-sequencing-sdk: mintGenomicToken()
6. Customer sees confirmation: "Your genome is now vaulted and tokenized"
7. Token appears in customer's wallet — vault dashboard accessible at partner subdomain
   e.g., results.dantelabs.com/vault/<tokenId>
```

**White-label vault UI embedding:**

Partners embed the vault UI via an iframe with a signed partner token:

```html
<!-- In partner's results portal -->
<iframe
  src="https://vault.dnai.io/embed?
       partner=dante-labs&
       token=<SIGNED_JWT>&
       theme=partner-theme-id&
       genome=<TOKEN_ID>"
  width="100%"
  height="600px"
  allow="clipboard-write"
/>
```

The signed JWT authorizes the embed session for the specific genome holder. JWT is generated server-side by the partner using their `DNAI_PARTNER_KEY`. The embed UI accepts a `theme` parameter pointing to a partner-registered CSS theme hosted by DNaI, allowing full visual customization (colors, logo, typography).

**Self-hosted vault option (Phase III — Vault-as-a-Service):** Enterprise partners with data residency requirements can self-host the vault UI on their own domain. DNaI provides a Docker image (`ghcr.io/cloudcontrolllc/dnai-vault-ui`) with environment variables for partner configuration. Self-hosted vaults still communicate with the DNaI API for on-chain operations.

### 3.4 Revenue Share with Sequencing Partners

| Revenue Event | DNaI (Cloud Control LLC) | Sequencing Partner | Genome Holder |
|--------------|-------------------------|--------------------|---------------|
| Genome minted via partner SDK | $5/genome (licensing fee) | Included in sequencing fee | — |
| Data access royalty via partner vault | 20% protocol fee | 3% referral fee | 70%+ of royalty |
| AI training license for partner-sourced cohort | 30% protocol fee | 5% cohort origination fee | 58%+ of royalty |
| White-label vault subscription (VaaS) | $2,500–$10,000/month | — | — |

**Partner onboarding fee:** $10,000 per sequencing partner. Covers: SDK integration support (40 hours engineering time), custom theme setup, legal agreement review, and first 1,000 genomes with zero per-genome fee.

**Volume discount on per-genome fee:**

| Monthly Genomes Minted | Per-Genome Fee |
|------------------------|---------------|
| 1 – 1,000 | $5.00 |
| 1,001 – 10,000 | $3.50 |
| 10,001 – 50,000 | $2.00 |
| 50,001+ | $1.00 (custom enterprise) |

---

## 4. Web3 Onboarding Flow

### 4.1 Step-by-Step User Journey

The canonical onboarding path is `cloudcontrolllc.com/dnai` → full vaulted genome holder.

```
STEP 1 — LAND
  URL: cloudcontrolllc.com/dnai
  Page: Marketing landing page — hero, value proposition, "Vault Your Genome" CTA
  Assets: Video explainer (90s), FAQ, partner logos
  Next: Click "Get Started" → cloudcontrolllc.com/dnai/onboard

STEP 2 — CONNECT WALLET
  URL: cloudcontrolllc.com/dnai/onboard
  Action: Wallet connection modal (see Section 4.2 for wallet support)
  New users: "Create wallet with email" option — ERC-4337 social recovery (no seed phrase)
  Existing wallet users: Connect MetaMask / Coinbase / WalletConnect
  Next: Wallet connected → step 3

STEP 3 — UPLOAD GENOME
  URL: cloudcontrolllc.com/dnai/onboard/upload
  Action: Upload VCF, FASTQ, or BAM file (drag-and-drop or file picker)
  Supported: .vcf, .vcf.gz, .fastq, .fastq.gz, .bam
  File handling: Client-side only — file never leaves the browser unencrypted
  Validation: Client-side VCF format validator runs before encryption
  Max file size: 10 GB (chunked upload with progress indicator)
  Next: File validated → step 4

STEP 4 — ENCRYPT
  URL: cloudcontrolllc.com/dnai/onboard/encrypt
  Action: In-browser encryption using Web Crypto API (AES-256-GCM)
  Key derivation: HKDF from wallet signature of deterministic message
    - User signs: "DNaI Vault Key v1 — {walletAddress} — {genomicHash}"
    - Signature used as HKDF input material (never transmitted)
    - Encryption key never leaves the browser
  Progress: Encryption progress bar (large files: 30-60 seconds in browser)
  Next: Encrypted → step 5

STEP 5 — VAULT (STORE)
  URL: cloudcontrolllc.com/dnai/onboard/vault
  Action: Upload encrypted genome to IPFS via Pinata API
  Display: "Uploading to decentralized storage..." with IPFS CID preview
  Fallback: If IPFS upload fails — encrypted file queued to self-hosted IPFS node
  Filecoin deal: Initiated automatically post-IPFS-upload for long-term archival
  Next: IPFS CID confirmed → step 6

STEP 6 — MINT TOKEN
  URL: cloudcontrolllc.com/dnai/onboard/mint
  Action: Mint DNaI ERC-721 token
  Gas: Sponsored via ERC-4337 Paymaster (user pays 0 ETH — see Section 4.3)
  Transaction: User signs UserOperation (not raw transaction) — wallet signs, Paymaster pays
  Token ID: Derived from genomic hash (deterministic)
  Confirmation: Wait for Base transaction confirmation (~2 seconds on Base)
  Next: Token minted → step 7

STEP 7 — DASHBOARD
  URL: cloudcontrolllc.com/dnai/vault/{tokenId}
  Display:
    - Vault status (encrypted, IPFS CID, Filecoin deal status)
    - Token ID and genome hash (on-chain proof)
    - Access control panel (grant/revoke access to researchers/pharma)
    - Royalty dashboard (earnings, pending payments, lifetime total)
    - Consent history (all access grants, with timestamps and counterparty)
    - Data scope controls (what data is accessible per access grant)
    - Marketplace listings (set price floor, list for access)
```

**Time-to-complete:** Target < 10 minutes for a user with an existing VCF file and MetaMask wallet. Target < 15 minutes for a new user creating an ERC-4337 wallet.

### 4.2 Wallet Support

| Wallet | Integration | Support Level | Notes |
|--------|------------|---------------|-------|
| MetaMask | `window.ethereum` via wagmi | Primary | Desktop and mobile browser extension |
| Coinbase Wallet | Coinbase Wallet SDK via wagmi | Primary | Strong fit with Base ecosystem |
| WalletConnect | WalletConnect v2 via wagmi | Primary | 400+ mobile wallet support |
| ERC-4337 Social Recovery | Biconomy / Alchemy Account Kit | Primary | New users — email/social login |
| Safe (Gnosis) | Safe Apps SDK | Secondary | Enterprise users managing team vaults |
| Ledger | Ledger Live + WebUSB | Secondary | Hardware wallet users |

**Wallet connection library:** `wagmi v2` + `viem` for all wallet interactions. `RainbowKit v2` for the connection modal UI (pre-built, supports all above wallets).

**ERC-4337 social recovery wallet (for non-crypto users):**
- Powered by Biconomy Smart Accounts or Alchemy Account Kit (evaluated in Week 7)
- Login options: Google OAuth, Apple Sign-In, email magic link
- Recovery: Social recovery via 3-of-5 guardians (family members, trusted contacts) OR Biconomy's recovery service
- User sees: A normal email/social login — wallet address is generated silently
- Upgrade path: User can export private key or migrate to hardware wallet at any time
- The wallet address is deterministic from the user's social identity — same address across sessions

### 4.3 Gas Sponsorship — ERC-4337 Paymaster

**Requirement:** Genome holders pay zero gas to mint their DNaI token. Gas friction at the mint step would severely reduce conversion rates for non-crypto-native users.

**Implementation: ERC-4337 Paymaster**

The DNaI protocol deploys a `DNaIPaymaster.sol` contract on Base that sponsors gas for:
1. Initial genome token mint (one-time per address)
2. Vault creation transaction (bundled with mint)
3. First consent grant (so users can immediately list their genome for access)

Gas for all other operations (secondary transfers, royalty claims, additional consent grants) is paid by the user.

**Paymaster architecture:**

```
User Browser
  │
  ├── Constructs UserOperation (mint calldata)
  │
  ▼
Bundler (Alchemy / Pimlico)
  │
  ├── Calls DNaIPaymaster.validatePaymasterUserOp()
  │   └── Verifies: address not previously minted (prevents gas drain)
  │   └── Verifies: genome hash submitted (required parameter)
  │
  ├── Paymaster deposits ETH to EntryPoint on user's behalf
  │
  ▼
EntryPoint Contract (ERC-4337 standard)
  │
  ▼
DNaIToken.mint() executes — user pays 0 ETH
```

**Paymaster funding:** The DNaI protocol treasury pre-funds the Paymaster with 50 ETH at mainnet launch, covering approximately 25,000 sponsored mints at current Base gas prices (< $0.002 per mint). Treasury replenishes the Paymaster via governance vote when balance drops below 10 ETH.

**Anti-abuse:** The Paymaster checks that:
1. The calling address has not previously received a sponsored mint (one sponsorship per address)
2. The UserOperation's calldata includes a valid genomic hash (non-zero bytes32)
3. Rate limit: maximum 1,000 sponsored operations per hour (prevents flash-mob drain)

**Bundler provider:** Alchemy (primary), Pimlico (fallback). Both support Base mainnet.

### 4.4 Mobile App Strategy (Phase III)

**Phase III mobile delivery (target: November 2026):**
- React Native app using Expo — shares 80% of code with the Next.js web app
- WalletConnect v2 for mobile wallet integration
- In-app genome file upload from Files app (iOS) or file manager (Android)
- Biometric auth (Face ID / fingerprint) for vault access
- Push notifications for consent requests, royalty payments, and governance votes
- App Store and Google Play submission: Week 15 (October 16–22)

**Phase II mobile (interim):** Progressive Web App (PWA) — the Next.js site is PWA-enabled from Week 8, giving mobile users installable home-screen access without an app store requirement. PWA supports WalletConnect via the mobile deep-link flow.

---

## 5. Enterprise Distribution

### 5.1 Direct Sales Process

**Target segments:**
- Pharmaceutical companies (Pfizer, Roche, Novartis, AstraZeneca, Moderna)
- Academic research institutions (Broad Institute, Wellcome Sanger, NIH, Weill Cornell)
- Biotech (Tempus, Recursion, Alector, 23andMe)

**Sales motion: land-and-expand**

```
WEEK 5–6 (Phase I):     Partner outreach — NDA + initial call
WEEK 11 (Phase II):     Pilot agreement ($22,500 — 3-month, 500 genomes)
WEEK 13 (Phase III):    Pilot → Annual subscription ($50K–$250K/year)
WEEK 22 (Phase IV):     Expand to AI training dataset license + additional genome scope
```

**Sales process steps:**

1. **Initial outreach** (cold email + LinkedIn): 1-page executive brief — "Genomic Data, Consented, Verifiable, Auditable." No technical depth in first touch.
2. **Discovery call** (30 min): Understand partner's data sourcing challenges, compliance constraints, and genomic research pipeline.
3. **Technical demo** (60 min): Live demo of consent oracle, vault access flow, royalty distribution, and audit trail dashboard.
4. **NDA executed**: Standard mutual NDA (Cloud Control LLC legal template).
5. **Pilot proposal**: Statement of Work covering 3 months, specific genome cohort, specific data scopes, price per genome/month.
6. **Pilot execution**: Partner accesses genomic data via API, provides feedback, generates internal ROI case.
7. **Annual agreement**: Enterprise subscription with SLA (see Section 5.3).

**Sales collateral prepared in Phase I (Week 5–6):**
- 1-page executive brief
- 8-slide capability deck (no financial projections — avoids securities concerns)
- Technical integration white paper
- Pilot SOW template
- Reference data (anonymized) showing consent oracle performance and audit trail output

### 5.2 Technical Onboarding — Enterprise

**API key provisioning:**

```
1. Enterprise partner signs DNaI Enterprise Agreement (legal)
2. Cloud Control LLC ops team creates enterprise account in DNaI Admin Portal
3. System generates:
   - API key (Bearer token, 512-bit, scoped to partner's allowed genome cohorts)
   - Webhook signing secret (for consent event notifications)
   - Partner ID (used in on-chain consent registry as requester identifier)
4. Partner receives onboarding packet:
   - API key + webhook secret (via 1Password shared vault or secure email)
   - API documentation link
   - Sandbox environment credentials (Base Sepolia)
   - Assigned Solutions Engineer contact
5. 4-hour technical onboarding session with Solutions Engineer
6. Partner goes live in sandbox → production after test suite passes
```

**API authentication:**

```http
POST /api/v1/genomes/access-request
Authorization: Bearer <ENTERPRISE_API_KEY>
X-DNaI-Partner-ID: <PARTNER_ID>
Content-Type: application/json

{
  "cohortSpec": {
    "genomeScope": "VARIANT_PANEL",
    "ancestryFilter": ["EUR", "AFR"],
    "conditionFlags": ["BRCA1_POSITIVE"],
    "cohortSize": 500,
    "accessDuration": "P3M"
  },
  "pricePerGenome": 150.00,
  "currency": "USDC",
  "consentRequired": true
}
```

**SDK setup — Python (primary for research/pharma):**

```python
from dnai import DNaIEnterpriseClient

client = DNaIEnterpriseClient(
    api_key=os.environ["DNAI_API_KEY"],
    partner_id=os.environ["DNAI_PARTNER_ID"],
    environment="production"
)

# Submit data access request for a cohort
access_request = client.cohorts.request_access(
    genome_scope="VARIANT_PANEL",
    ancestry=["EUR"],
    condition_flags=["BRCA1_POSITIVE"],
    cohort_size=500,
    price_per_genome_usdc=150.0,
    duration_days=90
)

# Poll for consent approvals
consented_genomes = client.cohorts.poll_consent(
    request_id=access_request.id,
    timeout_hours=48
)

# Download access-gated data (decryption handled by SDK — requires consent oracle confirmation)
for genome in consented_genomes:
    data = client.vaults.download(genome.token_id, scope="VARIANT_PANEL")
    # data is plaintext variant panel — decrypted in SDK using ZK-proof-verified access key
```

**Consent oracle integration:**

The consent oracle is a Rust/Axum service that bridges on-chain consent events to enterprise API calls. It:
1. Listens to `ConsentGranted` events from the `ConsentRegistry` contract via The Graph
2. Updates the enterprise partner's access session with the newly consented genome's decryption authorization
3. Notifies the partner via webhook when new genomes consent to their access request
4. Enforces access duration — revokes data access after the agreed duration expires

Webhook payload for consent grant:

```json
{
  "event": "CONSENT_GRANTED",
  "partnerId": "pfizer-research-01",
  "tokenId": "42819",
  "genomeScope": "VARIANT_PANEL",
  "accessUntil": "2027-01-07T00:00:00Z",
  "consentTxHash": "0x...",
  "royaltyPerMonth": "150.00",
  "currency": "USDC"
}
```

### 5.3 Enterprise SLA and Support Tiers

| Tier | Price | Uptime SLA | Support | Features |
|------|-------|-----------|---------|----------|
| **Research** | $50K/year | 99.5% | Email (48h) | API access, up to 1,000 genomes/month |
| **Professional** | $150K/year | 99.9% | Slack + email (8h) | API access, up to 10,000 genomes/month, consent dashboard |
| **Enterprise** | $250K+/year | 99.95% | Dedicated SE + Slack (2h) | Unlimited genomes, custom cohort specs, ZK proof API, compliance dashboard |
| **Strategic** | Custom | 99.99% | 24/7 on-call SE | All features + white-label deployment + co-development roadmap input |

**SLA enforcement:**
- Status page: `status.dnai.io` (Statuspage.io — already used by Cloud Control LLC)
- SLA credits: 10% monthly fee credit per 0.1% below SLA threshold
- Incident response: PagerDuty alerting to on-call engineering team

### 5.4 White-Label Deployment — Vault-as-a-Service (VaaS)

**Available Phase III (Week 13+)**

VaaS allows pharma and large health systems to deploy a private-labeled genomic vault platform on their own infrastructure, using DNaI's smart contracts and SDK but under their own brand and domain.

**VaaS deployment package:**

```
dnai-vaas-bundle/
├── docker-compose.yml           (API + vault UI + IPFS node)
├── helm/                        (Kubernetes deployment charts)
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── config/
│   ├── partner.env.template     (Customization variables)
│   └── theme.json               (Brand colors, logo, typography)
├── contracts/                   (Pre-deployed Base contract addresses)
└── docs/
    └── VaaS-Setup-Guide.pdf
```

**VaaS pricing:** $10,000–$50,000/month depending on genome vault volume and support tier. Includes: self-hosted vault UI, API gateway, IPFS node, and dedicated on-chain consent oracle instance.

**VaaS governance:** VaaS deployments use DNaI's Base mainnet contracts for on-chain consent and royalty — they are not forks of the protocol. This maintains the unified consent audit trail across all VaaS deployments.

---

## 6. EHR Integration Distribution (Phase III)

### 6.1 SMART on FHIR App Distribution

**SMART on FHIR** (Substitutable Medical Applications, Reusable Technologies on Fast Healthcare Interoperability Resources) is the standard mechanism for distributing healthcare apps that integrate with EHR systems. DNaI's EHR integration is packaged as a SMART on FHIR app.

**Distribution targets:**

| Platform | Marketplace | Approval Timeline | Reach |
|----------|------------|-------------------|-------|
| Epic | App Orchard | 3–6 months review | 350M+ patient records |
| Oracle Cerner | App Market | 2–4 months review | 100M+ patient records |
| athenahealth | Marketplace | 2–3 months review | 160K+ providers |
| Veradigm (Allscripts) | Developer Program | 2–4 months review | 45K+ providers |

**Epic App Orchard submission (target: Week 14, Oct 9–15):**

App Orchard submission requirements:
- SMART on FHIR R4 compliant app
- HIPAA Business Associate Agreement with Epic
- SOC 2 Type II certification OR equivalent security review
- Sandbox testing in Epic's MyChart developer environment
- Patient privacy review (Epic's clinical informatics team)
- App listing content: description, screenshots, support contact, pricing

The DNaI SMART on FHIR app requests the following FHIR scopes:
```
patient/Observation.read          (genetic test results)
patient/DiagnosticReport.read     (sequencing reports)
patient/DocumentReference.read    (genome files in EHR document store)
openid fhirUser                   (patient identity)
launch/patient                    (EHR-launched context)
```

The app does **not** write back to the EHR — read-only. This reduces Epic's review complexity significantly.

**App launch flow (from patient perspective in MyChart):**
1. Patient views their genomic test results in MyChart
2. "Secure with DNaI Vault" button appears in the genomic results section
3. Patient clicks → SMART on FHIR launch with patient context
4. DNaI app loads in MyChart iframe — patient authenticates with wallet or email
5. DNaI app fetches DiagnosticReport from Epic FHIR API using SMART access token
6. Genome data is encrypted client-side and vaulted — token minted to patient's wallet
7. Patient sees vault confirmation in the DNaI app panel within MyChart

### 6.2 Patient Consent Flow Inside EHR

The EHR-embedded consent flow must satisfy both DNaI protocol consent requirements and EHR platform consent frameworks. A dual consent model is used:

**EHR-level consent:** Patient acknowledges in the EHR (MyChart) that their genomic data will be exported to the DNaI protocol. This is a standard EHR consent record (FHIR `Consent` resource written back to the EHR).

**On-chain consent:** Patient's wallet signs a transaction creating their on-chain consent profile in `ConsentRegistry.sol`. The consent record specifies:
- Which data scopes they authorize for marketplace access (initial default: none — opt-in required per request)
- Minimum royalty floor they will accept
- Geographic restrictions on data access (e.g., EU-only, US academic research only)

**Consent UI inside EHR:** Streamlined — the EHR-embedded DNaI app presents a 3-step consent wizard:
1. "What data will be vaulted?" — plain-language description of genomic data scope
2. "Who can access your data?" — choose from preset tiers (no access / research only / pharma + research / open)
3. "How will you earn royalties?" — wallet setup or email for ERC-4337 wallet

Total in-EHR consent time: target < 3 minutes.

### 6.3 Bulk Genome Import for Health Systems

Health systems deploying DNaI at scale (e.g., a hospital system with 50,000 previously sequenced patients) use the bulk import API rather than the per-patient SMART on FHIR flow.

**Bulk import flow:**

1. Health system signs DNaI Enterprise Agreement + BAA
2. Health system exports genomic data as FHIR `DiagnosticReport` bundle (NDJSON format)
3. DNaI bulk import API accepts the NDJSON bundle:
   ```bash
   curl -X POST https://api.dnai.io/v1/bulk/import \
     -H "Authorization: Bearer <ENTERPRISE_API_KEY>" \
     -H "Content-Type: application/x-ndjson" \
     --data-binary @genomic-export.ndjson
   ```
4. DNaI processes each report: extracts genome file reference, fetches from health system's FHIR server, encrypts client-side (within DNaI's secure processing environment), uploads to IPFS
5. For each patient: creates ERC-4337 wallet (using patient MRN as recovery seed — patient can claim later), mints DNaI token
6. Health system receives bulk mint report: CSV of patient MRN → token ID → vault address → wallet claim link
7. Health system sends patients a "Your genome data is now secured" communication with wallet claim link

**Patient outreach for wallet claim:** Patients receive an email with a magic link to claim their ERC-4337 wallet. Until claimed, the token is held in a custodial recovery wallet controlled by the health system (with the patient's MRN as the recovery key). Claiming gives patients full self-custody.

**Volume pricing for health systems:** Bulk import charged at $1–$2 per genome for the initial import batch. Ongoing access agreement revenue follows the standard enterprise pricing model.

---

## 7. Geographic Rollout

### 7.1 Phase II — United States + United Kingdom (Weeks 7–12, Aug–Oct 2026)

**United States:**
- Legal entity: Cloud Control LLC (existing Wyoming LLC)
- Regulatory posture: HIPAA-compliant vault, CCPA-compliant data handling, GDPR-adjacent practices adopted from day one
- KYC requirement: Not required for self-minting. Required for data access transactions exceeding $10,000/month (FinCEN threshold consideration — legal counsel confirmation needed)
- Genomic data law compliance: Genetic Information Nondiscrimination Act (GINA) review complete; California Genetic Privacy Act compliance; Illinois BIPA (Biometric Information Privacy Act) mapping

**United Kingdom:**
- Legal entity: Consider UK LLP formation for enterprise contracts (legal counsel recommendation pending)
- Regulatory: UK GDPR (post-Brexit) + ICO registration required for processing UK residents' genetic data
- NHS Digital alignment: Review NHS Digital's Data Security and Protection Toolkit requirements — position DNaI vault as a patient-controlled NHS data companion
- UK partner targets: Genomics England (100,000 Genomes Project alumni), UK Biobank, Wellcome Sanger Institute

### 7.2 Phase III — EU, Canada, Australia (Weeks 13–18, Oct–Nov 2026)

**European Union (GDPR-Compliant Stack):**
- Data residency: EU customer genomic data stored on IPFS nodes within EU (Frankfurt + Amsterdam regions)
- AWS eu-west-1 (Ireland) API layer for EU traffic
- Separate EU IPFS cluster (Pinata EU nodes + self-hosted Frankfurt node)
- GDPR Article 9 (special category health data): Explicit consent model — on-chain consent IS the Article 9 consent record
- Data Protection Impact Assessment (DPIA) completed before EU launch
- Data Processing Agreement (DPA) template for EU enterprise partners
- EU legal entity: Ireland subsidiary (Dublin) — required for VAT and enterprise contracting
- Data subject rights automation: `GET /api/v1/gdpr/export?address=0x...` — one-click Article 20 data portability; `DELETE /api/v1/gdpr/erase` triggers vault deletion and on-chain consent revocation (note: on-chain transaction hashes are immutable — legal analysis required for Article 17 compliance)

**Canada:**
- PIPEDA and provincial health privacy laws (PHIPA in Ontario, HIA in Alberta)
- Genome Canada alignment review
- No separate entity required initially — Cloud Control LLC US entity with Canadian DPA addendum

**Australia:**
- Australian Privacy Act + My Health Records Act review
- Australian Genomics Health Alliance engagement
- AWS ap-southeast-2 (Sydney) data residency for Australian customers

### 7.3 Phase IV — 50+ Jurisdictions (Weeks 19–22, Nov–Dec 2026)

**Jurisdiction gating via KYC/KYB layer:**

```
User attempts to mint or access marketplace
    │
    ▼
IP geolocation check (Cloudflare Workers geo header)
    │
    ├── Jurisdiction in ALLOWED list → proceed
    ├── Jurisdiction in REVIEW list → KYC required
    └── Jurisdiction in BLOCKED list → access denied (compliance requirement)
          Examples: OFAC-sanctioned countries
```

**KYC/KYB provider:** Persona (primary) or Jumio (fallback). Both support 195+ jurisdictions with government ID verification.

**On-chain jurisdiction record:** KYC verification result is recorded as an attestation on the user's address in the `KYCRegistry.sol` contract (deployed by a licensed KYC provider, not Cloud Control LLC, to avoid regulatory licensing requirements for identity verification).

**Jurisdiction compliance matrix:** Published at `dnai.io/compliance-matrix` — a public document listing DNaI's regulatory status in each jurisdiction. Updated as new jurisdictions are activated. Enterprise partners reference this matrix to validate regulatory posture before signing.

**Phase IV jurisdiction targets (50+):**

| Region | Key Jurisdictions | Key Regulatory Challenge |
|--------|------------------|------------------------|
| Americas | US, UK, Canada, Brazil, Mexico | LGPD (Brazil), biometric privacy |
| Europe | DE, FR, NL, SE, CH, NO | GDPR harmonized + canton variation (CH) |
| Asia-Pacific | JP, SG, AU, KR, IN | APPI (JP), PDPA (SG), DPDP Act (IN) |
| Middle East | UAE, SA, IL | DIFC data law, emerging genomic regulation |
| Africa | ZA, KE, NG | POPIA (ZA) |

---

## 8. Infrastructure Deployment

### 8.1 AWS / GCP Multi-Region API Layer

**Primary cloud provider: AWS** (existing Cloud Control LLC infrastructure)

**Production API layer:**

| Region | AWS Region | Purpose | Go-Live |
|--------|-----------|---------|---------|
| Primary (US) | us-east-1 (Virginia) | Primary API, US data processing | Week 13 |
| EU | eu-west-1 (Ireland) | EU data residency, GDPR stack | Week 16 |
| Asia-Pacific | ap-southeast-1 (Singapore) | APAC latency reduction | Week 20 |

**Architecture per region:**

```
Cloudflare (CDN + DDoS + WAF)
    │
    ▼
AWS ALB (Application Load Balancer — multi-AZ)
    │
    ├── ECS Fargate cluster (API containers — Rust/Axum)
    │   ├── Task: dnai-api (genomic vault operations)
    │   ├── Task: dnai-consent-oracle (on-chain event bridge)
    │   ├── Task: dnai-royalty-processor (royalty calculation + distribution)
    │   └── Task: dnai-partner-api (sequencing partner SDK backend)
    │
    ├── RDS Aurora PostgreSQL (multi-AZ) — off-chain metadata
    │   (genome metadata, partner records, access logs — no plaintext genomic data)
    │
    ├── ElastiCache Redis — session cache, rate limiting, Paymaster state
    │
    └── S3 — temporary encrypted upload buffer before IPFS handoff
```

**GCP usage:** Limited to BigQuery for analytics (The Graph subgraph data + API usage metrics). May expand GCP usage for federated learning compute workloads (Phase IV) given GCP's healthcare data processing capabilities (HIPAA BAA with GCP).

**Container orchestration:** AWS ECS Fargate (serverless containers — no EC2 management). Kubernetes (EKS) considered for Phase IV when federated learning compute requirements grow.

**Infrastructure as Code:** Terraform (primary) + AWS CDK (supplementary for ECS service definitions). All infrastructure is version-controlled in the monorepo under `infra/`.

**Auto-scaling policy:**
- API containers: scale on CPU > 70% or request queue depth > 100
- Minimum: 2 containers per region (HA)
- Maximum: 50 containers per region (handles 250K requests/minute)

### 8.2 IPFS Node Cluster

**Pinata (managed IPFS) — primary:**
- Account: Enterprise tier ($399/month — 100GB storage, dedicated IPFS nodes)
- CID pinning: Every encrypted genome file is pinned to Pinata immediately after upload
- Pinata API integration: `dnai-api` service calls Pinata's pinning API, receives CID, records in PostgreSQL

**Self-hosted IPFS nodes (backup + cost optimization):**

| Node | Cloud Provider | Region | Disk | Purpose |
|------|---------------|--------|------|---------|
| ipfs-us-1 | AWS us-east-1 | US | 10 TB NVMe | Primary US node |
| ipfs-eu-1 | AWS eu-west-1 | EU | 10 TB NVMe | EU data residency node |
| ipfs-ap-1 | AWS ap-southeast-1 | APAC | 5 TB NVMe | APAC node |

**Self-hosted node deployment:**

```bash
# Docker deployment per node
docker run -d \
  --name dnai-ipfs \
  -v /data/ipfs:/data/ipfs \
  -p 4001:4001 \   # IPFS swarm port
  -p 5001:5001 \   # IPFS API port (internal only)
  -p 8080:8080 \   # IPFS gateway
  ipfs/kubo:latest

# Configure as private IPFS network (DNaI cluster only)
# via swarm key bootstrap
```

**Redundancy model:** Every encrypted genome file is pinned to at minimum 3 locations: Pinata + 2 self-hosted nodes. The `dnai-api` service verifies all 3 pins are live before issuing the vault confirmation to the user.

**CID integrity:** All CIDs are recorded in the `GenomicVaultFactory` smart contract as part of the vault creation transaction. On-chain CID serves as the tamper-evident pointer — the Base blockchain anchors the IPFS location permanently.

### 8.3 Filecoin Storage Deals for Long-Term Vault Archival

**Purpose:** IPFS alone does not guarantee long-term persistence. Filecoin storage deals provide cryptographic proof of continued storage (Proof of Space-Time) with economic incentives for storage providers to maintain data.

**Filecoin integration via Estuary (or web3.storage):**

```typescript
import { Web3Storage } from 'web3.storage';

// After IPFS upload, initiate Filecoin deal
const web3 = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

// web3.storage wraps IPFS + Filecoin in a single API
const cid = await web3.put(encryptedGenomeFiles, {
  name: `genome-${tokenId}`,
  maxRetries: 3,
});

// web3.storage ensures:
// - IPFS pinning (immediate)
// - Filecoin deals (within 24-48 hours, multiple redundant deals)
// - Proof of storage retrievable via web3.storage status API
```

**Storage deal parameters:**
- Minimum 5 redundant Filecoin deals per genome file
- Deal duration: 540 days (minimum Filecoin deal length) — renewed automatically
- Storage providers: Verified providers in the Filecoin Plus program (subsidized storage for health data)
- Deal monitoring: `dnai-api` queries Filecoin deal status weekly; alerts if deal count drops below 3

**Cost model:** Filecoin Plus provides near-zero storage cost for datasets with DataCap (subsidized by Filecoin Foundation for beneficial data). DNaI will apply for DataCap allocation as a genomic sovereignty project. Estimated cost without DataCap: $0.0001–$0.001 per GB per month.

### 8.4 CDN — Cloudflare Pages

**Existing infrastructure:** cloudcontrolllc.com already deploys on Cloudflare Pages. The DNaI web app at `cloudcontrolllc.com/dnai` deploys on the same Cloudflare Pages project.

**Cloudflare configuration:**

```
cloudcontrolllc.com              → Cloudflare Pages (Next.js static + Edge)
cloudcontrolllc.com/dnai/*       → DNaI onboarding pages (same Pages project)
vault.dnai.io                    → DNaI vault dashboard (separate Pages project)
api.dnai.io                      → Cloudflare Worker proxy → AWS ALB
status.dnai.io                   → Statuspage.io
```

**Cloudflare Workers for edge logic:**
- Geographic routing: Workers detect EU IPs and route API calls to `eu-west-1`
- Rate limiting: 100 requests/minute per IP to public endpoints (genomic upload excluded)
- Bot protection: Cloudflare Bot Management on the `/api` routes
- DDoS protection: Cloudflare Magic Transit (enterprise plan)

**Build and deploy pipeline:**

```yaml
# .github/workflows/deploy-web.yml
- name: Build Next.js
  run: npm run build
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CF_API_TOKEN }}
    accountId: ${{ secrets.CF_ACCOUNT_ID }}
    projectName: cloudcontrolllc-site
    directory: .next
```

**Performance targets:**
- Lighthouse score: > 95 on all pages
- Time to Interactive (TTI): < 3 seconds globally
- Core Web Vitals: all green
- Genome upload start (first byte to IPFS): < 5 seconds

---

## 9. Phase III Mainnet Launch Day Checklist (50 Items)

**Launch Date: Wednesday, October 7, 2026 (Week 13)**
**Launch Time: 12:00 PM ET (Genesis event starts)**

The checklist is organized into five execution blocks. Each item has an assigned owner and must be signed off before the next block begins.

---

### Block A: T-72 Hours (Sunday, October 4)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | Security audit final report received and all Critical/High findings confirmed remediated | CTO | |
| 2 | Audit firm co-signs deployment readiness letter | Audit Firm | |
| 3 | Base mainnet Gnosis Safe deployed and all 5 signers have tested transaction signing | CEO + CTO | |
| 4 | Gnosis Safe funded: 0.5 ETH for contract deployment gas | CEO | |
| 5 | All 5 core contracts deployed to Base mainnet via multisig | CTO | |
| 6 | All 5 contracts verified on Basescan | CTO | |
| 7 | UUPS proxy-to-implementation linkage confirmed on Basescan | CTO | |
| 8 | ERC-4337 Paymaster deployed and funded with 50 ETH | CTO | |
| 9 | Bundler (Alchemy) endpoint confirmed operational on Base mainnet | CTO | |
| 10 | The Graph subgraph deployed to Base mainnet and indexing confirmed | CTO | |

---

### Block B: T-48 Hours (Monday, October 5)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 11 | Production API deployment to us-east-1 confirmed healthy (all containers green) | DevOps | |
| 12 | API integration tests against Base mainnet contracts pass (100%) | CTO | |
| 13 | IPFS Pinata enterprise account confirmed active, CID pinning tested | DevOps | |
| 14 | Filecoin storage deal test completed — sample file archived successfully | DevOps | |
| 15 | Cloudflare Pages production deployment of DNaI web app confirmed live | DevOps | |
| 16 | End-to-end onboarding flow tested: land → wallet → upload → encrypt → vault → mint → dashboard | QA | |
| 17 | MetaMask integration tested on mainnet (not testnet) | QA | |
| 18 | Coinbase Wallet integration tested on mainnet | QA | |
| 19 | WalletConnect v2 tested on mainnet with 3 different mobile wallets | QA | |
| 20 | ERC-4337 social recovery wallet tested end-to-end (email → wallet → mint) | QA | |

---

### Block C: T-24 Hours (Tuesday, October 6)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 21 | Whitelist Merkle root published to `GenesisMinter.sol` on Base mainnet | CTO | |
| 22 | Whitelist proof API (`GET /api/v1/genesis/proof`) tested for all 1,000 whitelist addresses | QA | |
| 23 | Genesis whitelist participants notified by email — mint instructions sent | Marketing | |
| 24 | Paymaster anti-abuse checks verified: duplicate address reverts, rate limit active | CTO | |
| 25 | Status page (`status.dnai.io`) showing all systems operational | DevOps | |
| 26 | PagerDuty on-call rotation confirmed: engineering on-call for 48 hours post-launch | CTO | |
| 27 | Rollback plan documented and confirmed accessible to all engineers | CTO | |
| 28 | Emergency pause procedure tested on Base Sepolia (2-of-5 emergency committee can pause within 60 seconds) | CTO + CEO | |
| 29 | Sequencing partner SDK (Dante Labs, Nebula Genomics) confirmed operational on mainnet | CTO | |
| 30 | Enterprise partner API keys provisioned and tested (Phase II pilot partners) | DevOps | |

---

### Block D: Launch Day (Wednesday, October 7)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 31 | 10:00 AM ET: All-hands 30-minute pre-launch call — confirm all Block A/B/C items signed off | CEO | |
| 32 | 11:00 AM ET: Final smoke test of complete onboarding flow on mainnet | QA | |
| 33 | 11:30 AM ET: Cloudflare traffic ramp enabled (remove maintenance mode) | DevOps | |
| 34 | 12:00 PM ET: Genesis event mint window opens — whitelist period begins | CTO (contract tx) | |
| 35 | 12:00 PM ET: Social media launch announcement posted (Twitter/X, LinkedIn, Farcaster) | Marketing | |
| 36 | 12:00 PM ET: Press release distributed (STAT News, CoinDesk, Nature News) | Marketing | |
| 37 | 12:15 PM ET: Confirm first whitelist mint transaction confirmed on Base | CTO | |
| 38 | 12:30 PM ET: Monitor Paymaster balance — confirm not being drained | CTO | |
| 39 | 1:00 PM ET: First 100 mints confirmed — metrics dashboard showing real-time data | CEO | |
| 40 | 2:00 PM ET: Sequencing partner first auto-mint via SDK confirmed (Dante Labs or Nebula) | CTO | |

---

### Block E: T+24 Hours (Thursday, October 8)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 41 | Public mint window opens (whitelist exclusivity period ends) | CTO (contract tx) | |
| 42 | API rate limits reviewed — adjust if legitimate traffic hitting limits | DevOps | |
| 43 | IPFS node replication confirmed: all minted genome vaults showing 3+ IPFS pins | DevOps | |
| 44 | Royalty distribution contract tested with first data-access request from pilot pharma partner | CTO | |
| 45 | On-call incident log reviewed — all incidents documented and closed or triaged | CTO | |
| 46 | The Graph subgraph indexing confirmed current (< 10 block lag) | CTO | |
| 47 | EU API region (eu-west-1) traffic routing confirmed for EU IPs | DevOps | |
| 48 | Launch metrics published internally: mints, vaults, API calls, Paymaster spend | CEO | |
| 49 | Post-launch retro scheduled (Friday, Oct 9, 3 PM ET) | CEO | |
| 50 | Series A update narrative revised with launch metrics — sent to warm investor contacts | CEO | |

---

## Timeline Integration Summary

| Milestone | Playbook Week | Calendar Date | Section |
|-----------|--------------|---------------|---------|
| Gnosis Safe Base Sepolia test | Week 7 | Aug 16–22 | 1.4 |
| All contracts deployed to Sepolia | Week 8 | Aug 23–29 | 1.1 |
| All contracts deployed to Base Sepolia | Week 8–9 | Aug 29–Sep 5 | 1.1 |
| Sequencing partner SDK beta release | Week 9 | Sep 1–5 | 3.2 |
| Enterprise API keys provisioned (pilot partners) | Week 11 | Sep 13–19 | 5.2 |
| Security audit kickoff | Week 12 | Sep 20 | 1.1 |
| Security audit findings remediated | Week 13 | Oct 2–4 | 1.1 |
| Gnosis Safe Base mainnet deployed | Week 13 | Oct 4 | 1.4 |
| All contracts deployed to Base mainnet | Week 13 | Oct 4–5 | 1.1 |
| Launch day checklist — Block A | Week 13 | Oct 4 | 9 |
| Launch day checklist — Block B | Week 13 | Oct 5 | 9 |
| Launch day checklist — Block C | Week 13 | Oct 6 | 9 |
| Genesis event — mainnet launch | Week 13 | Oct 7 | 2.3, 9 |
| Public mint window opens | Week 13 | Oct 8 | 2.3 |
| EHR integration (FHIR adapter) | Week 14 | Oct 9–15 | 6.1 |
| Epic App Orchard submission | Week 14 | Oct 14 | 6.1 |
| EU API region live | Week 16 | Oct 23–29 | 7.2, 8.1 |
| Governance DAO deployed to mainnet | Week 17 | Nov 2–5 | 2.2 |
| APAC API region live | Week 20 | Nov 23–26 | 8.1 |
| AI marketplace launch | Week 20 | Nov 24–26 | — |
| Series A deck complete | Week 21 | Dec 1 | 9 |

---

## Document Control

- **Version:** 1.0
- **Last Updated:** July 1, 2026
- **Owner:** Cloud Control LLC, DNaI Project
- **Next Review:** August 15, 2026 (Phase I sign-off)
- **Maintained by:** everett@cloudcontrolllc.com

*This document is a living specification. Each phase sign-off triggers a review and update of relevant sections.*
