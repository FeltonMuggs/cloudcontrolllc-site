'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll-scrubbing canvas hero.
 *
 * Renders a 3D node-network (a stand-in for "verifiable infrastructure")
 * to a 2D canvas using a lightweight perspective projection — no WebGL or
 * image sequence required, so it stays fast and dependency-free. The browser
 * is driven like a render target: scroll position scrubs an `assembly`
 * parameter that raises the nodes up from the ground and rotates the
 * structure, while opacity fades the field into a subtle backdrop as the
 * visitor moves past the hero.
 *
 * To swap in a true Magma-style image sequence later, replace the draw()
 * body with a frame blit: ctx.drawImage(frames[Math.round(progress*last)], …).
 */
export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const progressRef = useRef(0); // 0 → 1 across the first ~2 viewports
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
      nodes.push({
        base,
        // higher nodes settle later → "built from the ground up"
        rise: 0.08 + (base.y + 1) * 0.42,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    // Precompute nearby edges once (by base distance).
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
      // rotate around Y
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      let dx = x * cosY - z * sinY;
      let dz = x * sinY + z * cosY;
      // tilt around X
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const dy = y * cosX - dz * sinX;
      dz = y * sinX + dz * cosX;

      const fov = 3.2;
      const scale = fov / (fov + dz);
      const minDim = Math.min(width, height);
      const reach = minDim * 0.42;
      return {
        sx: width / 2 + dx * reach * scale,
        sy: height / 2 + dy * reach * scale,
        scale,
        depth: dz,
      };
    };

    let raf;
    let t = 0;
    const draw = () => {
      t += reduced ? 0 : 0.0032;
      const p = progressRef.current;

      // Eased assembly + fade.
      const assembly = gsap.parseEase('power2.out')(Math.min(1, p / 0.55));
      const fade = 1 - gsap.parseEase('power1.in')(Math.min(1, Math.max(0, (p - 0.15) / 0.85))) * 0.82;

      const ay = t * 0.6 + p * Math.PI * 0.9 + pointerRef.current.x * 0.25;
      const ax = -0.22 + pointerRef.current.y * 0.12;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      const pts = nodes.map((n) => {
        const settle = Math.min(1, Math.max(0, (assembly - 0) / 1)) ;
        const groundY = -1.65;
        const y = groundY + (n.base.y - groundY) * gsap.parseEase('power3.out')(
          Math.min(1, settle * (0.55 + n.rise))
        );
        return project(n.base.x, y, n.base.z, ay, ax);
      });

      // edges
      for (let k = 0; k < edges.length; k++) {
        const [i, j, d] = edges[k];
        const a = pts[i];
        const b = pts[j];
        const depth = (a.depth + b.depth) / 2;
        const dAlpha = (1 - (depth + 1.4) / 2.8);
        const alpha = Math.max(0, dAlpha) * (1 - d / 0.74) * 0.5 * fade * assembly;
        if (alpha < 0.01) continue;
        ctx.strokeStyle = `rgba(52, 227, 176, ${alpha})`;
        ctx.lineWidth = 0.6 * a.scale;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // nodes
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

    // ScrollTrigger scrubs progress across the first two viewports.
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: () => `+=${window.innerHeight * 2}`,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      st.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
