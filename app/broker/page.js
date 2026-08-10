'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ---------------- smooth scroll ---------------- */
function useSmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js-ready');
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      touchMultiplier: 1.6,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
      document.documentElement.classList.remove('js-ready');
    };
  }, []);
}

/* ---------------- reveal ---------------- */
function Reveal({ children, className = '', stagger = false, y = 46 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const targets = stagger ? gsap.utils.toArray(el.children) : [el];
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: { trigger: el, start: 'top 84%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, [stagger, y]);
  return (
    <div ref={ref} className={className} {...(!stagger && { 'data-reveal': '' })}>
      {children}
    </div>
  );
}

/* ---------------- nav ---------------- */
const NAV_LINKS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Demo', href: '#demo' },
  { label: 'How it works', href: '#how' },
];
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-navy-900/85 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-b border-transparent'}`}>
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-3.5 md:px-10">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="hidden sm:block font-serif text-base font-semibold text-cream/80 group-hover:text-cream leading-none transition-colors">
              Cloud Control <span className="text-sky-light">LLC</span>
            </span>
          </a>
          <span className="text-white/20 text-lg" aria-hidden="true">/</span>
          <span className="flex items-center gap-2 rounded-full border border-sky-light/50 bg-sky-light/15 px-3.5 py-1.5 text-xs font-semibold text-sky-light tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-light" />
            Carbon Broker
          </span>
        </div>
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">{l.label}</a>
          ))}
        </nav>
        <a href="mailto:everett@cloudcontrolllc.com?subject=Carbon%20Broker%20Inquiry" className="rounded-full bg-wheat px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Start a conversation</a>
      </div>
    </header>
  );
}

const HOW_STEPS = [
  { k: '01', title: 'Match', body: 'A permit holder with an offset obligation is matched to an approved credit bank in the same watershed — because credits only count where the rules say they count. The broker is non-custodial: buyers pay sellers directly.' },
  { k: '02', title: 'Price', body: 'Deal terms stay in dollars. Settlement converts at a decentralized oracle rate read on-chain (Flare FTSO v2), so the conversion is verifiable rather than quoted. The oracle prices the settlement currency, not the credit.' },
  { k: '03', title: 'Prove', body: 'A registry event is attested by an independent validator set (Flare Data Connector) and Merkle-proof verified on-chain. Every credit carries a provenance grade — double-selling becomes externally detectable.' },
];

const BARRIERS = [
  { t: 'Finance friction', b: 'Brokered markets with opaque spreads, slow settlement, and intermediaries who hold your funds. Carbon Broker puts the economics on the table and never takes custody.' },
  { t: 'Historical restrictions', b: 'Land and credit markets have structurally favored large holders. Smaller landowners rarely see the demand side, the pricing, or the paperwork path to participate at all.' },
  { t: 'Verification by trust', b: 'Today a credit’s status is a registry screenshot and a broker’s word. Carbon Broker replaces that with decentralized attestation anyone can check.' },
];

