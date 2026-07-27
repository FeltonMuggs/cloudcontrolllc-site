require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-network-helpers");
require("dotenv").config();

const DEPLOYER_KEY = process.env.DEPLOYER_KEY || "";

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.25", settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: "paris" } },
      { version: "0.8.24", settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: "paris" } },
    ],
  },
  networks: {
    coston2: {
      url: process.env.RPC_URL || "https://coston2-api.flare.network/ext/C/rpc",
      chainId: 114,
      accounts: DEPLOYER_KEY ? [DEPLOYER_KEY] : [],
    },
  },
};
