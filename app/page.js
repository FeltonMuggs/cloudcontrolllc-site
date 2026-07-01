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

/* ---------------- nav ---------------- */
const LINKS = [
  { label: 'Approach', href: '#approach' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'BMM Certified', href: '#bmm' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];
const PROJECT_LINKS = [{ label: 'DNaI', href: '/dnai' }];
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
        <a href="#top" onClick={(e) => go(e, '#top')} className="flex items-center gap-3">
          <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto" />
          <span className="font-serif text-lg font-semibold text-cream leading-none">Cloud Control <span className="text-sky-light">LLC</span></span>
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">{l.label}</a>
          ))}
          <span className="h-4 w-[1px] bg-white/15" aria-hidden="true" />
          {PROJECT_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="flex items-center gap-1.5 text-sm font-medium text-field transition-colors hover:text-field-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-field" />
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#contact" onClick={(e) => go(e, '#contact')} className="rounded-full bg-wheat px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Request a BMM Assessment</a>
      </div>
    </header>
  );
}

/* ---------------- hero canvas: data constellation ---------------- */
function HeroCanvas() {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const NODE_COUNT = 86;
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const base = { x: (Math.random() * 2 - 1) * 1.18, y: (Math.random() * 2 - 1) * 0.95, z: (Math.random() * 2 - 1) * 1.18 };
      const roll = Math.random();
      const color = roll > 0.86 ? [216, 169, 63] : roll > 0.72 ? [94, 160, 73] : [134, 186, 224];
      nodes.push({ base, rise: 0.08 + (base.y + 1) * 0.42, twinkle: Math.random() * Math.PI * 2, color });
    }
    const edges = [];
    for (let i = 0; i < NODE_COUNT; i++)
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const a = nodes[i].base, b = nodes[j].base;
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < 0.72) edges.push([i, j, d]);
      }
    const resize = () => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const onPointer = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    const project = (x, y, z, ay, ax) => {
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      let dx = x * cosY - z * sinY, dz = x * sinY + z * cosY;
      const cosX = Math.cos(ax), sinX = Math.sin(ax);
      const dy = y * cosX - dz * sinX; dz = y * sinX + dz * cosX;
      const fov = 3.2, scale = fov / (fov + dz), minDim = Math.min(width, height), reach = minDim * 0.4;
      return { sx: width / 2 + dx * reach * scale, sy: height * 0.46 + dy * reach * scale, scale, depth: dz };
    };
    let raf, t = 0;
    const draw = () => {
      t += reduced ? 0 : 0.0028;
      const p = progressRef.current;
      const assembly = gsap.parseEase('power2.out')(Math.min(1, p / 0.55));
      const fade = 1 - gsap.parseEase('power1.in')(Math.min(1, Math.max(0, (p - 0.15) / 0.85))) * 0.85;
      const ay = t * 0.55 + p * Math.PI * 0.8 + pointerRef.current.x * 0.25;
      const ax = -0.18 + pointerRef.current.y * 0.1;
      ctx.clearRect(0, 0, width, height);
      const pts = nodes.map((n) => {
        const groundY = -1.6;
        const y = groundY + (n.base.y - groundY) * gsap.parseEase('power3.out')(Math.min(1, assembly * (0.55 + n.rise)));
        return project(n.base.x, y, n.base.z, ay, ax);
      });
      for (let k = 0; k < edges.length; k++) {
        const [i, j, d] = edges[k]; const a = pts[i], b = pts[j];
        const depth = (a.depth + b.depth) / 2;
        const alpha = Math.max(0, 1 - (depth + 1.4) / 2.8) * (1 - d / 0.72) * 0.42 * fade * assembly;
        if (alpha < 0.01) continue;
        ctx.strokeStyle = `rgba(120, 170, 214, ${alpha})`;
        ctx.lineWidth = 0.6 * a.scale; ctx.beginPath();
        ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], n = nodes[i];
        const depthAlpha = Math.max(0.12, 1 - (a.depth + 1.4) / 2.8);
        const tw = reduced ? 1 : 0.72 + Math.sin(t * 2 + n.twinkle) * 0.28;
        const r = Math.max(0.7, 2.3 * a.scale) * (0.7 + assembly * 0.3);
        ctx.fillStyle = `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${depthAlpha * fade * tw})`;
        ctx.beginPath(); ctx.arc(a.sx, a.sy, r, 0, Math.PI * 2); ctx.fill();
      }
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

