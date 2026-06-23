'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function useSmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js-ready');

            const lenis = new Lenis({
              duration: 1.1,
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


function Reveal({ children, className = '', stagger = false, y = 42 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const targets = stagger ? gsap.utils.toArray(el.children) : [el];
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
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

const LINKS = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'BMM Certified', href: '#bmm' },
  { label: 'Approach', href: '#approach' },
  { label: 'Contact', href: '#contact' },
  ];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    scrolled ? 'bg-base/80 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'
  }`}
>
<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
  <a href="#top" onClick={(e) => go(e, '#top')} className="flex items-center gap-2.5 text-ink">
  <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 ring-1 ring-accent/40">
  <span className="block h-2.5 w-2.5 rounded-sm bg-accent" />
  </span>
<span className="text-sm font-semibold tracking-tight">
  Cloud Control <span className="text-muted">LLC</span>
  </span>
  </a>
<nav className="hidden items-center gap-8 md:flex">
{LINKS.map((l) => (
  <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} className="text-sm text-muted transition-colors hover:text-ink">
  {l.label}
  </a>
           ))}
</nav>
<a href="#contact" onClick={(e) => go(e, '#contact')} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-base transition-transform hover:scale-[1.03] active:scale-95">
  Request a BMM Assessment
  </a>
  </div>
  </header>
);
}

function HeroCanvas() {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d', { alpha: true });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

          const NODE_COUNT = 92;
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const base = {
      x: (Math.random() * 2 - 1) * 1.15,
      y: (Math.random() * 2 - 1) * 1.0,
      z: (Math.random() * 2 - 1) * 1.15,
    };
    nodes.push({ base, rise: 0.08 + (base.y + 1) * 0.42, twinkle: Math.random() * Math.PI * 2 });
  }

          const edges = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const a = nodes[i].base;
      const b = nodes[j].base;
      const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
      if (d < 0.74) edges.push([i, j, d]);
    }
  }

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

          const project = (x, y, z, ay, ax) => {
            const cosY = Math.cos(ay);
            const sinY = Math.sin(ay);
            let dx = x * cosY - z * sinY;
            let dz = x * sinY + z * cosY;
            const cosX = Math.cos(ax);
            const sinX = Math.sin(ax);
            const dy = y * cosX - dz * sinX;
            dz = y * sinX + dz * cosX;
            const fov = 3.2;
            const scale = fov / (fov + dz);
            const minDim = Math.min(width, height);
            const reach = minDim * 0.42;
            return { sx: width / 2 + dx * reach * scale, sy: height / 2 + dy * reach * scale, scale, depth: dz };
          };

          let raf;
  let t = 0;
  const draw = () => {
    t += reduced ? 0 : 0.0032;
    const p = progressRef.current;
    const assembly = gsap.parseEase('power2.out')(Math.min(1, p / 0.55));
    const fade = 1 - gsap.parseEase('power1.in')(Math.min(1, Math.max(0, (p - 0.15) / 0.85))) * 0.82;
    const ay = t * 0.6 + p * Math.PI * 0.9 + pointerRef.current.x * 0.25;
    const ax = -0.22 + pointerRef.current.y * 0.12;

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    const pts = nodes.map((n) => {
      const settle = Math.min(1, Math.max(0, assembly));
      const groundY = -1.65;
      const y = groundY + (n.base.y - groundY) * gsap.parseEase('power3.out')(Math.min(1, settle * (0.55 + n.rise)));
      return project(n.base.x, y, n.base.z, ay, ax);
    });

    for (let k = 0; k < edges.length; k++) {
      const [i, j, d] = edges[k];
      const a = pts[i];
      const b = pts[j];
      const depth = (a.depth + b.depth) / 2;
      const dAlpha = 1 - (depth + 1.4) / 2.8;
      const alpha = Math.max(0, dAlpha) * (1 - d / 0.74) * 0.5 * fade * assembly;
      if (alpha < 0.01) continue;
      ctx.strokeStyle = `rgba(52, 227, 176, ${alpha})`;
      ctx.lineWidth = 0.6 * a.scale;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const depthAlpha = Math.max(0.12, 1 - (a.depth + 1.4) / 2.8);
      const tw = reduced ? 1 : 0.7 + Math.sin(t * 2 + nodes[i].twinkle) * 0.3;
      const r = Math.max(0.6, 2.1 * a.scale) * (0.7 + assembly * 0.3);
      ctx.fillStyle = `rgba(150, 247, 219, ${depthAlpha * fade * tw})`;
      ctx.beginPath();
      ctx.arc(a.sx, a.sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

          gsap.registerPlugin(ScrollTrigger);
  const st = ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: () => `+=${window.innerHeight * 2}`,
    scrub: true,
    onUpdate: (self) => { progressRef.current = self.progress; },
  });

          return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointer);
            st.kill();
          };
}, []);

return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}

const CAPABILITIES = [
  { k: '01', title: 'Blockchain-based digital ledgers', body: 'Immutable project, asset, and compliance records that stand up to audit across the full lifecycle.' },
  { k: '02', title: 'IoT & sensor data ingestion', body: 'Real-time monitoring of built and natural environments, anchored to a verifiable source of truth.' },
  { k: '03', title: 'Digital provenance', body: 'Materials, retrofits, maintenance, and energy performance - traceable from origin to operation.' },
  { k: '04', title: 'Lifecycle governance', body: 'Frameworks aligned to government acquisition and regulatory standards, planning through operations.' },
  ];

const SERVICES = [
  'Blockchain Maturity Model (BMM) Assessments',
  'Digital Asset Roadmapping',
  'IoT-to-Ledger Integration for Built Assets',
  'Material, Retrofit & Performance Provenance',
  'Regulatory & Compliance Data Integrity',
  'Grant & Funding Readiness Enablement',
  'Lifecycle Analytics & Performance Dashboards',
  ];

const APPROACH = [
  { title: 'Relationships', body: 'Active strategic alignment with the Government Blockchain Association - the world\'s leading nonprofit advancing blockchain adoption in government and critical industries.' },
  { title: 'Alignment', body: 'Policy and standards first. Construction, infrastructure, and public-works modernization demand digital compliance and accountability.' },
  { title: 'Built Environment & RWA', body: 'Vertical and horizontal construction, water and environmental infrastructure, energy-efficiency retrofits, and housing and community development.' },
  { title: 'Foundational Awareness', body: 'By anchoring digital records to physical assets, we enable verifiable delivery, long-term accountability, and defensible reporting.' },
  ];

export default function Home() {
  useSmoothScroll();
  return (
    <main id="top" className="relative">
    <HeroCanvas />
    <Nav />

    <section className="relative z-10 flex min-h-screen flex-col justify-center px-6 md:px-10">
    <div className="mx-auto w-full max-w-7xl">
    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-base/40 px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur-sm">
    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
    GBA &middot; Blockchain Maturity Model Certified
    </div>
  <h1 className="max-w-5xl text-[13vw] font-extrabold leading-[0.92] tracking-tightest text-ink sm:text-[10vw] md:text-[7.4vw]">
    Verifiable<br />Infrastructure,<br />
    <span className="text-muted">from the </span>
  <span className="text-accent">ground up.</span>
    </h1>
  <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
    The digital foundation for real infrastructure - GBA-certified blockchain for verifiable trust, compliance, and performance across the built environment.
    </p>
  <div className="mt-10 flex flex-wrap items-center gap-4">
    <a href="#contact" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base transition-transform hover:scale-[1.03] active:scale-95">
    Request a BMM Assessment
    </a>
  <a href="#capabilities" className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/60 hover:text-accent">
    See capabilities
    </a>
    </div>
    </div>
  <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-muted/70">Scroll</div>
    </section>

<div className="relative z-10 h-[40vh] bg-gradient-to-b from-transparent to-base" />

    <section id="capabilities" className="relative z-10 bg-base px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-7xl">
    <Reveal>
    <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">Assess &middot; Build &middot; Scale</p>
  <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">Build with verifiable trust from the ground up.</h2>
  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
    Cloud Control specializes in blockchain solution assessment and development through digital asset program management for construction, infrastructure, and real-world asset (RWA) environments - mature worldwide, implemented with American innovation.
    </p>
    </Reveal>
  <Reveal stagger className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
  {CAPABILITIES.map((c) => (
    <div key={c.k} className="group bg-base p-8 transition-colors hover:bg-surface md:p-10">
  <span className="font-mono text-xs text-accent">{c.k}</span>
<h3 className="mt-4 text-xl font-semibold text-ink md:text-2xl">{c.title}</h3>
<p className="mt-3 leading-relaxed text-muted">{c.body}</p>
  </div>
))}
  </Reveal>
  </div>
  </section>

<section id="bmm" className="relative z-10 border-y border-line bg-surface px-6 py-28 md:px-10 md:py-36">
  <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
  <Reveal>
  <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">GBA Certified</p>
<h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">The only government-recognized blockchain readiness framework.</h2>
<p className="mt-6 text-lg leading-relaxed text-muted">
  Cloud Control LLC holds a Certificate of the Government Blockchain Association\'s Blockchain Maturity Model (BMM) - a standardized quality-assurance and risk-reduction roadmap for the public sector and regulated industries.
  </p>
<p className="mt-5 text-lg leading-relaxed text-muted">Competitors provide technology tools. Cloud Control provides certified governance readiness.</p>
  </Reveal>
<Reveal stagger className="space-y-3">
{[
  'Assess the digital maturity of construction and infrastructure assets',
  'Identify gaps in data integrity, cybersecurity, compliance, and performance',
  'Develop a clear, phased roadmap to peak digital-asset performance',
  'Align programs with grant, utility, and federal funding requirements',
  ].map((line) => (
    <div key={line} className="flex items-start gap-4 rounded-xl border border-line bg-base p-5">
    <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-accent/15 ring-1 ring-accent/40">
    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
    </span>
        <span className="leading-relaxed text-ink">{line}</span>
    </div>
        ))}
  </Reveal>
  </div>
  </section>

<section id="approach" className="relative z-10 bg-base px-6 py-28 md:px-10 md:py-36">
  <div className="mx-auto max-w-7xl">
  <Reveal>
  <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">How we do it</p>
  <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">Defensible digital truth for the built environment.</h2>
  </Reveal>
<Reveal stagger className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
{APPROACH.map((a) => (
  <div key={a.title} className="border-t border-line pt-6">
  <h3 className="text-lg font-semibold text-ink">{a.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a.body}</p>
  </div>
              ))}
</Reveal>
<Reveal className="mt-24">
  <p className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-accent">Key services</p>
<div className="flex flex-wrap gap-3">
{SERVICES.map((s) => (
  <span key={s} className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink">{s}</span>
              ))}
</div>
  </Reveal>
  </div>
  </section>

<section id="contact" className="relative z-10 overflow-hidden border-t border-line bg-surface px-6 py-32 md:px-10">
  <div className="mx-auto max-w-4xl text-center">
  <Reveal>
  <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight text-ink md:text-6xl">
  Move beyond documents.<br /><span className="text-accent">Toward verifiable value.</span>
  </h2>
<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
  Reduce risk, unlock funding, and ensure infrastructure investments deliver measurable, auditable, long-term value.
  </p>
<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
  <a href="mailto:everett@cloudcontrolllc.com?subject=BMM%20Assessment%20Inquiry" className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-base transition-transform hover:scale-[1.03] active:scale-95">
  Start a conversation
  </a>
<a href="tel:2029618805" className="rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent/60 hover:text-accent">
  (202) 961-8805
  </a>
  </div>
  </Reveal>
  </div>
  </section>

<footer className="relative z-10 bg-base px-6 py-12 md:px-10">
  <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
  <div className="flex items-center gap-2.5">
  <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 ring-1 ring-accent/40">
  <span className="block h-2.5 w-2.5 rounded-sm bg-accent" />
  </span>
<span className="text-sm text-muted">Cloud Control LLC &middot; Colonial Beach, VA</span>
  </div>
<p className="text-sm text-muted">&copy; {new Date().getFullYear()} Cloud Control LLC - All Rights Reserved.</p>
  </div>
  </footer>
  </main>
);
}
