'use client';

import { motion, useReducedMotion } from 'framer-motion';

// Project-specific spotlight effect inspired by React Bits' Spotlight Card.
// Pointer tracking only updates CSS variables; content stays visible on touch.
export default function SpotlightCard({ children, className = '' }) {
  const reduced = useReducedMotion();
  function track(event) {
    if (reduced || event.pointerType === 'touch') return;
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--spotlight-x', `${event.clientX - box.left}px`);
    card.style.setProperty('--spotlight-y', `${event.clientY - box.top}px`);
    card.dataset.spotlight = 'on';
  }
  return <motion.article
    className={`spotlight-card ${className}`}
    onPointerMove={track}
    onPointerLeave={event => { event.currentTarget.dataset.spotlight = 'off'; }}
    whileHover={reduced ? {} : { y: -4 }}
    transition={{ duration: 0.25 }}
  >
    <span className="spotlight-glow" aria-hidden="true" />
    {children}
  </motion.article>;
}