/* ---------------- content data ---------------- */
const THREAD = [
  { k: '01', title: 'From static documents to structured assets', body: 'We transition fragmented construction records from human-readable PDFs into machine-readable datasets designed for the digital age.' },
  { k: '02', title: 'Value engineering through digital twins', body: 'Your digital replica lets teams assess, manipulate, and optimize buildings and infrastructure to uncover efficiencies and reduce operational risk.' },
  { k: '03', title: 'An auditable, immutable trust layer', body: 'We integrate IoT and sensor data with blockchain ledgers to ensure maintenance and performance records are tamper-evident and permanent.' },
  { k: '04', title: 'Finance & tokenization readiness', body: 'Clean digital outputs transform physical assets into finance-ready records — reducing the friction of capital and grant qualification.' },
  { k: '05', title: 'Validated by the GBA Blockchain Maturity Model', body: 'Every engagement maps to the Government Blockchain Association BMM — the only government-recognized assurance and readiness standard.' },
];
const CAPABILITIES = [
  { t: 'Blockchain digital ledgers', b: 'Immutable project, asset, and compliance records that stand up to audit across the full lifecycle.' },
  { t: 'IoT & sensor ingestion', b: 'Real-time monitoring of the built and natural environment, anchored to a verifiable source of truth.' },
  { t: 'Digital provenance', b: 'Materials, retrofits, maintenance, and energy performance — traceable from origin to operation.' },
  { t: 'Lifecycle governance', b: 'Frameworks aligned to government acquisition and regulatory standards, planning through operations.' },
];
const SERVICES = ['BMM Assessments', 'Digital Asset Roadmapping', 'IoT-to-Ledger Integration', 'Material & Performance Provenance', 'Compliance Data Integrity', 'Grant & Funding Readiness', 'Lifecycle Analytics Dashboards'];

