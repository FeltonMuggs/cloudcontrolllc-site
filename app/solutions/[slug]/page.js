import Link from 'next/link';

/* ----------------------------------------------------------------------------
   Solution detail pages — one route, four statically-generated pages.
   Real-world solutions are drawn from the GBBC "101 Real-World Blockchain
   Use Cases Handbook" (2026 Edition) and mapped to Cloud Control's
   capability pillars.
---------------------------------------------------------------------------- */

const SOLUTIONS = {
  'blockchain-ledgers': {
    idx: '01',
    eyebrow: 'Capability · Blockchain digital ledgers',
    title: 'Blockchain digital ledgers',
    tagline:
      'Immutable project, asset, and compliance records that stand up to audit across the full lifecycle.',
    intro:
      'Cloud Control stands up tamper-evident ledgers that turn fragmented project, asset, and compliance records into a single verifiable source of truth — engineered to survive audit, financing diligence, and the full operating life of an asset.',
    deliver: [
      'A canonical, append-only record for every project, asset, and compliance event.',
      'Programmable compliance — identity, eligibility, and reporting rules — enforced at settlement, not after the fact.',
      'On-chain audit attestations and version history that preserve every correction rather than overwriting it.',
      'Finance-ready outputs that map cleanly to capital, grant, and procurement diligence.',
    ],
    featured: [
      { company: 'Evergon Labs', sector: 'Digital Identity & Infrastructure', name: 'End-to-end tokenized asset lifecycle', desc: 'Manages tokenized assets as fully-governed financial products — issuance, distribution, transfers, yield, corporate actions, and redemptions — with programmable compliance (identity and eligibility checks) embedded directly into settlement.' },
      { company: 'Swift', sector: 'Finance', name: 'The Swift Ledger', desc: 'A shared ledger that orchestrates the full payment lifecycle — funding, authorization, and settlement triggering — for deterministic 24/7 cross-border payments, while preserving existing legal and regulatory settlement frameworks.' },
      { company: 'Bank of Canada', sector: 'Government', name: 'Project Samara', desc: 'A distributed-ledger capital-markets experiment that issued and traded a real CA$100M government bond settled with central bank money, testing the feasibility of DLT-based bond issuance.' },
      { company: 'Cardano Foundation', sector: 'Finance', name: 'Reeve — audit attestations', desc: 'Tamper-evident audit attestations for regulated financial reporting: restatements are anchored as new records preserving full version history, paired with an on-chain audit opinion issued with Grant Thornton.' },
      { company: 'Edge & Node', sector: 'Compliance Infrastructure', name: 'Amp — compliance database', desc: 'A blockchain-native database for enterprise compliance and auditability — sanctions screening, AML workflows, tokenized asset registries, and stablecoin treasury tracking — deployable on-premises for regulated environments.' },
      { company: 'Archax', sector: 'Finance', name: 'GOVY — tokenized T-Bills', desc: 'Tokenized US Treasury bills with custody, settlement, and delivery rights embedded directly in the token, backed 1:1 in regulated custody across Ethereum, Hedera, and Stellar.' },
    ],
  },
  'iot-sensor-ingestion': {
    idx: '02',
    eyebrow: 'Capability · IoT & sensor ingestion',
    title: 'IoT & sensor ingestion',
    tagline:
      'Real-time monitoring of the built and natural environment, anchored to a verifiable source of truth.',
    intro:
      'Cloud Control ingests live IoT and sensor data — from construction sites, utilities, and natural systems — and anchors each reading to an immutable ledger, so operational telemetry becomes evidence you can trust, share, and act on.',
    deliver: [
      'Sensor and IoT readings anchored to an immutable record at the point of capture.',
      'Smart-contract business rules that validate data and trigger payments or alerts automatically.',
      'A shared infrastructure layer for multi-party coordination, emissions data, and credentials.',
      'Transparent, defensible reporting for regulators, buyers, and supply-chain partners.',
    ],
    featured: [
      { company: 'Cintel', sector: 'Agriculture & Energy', name: 'AgroTrack traceability', desc: 'Anchors each critical data point — collected volumes, origin and destination, lab and organoleptic testing — to an immutable record, with smart contracts enforcing business rules and supporting product payments.' },
      { company: 'CattleProof Verified', sector: 'Agriculture & Energy', name: 'Livestock identity infrastructure', desc: 'Next-generation livestock identity delivering faster, more secure payments, real-time shareable data for supply-chain partners, and improved regulatory compliance and auditability.' },
      { company: 'Blockchain for Energy', sector: 'Agriculture & Energy', name: 'Shared energy data platform', desc: 'An infrastructure layer for the energy industry that cuts manual reconciliation and supports operational coordination, standardized emissions data for carbon reporting, and participant identity and credentials.' },
      { company: 'onocoy / UZH Blockchain Center', sector: 'Infrastructure', name: 'High-precision GNSS commons', desc: 'An economically viable shared infrastructure for high-precision GNSS positioning: crowdsourced reference stations earn token rewards scaled by signal quality, availability, and coverage contribution.' },
      { company: 'Virginia Dept. of Environmental Quality', sector: 'Government', name: 'SWaN water-credit marketplace', desc: 'A digital marketplace for environmental mitigation and nutrient-banking credits that brings public transparency, steadier pricing, and more timely, ecologically successful offsets to water management.' },
      { company: '2Tokens / Amelander Energie Coöperatie', sector: 'Agriculture & Energy', name: 'Tokenized community energy', desc: 'Fair-priced local energy contracts and tokenized eBonds to finance startup assets, selected for the European Commission’s Blockchain Regulatory Sandbox.' },
    ],
  },
  'digital-provenance': {
    idx: '03',
    eyebrow: 'Capability · Digital provenance',
    title: 'Digital provenance',
    tagline:
      'Materials, retrofits, maintenance, and energy performance — traceable from origin to operation.',
    intro:
      'Cloud Control builds digital provenance into every asset — capturing where materials came from, what work was done, and how performance holds up — so each claim is backed by decentralized, verifiable evidence from origin through operation.',
    deliver: [
      'Origin-to-operation traceability for materials, retrofits, and maintenance events.',
      'Authenticity and reliability "passports" that travel with an asset across custody changes.',
      'Immutable certificates backing every verified claim — volume, condition, or performance.',
      'Provenance that links physical assets to finance-ready, auditable digital records.',
    ],
    featured: [
      { company: 'The Provenance Chain Network', sector: 'Supply Chains', name: 'Commercial Trust™ Architecture', desc: 'Digitized rules, decentralized evidence storage, AI-based evaluation, and DLT-recorded credentials combine to issue reliability and authenticity "passports" across a value chain.' },
      { company: 'IOTA Foundation', sector: 'Supply Chains', name: 'TLIP trade-logistics platform', desc: 'A trusted, transparent platform integrated with national authorities (Kenya Revenue Authority and others) that issues permits instantly and lets exporters securely store and share consignment data.' },
      { company: 'DFM Data Corp.', sector: 'Supply Chains', name: 'Transport Unit Identifier (TUID)', desc: 'A custom on-chain ID for every shipment that preserves traceability even as goods change custody, are re-routed, or are split and recombined — bridging physical and digital worlds.' },
      { company: 'UNDP / Plastiks', sector: 'Sustainability', name: 'Verified plastic recovery', desc: 'Blockchain verification, traceability, and financing for plastic recovery — 4.2M+ kg verified across four regions in 2025, each kilogram backed by an immutable on-chain certificate.' },
      { company: 'Fairfood International + Hashgraph', sector: 'Agriculture', name: 'Traceable farmer payments', desc: 'Links smallholder-farmer transactions to Hedera’s ledger so payments are traceable, verifiable, and tied to the individual farmer — supporting fair compensation and livelihoods.' },
      { company: 'Tether Gold (XAUT)', sector: 'Commodities', name: 'Allocated physical gold provenance', desc: 'Each token represents ownership of one fine troy ounce of allocated physical gold on a specific bar, combining direct gold exposure with on-chain transactional utility.' },
    ],
  },
  'lifecycle-governance': {
    idx: '04',
    eyebrow: 'Capability · Lifecycle governance',
    title: 'Lifecycle governance',
    tagline:
      'Frameworks aligned to government acquisition and regulatory standards, planning through operations.',
    intro:
      'Cloud Control aligns digital-asset programs to recognized government and industry frameworks — so adoption is defensible from planning through procurement to operations, and every control maps to a standard a regulator already trusts.',
    deliver: [
      'Programs mapped to recognized government and industry standards from day one.',
      'Legal certainty for digital assets, identity, and collateral across jurisdictions.',
      'Verifiable organizational identity wired into automated compliance.',
      'A governance backbone that carries an asset from planning to procurement to operations.',
    ],
    featured: [
      { company: 'Uniform Commercial Code (UCC) Amendments', sector: 'Government', name: 'Legal certainty for digital collateral', desc: 'Defines Controllable Electronic Records (CERs) and a uniform method for creditors to perfect a security interest in digital assets by obtaining "control" — giving legal certainty to digital-asset collateral.' },
      { company: 'Wyoming Stable Token Commission', sector: 'Government', name: 'FRNT public-issuer framework', desc: 'A replicable framework for state-issued digital payments, designed for bilateral settlement between public issuers and faster payment-on-delivery for commodities.' },
      { company: 'Utah Blockchain Coalition', sector: 'Government', name: 'SEDI state-endorsed identity', desc: 'State-endorsed digital identity enabling instant KYC — combining individual privacy control, cryptographic validation, and publicly verifiable on-chain events.' },
      { company: 'Global Standards Mapping Initiative', sector: 'Standards', name: 'GSMI standards mapping', desc: 'Crowdsourced, open-access mapping of global blockchain standards — referenced by corporations, regulators, agencies, and academia to advance common standards and interoperability.' },
      { company: 'InterWork Alliance', sector: 'Standards', name: 'Token Taxonomy Framework (TTF)', desc: 'A standards framework for defining tokens and data packages, used as the foundation for digital Measurement, Reporting & Verification (dMRV) of environmental claims.' },
      { company: 'GLEIF', sector: 'Standards', name: 'Verifiable LEIs (vLEI)', desc: 'Verifiable Legal Entity Identifiers that embed verifiable organizational identity for automated compliance, linking smart contracts and tokens to real-world legal entities.' },
    ],
  },
};

