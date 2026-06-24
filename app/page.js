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
  { label: 'Contact', href: '#contact' },
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
        <a href="#top" onClick={(e) => go(e, '#top')} className="flex items-center gap-3">
          <img src="/logo.png" alt="Cloud Control LLC" className="h-10 w-auto" />
          <span className="font-serif text-lg font-semibold text-cream leading-none">Cloud Control <span className="text-sky-light">LLC</span></span>
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} className="text-sm font-medium text-sky-light/80 transition-colors hover:text-cream">{l.label}</a>
          ))}
        </nav>
        <a href="#contact" onClick={(e) => go(e, '#contact')} className="rounded-full bg-wheat px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-wheat/20 transition-transform hover:scale-[1.04] active:scale-95">Request a BMM Assessment</a>
      </div>
    </header>
  );
}

/* ---------------- WebGL hero: living landscape that evolves into a digital city ---------------- */
let __threePromise = null;
function loadThree() {
  if (typeof window === 'undefined') return Promise.reject();
  if (window.THREE) return Promise.resolve(window.THREE);
  if (__threePromise) return __threePromise;
  __threePromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.async = true;
    s.onload = () => resolve(window.THREE);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return __threePromise;
}

function glowTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.Texture(c); t.needsUpdate = true; return t;
}
function birdTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); g.clearRect(0, 0, 64, 64);
  g.strokeStyle = 'rgba(233,239,241,0.95)'; g.lineWidth = 4; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(8, 42); g.quadraticCurveTo(22, 22, 32, 36); g.quadraticCurveTo(42, 22, 56, 42); g.stroke();
  const t = new THREE.Texture(c); t.needsUpdate = true; return t;
}
function cloudTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(180,205,232,0.55)'); grd.addColorStop(0.5, 'rgba(150,180,215,0.18)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.Texture(c); t.needsUpdate = true; return t;
}

