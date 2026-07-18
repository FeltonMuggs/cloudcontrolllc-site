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
  { label: 'Heritage', href: '#heritage' },
  { label: 'Clark SPP', href: '#clark-spp' },
  { label: 'Playbook', href: '#playbook' },
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
          <span className="flex items-center gap-2 rounded-full border border-wheat/50 bg-wheat/15 px-3.5 py-1.5 text-xs font-semibold text-wheat tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-wheat" />
            Legacy
          </span>
        </div>
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">{l.label}</a>
          ))}
        </nav>
        <a href="mailto:everett@cloudcontrolllc.com?subject=Legacy%20Inquiry" className="rounded-full bg-wheat px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Start a conversation</a>
      </div>
    </header>
  );
}

/* ---------------- crest with graceful fallback until the asset lands ---------------- */
function SppCrest() {
  const [imgOk, setImgOk] = useState(true);
  if (!imgOk) {
    return (
      <div className="flex h-48 w-48 items-center justify-center rounded-full border-2 border-wheat/40 bg-navy-900/60 text-center">
        <span className="px-6 font-serif text-sm leading-snug text-wheat">Clark Construction<br />SPP Crest</span>
      </div>
    );
  }
  return (
    <img
      src="/clark-spp.png"
      alt="Clark Construction Strategic Partnership Program crest"
      className="h-48 w-auto drop-shadow-2xl"
      onError={() => setImgOk(false)}
    />
  );
}

const HERITAGE_POINTS = [
  { k: '01', title: 'Field First', body: 'Cloud Control was built by people who have stood on the jobsite — bidding work, managing crews, and answering to schedules, inspections, and pay applications long before writing a line of code.' },
  { k: '02', title: 'Earned Standards', body: 'Our approach to verifiable infrastructure data comes from living the paperwork burden firsthand: submittals, RFIs, certified payroll, closeout. We digitize what we have personally carried.' },
  { k: '03', title: 'Built to Hand Down', body: 'Legacy means the next generation of subcontractors inherits a playbook, not a pile of lessons learned the hard way. We publish what we know so smaller firms can compete and win.' },
];

export default function LegacyPage() {
  useSmoothScroll();
  return (
    <main id="top" className="relative bg-navy-deep">
      <Nav />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy-900 via-navy-deep to-navy">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(214,183,120,0.14),transparent_70%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-8xl flex-col justify-center px-6 md:px-10">
          <div className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-wheat/40 bg-navy-900/40 px-4 py-2 text-xs font-medium tracking-wide text-wheat backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-wheat" />
            Cloud Control LLC &middot; Legacy
          </div>
          <h1 className="font-serif max-w-5xl text-[12.5vw] font-semibold leading-[0.95] tracking-tight text-cream sm:text-[9vw] md:text-[6.6vw]">
            Before the ledger,<br />
            <span className="italic text-wheat-light">the jobsite.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-sky-light/85 md:text-xl">
            Cloud Control&rsquo;s roots are in construction &mdash; the trades, the schedules, the standards. Legacy is where that heritage lives: the credentials we earned in the field and the playbook we&rsquo;re writing for the subcontractors coming up behind us.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#clark-spp" className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/30 transition-transform hover:scale-[1.04] active:scale-95">The Clark SPP story</a>
            <a href="#playbook" className="rounded-full border border-sky-light/40 bg-navy-900/30 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:border-wheat hover:text-wheat-light">The Subcontractor Playbook</a>
          </div>
        </div>
      </section>

      {/* ===== HERITAGE ===== */}
      <section id="heritage" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Heritage</p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">Technology company second. Construction company first.</h2>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-8 md:grid-cols-3">
            {HERITAGE_POINTS.map((p) => (
              <div key={p.k} className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
                <p className="font-mono text-xs text-wheat">{p.k}</p>
                <h3 className="mt-3 font-serif text-xl font-medium text-cream">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/80">{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== CLARK SPP ===== */}
      <section id="clark-spp" className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[auto,1fr]">
          <Reveal className="justify-self-center">
            <SppCrest />
          </Reveal>
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Clark Construction &middot; Strategic Partnership Program</p>
            <h2 className="font-serif text-3xl font-medium leading-[1.15] text-cream md:text-5xl">Trained where the biggest work gets built.</h2>
            <p className="mt-6 text-lg leading-relaxed text-sky-light/80">
              Cloud Control LLC is a graduate of Clark Construction&rsquo;s Strategic Partnership Program &mdash; the executive-education program that has been empowering small businesses since 2006, developing subcontractors in the disciplines that win and deliver major work: estimating, project controls, contracts, safety, and financial management.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-sky-light/80">
              That training is baked into how we build software: every workflow we digitize is one we first learned to run on paper, under contract, on a live project.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== SUBCONTRACTOR PLAYBOOK ===== */}
      <section id="playbook" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Active Project</p>
            <h2 className="font-serif text-3xl font-medium leading-[1.15] text-cream md:text-5xl">The Subcontractor Playbook</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sky-light/80">
              A field-tested operating guide for subcontractors moving from paper to verifiable digital records &mdash; bidding, compliance, payment, and closeout &mdash; distilled from the Clark SPP curriculum and our own years in the trades.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:everett@cloudcontrolllc.com?subject=Subcontractor%20Playbook" className="rounded-full bg-wheat px-8 py-4 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Get notified when it ships</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-navy-900 px-6 pb-12 pt-8 md:px-10">
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
