# DNaIConsent — merged contract (FTSO pricing + co-custody + tested base)

The Task-#3 merge: the good ideas from the `DNaIVault.sol` draft (FTSO dynamic
pricing, dual-parent co-custody) ported onto the tested base, with the draft's
bugs fixed. Implements the on-chain slice of the provisional: consent token +
decentralized price feed + automatic royalty split + real-time revocation +
audit ledger (provisional FIG. 3 state machine).

## Files
- `contracts/DNaIConsent.sol` — soulbound consent token, FTSO-priced access, EIP-712 co-custody, pull-payments, ledger.
- `contracts/IFtsoAdapter.sol` — the ONE oracle seam + a `MockFtsoAdapter` for tests/demo.
- `test/DNaIConsent.test.js` — 24 tests (all passing).
- `scripts/deploy_consent.js` — deploys mock adapter + contract, seeds a SYNTHETIC demo asset.

## What was fixed vs the DNaIVault draft
| Draft bug | Fix here |
|---|---|
| Fabricated FTSO interface hard-coded | Isolated behind `IFtsoAdapter`; real wiring is one adapter file |
| No price-staleness check | `maxPriceStaleness` enforced on every read |
| Raw-hash signature, no EIP-191 prefix → unverifiable | EIP-712 typed data via OZ (`_hashTypedDataV4`) |
| No nonce/expiry → signatures replayable forever | Per-token nonce (consumed on grant) + explicit expiry |
| `.transfer()` payouts break to a multisig owner | Pull-payment withdrawals (`.call`, reentrancy-guarded) |
| Individual mode auto-granted on payment | Owner must explicitly grant each request |
| Not a real/complete ERC-721 | Real OZ ERC721, made soulbound via `_update` |

## Run tests (no network needed)
```bash
npm install
npx hardhat test test/DNaIConsent.test.js   # 24/24
```

## Deploy to Coston2 (on YOUR machine — Flare RPC unreachable from the sandbox)
```bash
cp .env.example .env    # faucet-funded Coston2 key
npx hardhat run scripts/deploy_consent.js --network coston2
```

## The one open seam: real FTSOv2
`IFtsoAdapter` is deliberately the only place the oracle is touched. The demo/test
`MockFtsoAdapter` returns a fixed FLR/USD price. For real pricing, implement
`FtsoV2Adapter` (same interface) against Flare's live FTSOv2 — obtain the FtsoV2
instance via Flare's ContractRegistry and call the current feed method with the
bytes21-encoded FLR/USD feed id. **Enable web search and I'll pin the exact
current interface and write that adapter; nothing else in the contract changes.**

## Mainnet firewall (unchanged)
Testnet only. Mainnet gated on: provisional filed · securities opinion · MTL/KYC
scoping · professional audit · secure multisig owner · real FTSOv2 adapter verified.


## FTSOv2 adapter — VERIFIED against the real package
The oracle seam is now finalized: `contracts/FtsoV2Adapter.sol` compiles against
`@flarenetwork/flare-periphery-contracts` v0.1.52 (coston2). Key correction found by
checking the real package: `getFeedById` is **payable** (fee-bearing), NOT a view — so
the adapter caches via `refresh()` and exposes a `view` getter. FLR/USD feed id:
`0x01464c522f55534400000000000000000000000000`. Registry: `0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019`.
Tests use `MockFtsoAdapter`; deploy can start on the mock and switch to the real adapter via `setFtsoAdapter`.

## Deploy + smoke (scripts/deploy_consent_full.js)
Runs on YOUR machine (Coston2 RPC isn't reachable from the sandbox). Faucet: https://faucet.flare.network/coston2

```bash
cp .env.example .env            # set DEPLOYER_KEY (faucet-funded)
npm install

# 1) mock-only deploy + seed (fastest; proves the contract, no live oracle):
npx hardhat run scripts/deploy_consent_full.js --network coston2

# 2) full mock smoke (adds request/grant/withdraw loop) — needs a 2nd funded key:
SMOKE_KEY=<second_faucet_key> npx hardhat run scripts/deploy_consent_full.js --network coston2

# 3) also wire the REAL FTSOv2 adapter (deploys it, refresh()es a live price, switches over):
USE_REAL_FTSO=1 SMOKE_KEY=<second_faucet_key> npx hardhat run scripts/deploy_consent_full.js --network coston2
```
Writes `deployment.consent.json` (contract + both adapter addresses + the live price if step 3 ran).
Local logic for the mock smoke was validated on an in-process Hardhat chain before shipping;
the Coston2 run is the live confirmation.

### After deploy
- Put the `consent` address into the UI (Live mode sidebar, or the HTML demo's CONTRACT).
- The real feed is fee-bearing + cached: if a price goes stale before a request, call `refresh()`
  on the `FtsoV2Adapter` again (send >= `feedFee()`; excess is refunded).
