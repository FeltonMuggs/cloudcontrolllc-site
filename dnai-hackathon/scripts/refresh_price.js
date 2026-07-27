const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Standalone FTSO re-cache. Calls refresh() on the deployed FtsoV2Adapter so the
 * cached FLR/USD price is fresh before a demo, WITHOUT redeploying anything.
 *
 * The real FTSOv2 feed read is fee-bearing and non-view, so the adapter caches the
 * price and DNaIConsent enforces staleness on that cache. Run this whenever the
 * cached price may have gone stale (default staleness window is 1 hour).
 *
 * Run on YOUR machine:
 *   npx hardhat run scripts/refresh_price.js --network coston2
 *
 * Address resolution (first match wins):
 *   1. env FTSO_ADAPTER=0x...
 *   2. realFtsoAdapter field in deployment.consent.json (written by deploy_consent_full.js)
 */
async function main() {
  const [signer] = await ethers.getSigners();

  let adapterAddr = process.env.FTSO_ADAPTER || "";
  if (!adapterAddr) {
    const p = path.join(__dirname, "..", "deployment.consent.json");
    if (fs.existsSync(p)) {
      const d = JSON.parse(fs.readFileSync(p, "utf8"));
      adapterAddr = d.realFtsoAdapter || "";
    }
  }
  if (!adapterAddr) {
    throw new Error(
      "No adapter address. Set FTSO_ADAPTER=0x... or run deploy_consent_full.js with USE_REAL_FTSO=1 first " +
      "(it writes realFtsoAdapter into deployment.consent.json)."
    );
  }

  console.log("Network:", network.name, "| signer:", signer.address);
  console.log("FtsoV2Adapter:", adapterAddr);

  const adapter = await ethers.getContractAt("FtsoV2Adapter", adapterAddr);

  // price before (if any)
  try {
    const [p0, d0, t0] = await adapter.getFlrUsdPrice();
    console.log("cached before:", p0.toString(), "dec", Number(d0), "ts", new Date(Number(t0) * 1000).toISOString());
  } catch {
    console.log("cached before: (none yet)");
  }

  // fee, then refresh with a small buffer (excess is refunded by the adapter)
  let fee = 0n;
  try { fee = await adapter.feedFee(); } catch (e) { console.log("feedFee() read note:", e.shortMessage || e.message); }
  const value = fee > 0n ? fee : ethers.parseEther("0.01");
  console.log("feedFee:", ethers.formatEther(fee), "FLR — sending", ethers.formatEther(value), "(excess refunded)");

  const tx = await adapter.refresh({ value });
  console.log("refresh tx:", tx.hash);
  await tx.wait();

  const [p, d, t] = await adapter.getFlrUsdPrice();
  console.log("cached after: ", p.toString(), "dec", Number(d), "ts", new Date(Number(t) * 1000).toISOString());
  console.log("✅ price re-cached. FLR/USD ≈", (Number(p) / 10 ** Number(d)).toString(), "USD");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
