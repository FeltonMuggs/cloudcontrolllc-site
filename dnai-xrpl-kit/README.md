# DNaI × XRPL — Agentic Payment Rail (testnet kit)

Lets an AI agent pay for a **DNaI data access or inference call** on the **XRP
Ledger** in **XRP or RLUSD**, carrying the DNaI access reference in an on-chain
**Memo** so the payment is auditable and can be attested back to the Flare logic
layer. This is the **payment rail**; your consent / registry / provenance /
oracle-settlement logic stays on Flare/EVM.

Pairs with Ripple's **XRP Ledger AI Starter Kit** (June 2026): the XRPL Docs MCP
server + Agent Wallet Skill + Payments Skill, and **X402** support so agents pay
per API call. This kit implements the DNaI-specific pay-for-access + verification
around those primitives.

Verified in Cowork: **14/14 offline tests** (memo encode/decode, payment tx
construction for XRP + RLUSD, X402 challenge build/parse, resource-side
verification incl. underpaid / wrong-destination / bad-memo / RLUSD cases). The
actual testnet payment runs on your machine (the XRPL testnet isn't reachable
from the Cowork cloud).

## What's inside
- `lib/dnai-xrpl.js` — pure helpers: `accessHash`, memo encode/read, `currencyCode`
  (RLUSD → 40-char hex), `buildPaymentTx`, X402 `buildPaymentRequired` /
  `verifyPayment` (the resource-side check).
- `scripts/create-wallet.js` — generate + faucet-fund a testnet wallet.
- `scripts/pay-for-access.js` — agent pays; access ref goes in the Memo; prints tx hash.
- `scripts/verify-access.js` — resource server verifies the payment before granting.
- `test/offline.test.js` — the 14 offline tests (`npm test`).

## The 30-minute path (your machine)
```bash
npm install
npm test                         # 14/14 offline

node scripts/create-wallet.js    # → address + seed (put seed in .env) + testnet XRP
cp .env.example .env             # set SEED, DEST (a second address), CURRENCY, VALUE, ACCESS_REF
node scripts/pay-for-access.js   # agent pays; prints tx hash + explorer link
node scripts/verify-access.js <TX_HASH>   # resource server: GRANTED / DENIED
```
For RLUSD instead of XRP: set `CURRENCY=RLUSD`, `VALUE=299`, and `RLUSD_ISSUER=…`,
and establish an RLUSD trustline on the payer first (per XRPL docs).

## How it plugs into DNaI (two rails)
1. A buyer's **agent** requests a dataset/inference from a DNaI endpoint.
2. The endpoint returns an **X402 “402 Payment Required”** body
   (`buildPaymentRequired`) naming the price (XRP/RLUSD), the pay-to address, and
   the **accessRef** (e.g. the dataset `contentHash` from the EVM dataset kit).
3. The agent pays on XRPL with the accessRef in the Memo (`pay-for-access`).
4. The resource server **verifies** the validated payment (`verify-access` →
   `verifyPayment`) and grants access.
5. Optionally, your Flare-side connector **attests the XRPL payment event**
   (the spec's cross-chain attestation) to release the on-chain consent grant —
   linking this rail to the patented settlement logic.

## Installing Ripple's XRPL AI Starter Kit (separate from this kit)
Not a one-click claude.ai connector — it's an MCP server + Claude skills you add
to your client:
- **XRPL Docs MCP server** — add it to your Claude Desktop/Code MCP config (per
  Ripple's repo / npm package) so your agent can pull XRPL docs on demand.
- **Agent Wallet + Payments Skills** — install per Ripple's instructions so an
  agent can create wallets and send XRP/RLUSD.
- Follow xrpl.org → “Getting Started with Agentic Transactions”. This DNaI kit is
  what you build on top for consented, access-referenced pay-for-access.

## Guardrails
- Testnet only until go-live gating clears (see the other kits). Never reuse a
  testnet seed on mainnet.
- Paying for **real** data access is the public payment/disclosure path — keep it
  behind the same gate as /dnai/vip and /dnai/data until the provisional is filed.
- RLUSD is an issued currency: a trustline and the correct issuer are required.
- `verifyPayment` uses `delivered_amount` (partial-payment safe) and checks
  destination + amount + the DNaI access memo before granting.
```
