'use client';

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------
   /dnai/wallet — Inherited Sciences · Sovereign Genomic Wallet
   Structure mirrors app/broker/page.js:
     hero → problem → #demo (launch card ABOVE video) → #how → waitlist
   No $250 reservation anywhere. Waitlist captures intent only.
------------------------------------------------------------------- */

// Set to the YouTube ID once the wallet demo video is recorded.
// While null, the video frame is omitted and the launch card carries the section.
const DEMO_VIDEO_ID = null;

const DEMO_URL = '/dnai-wallet-demo/index.html';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Waitlist() {
  const [state, setState] = useState('idle');
  const [msg, setMsg] = useState('');
  const hp = useRef(null);

  async function submit(e) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company) return; // honeypot
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      setState('error');
      setMsg('Please enter a valid email address.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name || '',
          email: data.email,
          org: data.org || '',
          method: 'waitlist',
          interest: 'dnai-genomic-wallet',
          note: 'Waitlist signup — no payment, no reservation.',
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setState('done');
    } catch {
      setState('error');
      setMsg(
        'Something went wrong. Email everett@cloudcontrolllc.com and I\u2019ll add you manually.'
      );
    }
  }

  if (state === 'done') {
    return (
      <div className="mt-8 rounded-3xl border border-wheat/30 bg-wheat/[0.06] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat-light">
          You&rsquo;re on the list
        </p>
        <p className="mt-3 leading-relaxed text-sky-light/80">
          We&rsquo;ll be in touch as the wallet moves from testnet to pilot units. No
          payment was taken and nothing was reserved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Name"
          className="w-full rounded-xl border border-white/15 bg-navy-900/50 px-4 py-3 text-cream placeholder:text-sky-light/40 focus:border-wheat/60 focus:outline-none"
        />
        <input
          name="org"
          type="text"
          autoComplete="organization"
          placeholder="Organization (optional)"
          className="w-full rounded-xl border border-white/15 bg-navy-900/50 px-4 py-3 text-cream placeholder:text-sky-light/40 focus:border-wheat/60 focus:outline-none"
        />
      </div>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        className="w-full rounded-xl border border-white/15 bg-navy-900/50 px-4 py-3 text-cream placeholder:text-sky-light/40 focus:border-wheat/60 focus:outline-none"
      />
      {/* honeypot */}
      <input
        ref={hp}
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-deep transition hover:bg-wheat-light disabled:opacity-60"
        >
          {state === 'sending' ? 'Joining\u2026' : 'Join the waitlist'}
        </button>
        <p className="text-xs leading-relaxed text-sky-light/60">
          Intent only. No payment is collected and no device or slot is reserved.
        </p>
      </div>
      {state === 'error' && (
        <p className="text-sm text-wheat-light" role="alert">
          {msg}
        </p>
      )}
    </form>
  );
}