export default function Home() {
  useSmoothScroll();
  return (
    <main id="top" className="relative bg-navy-deep">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy-900 via-navy-deep to-navy">
        <HeroCanvas />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(90,155,212,0.22),transparent_70%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-8xl flex-col justify-center px-6 md:px-10">
          <div className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-sky/30 bg-navy-900/40 px-4 py-2 text-xs font-medium tracking-wide text-sky-light backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-wheat" />
            GBA &middot; Blockchain Maturity Model Certified
          </div>
          <h1 className="font-serif max-w-5xl text-[12.5vw] font-semibold leading-[0.95] tracking-tight text-cream sm:text-[9vw] md:text-[6.6vw]">
            Verifiable infrastructure,<br />
            <span className="text-sky-light">rooted in the </span><span className="italic text-wheat-light">real world.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-sky-light/85 md:text-xl">
            Cloud Control turns fragmented construction and infrastructure data into a verifiable Golden Thread &mdash; innovation aligned with Mother Nature, from concrete to code.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Request a BMM Assessment</a>
            <a href="#approach" className="rounded-full border border-sky-light/40 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">See how it works</a>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 z-[5] leading-[0]" aria-hidden="true">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="block w-full h-[26vh]">
            <path d="M0,140 C260,80 520,170 760,140 C1000,110 1240,60 1440,120 L1440,220 L0,220 Z" fill="#3c7a31" opacity="0.45" />
            <path d="M0,176 C300,120 560,200 820,172 C1080,144 1280,170 1440,150 L1440,220 L0,220 Z" fill="#11314f" />
          </svg>
        </div>
      </section>

      {/* ===== FROM CONCRETE TO CODE ===== */}
      <section className="relative bg-navy px-6 pb-24 pt-16 md:px-10 md:pb-32">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-wheat">From concrete to code</p>
            <h2 className="font-serif text-3xl font-medium leading-[1.15] text-cream md:text-5xl">
              We convert the physical world into a <span className="text-sky-light">Golden Thread</span> of structured, auditable data &mdash; so every asset can be trusted, valued, and financed.
            </h2>
          </Reveal>
        </div>
      </section>
      <Hills from="bg-navy" to="fill-cream" />

      {/* ===== APPROACH / GOLDEN THREAD ===== */}
      <section id="approach" className="relative bg-cream px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-field-deep">The Golden Thread</p>
            <h2 className="font-serif max-w-3xl text-4xl font-medium leading-[1.08] text-ink md:text-6xl">Value engineering the digital asset.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">A clear, phased path that takes an asset from fragmented paperwork to a finance-ready, blockchain-verified digital twin.</p>
          </Reveal>
          <div className="relative mt-16">
            <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-wheat via-wheat/60 to-field md:left-[31px]" aria-hidden="true" />
            <Reveal stagger className="space-y-8">
              {THREAD.map((s) => (
                <div key={s.k} className="relative flex gap-6 md:gap-8">
                  <div className="relative z-10 grid h-14 w-14 flex-none place-items-center rounded-2xl bg-navy text-cream shadow-lg shadow-navy/20 ring-4 ring-cream">
                    <span className="font-serif text-lg font-semibold text-wheat-light">{s.k}</span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-xl font-semibold text-ink md:text-2xl">{s.title}</h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
      <Hills from="bg-cream" to="fill-navy-deep" />

      {/* ===== CAPABILITIES ===== */}
      <section id="capabilities" className="relative grain bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Assess &middot; Build &middot; Scale</p>
            <h2 className="font-serif max-w-3xl text-4xl font-medium leading-[1.08] text-cream md:text-6xl">Built for the real-world asset economy.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">Blockchain solution assessment and development through digital asset program management for construction, infrastructure, and real-world assets.</p>
          </Reveal>
          <Reveal stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <div key={c.t} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 transition-colors hover:border-wheat/40 md:p-9">
                <div className="mb-5 h-10 w-10 rounded-xl bg-gradient-to-br from-sky to-field-deep opacity-90" />
                <h3 className="text-xl font-semibold text-cream md:text-2xl">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-sky-light/75">{c.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== BMM CERTIFIED ===== */}
      <section id="bmm" className="relative bg-navy px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">GBA Certified</p>
            <h2 className="font-serif text-4xl font-medium leading-[1.08] text-cream md:text-5xl">The only government-recognized blockchain readiness framework.</h2>
            <p className="mt-6 text-lg leading-relaxed text-sky-light/80">Cloud Control LLC holds a Certificate of the Government Blockchain Association&apos;s Blockchain Maturity Model &mdash; a standardized quality-assurance and risk-reduction roadmap for the public sector and regulated industries.</p>
            <p className="mt-5 text-lg leading-relaxed text-sky-light/80">Competitors provide technology tools. Cloud Control provides certified governance readiness.</p>
          </Reveal>
          <Reveal stagger className="space-y-3">
            {['Assess the digital maturity of construction and infrastructure assets', 'Identify gaps in data integrity, cybersecurity, compliance, and performance', 'Develop a clear, phased roadmap to peak digital-asset performance', 'Align programs with grant, utility, and federal funding requirements'].map((line) => (
              <div key={line} className="flex items-start gap-4 rounded-xl border border-white/10 bg-navy-deep/60 p-5">
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-wheat/15 ring-1 ring-wheat/40">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-wheat" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="leading-relaxed text-cream">{line}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <Hills from="bg-navy" to="fill-field-deep" />

      {/* ===== NATURE + INNOVATION BAND ===== */}
      <section className="relative overflow-hidden bg-field-deep px-6 py-24 md:px-10 md:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0,300 C360,220 720,360 1080,280 C1260,240 1380,300 1440,270 L1440,400 L0,400 Z" fill="#2c5a24" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <img src="/logo.png" alt="" className="mx-auto h-20 w-auto drop-shadow-xl" aria-hidden="true" />
            <h2 className="font-serif mt-7 text-3xl font-medium leading-[1.15] text-cream md:text-5xl">Innovation aligned with Mother Nature.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">By anchoring digital records to physical and natural assets, we enable verifiable delivery, long-term accountability, and defensible reporting &mdash; for the built environment and the land it stands on.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-2.5">
              {SERVICES.map((s) => (<span key={s} className="rounded-full border border-cream/25 bg-cream/10 px-4 py-2 text-sm text-cream">{s}</span>))}
            </div>
          </Reveal>
        </div>
      </section>
      <Hills from="bg-field-deep" to="fill-navy-deep" />

      {/* ===== PROJECTS ===== */}
      <section id="projects" className="relative bg-navy-deep px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-wheat">Projects</p>
            <h2 className="font-serif max-w-3xl text-4xl font-medium leading-[1.08] text-cream md:text-6xl">
              Building the sovereign data economy.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-light/80">
              Cloud Control LLC applies its blockchain and data-integrity expertise beyond the built environment — extending sovereign digital infrastructure to every domain where provenance, ownership, and consent matter.
            </p>
          </Reveal>
          <Reveal y={32}>
            <a href="/dnai" className="group relative mt-14 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent transition-colors hover:border-field/50 md:flex-row">
              {/* DNA visual accent */}
              <div className="relative flex h-48 w-full flex-none items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 to-navy md:h-auto md:w-72 md:rounded-l-3xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(94,160,73,0.22),transparent_80%)]" />
                {/* stylised double helix glyph */}
                <svg viewBox="0 0 80 120" className="h-28 w-auto opacity-80 md:h-36" aria-hidden="true">
                  <defs>
                    <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5a9bd4" />
                      <stop offset="100%" stopColor="#d8a93f" />
                    </linearGradient>
                    <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d8a93f" />
                      <stop offset="100%" stopColor="#5a9bd4" />
                    </linearGradient>
                  </defs>
                  {/* strand 1 */}
                  <path d="M40,0 C60,15 20,30 40,45 C60,60 20,75 40,90 C60,105 20,118 40,120" fill="none" stroke="url(#s1)" strokeWidth="3" strokeLinecap="round" />
                  {/* strand 2 */}
                  <path d="M40,0 C20,15 60,30 40,45 C20,60 60,75 40,90 C20,105 60,118 40,120" fill="none" stroke="url(#s2)" strokeWidth="3" strokeLinecap="round" />
                  {/* rungs */}
                  {[11, 22.5, 34, 45, 56.5, 68, 79.5, 91, 108].map((y, i) => (
                    <line key={i} x1="22" y1={y} x2="58" y2={y} stroke="#5ea049" strokeWidth="1.8" strokeOpacity="0.7" />
                  ))}
                </svg>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-field/50 bg-field/15 px-3 py-1.5 text-[10px] font-semibold tracking-widest text-field uppercase md:bottom-5 md:left-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-field" style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
                  In Development
                </div>
              </div>
              {/* text */}
              <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-field">Project DNaI</p>
                <h3 className="font-serif mt-3 text-3xl font-semibold leading-tight text-cream md:text-4xl">
                  Genomic Sovereign Token
                </h3>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-sky-light/80">
                  DNaI transforms every human&rsquo;s genetic code into a verifiable, ownable digital asset — with on-chain consent, automatic royalties, and zero-knowledge privacy. Your DNA. Your data. Your sovereignty.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-field transition-colors group-hover:text-field-deep">
                  Explore DNaI
                  <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </a>
          </Reveal>
        </div>
      </section>
      <Hills from="bg-navy-deep" to="fill-navy-900" />

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative bg-navy-900 px-6 py-28 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-serif text-4xl font-semibold leading-[1.05] text-cream md:text-6xl">Move beyond documents.<br /><span className="italic text-wheat-light">Toward verifiable value.</span></h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sky-light/80">Reduce risk, unlock funding, and ensure infrastructure investments deliver measurable, auditable, long-term value.</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:everett@cloudcontrolllc.com?subject=BMM%20Assessment%20Inquiry" className="rounded-full bg-wheat px-8 py-4 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Start a conversation</a>
              <a href="tel:2029618805" className="rounded-full border border-sky-light/40 px-8 py-4 text-sm font-semibold text-cream transition-colors hover:border-wheat hover:text-wheat-light">(202) 961-8805</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
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
