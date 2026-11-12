import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// Adapt the React Bits Split Text entrance to the site's shared GSAP timelines.
// Splitting words preserves natural wrapping without measuring fixed lines.
export function splitHeadings(root) {
  const split = selector => SplitText.create(root.querySelector(selector), {
    type: 'words', wordsClass: 'split-text-word', aria: 'auto',
  });
  const headings = {
    help: split('#help-title'), about: split('#about-title'),
    patients: split('#patient-title'), faq: split('.faq-column h2'),
  };
  return {
    ...headings,
    revert: () => Object.values(headings).forEach(heading => heading.revert()),
  };
}

export const foldFrom = { rotationX: 88, yPercent: 12, autoAlpha: 0 };
export const foldTo = { rotationX: 0, yPercent: 0, autoAlpha: 1, ease: 'power3.out', force3D: true };
