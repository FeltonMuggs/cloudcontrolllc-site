const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deploys DNaIToken to Coston2 and (optionally) seeds one demo asset so the
 * frontend has something to read immediately. Writes deployment.json for the UI.
 *
 * Run on YOUR machine (Flare RPC is not reachable from the cloud sandbox):
 *   RPC_URL=... DEPLOYER_KEY=<faucet-funded coston2 key> npm run deploy
 */
async function main() {
  const PLATFORM_ROYALTY_BPS = process.env.PLATFORM_ROYALTY_BPS || "1000"; // 10%
  const [deployer] = await ethers.getSigners();
  console.log("Network:      ", network.name);
  console.log("Deployer:     ", deployer.address);
  console.log("Balance:      ", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "FLR");

  const DNaI = await ethers.getContractFactory("DNaIToken");
  const dnai = await DNaI.deploy(PLATFORM_ROYALTY_BPS);
  await dnai.waitForDeployment();
  const address = await dnai.getAddress();
  console.log("DNaIToken:    ", address);
  console.log("Royalty bps:  ", PLATFORM_ROYALTY_BPS);

  // Seed a demo asset owned by the deployer so the UI reads a live token.
  const demoHash = ethers.keccak256(ethers.toUtf8Bytes("demo-genome-" + Date.now()));
  const demoPrice = ethers.parseEther("1"); // 1 FLR to request access
  const tx = await dnai.registerAsset(
    deployer.address,
    demoHash,
    "SYNTHETIC", // demo asset is synthetic — never seed a demo with real provenance
    "ipfs://demo-consent-safe-metadata",
    demoPrice
  );
  await tx.wait();
  console.log("Demo token #1 registered (provenance=SYNTHETIC, price=1 FLR).");

  const out = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    contract: address,
    platformRoyaltyBps: Number(PLATFORM_ROYALTY_BPS),
    demoTokenId: 1,
    deployedAt: new Date().toISOString(),
  };
  const outPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("Wrote", outPath);
  console.log("\nNext: copy contract address into frontend/app.js CONTRACT and open frontend/index.html");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
