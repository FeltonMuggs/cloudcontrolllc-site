const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("DNaIConsent", function () {
  let dnai, ftso, platform, owner, parentB, licensee, other;
  const ROYALTY_BPS = 1000n;              // 10%
  const FEE_CENTS = 1000n;                // $10.00
  const HASH = ethers.keccak256(ethers.toUtf8Bytes("genome-1"));
  const LINEAGE = ethers.keccak256(ethers.toUtf8Bytes("lineage-1"));
  const URI = "ipfs://Qm-consent-safe";
  // FLR/USD = 0.02 with 5 decimals → price=2000, decimals=5. 1 FLR = $0.02.
  const PRICE = 2000n;
  const DEC = 5;
  // $10.00 / $0.02 = 500 FLR
  const EXPECTED_FLR = ethers.parseEther("500");

  const Gov = { Individual: 0, MultiSig: 1 };

  beforeEach(async function () {
    [platform, owner, parentB, licensee, other] = await ethers.getSigners();
    const Mock = await ethers.getContractFactory("MockFtsoAdapter", platform);
    ftso = await Mock.deploy(PRICE, DEC);
    await ftso.waitForDeployment();
    // fresh timestamp so it isn't stale
    await ftso.set(PRICE, DEC, await time.latest());

    const DNaI = await ethers.getContractFactory("DNaIConsent", platform);
    dnai = await DNaI.deploy(ROYALTY_BPS, await ftso.getAddress());
    await dnai.waitForDeployment();
  });

  async function registerIndividual() {
    await dnai.connect(platform).registerAsset(owner.address, HASH, ethers.ZeroHash, "REAL", URI, FEE_CENTS, Gov.Individual, ethers.ZeroAddress);
    return 1n;
  }
  async function registerMultiSig() {
    await dnai.connect(platform).registerAsset(owner.address, HASH, LINEAGE, "SYNTHETIC", URI, FEE_CENTS, Gov.MultiSig, parentB.address);
    return 1n;
  }
  async function freshPrice() { await ftso.set(PRICE, DEC, await time.latest()); }

  describe("deployment & registration", function () {
    it("rejects royalty >100% and zero ftso", async function () {
      const DNaI = await ethers.getContractFactory("DNaIConsent", platform);
      await expect(DNaI.deploy(10001, await ftso.getAddress())).to.be.revertedWith("royalty > 100%");
      await expect(DNaI.deploy(1000, ethers.ZeroAddress)).to.be.revertedWith("zero ftso");
    });
    it("mints soulbound token with provenance + gov", async function () {
      const id = await registerIndividual();
      expect(await dnai.ownerOf(id)).to.equal(owner.address);
      const [ch, prov, fee, gov, state] = await dnai.getAssetState(id);
      expect(ch).to.equal(HASH); expect(prov).to.equal("REAL");
      expect(fee).to.equal(FEE_CENTS); expect(gov).to.equal(Gov.Individual); expect(state).to.equal(0);
    });
    it("MultiSig requires a valid distinct parentB", async function () {
      await expect(dnai.registerAsset(owner.address, HASH, ethers.ZeroHash, "REAL", URI, FEE_CENTS, Gov.MultiSig, ethers.ZeroAddress)).to.be.revertedWith("bad parentB");
      await expect(dnai.registerAsset(owner.address, HASH, ethers.ZeroHash, "REAL", URI, FEE_CENTS, Gov.MultiSig, owner.address)).to.be.revertedWith("bad parentB");
    });
    it("Individual must not set parentB", async function () {
      await expect(dnai.registerAsset(owner.address, HASH, ethers.ZeroHash, "REAL", URI, FEE_CENTS, Gov.Individual, parentB.address)).to.be.revertedWith("parentB set on individual");
    });
  });

  describe("FTSO pricing & staleness", function () {
    it("prices $10 at 0.02 FLR/USD = 500 FLR", async function () {
      const id = await registerIndividual();
      await freshPrice();
      expect(await dnai.requiredFlrWei(id)).to.equal(EXPECTED_FLR);
    });
    it("handles negative decimals", async function () {
      // price=5, decimals=-1 → actual 5 * 10^1 = $50 per FLR. $10/$50 = 0.2 FLR
      const id = await registerIndividual();
      await ftso.set(5, -1, await time.latest());
      expect(await dnai.requiredFlrWei(id)).to.equal(ethers.parseEther("0.2"));
    });
    it("rejects a stale feed", async function () {
      const id = await registerIndividual();
      const old = (await time.latest()) - 4000; // older than 3600 default
      await ftso.set(PRICE, DEC, old);
      await expect(dnai.requiredFlrWei(id)).to.be.revertedWith("stale price");
    });
    it("rejects a zero price", async function () {
      const id = await registerIndividual();
      await ftso.set(0, DEC, await time.latest());
      await expect(dnai.requiredFlrWei(id)).to.be.revertedWith("bad feed price");
    });
  });

  describe("request access (Individual)", function () {
    it("escrows required amount, refunds overpayment via pull", async function () {
      const id = await registerIndividual();
      await freshPrice();
      const over = EXPECTED_FLR + ethers.parseEther("3");
      await expect(dnai.connect(licensee).requestAccess(id, "cancer study", { value: over }))
        .to.emit(dnai, "AccessRequested");
      expect(await dnai.escrowed(id)).to.equal(EXPECTED_FLR);
      expect(await dnai.pendingWithdrawals(licensee.address)).to.equal(ethers.parseEther("3"));
      const [, , , , state, req] = await dnai.getAssetState(id);
      expect(state).to.equal(1); expect(req).to.equal(licensee.address);
    });
    it("reverts on insufficient payment", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await expect(dnai.connect(licensee).requestAccess(id, "x", { value: EXPECTED_FLR - 1n })).to.be.revertedWith("insufficient payment");
    });
    it("owner cannot request own asset", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await expect(dnai.connect(owner).requestAccess(id, "x", { value: EXPECTED_FLR })).to.be.revertedWith("owner cannot request own asset");
    });
    it("blocks a second concurrent request", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "x", { value: EXPECTED_FLR });
      await freshPrice();
      await expect(dnai.connect(other).requestAccess(id, "y", { value: EXPECTED_FLR })).to.be.revertedWith("request pending or active");
    });
  });

  describe("grant / deny (Individual)", function () {
    it("grant splits payment and logs granted", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "study", { value: EXPECTED_FLR });
      const platformShare = (EXPECTED_FLR * ROYALTY_BPS) / 10000n;
      const ownerShare = EXPECTED_FLR - platformShare;
      await expect(dnai.connect(owner).grantAccess(id, 0, 0, "0x"))
        .to.emit(dnai, "AccessGranted");
      expect(await dnai.pendingWithdrawals(owner.address)).to.equal(ownerShare);
      expect(await dnai.pendingWithdrawals(platform.address)).to.equal(platformShare);
      const [, , , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(2);
      const hist = await dnai.tokenHistory(id);
      expect(hist[0].granted).to.equal(true);
    });
    it("only owner can grant", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "s", { value: EXPECTED_FLR });
      await expect(dnai.connect(other).grantAccess(id, 0, 0, "0x")).to.be.revertedWith("not token owner");
    });
    it("deny refunds licensee and returns to Idle", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "s", { value: EXPECTED_FLR });
      await dnai.connect(owner).denyAccess(id);
      expect(await dnai.pendingWithdrawals(licensee.address)).to.equal(EXPECTED_FLR);
      const [, , , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(0);
    });
  });

  describe("co-custody (MultiSig, EIP-712)", function () {
    async function signParentB(id, lic, purpose, expiry, signer = parentB) {
      const purposeHash = ethers.keccak256(ethers.toUtf8Bytes(purpose));
      const domain = {
        name: "DNaIConsent", version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await dnai.getAddress(),
      };
      const types = { ParentBConsent: [
        { name: "tokenId", type: "uint256" },
        { name: "licensee", type: "address" },
        { name: "purposeHash", type: "bytes32" },
        { name: "nonce", type: "uint256" },
        { name: "expiry", type: "uint256" },
      ]};
      const nonce = await dnai.parentBNonce(id);
      const value = { tokenId: id, licensee: lic, purposeHash, nonce, expiry };
      return signer.signTypedData(domain, types, value);
    }

    it("grants with a valid parent B signature", async function () {
      const id = await registerMultiSig();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "rare disease", { value: EXPECTED_FLR });
      const expiry = (await time.latest()) + 3600;
      const sig = await signParentB(id, licensee.address, "rare disease", expiry);
      await expect(dnai.connect(owner).grantAccess(id, 0, expiry, sig)).to.emit(dnai, "AccessGranted");
      const [, , , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(2);
    });
    it("rejects a signature from the wrong signer", async function () {
      const id = await registerMultiSig();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "p", { value: EXPECTED_FLR });
      const expiry = (await time.latest()) + 3600;
      const badSig = await signParentB(id, licensee.address, "p", expiry, other);
      await expect(dnai.connect(owner).grantAccess(id, 0, expiry, badSig)).to.be.revertedWith("bad parentB signature");
    });
    it("rejects a signature over a different purpose", async function () {
      const id = await registerMultiSig();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "purpose-A", { value: EXPECTED_FLR });
      const expiry = (await time.latest()) + 3600;
      const sig = await signParentB(id, licensee.address, "purpose-B", expiry); // signed a different purpose
      await expect(dnai.connect(owner).grantAccess(id, 0, expiry, sig)).to.be.revertedWith("bad parentB signature");
    });
    it("rejects an expired signature", async function () {
      const id = await registerMultiSig();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "p", { value: EXPECTED_FLR });
      const expiry = (await time.latest()) - 1;
      const sig = await signParentB(id, licensee.address, "p", expiry);
      await expect(dnai.connect(owner).grantAccess(id, 0, expiry, sig)).to.be.revertedWith("parentB sig expired");
    });
    it("nonce prevents replay of a used signature", async function () {
      const id = await registerMultiSig();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "p", { value: EXPECTED_FLR });
      const expiry = (await time.latest()) + 3600;
      const sig = await signParentB(id, licensee.address, "p", expiry);
      await dnai.connect(owner).grantAccess(id, 0, expiry, sig);
      await dnai.connect(owner).revokeAccess(id);
      // licensee requests again; the OLD sig must no longer work (nonce advanced)
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "p", { value: EXPECTED_FLR });
      await expect(dnai.connect(owner).grantAccess(id, 0, expiry, sig)).to.be.revertedWith("bad parentB signature");
    });
  });

  describe("revocation & expiry", function () {
    it("revoke moves Granted -> Revoked", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "s", { value: EXPECTED_FLR });
      await dnai.connect(owner).grantAccess(id, 0, 0, "0x");
      await expect(dnai.connect(owner).revokeAccess(id)).to.emit(dnai, "ConsentRevoked");
      const [, , , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(3);
    });
    it("grant with validity window expires", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "s", { value: EXPECTED_FLR });
      await dnai.connect(owner).grantAccess(id, 100, 0, "0x"); // 100s validity
      await expect(dnai.expireGrant(id)).to.be.revertedWith("not expired");
      await time.increase(101);
      await dnai.expireGrant(id);
      const [, , , , state] = await dnai.getAssetState(id);
      expect(state).to.equal(4); // Expired
    });
  });

  describe("withdrawals", function () {
    it("owner withdraws their split; balance zeroes", async function () {
      const id = await registerIndividual();
      await freshPrice();
      await dnai.connect(licensee).requestAccess(id, "s", { value: EXPECTED_FLR });
      await dnai.connect(owner).grantAccess(id, 0, 0, "0x");
      const before = await ethers.provider.getBalance(owner.address);
      const tx = await dnai.connect(owner).withdraw();
      const rc = await tx.wait();
      const after = await ethers.provider.getBalance(owner.address);
      const platformShare = (EXPECTED_FLR * ROYALTY_BPS) / 10000n;
      expect(after + rc.gasUsed * rc.gasPrice - before).to.equal(EXPECTED_FLR - platformShare);
      expect(await dnai.pendingWithdrawals(owner.address)).to.equal(0);
    });
  });

  describe("soulbound", function () {
    it("blocks transfer between users", async function () {
      const id = await registerIndividual();
      await expect(
        dnai.connect(owner).transferFrom(owner.address, other.address, id)
      ).to.be.revertedWith("soulbound: non-transferable");
    });
  });
});