export default function BrokerPage() {
  useSmoothScroll();
  return (
    <main id="top" className="relative bg-navy-deep">
      <Nav />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy-900 via-navy-deep to-navy">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(90,155,212,0.18),transparent_70%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-8xl flex-col justify-center px-6 md:px-10">
          <div className="mb-4 inline-flex w-fit items-center gap-2.5 rounded-full border border-sky-light/40 bg-navy-900/40 px-4 py-2 text-xs font-medium tracking-wide text-sky-light backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-light" />
            Cloud Control LLC &middot; Carbon Broker &middot; Coston2 testnet demo
          </div>
          <div className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-wheat/40 bg-wheat/[0.08] px-4 py-2 text-xs font-medium tracking-wide text-wheat-light backdrop-blur-sm">
            <span aria-hidden="true">&#127942;</span>
            Built for Flare Summer Signal &middot; Interoperable Asset Products (FTSOv2 + FDC)
          </div>
          <h1 className="font-serif max-w-5xl text-[12.5vw] font-semibold leading-[0.95] tracking-tight text-cream sm:text-[9vw] md:text-[6.6vw]">
            The land economy<br />
            <span className="text-sky-light">has a gate.</span><br />
            <span className="italic text-wheat-light">We&rsquo;re removing it.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-sky-light/85 md:text-xl">
            Carbon Broker decouples the finance friction and historical restrictions that keep smaller landowners out of land and carbon-credit real-world-asset markets &mdash; broker-matched deals, oracle-priced settlement, and credit provenance verified on-chain instead of taken on trust.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#demo" className="rounded-full bg-sky-light px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-sky-light/30 transition-transform hover:scale-[1.04] active:scale-95">Watch the demo</a>
            <a href="#mission" className="rounded-full border border-sky-light/40 bg-navy-900/30 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:border-wheat hover:text-wheat-light">Why it matters</a>
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section id="mission" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-light">Mission</p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              Every development permit creates demand. Smaller landowners should be able to supply it.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-sky-light/80">
              In regulated mitigation markets like Virginia&rsquo;s, permits that impact streams, wetlands, or the Chesapeake Bay watershed create a legal obligation to buy offset credits &mdash; and demand outruns approved supply, and the state&rsquo;s SWaN exchange (a Virginia DEQ &times; Water Ledger platform) now publishes credit availability and pricing in the open. Carbon Broker is built for regulated markets like Virginia&rsquo;s &mdash; the participant-side service layer that gets smaller landowners into them. The barriers that keep landowners on the sidelines aren&rsquo;t about land. They&rsquo;re about access:
            </p>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-8 md:grid-cols-3">
            {BARRIERS.map((p) => (
              <div key={p.t} className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
                <h3 className="font-serif text-xl font-medium text-cream">{p.t}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/80">{p.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== DEMO VIDEO ===== */}
      <section id="demo" className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-light">The demo</p>
            <h2 className="font-serif text-3xl font-medium leading-[1.15] text-cream md:text-5xl">Verified, not trusted.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">
              Two minutes, end to end: a broker-matched credit deal, oracle-priced settlement, decentralized attestation of the credit&rsquo;s provenance, and retirement with the disclosure attached. Runs on Flare&rsquo;s Coston2 testnet with simulated deal data.
            </p>
          </Reveal>
          <Reveal y={32}>
            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/yCi1H4o0gpo"
                  title="Carbon Broker demo — verified, not trusted"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
            <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-sky-light/50">
              Built on FDC + FTSO v2 &middot; Coston2 testnet &middot; simulated deal data
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-sky-light">How it works</p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">Match. Price. Prove.</h2>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-8 md:grid-cols-3">
            {HOW_STEPS.map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
                <p className="font-mono text-xs text-sky-light">{s.k}</p>
                <h3 className="mt-3 font-serif text-xl font-medium text-cream">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/80">{s.body}</p>
              </div>
            ))}
          </Reveal>
          <Reveal y={24}>
            <div className="mt-12 rounded-2xl border border-wheat/30 bg-wheat/[0.06] p-6 text-sky-light/80">
              <span className="font-semibold text-wheat">Status:</span> Carbon Broker is a working demo on Flare&rsquo;s Coston2 testnet with simulated deal data. No mainnet deployment, no live transactions, and no customer funds &mdash; by design, until the market and compliance gates clear.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA + FOOTER ===== */}
      <section className="relative bg-navy-900 px-6 py-24 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-[1.05] text-cream md:text-5xl">Own land? <span className="italic text-wheat-light">You&rsquo;re the supply side.</span></h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sky-light/80">If you hold land in a mitigation-eligible watershed and want to understand what participation could look like, start a conversation.</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:everett@cloudcontrolllc.com?subject=Carbon%20Broker%20Inquiry" className="rounded-full bg-wheat px-8 py-4 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Start a conversation</a>
              <a href="/" className="rounded-full border border-sky-light/40 px-8 py-4 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">Back to Cloud Control</a>
            </div>
          </Reveal>
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
