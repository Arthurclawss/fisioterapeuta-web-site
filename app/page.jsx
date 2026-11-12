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
          const scroll = gsap.timeline({ scrollTrigger: { trigger: '.hero-stage', start: 'top top', end: '+=80%', scrub: 1, pin: '.hero', anticipatePin: 1, invalidateOnRefresh: true } });
          scroll.to('.hero-copy', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
            .to('.portrait-scroll', { yPercent: -9, scale: 1.06, ease: 'none' }, 0)
            .to('.backdrop-word', { xPercent: -16, yPercent: -25, ease: 'none' }, 0)
            .to('.orbit', { rotation: 40, scale: 1.3, ease: 'none' }, 0)
            .to('.portrait-caption, .hero-footer', { opacity: 0, y: -35 }, 0)
            .to('.hero-shade', { opacity: 0.8 }, 0.5);
        });
        media.add('(max-width: 899px)', () => {
          gsap.to('.portrait-scroll', { y: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
          gsap.to('.backdrop-word', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
        });
        gsap.from('.section-reveal', { y: 45, opacity: 0, duration: 0.9, stagger: 0.15, scrollTrigger: { trigger: '#cuidado', start: 'top 82%', toggleActions: 'play none none reverse' } });
      });
    }, root);
    return () => { media.revert(); ctx.revert(); };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return <main ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header flex items-center justify-between">
      <a href="#inicio" aria-label="Rudy Mollick, início" onClick={closeMenu}><Image className="brand-logo" src="/images/rudy-logo.png" width={2167} height={726} alt="Rudy Mollick — Fisioterapia Manipulativa" priority /></a>
      <nav className="hidden items-center gap-10 md:flex" aria-label="Navegação principal"><a href="#inicio">Início</a><a href="#cuidado">O cuidado</a><a className="nav-cta" href="#contato">Vamos conversar <Arrow diagonal /></a></nav>
      <button className="menu-toggle md:hidden" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Fechar −' : 'Menu +'}</button>
    </header>
    <AnimatePresence>{menuOpen && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Navegação móvel" initial={{ opacity: 0, y: reducedMotion ? 0 : -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}><a href="#inicio" onClick={closeMenu}>Início</a><a href="#cuidado" onClick={closeMenu}>O cuidado</a><a href="#contato" onClick={closeMenu}>Vamos conversar <Arrow diagonal /></a></motion.nav>}</AnimatePresence>

    <div id="inicio" className="hero-stage">
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
            <a className="text-link" href="#cuidado">Conheça o cuidado <Arrow /></a>
          </div>
        </div>
        <div className="portrait-scroll"><div className="portrait-entrance"><Image src="/images/rudy-recorte.png" alt="Rudy Mollick de jaleco, segurando um modelo anatômico da coluna vertebral" width={1092} height={1441} className="rudy-portrait" sizes="(max-width: 899px) 90vw, 53vw" priority /></div></div>
        <div className="portrait-caption"><span className="caption-cross" aria-hidden="true">+</span><div><strong>Rudy Mollick</strong><span>Fisioterapia Manipulativa</span></div></div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-footer flex items-center justify-between"><a href="#cuidado" className="scroll-cue"><span className="scroll-mouse" aria-hidden="true"><span /></span> CONTINUE O MOVIMENTO <span aria-hidden="true">↓</span></a><span className="hero-footer-note">CIÊNCIA NO CUIDADO. <span>PRESENÇA EM CADA MOVIMENTO.</span></span><span className="chapter-index">01 <span>/ 03</span></span></div>
      </section>
    </div>

    <section id="cuidado" className="care-section">
      <div className="section-reveal section-label"><span>01 — O CUIDADO</span><span aria-hidden="true">↘</span></div>
      <div className="care-grid"><h2 className="section-reveal">O próximo passo<br />é <em>sobre você.</em></h2><div className="section-reveal care-copy"><p>Seu corpo conta uma história. Sua rotina, seus limites e os movimentos que fazem falta são o ponto de partida para uma conversa sobre o seu cuidado.</p><a href="#contato" className="text-link">Vamos começar essa conversa <Arrow diagonal /></a></div></div>
      <div className="care-bottom"><span>ESCUTAR.</span><span>COMPREENDER.</span><span className="text-cyan-300">CUIDAR.</span></div>
    </section>

    <section id="contato" className="contact-section"><p className="section-label">02 — SEU PRIMEIRO PASSO</p><h2>O que te move<br /><em>faz falta.</em></h2><p>Converse com Rudy sobre o seu atendimento.</p><motion.a className="primary-button" href="https://rudymollick.com.br/" whileHover={reducedMotion ? {} : { y: -3 }}>Acessar os canais de atendimento <span><Arrow diagonal /></span></motion.a><span className="contact-note">Você será direcionado ao site oficial do Rudy.</span></section>
    <footer className="site-footer flex flex-wrap items-center justify-between gap-5"><span>RUDY MOLLICK <span className="footer-divider">/</span> FISIOTERAPIA</span><a href="#inicio">Voltar ao início ↑</a></footer>
  </main>;
}
