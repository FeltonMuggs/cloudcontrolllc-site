'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll-triggered reveal. Children animate up + fade in as they
 * enter the viewport. Supports a `stagger` mode that animates the
 * element's direct children sequentially.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  stagger = false,
  delay = 0,
  y = 42,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const targets = stagger
        ? gsap.utils.toArray(el.children)
        : [el];

      gsap.set(targets, { opacity: 0, y });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: 'power3.out',
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, delay, y]);

  // data-reveal lets globals.css hide the element pre-hydration to avoid a
  // flash — but only when the element itself animates. In stagger mode the
  // children animate individually, so the container must stay visible.
  return (
    <Tag ref={ref} className={className} {...(!stagger && { 'data-reveal': '' })}>
      {children}
    </Tag>
  );
}
