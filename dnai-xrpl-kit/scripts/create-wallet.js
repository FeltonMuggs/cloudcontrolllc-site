#!/usr/bin/env node
/** Create + faucet-fund an XRPL testnet wallet. Usage: node scripts/create-wallet.js */
const xrpl = require('xrpl');
const TESTNET = process.env.XRPL_WSS || 'wss://s.altnet.rippletest.net:51233';
async function main() {
  const client = new xrpl.Client(TESTNET);
  await client.connect();
  console.log('→ funding a new testnet wallet from the faucet…');
  const { wallet, balance } = await client.fundWallet();
  console.log('\n✅ Testnet wallet ready');
  console.log('   address :', wallet.classicAddress);
  console.log('   seed    :', wallet.seed, ' (TESTNET ONLY — put in .env as SEED, never reuse on mainnet)');
  console.log('   balance :', balance, 'XRP');
  console.log('   explorer:', 'https://testnet.xrpl.org/accounts/' + wallet.classicAddress);
  await client.disconnect();
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
