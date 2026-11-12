'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerSmoothScroll } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let teardown = () => {};
    const configure = () => {
      teardown();
      teardown = () => {};
      if (preference.matches) return;
      const lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        autoToggle: true,
        anchors: false,
        stopInertiaOnNavigate: true,
        prevent: node => Boolean(node.closest('dialog, [data-lenis-prevent]')),
      });
      const unregister = registerSmoothScroll(lenis);
      const tick = time => lenis.raf(time * 1000);
      const resize = () => lenis.resize();
      const onAnchor = event => {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest?.('a[href]');
        if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
        const url = new URL(link.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        window.history.replaceState(null, '', url.hash);
        lenis.scrollTo(target, { offset: ['inicio', 'conteudo'].includes(target.id) ? 0 : -100, duration: 1, lerp: 0, easing: t => 1 - Math.pow(1 - t, 4) });
      };
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.addEventListener('refresh', resize);
      window.addEventListener('click', onAnchor);
      const frame = requestAnimationFrame(() => { lenis.resize(); ScrollTrigger.refresh(); });
      teardown = () => {
        cancelAnimationFrame(frame);
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener('refresh', resize);
        window.removeEventListener('click', onAnchor);
        lenis.off('scroll', ScrollTrigger.update);
        unregister();
        lenis.destroy();
      };
    };
    configure();
    preference.addEventListener('change', configure);
    return () => { preference.removeEventListener('change', configure); teardown(); };
  }, [pathname]);
  return null;
}
