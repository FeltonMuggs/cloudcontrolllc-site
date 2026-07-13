#!/usr/bin/env node
/** Resource server verifies an agent's XRPL payment (X402-style) before granting access.
 * .env / args: TX_HASH, DEST, CURRENCY, VALUE, RLUSD_ISSUER (if RLUSD), ACCESS_REF
 * Usage: node scripts/verify-access.js <TX_HASH>
 */
require('dotenv').config();
const xrpl = require('xrpl');
const L = require('../lib/dnai-xrpl');
const TESTNET = process.env.XRPL_WSS || 'wss://s.altnet.rippletest.net:51233';
async function main() {
  const hash = process.argv[2] || process.env.TX_HASH; if (!hash) throw new Error('Pass a TX_HASH.');
  const required = {
    destination: process.env.DEST, currency: (process.env.CURRENCY || 'XRP').toUpperCase(),
    value: process.env.VALUE || '10', issuer: process.env.RLUSD_ISSUER, accessRef: process.env.ACCESS_REF,
  };
  if (!required.destination || !required.accessRef) throw new Error('Set DEST and ACCESS_REF (the required payment) in .env.');
  const client = new xrpl.Client(TESTNET);
  await client.connect();
  const tx = await client.request({ command: 'tx', transaction: hash });
  // normalize to the shape verifyPayment expects
  const shaped = { validated: tx.result.validated, tx_json: tx.result.tx_json || tx.result, meta: tx.result.meta };
  const v = L.verifyPayment(shaped, required);
  await client.disconnect();
  if (v.granted) { console.log('✅ ACCESS GRANTED — payment satisfies the requirement.'); process.exit(0); }
  console.log('❌ ACCESS DENIED:'); v.reasons.forEach(r => console.log('   -', r)); process.exit(1);
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