const ORDER = ['blockchain-ledgers', 'iot-sensor-ingestion', 'digital-provenance', 'lifecycle-governance'];

export function generateStaticParams() {
  return ORDER.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const s = SOLUTIONS[params.slug];
  if (!s) return {};
  return {
    title: `${s.title} — Cloud Control LLC`,
    description: s.tagline,
  };
}

function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Cloud Control LLC" className="h-9 w-auto" />
          <span className="font-serif text-lg font-semibold text-cream leading-none">Cloud Control <span className="text-sky-light">LLC</span></span>
        </Link>
        <Link href="/#capabilities" className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">&larr; All capabilities</Link>
      </div>
    </header>
  );
}

export default function SolutionPage({ params }) {
  const s = SOLUTIONS[params.slug];
  if (!s) return null;
  const others = ORDER.filter((x) => x !== params.slug);

  return (
    <main className="relative min-h-screen bg-navy-deep text-cream">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(70%_60%_at_30%_0%,rgba(90,155,212,0.18),transparent_72%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-wheat">{s.eyebrow}</p>
          <h1 className="font-serif text-[10vw] font-semibold leading-[1.0] tracking-tight text-cream sm:text-6xl md:text-7xl">{s.title}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-sky-light">{s.tagline}</p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">{s.intro}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/readiness/" className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/30 transition-transform hover:scale-[1.04] active:scale-95">Request a BMM Assessment</Link>
            <Link href="/#contact" className="rounded-full border border-sky-light/40 bg-navy-900/30 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">Talk to Cloud Control</Link>
          </div>
        </div>
      </section>

      {/* How Cloud Control delivers this */}
      <section className="border-y border-white/10 bg-navy px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-2xl font-medium text-cream md:text-3xl">How Cloud Control delivers this</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {s.deliver.map((d, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-white/10 bg-navy-deep/60 p-5">
                <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full bg-wheat/15 font-serif text-sm font-semibold text-wheat-light ring-1 ring-wheat/40">{i + 1}</span>
                <span className="leading-relaxed text-sky-light/90">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-world proof */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Real-world proof</p>
          <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.1] text-cream md:text-5xl">Solutions already live in this space.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-sky-light/70">A snapshot of organizations deploying this capability today &mdash; the kind of verifiable infrastructure Cloud Control brings to construction, infrastructure, and real-world assets.</p>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {s.featured.map((f) => (
              <div key={f.company} className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-7 transition-all duration-300 hover:-translate-y-1 hover:border-wheat/40 hover:shadow-2xl hover:shadow-sky/10">
                <span className="mb-4 w-fit rounded-full border border-sky/30 bg-navy-900/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-sky-light/80">{f.sector}</span>
                <h3 className="text-lg font-semibold text-cream">{f.name}</h3>
                <p className="mt-1 text-sm font-medium text-wheat-light">{f.company}</p>
                <p className="mt-3 text-sm leading-relaxed text-sky-light/75">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-xs leading-relaxed text-sky-light/50">Featured solutions sourced from the Global Blockchain Business Council (GBBC) &ldquo;101 Real-World Blockchain Use Cases Handbook,&rdquo; 2026 Edition. Cloud Control LLC is not affiliated with the listed organizations; examples are shown to illustrate the capability.</p>
        </div>
      </section>

      {/* Explore other capabilities */}
      <section className="border-t border-white/10 bg-navy px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl font-medium text-cream md:text-3xl">Explore the other capabilities</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o} href={`/solutions/${o}/`} className="group rounded-2xl border border-white/10 bg-navy-deep/60 p-6 transition-all hover:-translate-y-1 hover:border-wheat/40">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat/80">{SOLUTIONS[o].idx}</p>
                <h3 className="mt-2 text-lg font-semibold text-cream">{SOLUTIONS[o].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sky-light/70">{SOLUTIONS[o].tagline}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-wheat-light transition-transform group-hover:translate-x-1">Explore &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-semibold leading-[1.1] text-cream md:text-5xl">Ready to make this verifiable?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">Start with a GBA Blockchain Maturity Model assessment &mdash; the government-recognized readiness standard &mdash; and map your path from concrete to code.</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/readiness/" className="rounded-full bg-wheat px-8 py-4 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Request a BMM Assessment</Link>
            <Link href="/" className="rounded-full border border-sky-light/40 px-8 py-4 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">Back to home</Link>
          </div>
        </div>
      </section>

      <footer className="bg-navy-900 px-6 pb-12 md:px-10">
        <div className="mx-auto flex max-w-8xl flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto" />
            <span className="text-sm text-sky-light/70">Cloud Control LLC &middot; Colonial Beach, VA</span>
          </div>
          <p className="text-sm text-sky-light/60">&copy; {new Date().getFullYear()} Cloud Control LLC &mdash; All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