function initHero(THREE, mount, progressRef, reduced) {
  let width = mount.clientWidth, height = mount.clientHeight;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b2237, 0.05);
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
  camera.position.set(0, 2.2, 9);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0b2237, 1);
  mount.appendChild(renderer.domElement);

  const glow = glowTexture(THREE), bird = birdTexture(THREE), cloud = cloudTexture(THREE);

  // --- terrain ---
  const terrainGeo = new THREE.PlaneGeometry(110, 110, 170, 170);
  const terrainMat = new THREE.ShaderMaterial({
    wireframe: true, transparent: true,
    uniforms: { uTime: { value: 0 } },
    vertexShader:
      'uniform float uTime; varying float vH; varying float vDist;' +
      'float wave(vec2 p){ return sin(p.x*0.32+uTime*0.5)*0.6 + sin(p.y*0.4-uTime*0.36)*0.5 + sin((p.x+p.y)*0.26+uTime*0.28)*0.4; }' +
      'void main(){ vec3 pos=position; float h=wave(position.xy); pos.z+=h; vH=h; vec4 mv=modelViewMatrix*vec4(pos,1.0); vDist=-mv.z; gl_Position=projectionMatrix*mv; }',
    fragmentShader:
      'varying float vH; varying float vDist;' +
      'void main(){ vec3 low=vec3(0.16,0.40,0.60); vec3 mid=vec3(0.34,0.60,0.27); vec3 high=vec3(0.84,0.66,0.26);' +
      'float m=smoothstep(-0.8,1.4,vH); vec3 col=mix(low,mid,smoothstep(0.0,0.55,m)); col=mix(col,high,smoothstep(0.55,1.0,m));' +
      'float fade=clamp(1.0-vDist/34.0,0.0,1.0); float a=(0.30+m*0.42)*fade; gl_FragColor=vec4(col,a); }',
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.rotation.x = -Math.PI / 2; terrain.position.set(0, -2.4, -12);
  scene.add(terrain);

  // --- river (flowing) ---
  const rPts = [];
  for (let i = 0; i <= 44; i++) { const u = i / 44; rPts.push(new THREE.Vector3(7.5 * Math.sin(u * 5.2 + 0.6), -2.5 + Math.sin(u * 9.0) * 0.05, 3 - u * 34)); }
  const riverGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rPts), 160, 0.6, 8, false);
  const riverMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform float uTime; varying vec2 vUv; void main(){ float flow=sin(vUv.y*26.0 - uTime*2.6)*0.5+0.5; float side=smoothstep(0.0,0.45,vUv.x)*smoothstep(1.0,0.55,vUv.x); vec3 c=mix(vec3(0.16,0.42,0.66), vec3(0.62,0.86,1.0), flow*flow); gl_FragColor=vec4(c, (0.30+0.45*flow)*side); }',
  });
  const river = new THREE.Mesh(riverGeo, riverMat); scene.add(river);

  // --- buildings (rise on scroll) + sky twins + link threads ---
  const buildings = [], twins = [];
  const bBoxGeo = new THREE.BoxGeometry(1, 1, 1); bBoxGeo.translate(0, 0.5, 0);
  const bEdgeGeo = new THREE.EdgesGeometry(bBoxGeo);
  const N = 26;
  for (let i = 0; i < N; i++) {
    const bx = (Math.random() * 2 - 1) * 12.5;
    const bz = -2 - Math.random() * 22;
    const bw = 0.55 + Math.random() * 1.0, bd = 0.55 + Math.random() * 1.0;
    const bh = 2.4 + Math.random() * 5.2;
    const gy = -3.2;
    const edgeCol = Math.random() > 0.62 ? 0xe6b84e : 0x74b6e6;
    const mesh = new THREE.Mesh(bBoxGeo, new THREE.MeshStandardMaterial({ color: 0x163a5c, emissive: 0x1a4063, emissiveIntensity: 0.32, metalness: 0.6, roughness: 0.35, transparent: true, opacity: 0.9 }));
    mesh.position.set(bx, gy, bz); mesh.scale.set(bw, 0.02, bd);
    mesh.add(new THREE.LineSegments(bEdgeGeo, new THREE.LineBasicMaterial({ color: edgeCol, transparent: true, opacity: 0.85 })));
    scene.add(mesh);
    buildings.push({ mesh, bw, bd, bh, gy, bx, bz, edgeCol, order: Math.random() });
  }
  const tBoxGeo = new THREE.BoxGeometry(1, 1, 1); tBoxGeo.translate(0, 0.5, 0);
  const tEdgeGeo = new THREE.EdgesGeometry(tBoxGeo);
  const linkPos = [];
  const twinIdx = buildings.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 12);
  twinIdx.forEach((bi) => {
    const b = buildings[bi]; const sk = 0.17;
    const tx = b.bx * 0.55, tz = -7 - Math.random() * 6, ty = 6.6 + Math.random() * 2.4;
    const mesh = new THREE.Mesh(tBoxGeo, new THREE.MeshBasicMaterial({ color: 0x0e2c47, transparent: true, opacity: 0 }));
    mesh.position.set(tx, ty, tz); mesh.scale.set(b.bw * sk, b.bh * sk, b.bd * sk);
    const edges = new THREE.LineSegments(tEdgeGeo, new THREE.LineBasicMaterial({ color: b.edgeCol, transparent: true, opacity: 0 }));
    mesh.add(edges); scene.add(mesh);
    twins.push({ mesh, edges, tx, ty, tz });
    linkPos.push(b.bx, b.gy + b.bh, b.bz, tx, ty, tz);
  });
  const netPos = [];
  for (let a = 0; a < twins.length; a++) for (let b = a + 1; b < twins.length; b++) {
    const A = twins[a], B = twins[b];
    if (Math.hypot(A.tx - B.tx, A.ty - B.ty, A.tz - B.tz) < 5.6) netPos.push(A.tx, A.ty, A.tz, B.tx, B.ty, B.tz);
  }
  const netGeo = new THREE.BufferGeometry(); netGeo.setAttribute('position', new THREE.Float32BufferAttribute(netPos, 3));
  const netMat = new THREE.LineBasicMaterial({ color: 0x74b6e6, transparent: true, opacity: 0 });
  const netLines = new THREE.LineSegments(netGeo, netMat); scene.add(netLines);
  const linkGeo = new THREE.BufferGeometry(); linkGeo.setAttribute('position', new THREE.Float32BufferAttribute(linkPos, 3));
  const linkMat = new THREE.LineBasicMaterial({ color: 0xe6b84e, transparent: true, opacity: 0 });
  const linkLines = new THREE.LineSegments(linkGeo, linkMat); scene.add(linkLines);

  // --- trees ---
  const trees = [];
  const trunkGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.5, 5); trunkGeo.translate(0, 0.25, 0);
  const foliageGeo = new THREE.ConeGeometry(0.36, 0.95, 7); foliageGeo.translate(0, 0.98, 0);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d24, roughness: 0.9 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x3f7a31, emissive: 0x21451d, emissiveIntensity: 0.28, roughness: 0.8 });
  for (let i = 0; i < 16; i++) {
    const grp = new THREE.Group();
    grp.add(new THREE.Mesh(trunkGeo, trunkMat)); grp.add(new THREE.Mesh(foliageGeo, foliageMat));
    grp.position.set((Math.random() * 2 - 1) * 13, -2.7, -1 - Math.random() * 20);
    grp.scale.setScalar(0.7 + Math.random() * 0.9);
    grp.userData = { ph: Math.random() * 6.28 };
    scene.add(grp); trees.push(grp);
  }

  // --- birds ---
  const birds = [];
  for (let i = 0; i < 5; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: bird, transparent: true, opacity: 0.9, depthWrite: false }));
    sp.scale.setScalar(0.9 + Math.random() * 0.6);
    sp.userData = { r: 6 + Math.random() * 7, sp: 0.16 + Math.random() * 0.16, ph: Math.random() * 6.28, yy: 3.4 + Math.random() * 3, cx: (Math.random() * 2 - 1) * 4, cz: -9 - Math.random() * 6 };
    scene.add(sp); birds.push(sp);
  }

  // --- clouds ---
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    const cl = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloud, color: 0x9fc2e0, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
    cl.scale.set(8 + Math.random() * 6, 4 + Math.random() * 3, 1);
    cl.position.set((Math.random() * 2 - 1) * 16, 6.4 + Math.random() * 3.2, -10 - Math.random() * 8);
    cl.userData = { dx: (Math.random() * 2 - 1) * 0.25 };
    scene.add(cl); clouds.push(cl);
  }

  // --- particles ---
  const pCount = 600; const pGeo = new THREE.BufferGeometry(); const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) { pPos[i * 3] = (Math.random() - 0.5) * 72; pPos[i * 3 + 1] = Math.random() * 24 - 1; pPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 12; }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ map: glow, color: 0xbcd9f0, size: 0.28, transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  scene.add(points);

  // --- lights ---
  scene.add(new THREE.AmbientLight(0x4a6c88, 1.0));
  const l1 = new THREE.PointLight(0x74b6e6, 80, 80); l1.position.set(-10, 12, 8); scene.add(l1);
  const l2 = new THREE.PointLight(0xe6b84e, 60, 80); l2.position.set(10, 8, -2); scene.add(l2);
  const dir = new THREE.DirectionalLight(0xbcd9f0, 0.5); dir.position.set(-5, 10, 6); scene.add(dir);

  // --- interaction ---
  const mouse = { x: 0, y: 0 };
  const onPointer = (e) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; };
  window.addEventListener('pointermove', onPointer, { passive: true });
  const onResize = () => { width = mount.clientWidth; height = mount.clientHeight; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); };
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock(); let raf;
  const render = () => {
    const t = clock.getElapsedTime(); const p = progressRef.current;
    terrainMat.uniforms.uTime.value = t; riverMat.uniforms.uTime.value = t;
    for (const b of buildings) { const local = ease((p - b.order * 0.32) / 0.5); b.mesh.scale.y = Math.max(0.02, b.bh * local); }
    const tw = ease((p - 0.22) / 0.55);
    for (const T of twins) { T.mesh.material.opacity = 0.28 * tw; T.edges.material.opacity = 0.92 * tw; T.mesh.position.y = T.ty + Math.sin(t * 0.8 + T.tx) * 0.12; }
    netMat.opacity = 0.5 * tw; linkMat.opacity = 0.45 * tw;
    for (const g of trees) g.rotation.z = Math.sin(t * 0.7 + g.userData.ph) * 0.045;
    for (const sp of birds) { const u = sp.userData; const a = t * u.sp + u.ph; sp.position.set(u.cx + Math.cos(a) * u.r, u.yy + Math.sin(a * 1.3) * 0.5, u.cz + Math.sin(a) * u.r * 0.6); sp.material.rotation = Math.sin(a) * 0.3; sp.scale.x = (0.9) * (1 + Math.sin(t * 8 + u.ph) * 0.12); }
    for (const cl of clouds) { cl.position.x += cl.userData.dx * 0.02; if (cl.position.x > 19) cl.position.x = -19; if (cl.position.x < -19) cl.position.x = 19; }
    points.rotation.y = t * 0.014;
    const camX = mouse.x * 2.4, camY = 2.2 - mouse.y * 1.1 + p * 1.0, camZ = 9 - p * 8.5;
    camera.position.x += (camX - camera.position.x) * 0.05;
    camera.position.y += (camY - camera.position.y) * 0.05;
    camera.position.z += (camZ - camera.position.z) * 0.05;
    camera.lookAt(0, 1.0 + p * 4.0, -11);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  };
  if (reduced) renderer.render(scene, camera); else raf = requestAnimationFrame(render);

  gsap.registerPlugin(ScrollTrigger);
  const st = ScrollTrigger.create({ trigger: document.documentElement, start: 'top top', end: () => `+=${window.innerHeight * 1.7}`, scrub: true, onUpdate: (s) => { progressRef.current = s.progress; } });

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', onResize);
    st.kill(); renderer.dispose();
    terrainGeo.dispose(); terrainMat.dispose(); riverGeo.dispose(); riverMat.dispose();
    bBoxGeo.dispose(); bEdgeGeo.dispose(); tBoxGeo.dispose(); tEdgeGeo.dispose();
    trunkGeo.dispose(); foliageGeo.dispose(); glow.dispose(); bird.dispose(); cloud.dispose();
    if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
  };
}

