const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deploys DNaIConsent to Coston2 with a MOCK FTSO adapter (safe for testnet demo),
 * seeds one SYNTHETIC demo asset, writes deployment.json.
 *
 * Run on YOUR machine (Flare RPC not reachable from the cloud sandbox):
 *   RPC_URL=... DEPLOYER_KEY=<faucet-funded coston2 key> npx hardhat run scripts/deploy_consent.js --network coston2
 *
 * === MAINNET / real pricing: replace MockFtsoAdapter with a real FtsoV2Adapter
 * that implements IFtsoAdapter against Flare's live FTSOv2 (see IFtsoAdapter.sol).
 */
async function main() {
  const ROYALTY_BPS = process.env.PLATFORM_ROYALTY_BPS || "1000"; // 10%
  const [deployer] = await ethers.getSigners();
  console.log("Network: ", network.name, "| Deployer:", deployer.address);
  console.log("Balance: ", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "FLR");

  // Mock feed: FLR/USD = 0.02 (price 2000, decimals 5). Swap for the real adapter later.
  const Mock = await ethers.getContractFactory("MockFtsoAdapter");
  const ftso = await Mock.deploy(2000, 5);
  await ftso.waitForDeployment();
  console.log("MockFtsoAdapter:", await ftso.getAddress(), "(FLR/USD=0.02 — VERIFY: replace with real FTSOv2 adapter)");

  const DNaI = await ethers.getContractFactory("DNaIConsent");
  const dnai = await DNaI.deploy(ROYALTY_BPS, await ftso.getAddress());
  await dnai.waitForDeployment();
  const addr = await dnai.getAddress();
  console.log("DNaIConsent:    ", addr, "| royalty bps:", ROYALTY_BPS);

  // Seed a SYNTHETIC demo asset (never demo with real provenance), Individual mode, $10.00 fee.
  const demoHash = ethers.keccak256(ethers.toUtf8Bytes("demo-genome-" + Date.now()));
  const tx = await dnai.registerAsset(
    deployer.address, demoHash, ethers.ZeroHash,
    "SYNTHETIC", "ipfs://demo-consent-safe", 1000, 0, ethers.ZeroAddress
  );
  await tx.wait();
  console.log("Demo token #1 registered (SYNTHETIC, Individual, $10.00).");

  const out = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    consent: addr,
    ftsoAdapter: await ftso.getAddress(),
    ftsoIsMock: true,
    platformRoyaltyBps: Number(ROYALTY_BPS),
    demoTokenId: 1,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(__dirname, "..", "deployment.consent.json"), JSON.stringify(out, null, 2));
  console.log("Wrote deployment.consent.json");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
