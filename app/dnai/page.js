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

/* ---------------- organic hill divider ---------------- */
function Hills({ from, to, flip = false }) {
  return (
    <div className={`relative ${from} leading-[0]`} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={`block w-full h-[70px] md:h-[110px] ${flip ? 'rotate-180' : ''}`}>
        <path d="M0,64 C240,110 480,20 720,48 C960,76 1200,118 1440,72 L1440,120 L0,120 Z" className={to} />
      </svg>
    </div>
  );
}

/* ---------------- DNA double helix canvas ---------------- */
function DNACanvas() {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onPointer = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let raf, t = 0;
    const RUNGS = 28;

    const draw = () => {
      t += reduced ? 0 : 0.022;
      const p = progressRef.current;
      const assembly = gsap.parseEase('power2.out')(Math.min(1, p / 0.6));
      const fade = 1 - gsap.parseEase('power1.in')(Math.min(1, Math.max(0, (p - 0.18) / 0.82))) * 0.82;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5 + pointerRef.current.x * 12;
      const amplitude = Math.min(width * 0.16, 100) * (0.4 + assembly * 0.6);
      const helixH = height * 0.75;
      const startY = height * 0.125;
      const tiltX = pointerRef.current.x * 0.15;
      const spacing = helixH / RUNGS;

      // Draw base pair rungs (behind strands)
      for (let i = 0; i < RUNGS; i++) {
        const progress = i / (RUNGS - 1);
        const y = startY + progress * helixH;
        const phase = t + progress * Math.PI * 3.5 + tiltX;
        const x1 = cx + Math.cos(phase) * amplitude;
        const x2 = cx + Math.cos(phase + Math.PI) * amplitude;
        const depth = Math.sin(phase);
        const alpha = (0.12 + (depth + 1) * 0.22) * fade;

        const grad = ctx.createLinearGradient(x1, y, x2, y);
        grad.addColorStop(0, `rgba(90, 155, 212, ${alpha * 1.2})`);
        grad.addColorStop(0.35, `rgba(94, 160, 73, ${alpha * 1.8})`);
        grad.addColorStop(0.65, `rgba(94, 160, 73, ${alpha * 1.8})`);
        grad.addColorStop(1, `rgba(216, 169, 63, ${alpha * 1.2})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Nucleotide dots on each end
        const dotA = Math.max(0.25, (depth + 1) * 0.5) * fade;
        ctx.fillStyle = `rgba(90, 155, 212, ${dotA})`;
        ctx.beginPath(); ctx.arc(x1, y, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(216, 169, 63, ${dotA})`;
        ctx.beginPath(); ctx.arc(x2, y, 3.2, 0, Math.PI * 2); ctx.fill();
      }

      // Draw the two helical strands
      for (let strand = 0; strand < 2; strand++) {
        const phaseShift = strand * Math.PI;
        const color = strand === 0 ? '90, 155, 212' : '216, 169, 63';
        ctx.beginPath();
        const steps = RUNGS * 6;
        for (let i = 0; i <= steps; i++) {
          const progress = i / steps;
          const y = startY + progress * helixH;
          const phase = t + progress * Math.PI * 3.5 + phaseShift + tiltX;
          const x = cx + Math.cos(phase) * amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${color}, ${0.9 * fade})`;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Glow overlay along center axis
      const glowGrad = ctx.createLinearGradient(cx, startY, cx, startY + helixH);
      glowGrad.addColorStop(0, 'rgba(94, 160, 73, 0)');
      glowGrad.addColorStop(0.5, `rgba(94, 160, 73, ${0.06 * fade})`);
      glowGrad.addColorStop(1, 'rgba(94, 160, 73, 0)');
      ctx.strokeStyle = glowGrad;
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(cx, startY);
      ctx.lineTo(cx, startY + helixH);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: document.documentElement, start: 'top top', end: () => `+=${window.innerHeight * 2}`,
      scrub: true, onUpdate: (self) => { progressRef.current = self.progress; },
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      st.kill();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full" />;
}

/* ---------------- nav ---------------- */
const NAV_LINKS = [
  { label: 'Mission', href: '#mission' },
  { label: 'How It Works', href: '#how' },
  { label: 'Demo', href: '#demo' },
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
          <span className="flex items-center gap-2 rounded-full border border-field/50 bg-field/15 px-3.5 py-1.5 text-xs font-semibold text-field tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-field" style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
            DNaI
          </span>
        </div>
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">{l.label}</a>
          ))}
        </nav>
        <a href="#contact" onClick={(e) => go(e, '#contact')} className="rounded-full bg-field px-5 py-2.5 text-sm font-semibold text-cream shadow-lg shadow-field/25 transition-transform hover:scale-[1.04] hover:bg-field-deep active:scale-95">
          Join Waitlist
        </a>
      </div>
    </header>
  );
}

/* ---------------- content data ---------------- */
const HOW_STEPS = [
  {
    k: '01', title: 'Sequence & Vault',
    body: 'Your genomic data is encrypted client-side and stored in a sovereign personal data vault — a zero-knowledge container that only you can authorize access to.',
  },
  {
    k: '02', title: 'Tokenize Sovereignty',
    body: 'A unique DNaI token is minted on-chain as immutable, verifiable proof that you hold exclusive sovereign rights over your genetic code. One genome, one token.',
  },
  {
    k: '03', title: 'Authorize & Earn',
    body: 'Choose who accesses your data — research institutions, pharma companies, personalized medicine platforms — and receive royalties automatically for every authorized use.',
  },
  {
    k: '04', title: 'Govern the Future',
    body: 'DNaI holders vote on data usage policies, research ethics, token issuance, and the standards governing the global genomic data economy.',
  },
];

const APPLICATIONS = [
  { t: 'Pharmaceutical Research', b: 'Pharma companies pay DNaI holders directly for consented access to genomic datasets — eliminating exploitative data brokers and intermediaries.' },
  { t: 'Personalized Medicine', b: 'Enable healthcare providers to access your verified genomic profile with your consent for precision diagnostics and individualized treatment.' },
  { t: 'Clinical Trials', b: 'Streamline trial recruitment and compensate participants fairly through smart contract-governed, fully auditable access agreements.' },
  { t: 'AI & Genomic Models', b: 'AI companies building genomic foundation models must obtain consent and compensate DNaI holders — ending unauthorized training data harvesting.' },
  { t: 'Ancestry & Heritage', b: 'Verifiable genomic identity anchored to a sovereign on-chain record — your lineage, your heritage, recognized as a digital asset.' },
  { t: 'Insurance & Risk', b: 'Consent-gated genomic risk assessment with tamper-evident audit trails protecting individual rights throughout every data interaction.' },
];

const TOKEN_FEATURES = [
  { label: 'Sovereign Ownership', desc: 'One DNaI per verified human genome — non-fungible proof of biological sovereignty recorded on an immutable ledger.' },
  { label: 'Access Royalties', desc: 'Smart contracts distribute earnings automatically every time an authorized party accesses your genomic data.' },
  { label: 'On-Chain Consent', desc: 'Every access event is immutably recorded on-chain. Full transparency. Full auditability. Full control.' },
  { label: 'Governance Rights', desc: 'Token holders vote on platform policy, research ethics standards, and protocol upgrades through a decentralized DAO.' },
  { label: 'Privacy by Default', desc: 'Zero-knowledge proofs enable data utility for researchers without ever exposing raw genomic sequences.' },
  { label: 'Interoperable', desc: 'DNaI integrates with EHR systems, research platforms, and existing healthcare infrastructure across jurisdictions.' },
];

const ROADMAP = [
  {
    phase: 'Phase I', title: 'Foundation',
    items: ['Genomic vault architecture', 'DNaI token standard development', 'Regulatory engagement & legal framework', 'Pilot partner selection'],
  },
  {
    phase: 'Phase II', title: 'Proof of Sovereignty',
    items: ['Closed beta — first 1,000 genomes vaulted', 'On-chain consent layer live', 'First pharmaceutical data-access agreements', 'DNaI token genesis event'],
  },
  {
    phase: 'Phase III', title: 'Open Network',
    items: ['Public mainnet launch', 'EHR & research platform integrations', 'Global expansion — 50+ jurisdictions', 'Governance DAO activation'],
  },
  {
    phase: 'Phase IV', title: 'The Genomic Economy',
    items: ['Universal genomic identity standard', 'Multi-omics support (proteomics, epigenomics)', 'AI model licensing marketplace', 'Sovereign genomic data index'],
  },
];

/* ---------------- access gate (owner-approved registration) ---------------- */
function AccessGate({ onGranted }) {
  const [mode, setMode] = useState('register'); // 'register' | 'check'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const grant = (em) => {
    try {
      localStorage.setItem('dnai_access', 'granted');
      if (em) localStorage.setItem('dnai_email', em);
    } catch (e) { /* private mode */ }
    onGranted();
  };

  const checkStatus = async (em, silent) => {
    try {
      const r = await fetch(`/api/register?action=status&email=${encodeURIComponent(em)}`);
      const d = await r.json();
      if (d.status === 'approved') { grant(em); return true; }
      if (!silent) {
        if (d.status === 'pending') setNote('Your request is still awaiting approval. You’ll be able to enter as soon as Everett approves it — check back shortly.');
        else if (d.status === 'denied') setNote('This registration was not approved. Questions? Email everett@cloudcontrolllc.com.');
        else setNote('No registration found for that email — request access below.');
      }
    } catch (e) {
      if (!silent) setNote('Could not reach the server — please try again.');
    }
    return false;
  };

  // Returning visitor: quietly re-check a previously submitted email.
  useEffect(() => {
    let em = '';
    try { em = localStorage.getItem('dnai_email') || ''; } catch (e) { /* noop */ }
    if (em) { setEmail(em); checkStatus(em, true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setNote('');
    setBusy(true);
    if (mode === 'check') {
      await checkStatus(email.trim().toLowerCase(), false);
      setBusy(false);
      return;
    }
    try {
      const r = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), org: org.trim() }),
      });
      const d = await r.json();
      if (d.ok && d.status === 'approved') { grant(email.trim().toLowerCase()); }
      else if (d.ok) {
        try { localStorage.setItem('dnai_email', email.trim().toLowerCase()); } catch (err) { /* noop */ }
        setNote('Request received. Every registration is personally approved — you’ll get an email once you’re in, or check back here with “Already registered?”.');
      } else setNote(d.error || 'Something went wrong — please try again.');
    } catch (err) {
      setNote('Could not reach the server — please try again.');
    }
    setBusy(false);
  };

  const field = 'w-full rounded-xl border border-white/15 bg-navy-900/60 px-4 py-3 text-[15px] text-cream placeholder:text-sky-light/40 outline-none transition-colors focus:border-field';

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-navy-deep/80 px-4 py-8 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-field/30 bg-navy-900/90 p-8 shadow-2xl shadow-black/50 md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto" />
          <div className="leading-tight">
            <p className="font-serif text-lg font-semibold text-cream">Project DNaI</p>
            <p className="text-xs uppercase tracking-[0.25em] text-field">Registered access</p>
          </div>
        </div>
        <h2 className="font-serif text-2xl font-medium leading-snug text-cream">This page is open to registered members.</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-sky-light/75">
          {mode === 'register'
            ? 'Request access below — each registration is personally reviewed and approved.'
            : 'Enter the email you registered with to unlock this device.'}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3.5">
          {mode === 'register' && (
            <>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" className={field} />
              <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organization (optional)" autoComplete="organization" className={field} />
            </>
          )}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" className={field} />
          {/* Honeypot — humans never see or fill this */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" onChange={() => {}} />
          <button type="submit" disabled={busy} className="w-full rounded-full bg-field px-7 py-3.5 text-sm font-semibold text-cream shadow-xl shadow-field/20 transition-transform hover:scale-[1.02] hover:bg-field-deep active:scale-95 disabled:opacity-60">
            {busy ? 'One moment…' : mode === 'register' ? 'Request access' : 'Check my status'}
          </button>
        </form>
        {note && <p className="mt-4 rounded-xl border border-wheat/30 bg-wheat/10 p-3.5 text-sm leading-relaxed text-cream">{note}</p>}
        <button
          type="button"
          onClick={() => { setMode(mode === 'register' ? 'check' : 'register'); setNote(''); }}
          className="mt-5 text-sm font-semibold text-wheat-light underline-offset-4 hover:underline"
        >
          {mode === 'register' ? 'Already registered? Check my status →' : '← Need access? Register here'}
        </button>
        <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-sky-light/50">
          Cloud Control LLC &middot; questions: <a href="mailto:everett@cloudcontrolllc.com" className="text-sky-light/80 hover:text-cream">everett@cloudcontrolllc.com</a>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export default function DNaIPage() {
  const [granted, setGranted] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setGranted(localStorage.getItem('dnai_access') === 'granted'); } catch (e) { /* noop */ }
    setReady(true);
  }, []);
  return (
    <>
      {ready && !granted && <AccessGate onGranted={() => setGranted(true)} />}
      <DNaIContent />
    </>
  );
}

function DNaIContent() {
  useSmoothScroll();
  return (
    <main id="top" className="relative bg-navy-deep">

      <Nav />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy-900 via-navy-deep to-navy">
        <DNACanvas />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(94,160,73,0.18),transparent_70%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-8xl flex-col justify-center px-6 md:px-10">
          <div className="mb-7 inline-flex w-fit flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-wheat/40 bg-navy-900/40 px-4 py-2 text-xs font-medium tracking-wide backdrop-blur-sm">
            <span className="inline-flex items-center gap-2 text-field">
              <span className="h-1.5 w-1.5 rounded-full bg-field" />
              Cloud Control LLC &middot; Project DNaI
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-2 text-wheat-light">
              <span aria-hidden="true">&#127942;</span>
              Built for Flare Summer Signal &middot; Confidential Compute Apps (FTSOv2 + FDC)
            </span>
          </div>
          <h1 className="font-serif max-w-5xl text-[12.5vw] font-semibold leading-[0.95] tracking-tight text-cream sm:text-[9vw] md:text-[6.6vw]">
            Your genome<br />
            <span className="text-field">is an asset.</span><br />
            <span className="italic text-wheat-light">You should own it.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-sky-light/85 md:text-xl">
            DNaI is the genomic sovereign token &mdash; a blockchain-native instrument that transforms every human&rsquo;s genetic code into a verifiable, ownable, and monetizable digital asset. Your DNA. Your data. Your sovereignty.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#demo" className="rounded-full bg-field px-7 py-3.5 text-sm font-semibold text-cream shadow-xl shadow-field/20 transition-transform hover:scale-[1.04] hover:bg-field-deep active:scale-95">
              Try the Wallet Demo
            </a>
            <a href="#contact" className="rounded-full border border-sky-light/40 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">
              Join the Waitlist
            </a>
          </div>
          <p className="mt-4 text-xs text-sky-light/50">Runs on Flare&rsquo;s Coston2 testnet with simulated data.</p>
          <div className="mt-16 flex flex-wrap gap-8 md:gap-14">
            {[
              { label: 'Genomic Assets', value: '8B+' },
              { label: 'Data Brokers Eliminated', value: '100%' },
              { label: 'Sovereign By Design', value: 'Always' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl font-semibold text-wheat-light md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-sky-light/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 z-[5] leading-[0]" aria-hidden="true">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="block w-full h-[26vh]">
            <path d="M0,140 C260,80 520,170 760,140 C1000,110 1240,60 1440,120 L1440,220 L0,220 Z" fill="#5ea049" opacity="0.35" />
            <path d="M0,176 C300,120 560,200 820,172 C1080,144 1280,170 1440,150 L1440,220 L0,220 Z" fill="#11314f" />
          </svg>
        </div>
      </section>

      {/* ===== OVERVIEW / WHAT IS DNaI ===== */}
      <section id="mission" className="relative bg-navy px-6 pb-24 pt-16 md:px-10 md:pb-32">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-field">What is DNaI</p>
            <h2 className="font-serif text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              A <span className="text-wheat-light">genomic sovereign token</span> for every human on Earth. The first blockchain instrument designed to make your genetic code a recognized, auditable, and compensated digital asset.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-sky-light/80">
              Today, genomics companies, research institutions, and data brokers extract enormous value from your DNA — without your meaningful consent and without compensating you. DNaI reverses the equation: through on-chain tokenization, zero-knowledge proofs, and smart contract-governed access, every human being can assert sovereign ownership over their most intimate data and participate in the value it creates.
            </p>
          </Reveal>
        </div>
      </section>
      <Hills from="bg-navy" to="fill-cream" />

      {/* ===== THE PROBLEM ===== */}
      <section className="relative bg-cream px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-start">
            <Reveal>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-field-deep">The Problem</p>
              <h2 className="font-serif text-4xl font-medium leading-[1.08] text-ink md:text-5xl">
                Your DNA is worth billions. You receive nothing.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                The global genomics market is projected to exceed $62 billion by 2028. The raw material driving that growth is human genetic data — collected through consumer ancestry tests, hospital systems, and research studies, then sold, licensed, and leveraged for pharmaceutical development, insurance risk modeling, and AI training.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                The individuals whose genomes power this economy are invisible stakeholders. They sign away rights in dense legal agreements, receive no ongoing royalties, and have no mechanism to revoke access or audit who holds their most sensitive biological data.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft font-semibold text-ink">
                DNaI exists to change that — permanently and provably.
              </p>
            </Reveal>
            <Reveal stagger className="space-y-4">
              {[
                { stat: '$62B+', detail: 'Genomics market value by 2028 — built on your data.' },
                { stat: '0%', detail: 'Share of that value returned to the individuals whose genomes power it.' },
                { stat: '500M+', detail: 'Human genomes already held by private databases with no reversion rights.' },
                { stat: '0', detail: 'Blockchain-verified consent mechanisms in mainstream genomics today.' },
              ].map((item) => (
                <div key={item.stat} className="rounded-2xl border border-ink/10 bg-navy/5 p-6">
                  <p className="font-serif text-4xl font-semibold text-field-deep">{item.stat}</p>
                  <p className="mt-2 leading-relaxed text-ink-soft">{item.detail}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
      <Hills from="bg-cream" to="fill-navy-deep" />

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-field">How DNaI Works</p>
            <h2 className="font-serif max-w-3xl text-4xl font-medium leading-[1.08] text-cream md:text-6xl">
              From genome to sovereign digital asset.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">
              A clear, cryptographically verifiable path from biological sequence to blockchain-anchored ownership and ongoing economic participation.
            </p>
          </Reveal>
          <div className="relative mt-16">
            <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-field via-field/60 to-wheat md:left-[31px]" aria-hidden="true" />
            <Reveal stagger className="space-y-8">
              {HOW_STEPS.map((s) => (
                <div key={s.k} className="relative flex gap-6 md:gap-8">
                  <div className="relative z-10 grid h-14 w-14 flex-none place-items-center rounded-2xl bg-navy text-cream shadow-lg shadow-navy/20 ring-4 ring-navy-deep">
                    <span className="font-serif text-lg font-semibold text-field">{s.k}</span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-xl font-semibold text-cream md:text-2xl">{s.title}</h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-sky-light/75">{s.body}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== VIDEO ===== */}
      <section id="demo" className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-field text-center">The demo</p>
            <h2 className="font-serif text-center text-4xl font-medium leading-[1.08] text-cream md:text-5xl">
              Medical AI without exposing<br />
              <span className="italic text-wheat-light">your DNA.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-sky-light/80">
              See why genomic privacy and AI-powered medicine don&rsquo;t have to be in conflict — and how DNaI makes both possible.
            </p>
          </Reveal>
          <Reveal y={32}>
            <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-wheat/30 bg-wheat/[0.06] p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat-light">Try it live &middot; interactive</p>
                <h3 className="mt-2 font-serif text-2xl font-medium text-cream">The Sovereign Genomic Wallet</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-sky-light/80">
                  Switch between owner and researcher, request access to a segment, sign under 2-of-3 multisig custody, and revoke a live grant &mdash; end to end, on Flare&rsquo;s Coston2 testnet with simulated data.
                </p>
              </div>
              <a href="/dnai-wallet-demo/index.html" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-wheat px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-wheat-light">
                Launch interactive demo &rarr;
              </a>
            </div>
          </Reveal>
          <Reveal y={32}>
            <div className="relative mt-12 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40"
                 style={{ paddingTop: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/Ujlripeho2Q"
                title="DNaI demo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-sky-light/50">
              Coston2 testnet &middot; simulated data &middot; no real genome is used
            </p>
          </Reveal>
        </div>
      </section>
      <Hills from="bg-navy-deep" to="fill-navy" />

      {/* ===== APPLICATIONS ===== */}
      <section className="relative grain bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Applications</p>
            <h2 className="font-serif max-w-3xl text-4xl font-medium leading-[1.08] text-cream md:text-6xl">
              The sovereign genomic economy.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">
              DNaI unlocks a new layer of the bioeconomy — one where individuals participate as recognized stakeholders across every sector that touches their genetic data.
            </p>
          </Reveal>
          <Reveal stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {APPLICATIONS.map((c) => (
              <div key={c.t} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 transition-colors hover:border-field/40 md:p-9">
                <div className="mb-5 h-10 w-10 rounded-xl bg-gradient-to-br from-field to-field-deep opacity-90" />
                <h3 className="text-xl font-semibold text-cream md:text-2xl">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/75">{c.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <Hills from="bg-navy" to="fill-navy-900" />

      <section id="contact" className="relative bg-navy-900 px-6 py-28 md:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-15" aria-hidden="true">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0,300 C360,220 720,360 1080,280 C1260,240 1380,300 1440,270 L1440,400 L0,400 Z" fill="#3c7a31" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <img src="/logo.png" alt="" className="mx-auto h-20 w-auto drop-shadow-xl opacity-90" aria-hidden="true" />
            <h2 className="font-serif mt-7 text-4xl font-semibold leading-[1.05] text-cream md:text-6xl">
              Claim your genomic sovereignty.<br /><span className="italic text-wheat-light">Before someone else does.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sky-light/80">
              DNaI is in active development. Subscribe for early access, token-design and roadmap updates, an invitation to the genesis token event, and a say in the policies governing the world&rsquo;s first sovereign genomic economy.
            </p>
            <div className="mt-14 grid gap-6 text-left md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-navy-deep/50 p-7">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat-light">What the token carries</p>
                <ul className="mt-5 space-y-3">
                  {TOKEN_FEATURES.map((f) => (
                    <li key={f.label} className="text-sm leading-relaxed text-sky-light/75">
                      <span className="font-semibold text-cream">{f.label}</span> &mdash; {f.desc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-navy-deep/50 p-7">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-wheat-light">Where it&rsquo;s going</p>
                <ol className="mt-5 space-y-4">
                  {ROADMAP.map((r) => (
                    <li key={r.phase} className="text-sm leading-relaxed text-sky-light/75">
                      <span className="font-mono text-xs text-field">{r.phase}</span>{' '}
                      <span className="font-semibold text-cream">{r.title}</span>
                      <span className="mt-1 block text-sky-light/55">{r.items.join(' \u00b7 ')}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:everett@cloudcontrolllc.com?subject=DNaI%20Waitlist%20Inquiry" className="rounded-full bg-field px-8 py-4 text-sm font-semibold text-cream shadow-xl shadow-field/20 transition-transform hover:scale-[1.04] hover:bg-field-deep active:scale-95">
                Join the DNaI Waitlist
              </a>
              <a href="#contact" className="rounded-full bg-wheat px-8 py-4 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Join the wallet waitlist</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="https://www.linkedin.com/in/everettjaymorton" target="_blank" rel="noopener" className="rounded-full border border-sky-light/25 px-5 py-2.5 text-xs font-semibold text-sky-light/80 transition-colors hover:border-wheat hover:text-wheat-light">LinkedIn &mdash; Everett Morton</a>
              <a href="https://www.linkedin.com/company/93807770/" target="_blank" rel="noopener" className="rounded-full border border-sky-light/25 px-5 py-2.5 text-xs font-semibold text-sky-light/80 transition-colors hover:border-wheat hover:text-wheat-light">LinkedIn &mdash; Cloud Control LLC</a>
              <a href="https://www.facebook.com/profile.php?id=61577496382293" target="_blank" rel="noopener" className="rounded-full border border-sky-light/25 px-5 py-2.5 text-xs font-semibold text-sky-light/80 transition-colors hover:border-wheat hover:text-wheat-light">Facebook</a>
              <a href="https://www.youtube.com/@CloudControlLLC" target="_blank" rel="noopener" className="rounded-full border border-sky-light/25 px-5 py-2.5 text-xs font-semibold text-sky-light/80 transition-colors hover:border-wheat hover:text-wheat-light">YouTube</a>
            </div>
            <p className="mt-8 text-sm text-sky-light/50">A Cloud Control LLC project &middot; GBA Blockchain Maturity Model Certified</p>
          </Reveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-navy-900 px-6 pb-12 md:px-10">
        <div className="mx-auto flex max-w-8xl flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto" />
              <span className="text-sm text-sky-light/70">Cloud Control LLC &middot; Colonial Beach, VA</span>
            </a>
            <span className="hidden md:block text-white/20">|</span>
            <span className="hidden md:block text-sm text-field/70 font-medium tracking-wide">DNaI Project</span>
          </div>
          <p className="text-sm text-sky-light/60">&copy; {new Date().getFullYear()} Cloud Control LLC &mdash; All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