function HeroScene() {
  const mountRef = useRef(null);
  const progressRef = useRef(0);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cleanup = () => {};
    let active = true;
    loadThree().then((THREE) => { if (!active || !THREE) return; cleanup = initHero(THREE, mount, progressRef, reduced); }).catch(() => {});
    return () => { active = false; cleanup(); };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 z-0" aria-hidden="true" />;
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
      <section className="relative min-h-screen overflow-hidden bg-navy-deep">
        <HeroScene />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(75%_55%_at_50%_0%,rgba(90,155,212,0.16),transparent_72%)] z-[1]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/70 via-navy-deep/25 to-transparent z-[1]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-navy-deep/55 to-transparent z-[1]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-8xl flex-col justify-center px-6 md:px-10">
          <div className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-sky/30 bg-navy-900/50 px-4 py-2 text-xs font-medium tracking-wide text-sky-light backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-wheat" />
            GBA &middot; Blockchain Maturity Model Certified
          </div>
          <h1 className="font-serif max-w-5xl text-[12.5vw] font-semibold leading-[0.95] tracking-tight text-cream sm:text-[9vw] md:text-[6.6vw] [text-shadow:0_2px_40px_rgba(8,26,43,0.7)]">
            Verifiable infrastructure,<br />
            <span className="text-sky-light">rooted in the </span><span className="italic text-wheat-light">real world.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-sky-light/90 md:text-xl [text-shadow:0_1px_22px_rgba(8,26,43,0.85)]">
            Cloud Control turns fragmented construction and infrastructure data into a verifiable Golden Thread &mdash; innovation aligned with Mother Nature, from concrete to code.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="rounded-full bg-wheat px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-wheat/30 transition-transform hover:scale-[1.04] active:scale-95">Request a BMM Assessment</a>
            <a href="#approach" className="rounded-full border border-sky-light/40 bg-navy-900/30 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:border-wheat hover:text-wheat-light">See how it works</a>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-sky-light/60">Scroll to watch it build</div>
      </section>

      {/* ===== FROM CONCRETE TO CODE ===== */}
      <section className="relative bg-navy px-6 pb-24 pt-20 md:px-10 md:pb-32">
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
              <div key={c.t} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-8 transition-all duration-300 hover:-translate-y-1 hover:border-wheat/40 hover:shadow-2xl hover:shadow-sky/10 md:p-9">
                <div className="mb-5 h-11 w-11 rounded-xl bg-gradient-to-br from-sky to-field-deep shadow-lg shadow-sky/30 transition-transform duration-300 group-hover:scale-110" />
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
      <Hills from="bg-field-deep" to="fill-navy-900" />

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
