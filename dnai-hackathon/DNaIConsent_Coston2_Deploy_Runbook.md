# DNaIConsent — Coston2 Deploy Runbook (Claude Code / Cowork)

_Cloud Control LLC · execution-ready handoff · merged consent contract + gated preview_

This is written to be pasted into **Claude Code (or Cowork) on your desktop**, which
has your repo, your keys, your `.env`, and network access to Coston2. This chat's
sandbox cannot run any of it — that's the whole reason the work moves to Claude Code.

---

## Scope & guardrails

- **Coston2 testnet only.** Base/mainnet stays OFF — six go-live gates unchanged
  (provisional patent **filed** — currently a draft, not filed · securities opinion ·
  money-transmission/KYC scoping · verified addresses + professional audit · secure
  owner key/multisig · real price-feed adapter verified). Do not wire any mainnet path.
- **No real money.** All value is worthless C2FLR on Coston2.
- **The gated preview page ships noindex + no nav link + URL-only.** It has **no access
  gate yet** — noindex is not access control. Do not share the URL until Cloudflare
  Access (or your chosen gate) is attached.

## Division of labor

**Claude Code does:** unzip the kit, install, test, deploy to Coston2 (mock adapter +
contract → seed → smoke → optional real adapter + refresh), capture addresses, wire the
preview page's `CONTRACT`, build `apps/web`, commit, push.

**You supply (never committed, never shared with the assistant):**
1. A **faucet-funded Coston2 key** (C2FLR for gas) → `DEPLOYER_KEY` in `.env` only.
2. A **second faucet-funded key** → `SMOKE_KEY` (needed because one account can't
   request access to its own token — the "owner cannot request own asset" guard).
3. **Cloudflare API token** (Pages + Access) for the gating step, later.

Faucet: https://faucet.flare.network/coston2

---

## Step 0 — Locate the kit

Unzip `dnai-consent-merged-kit.zip` into a working dir **outside `apps/web`** (it's a
standalone Hardhat project; keep it out of the web app's build path). Confirm files:
`contracts/DNaIConsent.sol`, `contracts/FtsoV2Adapter.sol`, `contracts/IFtsoAdapter.sol`,
`scripts/deploy_consent_full.js`, `scripts/refresh_price.js`, `test/DNaIConsent.test.js`.

## Step 1 — Install & test

```bash
cd <kit-dir>
npm install
npx hardhat test test/DNaIConsent.test.js     # expect 24/24 passing
```
Do not proceed if tests fail.

## Step 2 — Configure `.env`

```bash
cp .env.example .env
```
Set (see `.env.example` for the full list):
```
RPC_URL=https://coston2-api.flare.network/ext/C/rpc
DEPLOYER_KEY=<faucet-funded Coston2 key>     # NEVER commit; .env is gitignored
SMOKE_KEY=<second faucet-funded key>         # for the request/grant/withdraw smoke
PLATFORM_ROYALTY_BPS=1000                     # 10%
USE_REAL_FTSO=1                               # also deploy + wire the real price-feed adapter
```

## Step 3 — Deploy + smoke (Coston2)

```bash
npx hardhat run scripts/deploy_consent_full.js --network coston2
```
This runs, in order: deploy MockFtsoAdapter (FLR/USD=0.02) + DNaIConsent → seed a
SYNTHETIC demo token #1 → **mock smoke** (requestAccess → grantAccess → withdraw, with
split + state assertions) → **real adapter** (deploy FtsoV2Adapter, `refresh()` a live
price, `setFtsoAdapter` to switch onto it, print live `requiredFlrWei`).

Capture from the output (also written to `deployment.consent.json`):
- `consent` — the DNaIConsent address ← **this is the one the UI needs**
- `mockFtsoAdapter`, `realFtsoAdapter`, `activeAdapter`
- `livePrice` (if the real adapter ran)

Expected: "✅ MOCK SMOKE PASSED", then a live FLR/USD price printed.

## Step 4 — Wire the preview page

Set the address in the gated page (either the standalone `dnai-preview.html` or the
`apps/web/app/dnai/preview/` version — see `README_PREVIEW.md`):
```js
const CONTRACT = "<consent address from Step 3>";
```
Leave TOKEN_ID = 1 (the seeded demo asset).

## Step 5 — Confirm the gate + noindex on /dnai/preview

- Verify the route carries **noindex** (`robots: { index:false, follow:false }`).
- **No link** to it from public `/dnai` or nav.
- Attach a **Cloudflare Access** policy on `/dnai/preview*` (allowlist emails) before
  sharing the URL. This is the pre-filing-safe gate; a public sign-up system is a
  separate post-filing build. _(This is the one likely dashboard/API touch.)_

## Step 6 — Build, commit, deploy (web)

```bash
cd apps/web
npm run build            # confirm /dnai/preview exports in out/ and is noindex
# grep guard: outcome-only surface — no mechanism terms in the RENDERED page
grep -RiE "\b(FDC|FTSO|Web2Json|settlement|oracle|attestation)\b" out/dnai/preview/ || echo "clean"
git add -A
git commit -m "feat(dnai-preview): gated founding-preview + live Coston2 consent demo (noindex)"
git push origin main     # Cloudflare Pages auto-deploys
```
Note: the ABI embedded in the demo contains identifiers like `setFtsoAdapter` — those
live in a `<script>` ABI constant, not rendered marketing copy. If the grep flags them
and you want a zero-hit result, load the ABI from an external `.json` asset instead of
inlining it, so the rendered page source stays clean.

## Step 7 — End-to-end verify (live, Coston2)

- Open `/dnai/preview` (through Access), connect an injected wallet on **Coston2** (114).
- Token #1 shows **Idle**, provenance SYNTHETIC, a live access price.
- From a **second** wallet: **Request access & pay** → tx confirms → state **Requested**,
  ledger gains a row.
- Back on the owner wallet: **Grant** → **Granted**, ledger flips to granted, balances update.
- **Withdraw** shows the 90/10 split. **Revoke** → **Revoked**.
- If price shows "needs price refresh": `npx hardhat run scripts/refresh_price.js --network coston2`.

## Acceptance criteria

- [ ] 24/24 tests pass locally.
- [ ] `deploy_consent_full.js` prints "MOCK SMOKE PASSED" and a live price on Coston2.
- [ ] `deployment.consent.json` written with `consent` + adapter addresses.
- [ ] `CONTRACT` wired into the preview page; TOKEN_ID=1.
- [ ] `/dnai/preview` builds, exports, is **noindex**, and is **not linked** from public surfaces.
- [ ] Cloudflare Access applied to `/dnai/preview*` before the URL is shared.
- [ ] Live request→grant→withdraw on Coston2 produces explorer txs; second request from
      the owner address is rejected.
- [ ] No mainnet/Base path wired.

## Secrets & safety

- `DEPLOYER_KEY` / `SMOKE_KEY` are **testnet-only, faucet-funded** — worthless C2FLR.
  Never a key controlling real value. `.env` is gitignored; keys are never committed and
  never shared with any assistant.
- Testnet contract owner can be the deployer; the secure key/multisig owner is a mainnet
  gate, not needed for Coston2.

## Mainnet firewall (do NOT cross in this run)

Base/mainnet waits on all six gates above — the provisional is currently a **draft, not
filed**, so mainnet is firmly off regardless of technical readiness. `USE_REAL_FTSO=1`
only wires the real feed on **Coston2**; it does not touch mainnet.
