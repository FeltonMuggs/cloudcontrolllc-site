export const metadata = {
  title: 'GBA Certified — Blockchain Maturity Model Assessor | Cloud Control LLC',
  description:
    'Cloud Control LLC holds a Government Blockchain Association Blockchain Maturity Model (BMM) certificate. BMM readiness assessments for the public sector and regulated industries, led by a GBA-certified assessor.',
  alternates: { canonical: '/gba-certified/' },
  openGraph: {
    title: 'GBA Certified — Cloud Control LLC',
    description: 'Certified governance readiness: GBA Blockchain Maturity Model assessments for the public sector and regulated industries.',
    url: 'https://cloudcontrolllc.com/gba-certified/',
    siteName: 'Cloud Control LLC',
    type: 'website',
  },
};

const CHECKS = [
  'Assess the digital maturity of construction and infrastructure assets',
  'Identify gaps in data integrity, cybersecurity, compliance, and performance',
  'Develop a clear, phased roadmap to peak digital-asset performance',
  'Align programs with grant, utility, and federal funding requirements',
];

function Check({ small = false }) {
  return (
    <span className={`mt-0.5 grid flex-none place-items-center rounded-full ${small ? 'h-6 w-6 bg-wheat/15 ring-1 ring-wheat/40' : 'h-7 w-7 bg-wheat/20 ring-1 ring-wheat/50'}`}>
      <svg viewBox="0 0 24 24" className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'} fill-none stroke-wheat`} strokeWidth="3" aria-hidden="true"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

export default function GbaCertifiedPage() {
  return (
    <main id="top" className="relative min-h-screen bg-navy">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-navy-900/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-3.5 md:px-10">
          <div className="flex items-center gap-4">
            <a href="/" className="group flex items-center gap-3">
              <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto opacity-90 transition-opacity group-hover:opacity-100" />
              <span className="hidden font-serif text-base font-semibold leading-none text-cream/80 transition-colors group-hover:text-cream sm:block">
                Cloud Control <span className="text-sky-light">LLC</span>
              </span>
            </a>
            <span className="text-lg text-white/20" aria-hidden="true">/</span>
            <span className="flex items-center gap-2 rounded-full border border-wheat/50 bg-wheat/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-wheat">
              <span className="h-1.5 w-1.5 rounded-full bg-wheat" />
              GBA Certified
            </span>
          </div>
          <a href="/readiness/" className="rounded-full bg-wheat px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Book a BMM call</a>
        </div>
      </header>

      <section id="bmm" className="relative px-6 pb-24 pt-36 md:px-10 md:pb-32 md:pt-44">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <a href="https://gbaglobal.org/" target="_blank" rel="noopener noreferrer" title="Government Blockchain Association" className="inline-flex items-center rounded-lg bg-white px-3.5 py-2 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-[1.04]">
                <img src="/gba-logo.png" alt="Government Blockchain Association (GBA)" className="h-9 w-auto" />
              </a>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-wheat">GBA Certified</p>
            </div>
            <h1 className="font-serif text-4xl font-medium leading-[1.08] text-cream md:text-5xl">The only government-recognized blockchain readiness framework.</h1>
            <p className="mt-6 text-lg leading-relaxed text-sky-light/80">Cloud Control LLC holds a Certificate of the Government Blockchain Association&apos;s Blockchain Maturity Model &mdash; a standardized quality-assurance and risk-reduction roadmap for the public sector and regulated industries.</p>
            <p className="mt-5 text-lg leading-relaxed text-sky-light/80">Competitors provide technology tools. Cloud Control provides certified governance readiness.</p>
            <div className="mt-7 flex items-start gap-3.5 rounded-xl border border-wheat/40 bg-wheat/10 p-4">
              <Check />
              <p className="text-[15px] leading-relaxed text-cream"><span className="font-semibold">Assessments led by a GBA-Certified Blockchain Maturity Model Assessor</span> &mdash; your readiness evaluation is guided by a certified practitioner, not just a vendor.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/readiness/" className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/30 transition-transform hover:scale-[1.04] active:scale-95">Explore the BMM readiness funnel</a>
              <a href="/" className="text-sm font-semibold text-sky-light transition-colors hover:text-cream">&larr; Back to home</a>
            </div>
          </div>
          <div className="space-y-3">
            <a
              href="/bmm-certificate.jpg"
              target="_blank"
              rel="noopener noreferrer"
              title="View the certificate at full size"
              className="group block rounded-2xl border border-wheat/30 bg-navy-deep/60 p-4 shadow-xl shadow-navy-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-wheat/60 hover:shadow-wheat/10 md:p-5"
            >
              <img
                src="/bmm-certificate-card.jpg"
                alt="Certificate of Completion — Blockchain Maturity Model (BMM) Program, presented to Everett Morton by the Government Blockchain Association"
                className="w-full rounded-lg ring-1 ring-white/10"
              />
              <div className="mt-3.5 flex items-center justify-between gap-3">
                <p className="text-sm leading-snug text-sky-light/80">
                  <span className="font-semibold text-cream">Certificate of Completion</span> &mdash; GBA Blockchain Maturity Model Program &middot; 30 hours &middot; March 2026
                </p>
                <span className="flex-none text-xs font-semibold uppercase tracking-[0.15em] text-wheat-light transition-transform group-hover:translate-x-1">View &rarr;</span>
              </div>
            </a>
            {CHECKS.map((line) => (
              <div key={line} className="flex items-start gap-4 rounded-xl border border-white/10 bg-navy-deep/60 p-5">
                <Check small />
                <span className="leading-relaxed text-cream">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-navy-900 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-sky-light/70">
          <p>&copy; Cloud Control LLC &middot; Colonial Beach, Virginia</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-cream">Home</a>
            <a href="/legacy/" className="hover:text-cream">Project Legacy</a>
            <a href="mailto:everett@cloudcontrolllc.com?subject=BMM%20Assessment%20Inquiry" className="hover:text-cream">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
