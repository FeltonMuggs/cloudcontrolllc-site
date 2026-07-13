/**
 * Offline tests — validate the pure DNaI-XRPL helpers without any network.
 * (Actual testnet payment/verify run on your machine via the scripts.)
 */
const assert = require('assert');
const xrpl = require('xrpl');
const L = require('../lib/dnai-xrpl');

let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; console.log('  ✓', name); } catch (e) { fail++; console.log('  ✗ FAIL:', name, '—', e.message); } }

console.log('\n=== DNaI-XRPL offline tests ===');

t('wallet generation (offline)', () => {
  const w = xrpl.Wallet.generate();
  assert.ok(w.classicAddress.startsWith('r'), 'address starts with r');
  assert.ok(w.seed && w.seed.length > 0, 'has seed');
});

t('accessHash is deterministic + 0x sha256', () => {
  const a = L.accessHash({ datasetId: 2, buyer: 'agentX', ts: 'fixed' });
  const b = L.accessHash({ datasetId: 2, buyer: 'agentX', ts: 'fixed' });
  assert.strictEqual(a, b);
  assert.match(a, /^0x[0-9a-f]{64}$/);
});

t('memo encode/decode roundtrip carries access ref', () => {
  const ref = L.accessHash('access-req-1');
  const memo = L.buildAccessMemo(ref);
  const decoded = L.readAccessMemo([memo]);
  assert.strictEqual(decoded, ref);
  // memo type identifies DNaI
  assert.strictEqual(L.fromHex(memo.Memo.MemoType), L.MEMO_TYPE);
});

t('currencyCode: XRP passthrough, RLUSD → 40-char hex', () => {
  assert.strictEqual(L.currencyCode('XRP'), 'XRP');
  assert.strictEqual(L.currencyCode('USD'), 'USD');
  const rl = L.currencyCode('RLUSD');
  assert.strictEqual(rl.length, 40, 'RLUSD becomes 40-char hex');
  assert.match(rl, /^[0-9A-F]{40}$/);
  assert.ok(rl.startsWith('524C555344'), 'hex of ASCII RLUSD'); // R L U S D
});

t('buildPaymentTx: XRP payment shape', () => {
  const ref = L.accessHash('x');
  const tx = L.buildPaymentTx({ account: 'rPAYER', destination: 'rSELLER', currency: 'XRP', value: '10', accessRef: ref, sourceTag: 4200 });
  assert.strictEqual(tx.TransactionType, 'Payment');
  assert.strictEqual(tx.Amount, xrpl.xrpToDrops('10')); // 10000000 drops
  assert.strictEqual(tx.SourceTag, 4200);
  assert.strictEqual(L.readAccessMemo(tx.Memos), ref);
});

t('buildPaymentTx: RLUSD issued-amount shape', () => {
  const ref = L.accessHash('y');
  const tx = L.buildPaymentTx({ account: 'rPAYER', destination: 'rSELLER', currency: 'RLUSD', value: '299', issuer: 'rISSUER', accessRef: ref });
  assert.strictEqual(typeof tx.Amount, 'object');
  assert.strictEqual(tx.Amount.value, '299');
  assert.strictEqual(tx.Amount.issuer, 'rISSUER');
  assert.strictEqual(tx.Amount.currency.length, 40);
});

t('buildPaymentTx: RLUSD without issuer throws', () => {
  assert.throws(() => L.buildPaymentTx({ account: 'r1', destination: 'r2', currency: 'RLUSD', value: '1', accessRef: L.accessHash('z') }));
});

t('X402 challenge build/parse roundtrip', () => {
  const ref = L.accessHash('dataset-2-access');
  const body = L.buildPaymentRequired({ resource: '/dnai/data/2', destination: 'rSELLER', currency: 'RLUSD', value: '299', issuer: 'rISSUER', accessRef: ref });
  assert.strictEqual(body.x402Version, 1);
  const a = L.parsePaymentRequired(body);
  assert.strictEqual(a.payTo, 'rSELLER');
  assert.strictEqual(a.amount, '299');
  assert.strictEqual(a.accessRef, ref);
});

// ---- verifyPayment (resource-side X402 check) ----
function validatedTx({ dest = 'rSELLER', amount = xrpl.xrpToDrops('10'), delivered, ref, type = 'Payment', result = 'tesSUCCESS', validated = true } = {}) {
  const memos = ref ? [L.buildAccessMemo(ref)] : [];
  return { validated, tx_json: { TransactionType: type, Destination: dest, Amount: amount, Memos: memos }, meta: { TransactionResult: result, delivered_amount: delivered != null ? delivered : amount } };
}

t('verifyPayment: valid XRP payment grants', () => {
  const ref = L.accessHash('ok');
  const r = L.verifyPayment(validatedTx({ amount: xrpl.xrpToDrops('10'), ref }), { destination: 'rSELLER', currency: 'XRP', value: '10', accessRef: ref });
  assert.strictEqual(r.granted, true, JSON.stringify(r.reasons));
});

t('verifyPayment: underpaid XRP denied', () => {
  const ref = L.accessHash('under');
  const r = L.verifyPayment(validatedTx({ amount: xrpl.xrpToDrops('5'), ref }), { destination: 'rSELLER', currency: 'XRP', value: '10', accessRef: ref });
  assert.strictEqual(r.granted, false);
  assert.ok(r.reasons.some(x => x.includes('underpaid')));
});

t('verifyPayment: wrong destination denied', () => {
  const ref = L.accessHash('dest');
  const r = L.verifyPayment(validatedTx({ dest: 'rATTACKER', ref }), { destination: 'rSELLER', currency: 'XRP', value: '10', accessRef: ref });
  assert.strictEqual(r.granted, false);
  assert.ok(r.reasons.some(x => x.includes('destination')));
});

t('verifyPayment: missing/wrong access memo denied', () => {
  const r = L.verifyPayment(validatedTx({ ref: L.accessHash('other') }), { destination: 'rSELLER', currency: 'XRP', value: '10', accessRef: L.accessHash('expected') });
  assert.strictEqual(r.granted, false);
  assert.ok(r.reasons.some(x => x.includes('memo')));
});

t('verifyPayment: valid RLUSD payment grants', () => {
  const ref = L.accessHash('rlusd');
  const cur = L.currencyCode('RLUSD');
  const tx = { validated: true, tx_json: { TransactionType: 'Payment', Destination: 'rSELLER', Amount: { currency: cur, issuer: 'rISSUER', value: '299' }, Memos: [L.buildAccessMemo(ref)] }, meta: { TransactionResult: 'tesSUCCESS', delivered_amount: { currency: cur, issuer: 'rISSUER', value: '299' } } };
  const r = L.verifyPayment(tx, { destination: 'rSELLER', currency: 'RLUSD', issuer: 'rISSUER', value: '299', accessRef: ref });
  assert.strictEqual(r.granted, true, JSON.stringify(r.reasons));
});

t('verifyPayment: unvalidated tx denied', () => {
  const ref = L.accessHash('novalid');
  const r = L.verifyPayment(validatedTx({ ref, validated: false, result: 'terQUEUED' }), { destination: 'rSELLER', currency: 'XRP', value: '10', accessRef: ref });
  assert.strictEqual(r.granted, false);
});

console.log(`\n================ RESULT: ${pass} passed, ${fail} failed ================`);
process.exit(fail ? 1 : 0);
