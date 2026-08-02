const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * DNaIConsent — deploy + smoke for Coston2.
 *
 * Runs on YOUR machine (Flare RPC is not reachable from the cloud sandbox):
 *   cp .env.example .env         # faucet-funded Coston2 key in DEPLOYER_KEY
 *   npx hardhat run scripts/deploy_consent_full.js --network coston2
 *
 * Flow:
 *   1. Deploy MockFtsoAdapter (FLR/USD = 0.02) + DNaIConsent wired to it.
 *   2. Seed a SYNTHETIC demo asset (token #1, Individual, $10.00).
 *   3. MOCK SMOKE — full loop with a second signer: requestAccess -> grantAccess
 *      -> withdraw. Asserts the 90/10 split and the state transitions. This proves
 *      the whole contract end-to-end without depending on the live oracle.
 *   4. REAL ADAPTER (opt-in, USE_REAL_FTSO=1): deploy FtsoV2Adapter, call refresh()
 *      with the feed fee to pull a LIVE FLR/USD price, print requiredFlrWei, then
 *      setFtsoAdapter() to switch the contract onto the real feed.
 *
 * Env:
 *   DEPLOYER_KEY          faucet-funded Coston2 key (gas)
 *   PLATFORM_ROYALTY_BPS  default 1000 (10%)
 *   USE_REAL_FTSO=1       also deploy + wire the real FtsoV2Adapter (step 4)
 *   SMOKE_KEY             (optional) a SECOND faucet-funded key to play "licensee"
 *                         in step 3. If unset, step 3 is skipped with a note
 *                         (a single account cannot request access to its own token).
 */
async function main() {
  const ROYALTY_BPS = process.env.PLATFORM_ROYALTY_BPS || "1000";
  const useReal = process.env.USE_REAL_FTSO === "1";
  const [deployer] = await ethers.getSigners();
  const bal = await ethers.provider.getBalance(deployer.address);
  console.log("Network:  ", network.name);
  console.log("Deployer: ", deployer.address, "|", ethers.formatEther(bal), "FLR");
  if (bal === 0n) throw new Error("Deployer has 0 FLR — fund via https://faucet.flare.network/coston2");

  // 1) Mock adapter + contract
  const Mock = await ethers.getContractFactory("MockFtsoAdapter");
  const mock = await Mock.deploy(2000, 5); // FLR/USD = 0.02
  await mock.waitForDeployment();
  const mockAddr = await mock.getAddress();
  console.log("\n[1] MockFtsoAdapter:", mockAddr, "(FLR/USD=0.02)");

  const DNaI = await ethers.getContractFactory("DNaIConsent");
  const dnai = await DNaI.deploy(ROYALTY_BPS, mockAddr);
  await dnai.waitForDeployment();
  const addr = await dnai.getAddress();
  console.log("    DNaIConsent:   ", addr, "| royalty bps:", ROYALTY_BPS);

  // 2) Seed SYNTHETIC demo asset
  const demoHash = ethers.keccak256(ethers.toUtf8Bytes("demo-genome-" + Date.now()));
  await (await dnai.registerAsset(
    deployer.address, demoHash, ethers.ZeroHash,
    "SYNTHETIC", "ipfs://demo-consent-safe", 1000, 0, ethers.ZeroAddress
  )).wait();
  const req = await dnai.requiredFlrWei(1);
  console.log("[2] Demo token #1 (SYNTHETIC, Individual, $10.00). requiredFlrWei =", ethers.formatEther(req), "FLR");

  // 3) Mock smoke — needs a second account as the licensee
  const smokeKey = process.env.SMOKE_KEY;
  if (!smokeKey) {
    console.log("[3] MOCK SMOKE skipped — set SMOKE_KEY to a 2nd faucet-funded key to run the full request/grant/withdraw loop.");
  } else {
    const licensee = new ethers.Wallet(smokeKey, ethers.provider);
    const lbal = await ethers.provider.getBalance(licensee.address);
    console.log("[3] MOCK SMOKE — licensee:", licensee.address, "|", ethers.formatEther(lbal), "FLR");
    if (lbal < req) throw new Error("licensee balance < required FLR; fund SMOKE_KEY at the faucet");

    await (await dnai.connect(licensee).requestAccess(1, "smoke-test query", { value: req })).wait();
    let [, , , , state] = await dnai.getAssetState(1);
    if (Number(state) !== 1) throw new Error("expected Requested(1), got " + state);
    console.log("    requestAccess ok → state Requested; escrowed", ethers.formatEther(await dnai.escrowed(1)), "FLR");

    await (await dnai.grantAccess(1, 0, 0, "0x")).wait();
    [, , , , state] = await dnai.getAssetState(1);
    if (Number(state) !== 2) throw new Error("expected Granted(2), got " + state);
    const platformShare = (req * BigInt(ROYALTY_BPS)) / 10000n;
    const ownerPending = await dnai.pendingWithdrawals(deployer.address);
    console.log("    grantAccess ok → state Granted; owner pending", ethers.formatEther(ownerPending),
                "FLR (expected", ethers.formatEther(req - platformShare) + ")");
    if (ownerPending < (req - platformShare)) throw new Error("owner split mismatch");

    const beforeW = await ethers.provider.getBalance(deployer.address);
    await (await dnai.withdraw()).wait();
    console.log("    withdraw ok → balance moved by ~",
                ethers.formatEther((await ethers.provider.getBalance(deployer.address)) - beforeW), "FLR (minus gas)");
    console.log("    ✅ MOCK SMOKE PASSED");
  }

  // 4) Real FTSOv2 adapter (opt-in)
  let realAddr = null, livePrice = null;
  if (useReal) {
    console.log("\n[4] REAL FTSOv2 ADAPTER");
    const Real = await ethers.getContractFactory("FtsoV2Adapter");
    const real = await Real.deploy();
    await real.waitForDeployment();
    realAddr = await real.getAddress();
    console.log("    FtsoV2Adapter:", realAddr);

    let fee = 0n;
    try { fee = await real.feedFee(); console.log("    feedFee():", ethers.formatEther(fee), "FLR"); }
    catch (e) { console.log("    feedFee() read failed (continuing, will send small buffer):", e.shortMessage || e.message); }

    // refresh() pulls the live feed and caches it; send fee (+ small buffer, refunded)
    const value = fee > 0n ? fee : ethers.parseEther("0.01");
    await (await real.refresh({ value })).wait();
    const [p, d, ts] = await real.getFlrUsdPrice();
    livePrice = { price: p.toString(), decimals: Number(d), timestamp: Number(ts) };
    console.log("    refresh() ok → live FLR/USD:", p.toString(), "decimals", Number(d),
                "ts", new Date(Number(ts) * 1000).toISOString());

    // switch the contract onto the real feed
    await (await dnai.setFtsoAdapter(realAddr)).wait();
    const liveReq = await dnai.requiredFlrWei(1);
    console.log("    setFtsoAdapter ok → live requiredFlrWei(#1):", ethers.formatEther(liveReq), "FLR");
    console.log("    NOTE: real feed is fee-bearing + cached — call refresh() again if the price goes stale before a request.");
  } else {
    console.log("\n[4] REAL FTSOv2 ADAPTER skipped — re-run with USE_REAL_FTSO=1 to deploy it, pull a live price, and switch over.");
  }

  const out = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    consent: addr,
    mockFtsoAdapter: mockAddr,
    realFtsoAdapter: realAddr,
    activeAdapter: realAddr || mockAddr,
    livePrice,
    platformRoyaltyBps: Number(ROYALTY_BPS),
    demoTokenId: 1,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(__dirname, "..", "deployment.consent.json"), JSON.stringify(out, null, 2));
  console.log("\nWrote deployment.consent.json");
  console.log("Frontend: put", (realAddr || mockAddr) === addr ? "" : "the DNaIConsent address", addr, "into the UI (sidebar / CONTRACT).");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