export default function WalletPage() {
  useReveal();

  return (
    <main className="bg-navy text-cream">
      {/* ---------------- header ---------------- */}
      <header className="fixed inset-x-0 top-0 z-50 bg-navy-deep/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4 md:px-10">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Cloud Control LLC" className="h-9 w-auto" />
            <span className="font-serif text-lg text-cream">Inherited Sciences</span>
          </a>
          <nav className="hidden items-center gap-9 lg:flex">
            <a
              href="#problem"
              className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream"
            >
              The problem
            </a>
            <a
              href="#demo"
              className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream"
            >
              Demo
            </a>
            <a
              href="#how"
              className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream"
            >
              How it works
            </a>
          </nav>
          <a
            href="#waitlist"
            className="rounded-full bg-wheat px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95"
          >
            Join the waitlist
          </a>
        </div>
      </header>

      {/* ---------------- hero ---------------- */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy-900 via-navy-deep to-navy">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(90,155,212,0.18),transparent_70%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-8xl flex-col justify-center px-6 md:px-10">
          <div className="mb-7 inline-flex w-fit flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-wheat/40 bg-navy-900/40 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur-sm">
            <span className="inline-flex items-center gap-2 text-sky-light">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-light" />
              Cloud Control LLC · Inherited Sciences · Coston2 testnet demo
            </span>
            <span
              className="hidden h-3 w-px bg-white/20 sm:block"
              aria-hidden="true"
            />
            <span className="inline-flex items-center gap-2 text-wheat-light">
              Provisional patent filed with the USPTO
            </span>
          </div>

          <h1 className="font-serif max-w-5xl text-[12.5vw] font-semibold leading-[0.95] tracking-tight text-cream sm:text-[9vw] md:text-[6.6vw]">
            Your genome
            <br />
            <span className="text-sky-light">is an asset.</span>
            <br />
            <span className="italic text-wheat-light">Hold the keys.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-sky-light/85 md:text-xl">
            For years the deal was simple: hand over your DNA, and someone else profits.
            The Sovereign Genomic Wallet inverts it. Your sequence stays sealed in a vault
            you control, consent is a signed contract rather than a checkbox, and every
            grant, revocation and royalty is anchored on-chain where nobody can quietly
            rewrite it.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#demo"
              className="rounded-full bg-sky-light px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-sky-light/30 transition-transform hover:scale-[1.04] active:scale-95"
            >
              See the demo
            </a>
            <a
              href="#waitlist"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-cream transition hover:border-wheat/60"
            >
              Join the waitlist
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- problem ---------------- */}
      <section id="problem" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div data-reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-light">
              The problem
            </p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              Consent you can&rsquo;t audit isn&rsquo;t consent.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
              <h3 className="font-serif text-xl font-medium text-cream">
                One-way transfer
              </h3>
              <p className="mt-3 leading-relaxed text-sky-light/80">
                Send your sample away and the raw sequence lives on someone else&rsquo;s
                servers indefinitely. Deletion is a promise in a policy document, not
                something you can verify.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
              <h3 className="font-serif text-xl font-medium text-cream">
                Consent as a checkbox
              </h3>
              <p className="mt-3 leading-relaxed text-sky-light/80">
                Broad terms signed once, reinterpreted later, and re-scoped when the
                company changes hands. There is no record you control and no revocation
                you can prove happened.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
              <h3 className="font-serif text-xl font-medium text-cream">
                Value flows one way
              </h3>
              <p className="mt-3 leading-relaxed text-sky-light/80">
                Genomic data underwrites drug discovery and model training. The person it
                came from is a data subject in that arrangement, never a counterparty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- demo (launch card ABOVE video) ---------------- */}
      <section id="demo" className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div data-reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-light">
              The demo
            </p>
            <h2 className="font-serif text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              Sealed, not surrendered.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">
              Play both sides of a genomic access request. A research institute composes
              terms against a specific segment; the owner reviews an unsigned contract,
              counters or signs under 2-of-3 custody, and watches the grant, the royalty
              and the revocation land in an audit log nobody can edit. Runs on Flare&rsquo;s
              Coston2 testnet with simulated data.
            </p>
          </div>

          <div data-reveal>
            <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-wheat/30 bg-wheat/[0.06] p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat-light">
                  Try it live · interactive
                </p>
                <h3 className="mt-2 font-serif text-2xl font-medium text-cream">
                  The Sovereign Genomic Wallet
                </h3>
                <p className="mt-2 max-w-xl leading-relaxed text-sky-light/80">
                  Switch between owner and researcher, request access to a segment,
                  sign under multisig custody, and revoke a live grant — end to end,
                  on Coston2 testnet with simulated data.
                </p>
              </div>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-wheat px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-wheat-light"
              >
                Launch interactive demo →
              </a>
            </div>
          </div>

          {DEMO_VIDEO_ID && (
            <div data-reveal>
              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}`}
                    title="Sovereign Genomic Wallet demo — sealed, not surrendered"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                    style={{ border: 0 }}
                  />
                </div>
              </div>
            </div>
          )}

          <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-sky-light/50">
            Coston2 testnet · simulated data · no real genome is used
          </p>
        </div>
      </section>

      {/* ---------------- how ---------------- */}
      <section id="how" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div data-reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-light">
              How it works
            </p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              Seal. Sign. Prove.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
              <p className="font-mono text-xs text-sky-light">01</p>
              <h3 className="mt-3 font-serif text-xl font-medium text-cream">Seal</h3>
              <p className="mt-3 leading-relaxed text-sky-light/80">
                Your sequence is encrypted into a vault and split into licensable
                segments. What goes on-chain is a content hash and a consent record —
                never the reads themselves.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
              <p className="font-mono text-xs text-sky-light">02</p>
              <h3 className="mt-3 font-serif text-xl font-medium text-cream">Sign</h3>
              <p className="mt-3 leading-relaxed text-sky-light/80">
                A requester composes terms — segment, purpose, duration, royalty — as an
                unsigned contract. Nothing executes until the custody threshold signs.
                Approval mints a revocable license, not a copy of your genome.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
              <p className="font-mono text-xs text-sky-light">03</p>
              <h3 className="mt-3 font-serif text-xl font-medium text-cream">Prove</h3>
              <p className="mt-3 leading-relaxed text-sky-light/80">
                Every grant, computation, royalty and revocation is anchored on Flare as
                an immutable statement. Revocation isn&rsquo;t a request you file — it&rsquo;s
                a state change anyone can check.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- waitlist ---------------- */}
      <section
        id="waitlist"
        className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-3xl">
          <div data-reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-light">
              Waitlist
            </p>
            <h2 className="font-serif text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              Join the movement to make genomes sovereign.
            </h2>
            <p className="mt-5 leading-relaxed text-sky-light/80">
              The wallet is in active development on testnet. Add your email and
              we&rsquo;ll reach out as it moves toward pilot units and design partners.
            </p>
            <Waitlist />
          </div>
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer className="bg-navy-900 px-6 pb-12 pt-12 md:px-10">
        <div className="mx-auto flex max-w-8xl flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto" />
            <span className="text-sm text-sky-light/70">
              Cloud Control LLC · Colonial Beach, VA
            </span>
          </div>
          <p className="text-sm text-sky-light/60">
            © {new Date().getFullYear()} Cloud Control LLC — All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
