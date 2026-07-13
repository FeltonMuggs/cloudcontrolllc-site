#!/usr/bin/env node
/** Agent pays for a DNaI access on XRPL testnet, with the access ref in a Memo.
 * .env: SEED, DEST, CURRENCY(XRP|RLUSD), VALUE, RLUSD_ISSUER (if RLUSD),
 *       ACCESS_REF (or ACCESS_JSON to hash), SOURCE_TAG (optional)
 */
require('dotenv').config();
const xrpl = require('xrpl');
const L = require('../lib/dnai-xrpl');
const TESTNET = process.env.XRPL_WSS || 'wss://s.altnet.rippletest.net:51233';
async function main() {
  const seed = process.env.SEED; if (!seed) throw new Error('Set SEED in .env (from create-wallet).');
  const dest = process.env.DEST; if (!dest) throw new Error('Set DEST (resource/seller address) in .env.');
  const currency = (process.env.CURRENCY || 'XRP').toUpperCase();
  const value = process.env.VALUE || '10';
  const accessRef = process.env.ACCESS_REF || L.accessHash(process.env.ACCESS_JSON || JSON.stringify({ resource: dest, t: 'demo' }));

  const wallet = xrpl.Wallet.fromSeed(seed);
  const tx = L.buildPaymentTx({
    account: wallet.classicAddress, destination: dest, currency, value,
    issuer: process.env.RLUSD_ISSUER, accessRef,
    sourceTag: process.env.SOURCE_TAG,
  });
  const client = new xrpl.Client(TESTNET);
  await client.connect();
  console.log(`→ paying ${value} ${currency} to ${dest} for access ${accessRef.slice(0,14)}…`);
  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const res = await client.submitAndWait(signed.tx_blob);
  const ok = res.result.meta.TransactionResult === 'tesSUCCESS';
  console.log(ok ? '\n✅ Payment validated' : '\n❌ ' + res.result.meta.TransactionResult);
  console.log('   tx hash :', res.result.hash);
  console.log('   explorer:', 'https://testnet.xrpl.org/transactions/' + res.result.hash);
  console.log('   accessRef:', accessRef);
  console.log('\nGive the resource server the tx hash + accessRef; it verifies with scripts/verify-access.js');
  await client.disconnect();
  process.exit(ok ? 0 : 1);
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
