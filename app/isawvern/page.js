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

/* ---------------- constants ---------------- */
// Live Base44 app. Switch back to 'https://isawvern.ai' once that domain points at the app.
const VERN_SITE = 'https://i-saw-vern-44cfc45c.base44.app';

/* ---------------- Vern voice agent (ElevenLabs) ---------------- */
// Demo voice agent: procedural-only case file intake + Virginia public defender office routing.
const VERN_AGENT_ID = 'agent_0801m80esk16f4zswembvrt2tgjr';
const VERN_WIDGET_SRC = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

function useVernWidget() {
  useEffect(() => {
    if (document.querySelector(`script[src="${VERN_WIDGET_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = VERN_WIDGET_SRC;
    s.async = true;
    s.type = 'text/javascript';
    document.body.appendChild(s);
  }, []);
}

// Opens the corner call widget. Falls back to pointing at it if the widget hasn't loaded yet.
function talkToVern(e) {
  e.preventDefault();
  const widget = document.querySelector('elevenlabs-convai');
  const btn = widget?.shadowRoot?.querySelector('button');
  if (btn) {
    btn.click();
  } else if (widget) {
    widget.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}
const VERN_PORTRAIT = 'https://media.base44.com/images/public/6afa386987aee88b44cfc45c/90fae40e5_isawvern-crest.png';
const INQUIRY = 'mailto:everett@cloudcontrolllc.com?subject=iSawVern%20Partner%20Pilot';

/* ---------------- nav ---------------- */
const NAV_LINKS = [
  { label: 'Mission', href: '#mission' },
  { label: 'How it works', href: '#how' },
  { label: 'For defenders', href: '#defenders' },
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
          <span className="flex items-center gap-2 rounded-full border border-wheat-light/50 bg-wheat-light/15 px-3.5 py-1.5 text-xs font-semibold text-wheat-light tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-wheat-light" />
            iSawVern
          </span>
        </div>
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">{l.label}</a>
          ))}
        </nav>
        <a href={`${VERN_SITE}/#waitlist`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-wheat px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Join the waitlist</a>
      </div>
    </header>
  );
}

/* ---------------- content ---------------- */
const GAPS = [
  { t: 'The deadline nobody mentioned', b: 'People lose ground in the justice system on procedure, not merits: a missed notice, a hearing they did not understand, a filing window that closed quietly.' },
  { t: 'The record that changed', b: 'When a note is edited or a conversation has no witness, the person with the least power has the least proof. Memory is not evidence.' },
  { t: 'The counsel gap', b: 'Public defender offices carry caseloads that leave little time to explain process. People arrive at the courthouse unprepared through no fault of their own.' },
];

const HOW_STEPS = [
  { k: '01', title: 'Tell Vern', body: 'Describe the situation in plain words: the notice, the hearing, the deadline. Vern asks only what he needs to place you on the procedural map.' },
  { k: '02', title: 'Map the path', body: 'Vern names the stage you are in, the documents that govern it, and the deadlines attached, then lays out the next steps in plain language.' },
  { k: '03', title: 'Seal the record', body: 'In development: each instruction and source is hashed and anchored to a public ledger with a timestamp, so what you were told becomes verifiable.' },
  { k: '04', title: 'Hand off to counsel', body: 'When a matter needs a licensed attorney, Vern says so and routes you to your counsel or a partner defender office instead of guessing.' },
];

const DEFENDER_POINTS = [
  { t: 'Sovereign deployment', b: 'Designed to run as sovereign AI inside the office’s own environment, so client data never leaves the custody of the defender.' },
  { t: 'Evidence & discovery integrity', b: 'Hash-anchored intake and discovery records make alterations detectable, giving counsel a tamper-evident chain of what was received and when.' },
  { t: 'Chain-agnostic by design', b: 'The ledger layer is built to anchor to more than one network, with no lock-in to a single chain or vendor.' },
  { t: 'Assessed, not asserted', b: 'Built toward an independent Government Blockchain Association BMM maturity assessment before any production pilot.' },
];

export default function ISawVernPage() {
  useSmoothScroll();
  useVernWidget();
  return (
    <main id="top" className="relative bg-navy-deep">
      <Nav />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy-900 via-navy-deep to-navy">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(216,169,63,0.16),transparent_70%)]" />
        <div className="relative z-10 mx-auto grid min-h-screen max-w-8xl items-center gap-14 px-6 pb-16 pt-28 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-7 inline-flex w-fit flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-wheat/40 bg-navy-900/40 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur-sm">
              <span className="inline-flex items-center gap-2 text-wheat-light">
                <span className="h-1.5 w-1.5 rounded-full bg-wheat-light" style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
                Cloud Control LLC &middot; iSawVern.ai &middot; Waitlist open
              </span>
              <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />
              <span className="text-sky-light/80">Pronounced &ldquo;I saw Vern&rdquo;</span>
            </div>
            <h1 className="font-serif max-w-4xl text-[12vw] font-semibold leading-[0.95] tracking-tight text-cream sm:text-[8.5vw] md:text-[6vw]">
              Your rights,<br />
              <span className="text-sky-light">immutably</span><br />
              <span className="italic text-wheat-light">navigated.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-sky-light/85 md:text-xl">
              Vern is an AI legal navigator for people who feel the justice system is being used against them. He reads the record, names the procedure, and shows the next move &mdash; with every step headed for a public ledger so the account can&rsquo;t be rewritten later.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#talk-to-vern" onClick={talkToVern} className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/25 transition-transform hover:scale-[1.04] active:scale-95">Talk to Vern &rarr;</a>
              <a href={`${VERN_SITE}/case-file`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-wheat/60 bg-navy-900/30 px-7 py-3.5 text-sm font-semibold text-wheat-light backdrop-blur-sm transition-colors hover:border-wheat hover:text-wheat">Upload your papers</a>
              <a href="#defenders" className="rounded-full border border-sky-light/40 bg-navy-900/30 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:border-wheat hover:text-wheat-light">For defender offices &amp; firms</a>
            </div>
            <p id="talk-to-vern" className="mt-5 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-sky-light/60">
              Live demo &middot; Vern builds your case file, then points you to your public defender office. He&rsquo;s an AI, not a lawyer: what you tell him is recorded and is not protected like a conversation with your lawyer. You can skip your account and give only your court details. Not legal advice &middot; Not affiliated with VIDC.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-light/60">Vern &middot; navigator</span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-wheat-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-wheat-light" style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
                  listening
                </span>
              </div>
              <div className="relative aspect-[4/5]">
                <img src={VERN_PORTRAIT} alt="I Saw Vern AI crest: Legal Navigator, not Legal Advice" className="absolute inset-0 h-full w-full object-contain px-8 pb-20 pt-10" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,rgba(8,26,43,0.65)_100%)]" />
                <div className="absolute bottom-4 left-4 border-l-2 border-wheat pl-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-light/60">Vern</p>
                  <p className="font-serif text-xl text-cream">Legal navigator</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-sky-light/50">Navigator mode: on &middot; Licensed attorney: no</p>
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section id="mission" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat-light">Mission</p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              If the system can be rewritten, it can be used against you.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-sky-light/80">
              iSawVern extends Cloud Control&rsquo;s data-integrity work to the place it matters most for an individual: their own case. Vern gives people a plain-language guide through procedure and a verifiable record of what they were told &mdash; the same golden-thread principle we apply to infrastructure, applied to due process.
            </p>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-8 md:grid-cols-3">
            {GAPS.map((p) => (
              <div key={p.t} className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
                <h3 className="font-serif text-xl font-medium text-cream">{p.t}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/80">{p.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat-light">How it works</p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">Tell. Map. Seal. Hand off.</h2>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
                <p className="font-mono text-xs text-wheat-light">{s.k}</p>
                <h3 className="mt-3 font-serif text-xl font-medium text-cream">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/80">{s.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== FOR DEFENDERS ===== */}
      <section id="defenders" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat-light">For defender offices &amp; firms</p>
            <h2 className="font-serif max-w-3xl text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              A navigator for the client. <span className="italic text-wheat-light">An integrity layer for the office.</span>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-sky-light/80">
              We are seeking a founding public defender office or law group to shape a pilot. Vern prepares clients before they reach counsel; the ledger gives the office a tamper-evident record of intake and discovery.
            </p>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-2">
            {DEFENDER_POINTS.map((p) => (
              <div key={p.t} className="rounded-2xl border border-white/10 bg-navy-900/40 p-8">
                <h3 className="font-serif text-xl font-medium text-cream">{p.t}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/80">{p.b}</p>
              </div>
            ))}
          </Reveal>
          <Reveal y={24}>
            <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-wheat/30 bg-wheat/[0.06] p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat-light">Partner pilot</p>
                <h3 className="mt-2 font-serif text-2xl font-medium text-cream">Bring Vern to your office</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-sky-light/80">Tell us your jurisdiction and caseload, and we&rsquo;ll scope what a pilot would look like.</p>
              </div>
              <a href={`${VERN_SITE}/#partners`} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-wheat px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-wheat-light">Request a pilot conversation &rarr;</a>
            </div>
          </Reveal>
          <Reveal y={24}>
            <div className="mt-6 rounded-2xl border border-white/10 bg-navy-900/40 p-6 text-sky-light/80">
              <span className="font-semibold text-wheat">Status &amp; scope:</span> iSawVern is in development, with a waitlist open now. The on-chain record is not yet live. Vern is a legal navigator, not a licensed attorney: nothing here is legal advice, representation, or a prediction of outcome, and using it does not create an attorney&ndash;client relationship.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA + FOOTER ===== */}
      <section className="relative bg-navy-900 px-6 py-24 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-[1.05] text-cream md:text-5xl">Facing the system alone? <span className="italic text-wheat-light">You won&rsquo;t have to.</span></h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sky-light/80">Join the waitlist to hear when Vern opens in your jurisdiction, on the web and on iPhone and Android.</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href={`${VERN_SITE}/#waitlist`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-wheat px-8 py-4 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Join the waitlist</a>
              <a href={INQUIRY} className="rounded-full border border-sky-light/40 px-8 py-4 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">Start a conversation</a>
              <a href="/" className="rounded-full border border-sky-light/20 px-8 py-4 text-sm font-semibold text-sky-light/80 transition-colors hover:border-wheat hover:text-wheat-light">Back to Cloud Control</a>
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
      <elevenlabs-convai agent-id={VERN_AGENT_ID}></elevenlabs-convai>
    </main>
  );
}
