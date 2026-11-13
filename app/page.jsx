'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpotlightCard from './components/SpotlightCard';
import ClosingSections from './components/ClosingSections';
import FoldText from './components/FoldText';
import { splitHeadings, foldFrom, foldTo } from './lib/text-effects';
import { scrollToPosition } from './lib/scroll';

gsap.registerPlugin(ScrollTrigger);

function Arrow({ diagonal = false, ...props }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} /></svg>;
}

function TreatmentIcon({ kind }) {
  const paths = {
    assessment: <><rect x="6" y="5" width="20" height="24" rx="3" /><path d="M12 5V3h8v2M11 13h10M11 19h6M11 24h9" /></>,
    hands: <><path d="m5 18 5-5c2-2 4-2 6 0l2 2m-13 3 7 9c2 2 4 2 6 0l8-9M2 16l5 5M30 16l-5 5M13 14l4-4c1-1 3-1 4 0l6 6-6 6c-1 1-2 1-3 0l-5-5c-1-1-1-2 0-3Z" /></>,
    movement: <><circle cx="20" cy="5" r="2.5" /><path d="m9 13 6-4 6 4h7M16 10l-4 10 6 3 2 7M12 20l-7 7M9 6H4M7 13H2" /></>,
    listening: <><path d="M10 12a7 7 0 0 1 14 0c0 6-7 6-7 11 0 3-4 6-7 2M15 13a3 3 0 0 1 6 0c0 2-4 3-4 6M5 9c-2 4-2 8 0 12" /></>,
    guidance: <><path d="M5 5h22v17H15l-7 6v-6H5V5ZM10 11h12M10 16h8" /></>,
    personal: <><circle cx="16" cy="9" r="5" /><path d="M6 29v-3a10 10 0 0 1 20 0v3M23 17h7M26.5 13.5v7" /></>,
  };
  return <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

const treatmentHighlights = [
  { kind: 'assessment', title: 'Avaliação individual', text: 'Suas queixas, sua rotina e seus movimentos orientam o primeiro passo.' },
  { kind: 'hands', title: 'Fisioterapia manipulativa', text: 'Uma abordagem manual que considera a avaliação e as necessidades do seu corpo.' },
  { kind: 'movement', title: 'Movimento e função', text: 'Atenção ao que você precisa retomar nas atividades do dia a dia.' },
];

function TreatmentCard({ item, index }) {
  return <div className="treatment-reveal">
    <SpotlightCard className="treatment-feature">
      <span className="feature-number" aria-hidden="true">0{index + 1}</span>
      <span className="treatment-icon"><TreatmentIcon kind={item.kind} /></span>
      <h3>{item.title}</h3><p>{item.text}</p>
    </SpotlightCard>
  </div>;
}

function TitleWords({ text, fold = false }) {
  const words = text.split(' ');
  return words.map((word, index) => <span key={`${word}-${index}`} className="treatment-word-mask"><span className="treatment-word">{fold ? <FoldText text={word} /> : word}</span>{index < words.length - 1 ? '\u00a0' : null}</span>);
}

export default function Home() {
  const root = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const container = root.current;
    // Only enable the overlapping layout once this client can create its pins.
    // The server-rendered page stays in normal flow until this layout effect.
    container.classList.add('motion-ready');
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const text = splitHeadings(container);
        // Flat text stays on a 2D transform path. Only the actual folding
        // pieces use 3D; nested 3D/hidden backfaces can blink on compositing.
        gsap.set(container.querySelectorAll('.split-text-word, .split-text-char, .help-reveal, .about-reveal, .treatment-reveal, .treatment-word, .treatment-summary, .patient-kicker, .patient-intro, .testimonial-card, .testimonial-note, .faq-list, .faq-contact'), { force3D: false });
        gsap.timeline({ defaults: { ease: 'power2.out' } })
          .from('.hero-eyebrow', { y: 14, autoAlpha: 0, duration: 1.1 }, 0.15)
          .fromTo('.hero-copy .fold-piece', foldFrom, { ...foldTo, duration: 1.35, stagger: 0.1 }, 0.2)
          .from('.portrait-entrance', { y: 36, autoAlpha: 0, scale: 1.015, duration: 2.0 }, 0.25)
          .from('.hero-description, .hero-actions, .hero-footer', { y: 14, autoAlpha: 0, stagger: 0.16, duration: 1.1 }, 0.85);

        media.add('(min-width: 900px)', () => {
          const portrait = root.current.querySelector('.portrait-scroll');
          const scroll = gsap.timeline({ scrollTrigger: { id: 'hero-transition', trigger: '.hero-stage', start: 'top top', end: '+=400%', scrub: 0.22, pin: '.hero-scene', anticipatePin: 1, invalidateOnRefresh: true } });
          scroll.to('.hero-copy', { y: -28, autoAlpha: 0, duration: 0.32, ease: 'sine.inOut' }, 0)
            .to('.portrait-caption, .hero-footer', { autoAlpha: 0, y: -12, duration: 0.28, ease: 'sine.inOut' }, 0)
            .to(portrait, { x: () => window.innerWidth * 0.025 - portrait.offsetLeft, scale: 0.88, transformOrigin: 'left bottom', force3D: true, duration: 0.79, ease: 'sine.inOut' }, 0.06)
            .to('.scene-watermark-layer', { xPercent: -4, duration: 0.85, ease: 'sine.inOut' }, 0)
            .to('.scene-watermark', { opacity: 0.035, duration: 0.85, ease: 'sine.inOut' }, 0)
            .fromTo('.scene-reading-shade', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'sine.inOut' }, 0.45)
            .to('.orbit', { x: '-35vw', rotation: 30, duration: 0.85, ease: 'sine.inOut' }, 0)
            .fromTo('.help-panel', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.88)
            .fromTo('.help-reveal:not(h2)', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.065, ease: 'sine.out' }, 0.9)
            .fromTo(text.help.words, { yPercent: 45, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.42, stagger: { amount: 0.16 }, ease: 'power2.out' }, 0.98)
            .addLabel('help', 1.65)
            .fromTo('.help-reveal', { y: 0, autoAlpha: 1 }, { y: -25, autoAlpha: 0, duration: 0.24, stagger: 0.035, immediateRender: false }, 2)
            .set('.help-panel', { autoAlpha: 0 }, 2.4)
            .fromTo('.about-panel', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 2.43)
            .fromTo('.about-reveal:not(h2)', { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.32, stagger: 0.09, ease: 'power2.out' }, 2.46)
            .fromTo(text.about.words, { yPercent: 45, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, stagger: { amount: 0.14 }, ease: 'power2.out' }, 2.55)
            .addLabel('about', 3.2)
            .to({}, { duration: 0.35 });
          // Keep the existing chapter timing, then hold the scene while the next
          // section travels upward over it for one full viewport of scrolling.
          const chapterDuration = scroll.duration();
          scroll.to('.hero-shade', { opacity: 0.3, duration: chapterDuration / 3, ease: 'none' });
          ScrollTrigger.create({
            id: 'treatment-hold',
            trigger: '#tratamentos',
            start: 'top top',
            end: () => `+=${Math.min(320, window.innerHeight * 0.25)}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
          });
          gsap.timeline({
            defaults: { ease: 'power2.out' },
            // Let the entrance finish during the existing brief pin, giving
            // each group more scroll distance without restarting its state.
            scrollTrigger: { id: 'treatment-entrance', trigger: '#tratamentos', start: 'top 65%', end: 'top -15%', scrub: 0.22 },
          })
            .fromTo('.treatment-intro>.section-label', { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.28 }, 0)
            .fromTo('.treatment-word', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.02)
            .fromTo(text.treatment.chars, { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.48, stagger: { amount: 0.16 }, ease: 'power3.out' }, 0.06)
            .fromTo('#treatment-title .fold-piece', foldFrom, { ...foldTo, duration: 0.54, stagger: { amount: 0.13 } }, 0.12)
            .fromTo('.treatment-intro>p:not(.section-label), .treatment-intro>.treatment-button', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.055 }, 0.14)
            .fromTo('.treatment-features .treatment-reveal', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.52, stagger: 0.1 }, 0.2)
            .fromTo('.treatment-summary', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.38 }, 0.58)
            .fromTo(text.summary.words, { yPercent: 45, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.34, stagger: { amount: 0.12 } }, 0.59)
            .fromTo('.care-steps li', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.065 }, 0.68);
        });
        media.add('(max-width: 899px)', () => {
          gsap.to('.portrait-scroll', { y: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.2 } });
          gsap.to('.scene-watermark-layer', { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.25 } });
          gsap.from('.help-reveal:not(h2)', { y: 30, opacity: 0, duration: 0.6, stagger: 0.12, scrollTrigger: { trigger: '#cuidado', start: 'top 82%', once: true } });
          gsap.from('.about-reveal:not(h2)', { y: 30, opacity: 0, duration: 0.6, stagger: 0.12, scrollTrigger: { trigger: '#sobre', start: 'top 82%', once: true } });
          for (const [heading, trigger] of [[text.help, '#cuidado'], [text.about, '#sobre']]) {
            gsap.fromTo(heading.words, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.65, stagger: 0.045, ease: 'power2.out', scrollTrigger: { trigger, start: 'top 82%', once: true } });
          }
          root.current.querySelectorAll('.treatment-row').forEach(row => {
            gsap.from(row.querySelectorAll('.treatment-reveal'), { y: 30, autoAlpha: 0, duration: 1, stagger: 0.16, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
          });
          gsap.from('.treatment-word', { yPercent: 45, autoAlpha: 0, duration: 1, stagger: 0.075, ease: 'power3.out', scrollTrigger: { trigger: '.treatment-row-top', start: 'top 85%', once: true } });
          gsap.fromTo(text.treatment.chars, { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: { amount: 0.25 }, scrollTrigger: { trigger: '.treatment-row-top', start: 'top 85%', once: true } });
          gsap.fromTo('#treatment-title .fold-piece', foldFrom, { ...foldTo, duration: 1.1, stagger: 0.1, scrollTrigger: { trigger: '.treatment-row-top', start: 'top 85%', once: true } });
          gsap.fromTo(text.summary.words, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, scrollTrigger: { trigger: '.treatment-summary', start: 'top 85%', once: true } });
        });
        gsap.fromTo('.treatment-atmosphere', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#tratamentos', start: 'top bottom', end: 'bottom top', scrub: true } });
        media.add('(min-width: 900px) and (min-height: 760px)', () => {
          // Reserve the short reading pause in normal flow so the inverse
          // curtain starts after it, including when an FAQ changes height.
          ScrollTrigger.create({
            id: 'patient-hold', trigger: '.patient-section', start: 'top top',
            end: () => `+=${Math.min(200, window.innerHeight * 0.18)}`,
            pin: true, pinSpacing: true, anticipatePin: 0, invalidateOnRefresh: true,
          });
          gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: { id: 'patient-entrance', trigger: '.patient-stage', start: 'top 70%', end: 'top 8%', scrub: 0.25 },
          })
            .fromTo('.patient-kicker, .patient-intro', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.045 }, 0)
            .fromTo('.testimonial-card, .testimonial-note', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.04 }, 0.12)
            .fromTo('.faq-column>.small-eyebrow, .faq-list, .faq-contact', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: { amount: 0.04 } }, 0.08);
          const patientEntrance = ScrollTrigger.getById('patient-entrance').animation;
          patientEntrance
            .fromTo(text.patients.words, { yPercent: 65, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.42, stagger: { amount: 0.18 } }, 0.12)
            .fromTo('#patient-title .fold-piece', foldFrom, { ...foldTo, duration: 0.36, stagger: { amount: 0.1 } }, 0.22)
            .fromTo(text.faq.words, { yPercent: 65, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.38, stagger: { amount: 0.14 } }, 0.15)
            .fromTo('.faq-column h2 .fold-piece', foldFrom, { ...foldTo, duration: 0.34, stagger: { amount: 0.08 } }, 0.28);
          // Reveal the contact scene as a stationary surface. Transforming its
          // background exposed a dark strip below it during the curtain reveal.
          ScrollTrigger.create({
            id: 'closing-reveal', trigger: '.patient-stage', start: 'bottom bottom', end: '+=100%', pin: '.closing-scene', pinSpacing: false, anticipatePin: 1, invalidateOnRefresh: true,
          });
          gsap.fromTo('.contact-intro .fold-piece', foldFrom, { ...foldTo, duration: 1.1, stagger: 0.14, ease: 'power2.out', scrollTrigger: { trigger: '.patient-stage', start: 'bottom 65%', end: 'bottom top', scrub: 0.85 } });
        });
        media.add('(max-width: 899px), (max-height: 759px)', () => {
          for (const heading of [text.patients, text.faq]) {
            gsap.fromTo(heading.words, { yPercent: 35, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.65, delay: 0.15, stagger: 0.045, scrollTrigger: { trigger: heading.elements[0], start: 'top 75%', once: true } });
          }
          for (const heading of ['#patient-title', '.faq-column h2']) {
            gsap.fromTo(`${heading} .fold-piece`, foldFrom, { ...foldTo, duration: 0.9, delay: 0.2, stagger: 0.09, scrollTrigger: { trigger: heading, start: 'top 72%', once: true } });
          }
          gsap.fromTo('.contact-intro .fold-piece', foldFrom, { ...foldTo, duration: 1.25, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: '#contact-title', start: 'top 80%', once: true } });
        });
        return () => text.revert();
      });
    }, root);
    return () => { media.revert(); ctx.revert(); container.classList.remove('motion-ready'); };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const goToScene = (event, chapter) => {
    closeMenu();
    const transition = ScrollTrigger.getById('hero-transition');
    if (transition) {
      event.preventDefault();
      window.history.replaceState(null, '', chapter === 'help' ? '#cuidado' : '#sobre');
      const progress = transition.animation.labels[chapter] / transition.animation.duration();
      scrollToPosition(transition.start + (transition.end - transition.start) * progress);
    }
  };
  const goToHelp = (event) => goToScene(event, 'help');
  const goToAbout = (event) => goToScene(event, 'about');
  const handleSectionNavigation = (event) => {
    if (event.defaultPrevented) return;
    const link = event.target.closest('a[href="#contato"], a[href="#tratamentos"]');
    if (!link) return;
    const treatment = link.getAttribute('href') === '#tratamentos';
    const transition = ScrollTrigger.getById(treatment ? 'treatment-hold' : 'closing-reveal');
    if (transition) {
      event.preventDefault();
      window.history.replaceState(null, '', treatment ? '#tratamentos' : '#contato');
      scrollToPosition(treatment ? transition.start + 1 : transition.end);
    }
  };
  return <main ref={root} onClick={handleSectionNavigation}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header flex items-center justify-between">
      <a href="#inicio" aria-label="Rudy Mollick, início" onClick={closeMenu}><Image className="brand-logo" src="/images/rudy-logo.png" width={2167} height={726} alt="Rudy Mollick — Fisioterapia Manipulativa" priority /></a>
      <nav className="hidden items-center gap-10 md:flex" aria-label="Navegação principal"><a href="#inicio">Início</a><a href="#cuidado" onClick={goToHelp}>Como posso te ajudar</a><a href="#sobre" onClick={goToAbout}>Sobre o Rudy</a><a className="nav-cta" href="#contato">Vamos conversar <Arrow diagonal /></a></nav>
      <button className="menu-toggle md:hidden" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Fechar −' : 'Menu +'}</button>
    </header>
    <AnimatePresence>{menuOpen && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Navegação móvel" initial={{ opacity: 0, y: reducedMotion ? 0 : -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}><a href="#inicio" onClick={closeMenu}>Início</a><a href="#cuidado" onClick={goToHelp}>Como posso te ajudar</a><a href="#sobre" onClick={goToAbout}>Sobre o Rudy</a><a href="#contato" onClick={closeMenu}>Vamos conversar <Arrow diagonal /></a></motion.nav>}</AnimatePresence>

    <div id="inicio" className="hero-stage">
      <div className="hero-scene">
      <section className="hero" aria-labelledby="hero-title" id="conteudo">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
        <div className="scene-watermark-layer" aria-hidden="true"><Image src="/images/rudy-logo.png" width={2167} height={726} alt="" className="scene-watermark" sizes="115vw" /></div>
        <div className="scene-reading-shade" aria-hidden="true" />
        <div className="hero-copy">
          <p className="hero-eyebrow flex items-center gap-3"><span className="status-dot" /> FISIOTERAPIA COM RUDY MOLLICK</p>
          <h1 id="hero-title"><span className="title-line"><FoldText text="Seu corpo." /></span><span className="title-line"><FoldText text="Seu movimento." /></span><span className="title-line title-accent"><FoldText text="Sua liberdade." /></span></h1>
          <p className="hero-description">Volte a se conectar com o que te move.<br className="hidden md:block" /> Um cuidado individualizado, que começa por você.</p>
          <div className="hero-actions flex flex-wrap items-center gap-6">
            <motion.a href="#contato" className="primary-button" whileHover={reducedMotion ? {} : { y: -3 }} whileTap={reducedMotion ? {} : { scale: 0.97 }}>Quero dar o primeiro passo <span><Arrow diagonal /></span></motion.a>
            <a className="text-link" href="#cuidado" onClick={goToHelp}>Conheça o cuidado <Arrow /></a>
          </div>
        </div>
        <div className="portrait-scroll"><div className="portrait-entrance"><Image src="/images/rudy-recorte.png" alt="Rudy Mollick de jaleco, segurando um modelo anatômico da coluna vertebral" width={1092} height={1441} className="rudy-portrait" sizes="(max-width: 899px) 90vw, 53vw" priority /></div></div>
        <div className="portrait-caption"><div><strong>Rudy Mollick</strong><span>Fisioterapia Manipulativa</span></div></div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-footer flex items-center justify-between"><a href="#cuidado" onClick={goToHelp} className="scroll-cue"><span className="scroll-mouse" aria-hidden="true"><span /></span> CONTINUE O MOVIMENTO <span aria-hidden="true">↓</span></a><span className="hero-footer-note">CIÊNCIA NO CUIDADO. <span>PRESENÇA EM CADA MOVIMENTO.</span></span><span className="chapter-index">01 <span>/ 06</span></span></div>
      </section>
      <section id="cuidado" className="help-panel" aria-labelledby="help-title">
        <p className="help-reveal section-label">02 — COMO POSSO TE AJUDAR</p>
        <h2 id="help-title" className="help-reveal">Mais espaço<br />para <em>se mover.</em></h2>
        <p className="help-reveal help-intro">Quando um movimento faz falta na sua rotina, o primeiro passo é entender o que você está sentindo.</p>
        <ul className="help-reveal help-topics"><li><span>01</span> Dores que atrapalham o dia a dia</li><li><span>02</span> Dificuldade para se movimentar</li><li><span>03</span> Insegurança para retomar atividades</li></ul>
        <div className="help-reveal"><a href="#contato" className="text-link">Vamos conversar sobre você <Arrow diagonal /></a></div>
      </section>
      <section id="sobre" className="about-panel" aria-labelledby="about-title">
        <p className="about-reveal section-label">03 — CONHEÇA O RUDY</p>
        <h2 id="about-title" className="about-reveal">Rudy Mollick.<br /><em>Presença no cuidado.</em></h2>
        <p className="about-reveal help-intro">Fisioterapeuta com atuação em fisioterapia manipulativa. Um cuidado que olha para a pessoa, para sua rotina e para os movimentos que fazem parte da sua vida.</p>
        <p className="about-reveal about-description">A escuta é o começo dessa relação: entender o que você sente, conhecer suas dificuldades e conversar sobre os próximos passos do seu atendimento.</p>
        <div className="about-reveal about-signature"><span>Rudy Mollick</span><p>FISIOTERAPIA MANIPULATIVA</p></div>
        <div className="about-reveal"><a href="#tratamentos" className="text-link">Conheça o tratamento <Arrow diagonal /></a></div>
      </section>
      </div>
    </div>

    <section id="tratamentos" className="treatment-section" aria-labelledby="treatment-title">
      <div className="treatment-atmosphere" aria-hidden="true"><div className="treatment-ring" /><div className="treatment-ring treatment-ring-inner" /></div>
      <div className="treatment-content">
        <div className="treatment-row treatment-row-top grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="treatment-reveal treatment-intro">
            <p className="section-label">04 — TRATAMENTO ESPECIALIZADO</p>
            <h2 id="treatment-title" aria-label="O cuidado certo. Para o seu movimento."><span className="treatment-title-line" aria-hidden="true"><TitleWords text="O cuidado certo." /></span><em className="treatment-title-line" aria-hidden="true"><TitleWords text="Para o seu movimento." fold /></em></h2>
            <p>Seu corpo merece um olhar individual. A <strong>fisioterapia manipulativa</strong> começa pela avaliação e considera o que você precisa no dia a dia.</p>
            <p className="treatment-intro-note"><span aria-hidden="true" /> Você participa de cada passo do seu cuidado.</p>
            <motion.a href="#contato" className="treatment-button treatment-button-primary" whileHover={reducedMotion ? {} : { y: -3 }} whileTap={reducedMotion ? {} : { scale: 0.98 }}><span className="button-glare" aria-hidden="true" /><span>Conversar com o Rudy</span><Arrow diagonal /></motion.a>
          </div>
          <div className="treatment-features grid gap-9 sm:grid-cols-3 sm:gap-6">
            {treatmentHighlights.map((item, index) => <TreatmentCard key={item.kind} item={item} index={index} />)}
          </div>
        </div>
        <div className="treatment-row treatment-row-bottom grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="treatment-reveal treatment-summary">
            <span className="treatment-small-label">CADA PESSOA, UM PONTO DE PARTIDA.</span>
            <h3>Como funciona<br /><em>o seu cuidado?</em></h3>
            <ol className="care-steps" aria-label="Etapas do atendimento">
              <li><span>01</span><strong>Conversa</strong><p>Você conta o que sente e o que faz falta na sua rotina.</p></li>
              <li><span>02</span><strong>Avaliação</strong><p>Avaliamos suas necessidades, seus movimentos e seus limites.</p></li>
              <li><span>03</span><strong>Orientação</strong><p>Definimos os próximos passos e esclarecemos como será o seu cuidado.</p></li>
            </ol>
            <a href="#contato" className="text-link treatment-secondary-link">Dar o primeiro passo <Arrow diagonal /></a>
          </div>
        </div>
      </div>
    </section>

    <ClosingSections />
  </main>;
}
