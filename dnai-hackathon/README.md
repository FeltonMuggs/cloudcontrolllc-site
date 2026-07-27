# DNaI — Sovereign Genomic Asset (Flare hackathon build)

Standalone Flare-native DNaI: an **ERC-721** genomic asset with an on-chain
**consent state machine**, **native-FLR** access payments, and a verifiable
**access ledger**. No cross-chain, no XRPL, no oracle attestation — Flare only.

**Design choices locked in:** ERC-721 (one token per genome) · native FLR
payment · single-owner grant/revoke · pitch leads privacy, closes on
compliance/audit-trail.

## What's here
- `contracts/DNaIToken.sol` — the token + consent machine + payment settlement + ledger.
- `test/DNaIToken.test.js` — 22 behavioral tests (all passing).
- `scripts/deploy.js` — deploys to Coston2, seeds one SYNTHETIC demo asset, writes `deployment.json`.
- `frontend/index.html` — single-file demo UI (ethers via CDN, ABI embedded). Reads token
  state, submits a real access request, shows the ledger. State machine is the visual centerpiece.

## The loop (what the demo shows)
1. **Register** — an asset is minted as a DNaI token to its owner (hash + provenance + IPFS pointer; raw data never on-chain).
2. **Request** — a licensee calls `requestAccess` paying the price in FLR → state `Requested`, funds escrowed, logged.
3. **Grant / Deny** — the owner grants (payment splits owner/platform by royalty bps, pull-payment) or denies (full refund).
4. **Revoke** — the owner revokes a live grant; the on-chain state proves it.
5. **Withdraw** — owner and platform pull their balances.

Every transition emits an event, so "who accessed what, when, for what price" is fully on-chain.

## Run the tests (works anywhere, no network)
```bash
npm install
npm test          # expect 22/22 passing
```

## Deploy to Coston2 (run on YOUR machine — Flare RPC is not reachable from the cloud sandbox)
```bash
cp .env.example .env      # add a faucet-funded Coston2 key (C2FLR gas)
npm run deploy            # deploys + seeds demo token #1, writes deployment.json
```
Coston2 faucet: https://faucet.flare.network/coston2

Then paste the printed contract address into `frontend/index.html` at:
```js
const CONTRACT = "0x…";   // your deployed address
```
Open `frontend/index.html` in a browser with an injected wallet set to Coston2 (chain 114).

## Demo script (2 minutes)
1. Connect wallet (owner account) → token #1 shows **Idle**, price 1 FLR.
2. Switch to a second account (the "licensee") → **Request access & pay** → tx confirms → state **Requested**, ledger gains a row.
3. Switch back to owner → **Grant** → state **Granted**, ledger row flips to granted, balances update.
4. **Withdraw** shows the split (owner keeps 90%, platform 10% at default bps).
5. Owner **Revoke** → state **Revoked**; explain future queries are refused, provably.

**Live-with-fallback:** run it live on Coston2, but capture explorer links for each tx beforehand so you can cut to them if the network is slow on stage.

## Pitch spine
- **Open (privacy / sovereignty):** your genome never leaves your control; access is a request you approve, not a sale of your data.
- **Close (compliance / audit trail):** every grant, denial, and revocation is a signed on-chain event — the auditable consent rail a pharma/insurer buyer actually needs. Provenance (REAL/SYNTHETIC/BUNDLED) is on every token; buyers are always told which.
- **Why Flare:** native-FLR settlement, and the roadmap reuses Flare's data/oracle layer for compute-to-data metering post-hackathon.

## Mainnet firewall (do not cross for the hackathon)
Testnet only. Base/mainnet stays behind the go-live gates: provisional patent filed,
securities opinion (deposit/access = not an investment), MTL/KYC scoping, verified
addresses + professional audit, owner set to a secure key/multisig.

## Note on demo provenance
The seeded demo asset is `SYNTHETIC` on purpose — never demo with real-provenance data.
