# cloudcontrolllc-site

Next.js (App Router) marketing site for Cloud Control LLC, plus the DNaI
project: landing page at `app/dnai/`, planning docs in `docs/`, and the
XRPL payment-rail kit in `dnai-xrpl-kit/`.

## Project layout

- `app/` — Next.js pages (home at `app/page.js`, DNaI at `app/dnai/page.js`)
- `docs/` — DNaI playbook, revenue model, and Phase I specifications
- `dnai-xrpl-kit/` — standalone Node package: DNaI pay-for-access on the
  XRP Ledger (own `package.json`; run its commands from that directory)

## Testing

Always run the full offline test suite before committing integrated
third-party kits, and only commit/push after all tests pass.

- XRPL kit: `cd dnai-xrpl-kit && npm test` (14 offline tests — must be 14/14)
- Site: `npm run build` from the repo root to verify the Next.js build

## Version Control

When integrating provided kits or archives: unzip into the repo, install
dependencies, verify with tests, then commit and push in one flow. Never
push code whose tests are failing.

- Develop on the designated feature branch; never push directly to `main`
- Use the GitHub MCP tools for PR operations
- Do not create a pull request unless explicitly asked

## Project constraints

- Do not offer or reference a bug bounty program anywhere in DNaI docs
- XRPL work is testnet-only until go-live gating clears; never commit
  seeds or `.env` files (the kit's `.gitignore` covers this — keep it)
