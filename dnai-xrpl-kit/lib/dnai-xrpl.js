/**
 * dnai-xrpl.js — DNaI agentic-payment helpers for the XRP Ledger.
 *
 * The XRPL side is the PAYMENT RAIL: an AI agent pays for a DNaI data access or
 * inference call in XRP or RLUSD, carrying a DNaI access reference (a hash) in an
 * on-chain Memo for audit + cross-chain attestation back to the Flare logic layer.
 *
 * These functions are PURE (no network) so they unit-test offline. The network
 * scripts in ../scripts use them.
 */
const crypto = require('crypto');
const xrpl = require('xrpl');

const MEMO_TYPE = 'DNaI-access'; // identifies our memos

// ---- hashing / access reference ----
// Canonical SHA-256 of an access-request object → hex (the "access reference").
// This can equal a dataset contentHash from the EVM side, or a fresh request id.
function accessHash(obj) {
  const canonical = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return '0x' + crypto.createHash('sha256').update(canonical).digest('hex');
}

// ---- memo encoding ----
function toHex(s) { return Buffer.from(s, 'utf8').toString('hex').toUpperCase(); }
function fromHex(h) { return Buffer.from(h, 'hex').toString('utf8'); }

// Build an XRPL Memo carrying the DNaI access reference.
function buildAccessMemo(accessRef) {
  if (!accessRef) throw new Error('accessRef required');
  return { Memo: { MemoType: toHex(MEMO_TYPE), MemoData: toHex(String(accessRef)), MemoFormat: toHex('text/plain') } };
}
// Extract the DNaI access reference from a tx's Memos (or null).
function readAccessMemo(memos) {
  if (!Array.isArray(memos)) return null;
  for (const m of memos) {
    const mm = m.Memo || m;
    if (mm && mm.MemoType && fromHex(mm.MemoType) === MEMO_TYPE) return fromHex(mm.MemoData);
  }
  return null;
}

// ---- currency codes ----
// XRPL: <=3-char ISO stays as-is; longer codes (e.g. "RLUSD") become 40-char hex.
function currencyCode(code) {
  if (!code || code === 'XRP') return 'XRP';
  if (code.length <= 3) return code;
  const hex = Buffer.from(code, 'ascii').toString('hex').toUpperCase();
  return hex.padEnd(40, '0');
}

// ---- amount builders ----
// XRP amount in drops (string). value is XRP (e.g. "10").
function xrpAmount(value) { return xrpl.xrpToDrops(String(value)); }
// Issued-currency amount (e.g. RLUSD). Requires issuer + a trustline on the payer.
function issuedAmount(value, code, issuer) {
  if (!issuer) throw new Error('issuer required for ' + code);
  return { currency: currencyCode(code), issuer, value: String(value) };
}

// ---- payment transaction (unsigned object) ----
/**
 * Build a Payment tx paying for a DNaI access.
 * opts: { account, destination, currency: 'XRP'|'RLUSD'|..., value, issuer?, accessRef, sourceTag? }
 */
function buildPaymentTx(opts) {
  const { account, destination, currency = 'XRP', value, issuer, accessRef, sourceTag } = opts;
  if (!account || !destination || value == null || !accessRef) throw new Error('account, destination, value, accessRef required');
  const Amount = (currency === 'XRP') ? xrpAmount(value) : issuedAmount(value, currency, issuer);
  const tx = {
    TransactionType: 'Payment',
    Account: account,
    Destination: destination,
    Amount,
    Memos: [buildAccessMemo(accessRef)],
  };
  if (sourceTag != null) tx.SourceTag = Number(sourceTag);
  return tx;
}

// ---- X402-style challenge (resource server → agent) ----
/**
 * A resource server returns this (HTTP 402 body) telling an agent how to pay.
 */
function buildPaymentRequired({ resource, destination, currency = 'XRP', value, issuer, accessRef, network = 'xrpl-testnet' }) {
  if (!resource || !destination || value == null || !accessRef) throw new Error('resource, destination, value, accessRef required');
  return {
    x402Version: 1,
    accepts: [{
      scheme: 'xrpl-payment',
      network,
      resource,
      payTo: destination,
      asset: currency === 'XRP' ? { code: 'XRP' } : { code: currency, issuer },
      amount: String(value),
      accessRef,
      memo: MEMO_TYPE,
    }],
  };
}
function parsePaymentRequired(body) {
  const a = body && body.accepts && body.accepts[0];
  if (!a) throw new Error('no payment requirement');
  return a;
}

// ---- verification (resource server checks the agent's payment) ----
/**
 * Given a *validated* tx (as returned by xrpl `tx` / `account_tx`), decide whether
 * it satisfies a payment requirement. Pure — pass the tx object in.
 * required: { destination, currency, value, issuer?, accessRef }
 * Returns { granted: bool, reasons: string[] }
 */
function verifyPayment(txJson, required) {
  const reasons = [];
  const t = txJson.tx_json || txJson.tx || txJson; // tolerate shapes
  const meta = txJson.meta || txJson.metaData || {};
  const engineOk = (txJson.validated === true) || (meta && meta.TransactionResult === 'tesSUCCESS');
  if (!engineOk) reasons.push('tx not validated / not tesSUCCESS');
  if (t.TransactionType !== 'Payment') reasons.push('not a Payment');
  if (t.Destination !== required.destination) reasons.push('wrong destination');

  // delivered amount (prefer meta.delivered_amount for partial-payment safety)
  const delivered = meta.delivered_amount != null ? meta.delivered_amount : t.Amount;
  if (required.currency === 'XRP' || required.currency == null) {
    const gotDrops = typeof delivered === 'string' ? BigInt(delivered) : 0n;
    const needDrops = BigInt(xrpl.xrpToDrops(String(required.value)));
    if (gotDrops < needDrops) reasons.push(`underpaid XRP: got ${gotDrops} < need ${needDrops} drops`);
  } else {
    const need = { currency: currencyCode(required.currency), issuer: required.issuer, value: String(required.value) };
    if (typeof delivered !== 'object') reasons.push('expected issued-currency amount');
    else {
      if (delivered.currency !== need.currency) reasons.push('wrong currency');
      if (delivered.issuer !== need.issuer) reasons.push('wrong issuer');
      if (Number(delivered.value) < Number(need.value)) reasons.push(`underpaid: got ${delivered.value} < need ${need.value}`);
    }
  }

  const ref = readAccessMemo(t.Memos);
  if (ref !== String(required.accessRef)) reasons.push('missing/wrong DNaI access memo');

  return { granted: reasons.length === 0, reasons };
}

module.exports = {
  MEMO_TYPE, accessHash, toHex, fromHex, currencyCode, xrpAmount, issuedAmount,
  buildAccessMemo, readAccessMemo, buildPaymentTx,
  buildPaymentRequired, parsePaymentRequired, verifyPayment,
};
