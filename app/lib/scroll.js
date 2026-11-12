let controller = null;

export function registerSmoothScroll(instance) {
  controller = instance;
  return () => { if (controller === instance) controller = null; };
}

export function scrollToPosition(top) {
  if (controller) {
    controller.scrollTo(top, { duration: 1, lerp: 0, easing: t => 1 - Math.pow(1 - t, 4) });
    return;
  }
  window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
