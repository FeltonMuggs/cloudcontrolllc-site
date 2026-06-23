'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'BMM Certified', href: '#bmm' },
  { label: 'Approach', href: '#approach' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
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
        scrolled
          ? 'bg-base/80 backdrop-blur-md border-b border-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          onClick={(e) => go(e, '#top')}
          className="flex items-center gap-2.5 text-ink"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 ring-1 ring-accent/40">
            <span className="block h-2.5 w-2.5 rounded-sm bg-accent" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Cloud Control <span className="text-muted">LLC</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(e) => go(e, '#contact')}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-base transition-transform hover:scale-[1.03] active:scale-95"
        >
          Request a BMM Assessment
        </a>
      </div>
    </header>
  );
}
