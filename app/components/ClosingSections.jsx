'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contact, faqs, testimonials } from '../data/site-content';
import FoldText from './FoldText';

function Arrow() {
  return <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

function Instagram() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></svg>;
}

export default function ClosingSections() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const dialog = useRef(null);
  const patientContent = useRef(null);
  const layoutHeight = useRef(0);
  const refreshFrame = useRef(0);
  const reduced = useReducedMotion();
  const address = encodeURIComponent(contact.address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
  const quote = testimonials[quoteIndex];
  useLayoutEffect(() => {
    layoutHeight.current = patientContent.current?.offsetHeight ?? 0;
    return () => cancelAnimationFrame(refreshFrame.current);
  }, []);
  const refresh = () => {
    cancelAnimationFrame(refreshFrame.current);
    refreshFrame.current = requestAnimationFrame(() => {
      const height = patientContent.current?.offsetHeight ?? 0;
      if (height === layoutHeight.current) return;
      layoutHeight.current = height;
      // Only remeasure when content actually changes height, after scrolling
      // settles. A completed opacity tween must not reset every scene.
      ScrollTrigger.refresh(true);
    });
  };
  const whatsapp = () => {
    if (contact.whatsapp) window.open(`https://wa.me/${contact.whatsapp}`, '_blank', 'noopener,noreferrer');
    else dialog.current?.showModal();
  };

  return <div className="closing-story">
    <div className="patient-stage">
    <section id="depoimentos" className="patient-section" aria-labelledby="patient-title">
      <div className="patient-grain" aria-hidden="true" />
      <div className="patient-content" ref={patientContent}>
        <p className="section-label patient-kicker">05 — EXPERIÊNCIAS E DÚVIDAS</p>
        <div className="patient-grid">
          <div className="testimonial-column">
            <h2 id="patient-title"><span className="split-heading-lead">O que dizem</span><br /><em><FoldText text="os pacientes." /></em></h2>
            <p className="patient-intro">Conheça as experiências de quem já foi atendido pelo Dr. Rudy, nas avaliações publicadas no Google.</p>
            <div className="testimonial-card">
              <div className="testimonial-card-top"><span className="quote-mark" aria-hidden="true">“</span><span className="review-source">AVALIAÇÕES NO GOOGLE</span></div>
              <div className="testimonial-live" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={quoteIndex} initial={{ opacity: 0, x: reduced ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -12 }} transition={{ duration: reduced ? 0 : 0.2 }} onAnimationComplete={refresh}>
                    <span className="review-stars" role="img" aria-label={`${quote.rating} de 5 estrelas`}><span aria-hidden="true">{'★'.repeat(quote.rating)}</span></span>
                    <blockquote>{quote.quote}</blockquote>
                    <div className="testimonial-person"><span className="testimonial-avatar" aria-hidden="true">{quote.initials}</span><div><strong>{quote.name}</strong><span>Avaliação publicada no Google</span></div></div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="testimonial-controls"><span>0{quoteIndex + 1}<span> / 0{testimonials.length}</span></span><div><button type="button" aria-label="Depoimento anterior" onClick={() => setQuoteIndex((quoteIndex + testimonials.length - 1) % testimonials.length)}>←</button><button type="button" aria-label="Próximo depoimento" onClick={() => setQuoteIndex((quoteIndex + 1) % testimonials.length)}>→</button></div></div>
            </div>
            <p className="testimonial-note">Relatos individuais de pacientes. Cada experiência de cuidado é única.</p>
          </div>
          <div id="duvidas" className="faq-column">
            <span className="small-eyebrow">PERGUNTAS FREQUENTES</span>
            <h2><span className="split-heading-lead">Antes do</span><br /><em><FoldText text="primeiro passo." /></em></h2>
            <div className="faq-list">
              {faqs.map((faq, index) => <div className="faq-item" key={faq.question}>
                <h3><button id={`faq-question-${index}`} aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="faq-number">0{index + 1}</span><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">{openFaq === index ? '−' : '+'}</span></button></h3>
                <AnimatePresence initial={false}>{openFaq === index && <motion.div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} onAnimationComplete={refresh}><p>{faq.answer}</p></motion.div>}</AnimatePresence>
              </div>)}
            </div>
            <button type="button" className="primary-button faq-contact" onClick={whatsapp}>Falar com o Dr. Rudy no WhatsApp <span><Arrow /></span></button>
          </div>
        </div>
        <div className="patient-bottom"><span>O PRÓXIMO PASSO COMEÇA COM UMA CONVERSA.</span><a href="#contato">ENCONTRE O RUDY <span aria-hidden="true">↓</span></a></div>
      </div>
    </section>
    </div>

    <div className="closing-shell">
      <div className="closing-scene">
        <div className="closing-backdrop" aria-hidden="true"><Image src="/images/rudy-logo.png" width={2167} height={726} alt="" className="closing-watermark" sizes="100vw" /><div className="closing-orbit" /></div>
        <section id="contato" className="contact-final" aria-labelledby="contact-title">
          <p className="section-label">06 — LOCALIZAÇÃO E AGENDAMENTO</p>
          <div className="contact-main-grid">
            <div className="contact-intro">
              <h2 id="contact-title"><FoldText text="Seu próximo" /><br /><FoldText text="movimento" /><br /><em><FoldText text="começa aqui." /></em></h2>
              <p>Uma conversa para entender você.<br />Um primeiro passo para o seu cuidado.</p>
              <button type="button" className="primary-button contact-whatsapp" onClick={whatsapp}>Conversar pelo WhatsApp <span><Arrow /></span></button>
              <span className="contact-phone">WhatsApp · {contact.whatsappLabel}</span>
            </div>
            <div className="contact-location">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="map-frame" aria-label="Abrir localização do consultório no Google Maps">
                <picture>
                  <source media="(max-width:899px)" srcSet="/images/location-map-mobile.png" />
                  <Image src="/images/location-map.png" alt="Mapa do Google com a localização do atendimento na Rua Walter Duarte Pereira, 1620, Capim Macio, Natal" width={2200} height={1000} className="map-static-image" sizes="(max-width:899px) 86vw, 43vw" />
                </picture>
              </a>
              <div className="location-caption"><span>UM LUGAR PARA CUIDAR DE VOCÊ.</span><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Traçar rota <Arrow /></a></div>
              <div className="contact-detail-grid">
                <div><h3>ONDE ENCONTRAR</h3><address>{contact.address}</address></div>
                <div><h3>HORÁRIOS</h3><p>{contact.hours}</p></div>
              </div>
            </div>
          </div>
        </section>

        <footer className="final-footer">
          <div className="footer-main"><a href="#inicio" aria-label="Rudy Mollick, voltar ao início"><Image src="/images/rudy-logo.png" width={2167} height={726} alt="Rudy Mollick — Fisioterapia Manipulativa" className="footer-logo" sizes="180px" /></a><div><span className="footer-heading">CONTATO</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div><div><span className="footer-heading">ACOMPANHE</span><a className="footer-instagram" href={contact.instagram} target="_blank" rel="noopener noreferrer"><Instagram /> Instagram <Arrow /></a></div><a href="#inicio" className="footer-top">Voltar ao início ↑</a></div>
          <div className="footer-legal"><span>Rudy Mollick · Fisioterapeuta{contact.registration ? ` · ${contact.registration}` : ''}</span><Link href="/privacidade">Política de privacidade</Link><span>© 2026 Rudy Mollick</span></div>
        </footer>
      </div>
    </div>

    <dialog ref={dialog} className="whatsapp-dialog" aria-labelledby="whatsapp-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><div><button className="dialog-close" type="button" aria-label="Fechar aviso" onClick={() => dialog.current.close()}>×</button><span className="small-eyebrow">FALE COM O RUDY</span><h2 id="whatsapp-dialog-title">Vamos <em>conversar?</em></h2><p>O número de WhatsApp desta prévia é demonstrativo. Enquanto isso, você pode entrar em contato pelo Instagram oficial.</p><a className="primary-button" href={contact.instagram} target="_blank" rel="noopener noreferrer">Abrir Instagram <span><Arrow /></span></a></div></dialog>
  </div>;
}
