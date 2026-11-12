'use client';

import { motion, useReducedMotion, useSpring } from 'framer-motion';

// Project-specific spotlight effect inspired by React Bits' Spotlight Card.
// CSS variables and motion values avoid React renders on every pointer move.
export default function SpotlightCard({ children, className = '' }) {
  const reduced = useReducedMotion();
  const spring = { stiffness: 180, damping: 24, mass: 0.6 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const scale = useSpring(1, spring);
  const lift = useSpring(0, spring);
  function track(event) {
    if (reduced || event.pointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--spotlight-x', `${event.clientX - box.left}px`);
    card.style.setProperty('--spotlight-y', `${event.clientY - box.top}px`);
    card.dataset.spotlight = 'on';
    const x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    // The side beneath the pointer recedes, while the opposite side comes forward.
    rotateX.set(-y * 6);
    rotateY.set(x * 6);
    scale.set(1.018);
    lift.set(-3);
  }
  function reset(event) {
    event.currentTarget.dataset.spotlight = 'off';
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    lift.set(0);
  }
  return <motion.article
    className={`spotlight-card ${className}`}
    onPointerEnter={track}
    onPointerMove={track}
    onPointerLeave={reset}
    onPointerCancel={reset}
    style={{
      transformPerspective: 900,
      rotateX: reduced ? 0 : rotateX,
      rotateY: reduced ? 0 : rotateY,
      scale: reduced ? 1 : scale,
      y: reduced ? 0 : lift,
    }}
  >
    <span className="spotlight-glow" aria-hidden="true" />
    {children}
  </motion.article>;
}
