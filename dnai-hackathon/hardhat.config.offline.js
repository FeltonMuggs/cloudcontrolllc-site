// Offline Hardhat config for sandboxes that can't reach binaries.soliditylang.org
// (e.g. Cowork / Claude Code cloud). Uses the npm `solc` soljson compiler instead
// of the downloaded native binary: npm i --no-save solc@0.8.25, then
//   npx hardhat --config hardhat.config.offline.js test test/DNaIConsent.test.js
const path = require("path");
const { subtask } = require("hardhat/config");
const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");

const base = require("./hardhat.config.js");

const SOLC_VERSION = "0.8.25";
const soljsonPath = path.dirname(require.resolve("solc/package.json")) + "/soljson.js";

subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args, hre, runSuper) => {
  if (args.solcVersion === SOLC_VERSION) {
    return {
      compilerPath: soljsonPath,
      isSolcJs: true,
      version: SOLC_VERSION,
      longVersion: SOLC_VERSION,
    };
  }
  return runSuper(args);
});

module.exports = {
  ...base,
  // single solcjs compiler; all contracts are ^0.8.24 so 0.8.25 satisfies them.
  // cancun (not paris): the npm-resolved OpenZeppelin uses mcopy in Bytes.sol;
  // in-process Hardhat Network supports cancun. The base config keeps paris for Coston2.
  solidity: {
    compilers: [
      { version: SOLC_VERSION, settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: "cancun" } },
    ],
  },
};
