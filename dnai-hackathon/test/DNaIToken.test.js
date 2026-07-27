const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DNaIToken", function () {
  let dnai, platform, owner, licensee, other;
  const PRICE = ethers.parseEther("1"); // 1 FLR
  const ROYALTY_BPS = 1000n; // 10% to platform
  const HASH = ethers.keccak256(ethers.toUtf8Bytes("genomic-asset-1"));
  const URI = "ipfs://Qm-consent-safe-metadata";

  beforeEach(async function () {
    [platform, owner, licensee, other] = await ethers.getSigners();
    const DNaI = await ethers.getContractFactory("DNaIToken", platform);
    dnai = await DNaI.deploy(ROYALTY_BPS);
    await dnai.waitForDeployment();
  });

  async function registerOne() {
    await dnai.connect(platform).registerAsset(owner.address, HASH, "REAL", URI, PRICE);
    return 1n; // first token id
  }

  describe("deployment", function () {
    it("sets name, symbol, platform royalty", async function () {
      expect(await dnai.name()).to.equal("DNaI Sovereign Genomic Asset");
      expect(await dnai.symbol()).to.equal("DNAI");
      expect(await dnai.platformRoyaltyBps()).to.equal(ROYALTY_BPS);
    });
    it("rejects royalty over 100%", async function () {
      const DNaI = await ethers.getContractFactory("DNaIToken", platform);
      await expect(DNaI.deploy(10001)).to.be.revertedWith("royalty > 100%");
    });
  });

  describe("registration", function () {
    it("mints a token to the data owner and stores asset info", async function () {
      const id = await registerOne();
      expect(await dnai.ownerOf(id)).to.equal(owner.address);
      expect(await dnai.tokenURI(id)).to.equal(URI);
      const [contentHash, provenance, price, state] = await dnai.getAssetState(id);
      expect(contentHash).to.equal(HASH);
      expect(provenance).to.equal("REAL");
      expect(price).to.equal(PRICE);
      expect(state).to.equal(0); // Idle
    });
    it("emits AssetRegistered", async function () {
      await expect(dnai.connect(platform).registerAsset(owner.address, HASH, "SYNTHETIC", URI, PRICE))
        .to.emit(dnai, "AssetRegistered")
        .withArgs(1, owner.address, HASH, "SYNTHETIC", PRICE);
    });
    it("rejects zero owner and empty hash", async function () {
      await expect(dnai.registerAsset(ethers.ZeroAddress, HASH, "REAL", URI, PRICE)).to.be.revertedWith("zero owner");
      await expect(dnai.registerAsset(owner.address, ethers.ZeroHash, "REAL", URI, PRICE)).to.be.revertedWith("empty hash");
    });
    it("increments token ids and totalMinted", async function () {
      await registerOne();
      await dnai.registerAsset(owner.address, HASH, "REAL", URI, PRICE);
      expect(await dnai.totalMinted()).to.equal(2);
    });
  });

  describe("access request", function () {
    it("licensee requests with exact payment -> Requested + escrow + log", async function () {
      const id = await registerOne();
      await expect(dnai.connect(licensee).requestAccess(id, { value: PRICE }))
        .to.emit(dnai, "AccessRequested")
        .withArgs(id, licensee.address, PRICE, 0);
      const [, , , state, requester] = await dnai.getAssetState(id);
      expect(state).to.equal(1); // Requested
      expect(requester).to.equal(licensee.address);
      expect(await dnai.escrowed(id)).to.equal(PRICE);
      expect(await dnai.accessLogLength()).to.equal(1);
    });
    it("rejects wrong payment amount", async function () {
      const id = await registerOne();
      await expect(dnai.connect(licensee).requestAccess(id, { value: PRICE - 1n })).to.be.revertedWith("wrong payment amount");
      await expect(dnai.connect(licensee).requestAccess(id, { value: PRICE + 1n })).to.be.revertedWith("wrong payment amount");
    });
    it("blocks the token owner from requesting their own asset", async function () {
      const id = await registerOne();
      await expect(dnai.connect(owner).requestAccess(id, { value: PRICE })).to.be.revertedWith("owner cannot request own asset");
    });
    it("blocks a second request while one is pending", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await expect(dnai.connect(other).requestAccess(id, { value: PRICE })).to.be.revertedWith("request pending or granted");
    });
    it("reverts on nonexistent token", async function () {
      await expect(dnai.connect(licensee).requestAccess(99, { value: PRICE })).to.be.revertedWith("token does not exist");
    });
  });

  describe("grant / deny / revoke", function () {
    it("grant splits payment owner/platform and logs granted=true", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });

      const expectedPlatform = (PRICE * ROYALTY_BPS) / 10000n;
      const expectedOwner = PRICE - expectedPlatform;

      await expect(dnai.connect(owner).grantAccess(id))
        .to.emit(dnai, "AccessGranted")
        .withArgs(id, licensee.address, PRICE, expectedOwner, expectedPlatform, 0);

      expect(await dnai.pendingWithdrawals(owner.address)).to.equal(expectedOwner);
      expect(await dnai.pendingWithdrawals(platform.address)).to.equal(expectedPlatform);

      const [, , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(2); // Granted

      const hist = await dnai.tokenHistory(id);
      expect(hist[0].granted).to.equal(true);
    });

    it("only token owner can grant", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await expect(dnai.connect(other).grantAccess(id)).to.be.revertedWith("not token owner");
    });

    it("deny refunds the licensee in full and resets to Idle", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await expect(dnai.connect(owner).denyAccess(id))
        .to.emit(dnai, "AccessDenied")
        .withArgs(id, licensee.address, PRICE);
      expect(await dnai.pendingWithdrawals(licensee.address)).to.equal(PRICE);
      const [, , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(0); // Idle
    });

    it("revoke moves Granted -> Revoked", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await dnai.connect(owner).grantAccess(id);
      await expect(dnai.connect(owner).revokeAccess(id))
        .to.emit(dnai, "ConsentRevoked")
        .withArgs(id, licensee.address);
      const [, , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(3); // Revoked
    });

    it("cannot grant when nothing pending", async function () {
      const id = await registerOne();
      await expect(dnai.connect(owner).grantAccess(id)).to.be.revertedWith("no pending request");
    });

    it("a new request is allowed after revoke", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await dnai.connect(owner).grantAccess(id);
      await dnai.connect(owner).revokeAccess(id);
      await expect(dnai.connect(other).requestAccess(id, { value: PRICE })).to.emit(dnai, "AccessRequested");
    });
  });

  describe("withdrawals", function () {
    it("owner and platform can withdraw their shares; balances go to zero", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await dnai.connect(owner).grantAccess(id);

      const before = await ethers.provider.getBalance(owner.address);
      const tx = await dnai.connect(owner).withdraw();
      const rc = await tx.wait();
      const gas = rc.gasUsed * rc.gasPrice;
      const after = await ethers.provider.getBalance(owner.address);

      const expectedOwner = PRICE - (PRICE * ROYALTY_BPS) / 10000n;
      expect(after + gas - before).to.equal(expectedOwner);
      expect(await dnai.pendingWithdrawals(owner.address)).to.equal(0);
    });

    it("withdraw with nothing pending reverts", async function () {
      await expect(dnai.connect(other).withdraw()).to.be.revertedWith("nothing to withdraw");
    });
  });

  describe("access ledger", function () {
    it("records every request in per-token history with price + timestamp", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await dnai.connect(owner).denyAccess(id);
      await dnai.connect(other).requestAccess(id, { value: PRICE });

      const hist = await dnai.tokenHistory(id);
      expect(hist.length).to.equal(2);
      expect(hist[0].licensee).to.equal(licensee.address);
      expect(hist[0].granted).to.equal(false);
      expect(hist[1].licensee).to.equal(other.address);
      expect(hist[0].pricePaidWei).to.equal(PRICE);
      expect(hist[0].timestamp).to.be.greaterThan(0);
    });
  });

  describe("price updates", function () {
    it("owner updates price when idle", async function () {
      const id = await registerOne();
      const newP = ethers.parseEther("2");
      await expect(dnai.connect(owner).setAccessPrice(id, newP)).to.emit(dnai, "PriceUpdated").withArgs(id, newP);
      const [, , price] = await dnai.getAssetState(id);
      expect(price).to.equal(newP);
    });
    it("cannot change price mid-request", async function () {
      const id = await registerOne();
      await dnai.connect(licensee).requestAccess(id, { value: PRICE });
      await expect(dnai.connect(owner).setAccessPrice(id, PRICE)).to.be.revertedWith("request pending");
    });
  });
});
