'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Arrow({ diagonal = false, ...props }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} /></svg>;
}

export default function Home() {
  const root = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-eyebrow, .title-line', { y: 65, autoAlpha: 0, duration: 1.05, stagger: 0.12 }, 0.1)
          .from('.portrait-entrance', { y: 75, autoAlpha: 0, scale: 1.04, duration: 1.4 }, 0.2)
          .from('.hero-description, .hero-actions, .hero-footer', { y: 22, autoAlpha: 0, stagger: 0.12, duration: 0.75 }, 0.7);

        media.add('(min-width: 900px)', () => {
          const portrait = root.current.querySelector('.portrait-scroll');
          const scroll = gsap.timeline({ scrollTrigger: { id: 'hero-transition', trigger: '.hero-stage', start: 'top top', end: '+=300%', scrub: 0.8, pin: '.hero-scene', anticipatePin: 1, invalidateOnRefresh: true } });
          scroll.to('.hero-copy', { y: -45, autoAlpha: 0, duration: 0.22 }, 0)
            .to('.portrait-caption, .hero-footer', { autoAlpha: 0, y: -20, duration: 0.2 }, 0)
            .to(portrait, { x: () => window.innerWidth * 0.025 - portrait.offsetLeft, scale: 0.88, transformOrigin: 'left bottom', duration: 0.65, ease: 'power2.inOut' }, 0.2)
            .to('.backdrop-word', { xPercent: -30, autoAlpha: 0.25, duration: 0.85 }, 0)
            .to('.orbit', { x: '-35vw', rotation: 30, duration: 0.85 }, 0)
            .fromTo('.help-panel', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.88)
            .fromTo('.help-reveal', { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.32, stagger: 0.09, ease: 'power2.out' }, 0.9)
            .addLabel('help', 1.65)
            .to('.help-reveal', { y: -25, autoAlpha: 0, duration: 0.24, stagger: 0.035 }, 2)
            .set('.help-panel', { autoAlpha: 0 }, 2.4)
            .fromTo('.about-panel', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 2.43)
            .fromTo('.about-reveal', { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.32, stagger: 0.09, ease: 'power2.out' }, 2.46)
            .addLabel('about', 3.2)
            .to({}, { duration: 0.35 });
        });
        media.add('(max-width: 899px)', () => {
          gsap.to('.portrait-scroll', { y: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
          gsap.to('.backdrop-word', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
          gsap.from('.help-reveal', { y: 30, opacity: 0, duration: 0.6, stagger: 0.12, scrollTrigger: { trigger: '#cuidado', start: 'top 82%', toggleActions: 'play none none reverse' } });
          gsap.from('.about-reveal', { y: 30, opacity: 0, duration: 0.6, stagger: 0.12, scrollTrigger: { trigger: '#sobre', start: 'top 82%', toggleActions: 'play none none reverse' } });
        });
      });
    }, root);
    return () => { media.revert(); ctx.revert(); };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const goToScene = (event, chapter) => {
    closeMenu();
    const transition = ScrollTrigger.getById('hero-transition');
    if (transition) {
      event.preventDefault();
      window.history.replaceState(null, '', chapter === 'help' ? '#cuidado' : '#sobre');
      const progress = transition.animation.labels[chapter] / transition.animation.duration();
      window.scrollTo({ top: transition.start + (transition.end - transition.start) * progress, behavior: 'smooth' });
    }
  };
  const goToHelp = (event) => goToScene(event, 'help');
  const goToAbout = (event) => goToScene(event, 'about');
  return <main ref={root}>
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
        <span className="backdrop-word" aria-hidden="true">MOVIMENTO</span>
        <div className="hero-copy">
          <p className="hero-eyebrow flex items-center gap-3"><span className="status-dot" /> FISIOTERAPIA COM RUDY MOLLICK</p>
          <h1 id="hero-title"><span className="title-line">Seu corpo.</span><span className="title-line">Seu movimento.</span><span className="title-line title-accent">Sua liberdade.</span></h1>
          <p className="hero-description">Volte a se conectar com o que te move.<br className="hidden md:block" /> Um cuidado individualizado, que começa por você.</p>
          <div className="hero-actions flex flex-wrap items-center gap-6">
            <motion.a href="#contato" className="primary-button" whileHover={reducedMotion ? {} : { y: -3 }} whileTap={reducedMotion ? {} : { scale: 0.97 }}>Quero dar o primeiro passo <span><Arrow diagonal /></span></motion.a>
            <a className="text-link" href="#cuidado" onClick={goToHelp}>Conheça o cuidado <Arrow /></a>
          </div>
        </div>
        <div className="portrait-scroll"><div className="portrait-entrance"><Image src="/images/rudy-recorte.png" alt="Rudy Mollick de jaleco, segurando um modelo anatômico da coluna vertebral" width={1092} height={1441} className="rudy-portrait" sizes="(max-width: 899px) 90vw, 53vw" priority /></div></div>
        <div className="portrait-caption"><span className="caption-cross" aria-hidden="true">+</span><div><strong>Rudy Mollick</strong><span>Fisioterapia Manipulativa</span></div></div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-footer flex items-center justify-between"><a href="#cuidado" onClick={goToHelp} className="scroll-cue"><span className="scroll-mouse" aria-hidden="true"><span /></span> CONTINUE O MOVIMENTO <span aria-hidden="true">↓</span></a><span className="hero-footer-note">CIÊNCIA NO CUIDADO. <span>PRESENÇA EM CADA MOVIMENTO.</span></span><span className="chapter-index">01 <span>/ 04</span></span></div>
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
        <div className="about-reveal"><a href="#contato" className="text-link">Converse com o Rudy <Arrow diagonal /></a></div>
      </section>
      </div>
    </div>

    <section id="contato" className="contact-section"><p className="section-label">04 — SEU PRIMEIRO PASSO</p><h2>O que te move<br /><em>faz falta.</em></h2><p>Converse com Rudy sobre o seu atendimento.</p><motion.a className="primary-button" href="https://rudymollick.com.br/" whileHover={reducedMotion ? {} : { y: -3 }}>Acessar os canais de atendimento <span><Arrow diagonal /></span></motion.a><span className="contact-note">Você será direcionado ao site oficial do Rudy.</span></section>
    <footer className="site-footer flex flex-wrap items-center justify-between gap-5"><span>RUDY MOLLICK <span className="footer-divider">/</span> FISIOTERAPIA</span><a href="#inicio">Voltar ao início ↑</a></footer>
  </main>;
}
