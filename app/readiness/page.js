'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ----------------------------------------------------------------------------
   BMM Readiness funnel — inbound lead capture for BMM engagement and
   GBA Working Group Alliance participation.

   LEAD CAPTURE: the form currently emails the submission to the GBA inbox as
   an interim capture path. To wire JoMoCo (GoHighLevel):
     • EITHER replace <LeadForm /> with the JoMoCo form embed (iframe/script), OR
     • set JOMOCO_WEBHOOK below to your inbound-webhook URL — the handler will
       POST the lead to it (and still falls back to email on failure).
---------------------------------------------------------------------------- */

const JOMOCO_WEBHOOK = ''; // ← paste your JoMoCo inbound webhook URL here to go live
const GBA_INBOX = 'everett.morton@gbaglobal.org';

const PATHWAYS = [
  {
    tag: 'Phase 01 · Assess',
    title: 'GBA Working Group Alliance',
    body: 'Begin with a pre-assessment, cultural-integration phase. We embed your team in the GBA Standards & Certification Working Group to shift your roadmap and development culture from a Web2 posture to a 3rd-generation, DAO-like mindset — before a line of production code is written.',
  },
  {
    tag: 'Phase 02 · Certify',
    title: 'BMM Assessment & Roadmap',
    body: 'Engage a formal Blockchain Maturity Model assessment — the global standard for the trustworthiness of blockchain solutions. You receive a credible benchmark across security, performance, governance, and transparency, plus a phased roadmap to the next maturity level.',
  },
];

const WHY = [
  { stat: '500+', label: 'government offices', body: 'Solutions that pass a BMM assessment are published in the GBA Web3 Emerging Technology Directory — a resource shared with over 500 government offices worldwide.' },
  { stat: 'Procurement', label: 'evaluation criteria', body: 'Government solicitations in India, Mexico, and U.S. states have incorporated GBA BMM ratings directly into procurement evaluation criteria.' },
  { stat: 'v2.0', label: 'released on Capitol Hill', body: 'BMM v2.0 raises the bar on what a solution must demonstrate in performance, reliability, and sustainability — the readiness standard regulators recognize.' },
];

const RESOURCES = [
  { name: 'Blockchain Maturity Model — overview', href: 'https://gbaglobal.org/blockchain-maturity-model/' },
  { name: 'BMM v2.0 release announcement', href: 'https://gbaglobal.org/blog/2026/03/31/just-released-blockchain-maturity-model-bmm-v2-0/' },
  { name: 'BMM Overview (PDF, v1.0)', href: 'https://gbaglobal.org/wp-content/uploads/2023/01/01-Blockchain-Matuirity-Model-Overview-v1.0-2.pdf' },
  { name: 'BMM assessment results directory', href: 'https://gbaglobal.org/blockchain-maturity-model/results/' },
];

function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Cloud Control LLC" className="h-9 w-auto" />
          <span className="font-serif text-lg font-semibold text-cream leading-none">Cloud Control <span className="text-sky-light">LLC</span></span>
        </Link>
        <Link href="/" className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">&larr; Home</Link>
      </div>
    </header>
  );
}

function LeadForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k) => (fd.get(k) || '').toString().trim();
    const lead = {
      name: get('name'),
      email: get('email'),
      organization: get('organization'),
      role: get('role'),
      sector: get('sector'),
      interest: get('interest'),
      message: get('message'),
      source: 'cloudcontrolllc.com/readiness',
    };

    setStatus('sending');

    // Preferred path: POST to JoMoCo inbound webhook when configured.
    if (JOMOCO_WEBHOOK) {
      try {
        await fetch(JOMOCO_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
        setStatus('done');
        return;
      } catch (err) {
        // fall through to email fallback
      }
    }

    // Interim fallback: open a pre-filled email to the GBA inbox.
    const lines = [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Organization: ${lead.organization}`,
      `Role: ${lead.role}`,
      `Sector: ${lead.sector}`,
      `Interest: ${lead.interest}`,
      '',
      lead.message,
    ].join('\n');
    const subject = `BMM Readiness Inquiry — ${lead.organization || lead.name}`;
    window.location.href = `mailto:${GBA_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-wheat/40 bg-navy-deep/60 p-8 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-wheat/15 ring-1 ring-wheat/40">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-wheat" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="font-serif text-2xl font-semibold text-cream">Thank you — request received.</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-sky-light/80">We&apos;ll be in touch shortly to schedule your readiness consult. If your email client opened, send the pre-filled message to complete your request.</p>
      </div>
    );
  }

  const inputCls = 'w-full rounded-xl border border-white/12 bg-navy-deep/60 px-4 py-3 text-cream placeholder-sky-light/40 outline-none transition-colors focus:border-wheat/60';
  const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-sky-light/70';

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label className={labelCls} htmlFor="name">Name</label>
        <input id="name" name="name" required className={inputCls} placeholder="Full name" />
      </div>
      <div>
        <label className={labelCls} htmlFor="email">Work email</label>
        <input id="email" name="email" type="email" required className={inputCls} placeholder="you@organization.gov" />
      </div>
      <div>
        <label className={labelCls} htmlFor="organization">Organization</label>
        <input id="organization" name="organization" className={inputCls} placeholder="Agency or company" />
      </div>
      <div>
        <label className={labelCls} htmlFor="role">Role / Title</label>
        <input id="role" name="role" className={inputCls} placeholder="Your role" />
      </div>
      <div>
        <label className={labelCls} htmlFor="sector">Sector</label>
        <select id="sector" name="sector" defaultValue="" className={inputCls}>
          <option value="" disabled>Select sector</option>
          <option>Government / Public sector</option>
          <option>Private sector</option>
          <option>Academic / Research</option>
          <option>Non-profit / NGO</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="interest">I&apos;m interested in</label>
        <select id="interest" name="interest" defaultValue="" className={inputCls}>
          <option value="" disabled>Select interest</option>
          <option>BMM Assessment</option>
          <option>GBA Working Group Alliance</option>
          <option>Both — full engagement</option>
          <option>Not sure yet — advise me</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls} htmlFor="message">What are you building?</label>
        <textarea id="message" name="message" rows={4} className={inputCls} placeholder="A few lines on your solution, timeline, and the public-sector opportunity you have in mind." />
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === 'sending'} className="rounded-full bg-wheat px-8 py-4 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95 disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Request my readiness consult'}
        </button>
        <span className="text-xs text-sky-light/50">No spam. Your details route directly to the GBA sales & revenue team.</span>
      </div>
    </form>
  );
}

export default function ReadinessPage() {
  return (
    <main className="relative min-h-screen bg-navy-deep text-cream">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(70%_60%_at_30%_0%,rgba(90,155,212,0.18),transparent_72%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-wheat">Government Blockchain Association &middot; Blockchain Maturity Model</p>
          <h1 className="font-serif text-[10vw] font-semibold leading-[1.0] tracking-tight text-cream sm:text-6xl md:text-7xl">Government-recognized blockchain readiness.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-sky-light">The BMM is the global standard for the trustworthiness of blockchain solutions &mdash; a credible benchmark for security, performance, governance, and transparency, and a roadmap for continuous improvement.</p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">Cloud Control guides public- and private-sector teams from cultural alignment through certified readiness &mdash; assess, build, scale, repeat.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#start" className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/30 transition-transform hover:scale-[1.04] active:scale-95">Request a readiness consult</a>
            <a href="https://gbaglobal.org/blockchain-maturity-model/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-sky-light/40 bg-navy-900/30 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">Read the BMM &#8599;</a>
          </div>
        </div>
      </section>

      {/* Two pathways */}
      <section className="border-y border-white/10 bg-navy px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Two ways to engage</p>
          <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.1] text-cream md:text-4xl">Lead with culture. Certify with the model.</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {PATHWAYS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat/90">{p.tag}</p>
                <h3 className="mt-2 text-xl font-semibold text-cream md:text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/80">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Why readiness pays off</p>
          <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.1] text-cream md:text-5xl">A rating buyers already trust.</h2>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.label} className="rounded-2xl border border-white/10 bg-navy/40 p-7">
                <p className="font-serif text-4xl font-semibold text-wheat-light">{w.stat}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-sky-light/70">{w.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-sky-light/75">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The funnel form */}
      <section id="start" className="border-t border-white/10 bg-navy px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Start your readiness path</p>
          <h2 className="font-serif text-3xl font-medium leading-[1.1] text-cream md:text-5xl">Request a consult.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-sky-light/75">Tell us where you are and where you&apos;re headed. We&apos;ll map the fastest route from Working Group alignment to a BMM rating and public-sector pilot.</p>
          <div className="mt-10">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* BMM resources */}
      <section className="border-t border-white/10 bg-navy-deep px-6 py-14 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-xl font-medium text-cream md:text-2xl">BMM resources from the Government Blockchain Association</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RESOURCES.map((r) => (
              <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl border border-white/10 bg-navy/40 px-5 py-4 transition-colors hover:border-wheat/40">
                <span className="text-sm text-cream">{r.name}</span>
                <span className="text-sky-light/60 transition-colors group-hover:text-wheat-light">&#8599;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-navy-900 px-6 pb-12 pt-10 md:px-10">
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
