'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contact, faqs, testimonials } from '../data/site-content';

function Arrow() {
  return <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

function Instagram() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></svg>;
}

export default function ClosingSections() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const dialog = useRef(null);
  const reduced = useReducedMotion();
  const address = encodeURIComponent(contact.address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
  const quote = testimonials[quoteIndex];
  const refresh = () => ScrollTrigger.refresh();
  const whatsapp = () => {
    if (contact.whatsapp) window.open(`https://wa.me/${contact.whatsapp}`, '_blank', 'noopener,noreferrer');
    else dialog.current?.showModal();
  };

  return <div className="closing-story">
    <div className="patient-stage">
    <section id="depoimentos" className="patient-section" aria-labelledby="patient-title">
      <div className="patient-grain" aria-hidden="true" />
      <div className="patient-content">
        <p className="section-label patient-kicker">05 — EXPERIÊNCIAS E DÚVIDAS</p>
        <div className="patient-grid">
          <div className="testimonial-column">
            <h2 id="patient-title">Cada pessoa,<br /><em>uma história.</em></h2>
            <p className="patient-intro">Escutar faz parte do cuidado. Conheça este espaço dedicado às experiências dos pacientes.</p>
            <div className="testimonial-card">
              <div className="testimonial-card-top"><span className="quote-mark" aria-hidden="true">“</span><span className="demo-label">DEPOIMENTOS ILUSTRATIVOS</span></div>
              <div className="testimonial-live" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={quoteIndex} initial={{ opacity: 0, x: reduced ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -12 }} transition={{ duration: reduced ? 0 : 0.2 }}>
                    <blockquote>{quote.quote}</blockquote>
                    <div className="testimonial-person"><span className="testimonial-avatar" aria-hidden="true">{quote.initials}</span><div><strong>{quote.name}</strong><span>Personagem fictício · exemplo de relato</span></div></div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="testimonial-controls"><span>0{quoteIndex + 1}<span> / 0{testimonials.length}</span></span><div><button type="button" aria-label="Depoimento anterior" onClick={() => setQuoteIndex((quoteIndex + testimonials.length - 1) % testimonials.length)}>←</button><button type="button" aria-label="Próximo depoimento" onClick={() => setQuoteIndex((quoteIndex + 1) % testimonials.length)}>→</button></div></div>
            </div>
            <p className="testimonial-note">Relatos fictícios usados apenas para apresentar o layout.</p>
          </div>
          <div id="duvidas" className="faq-column">
            <span className="small-eyebrow">PERGUNTAS FREQUENTES</span>
            <h2>Antes do<br /><em>primeiro passo.</em></h2>
            <div className="faq-list">
              {faqs.map((faq, index) => <div className="faq-item" key={faq.question}>
                <h3><button id={`faq-question-${index}`} aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="faq-number">0{index + 1}</span><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">{openFaq === index ? '−' : '+'}</span></button></h3>
                <AnimatePresence initial={false}>{openFaq === index && <motion.div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} onAnimationComplete={refresh}><p>{faq.answer}</p></motion.div>}</AnimatePresence>
              </div>)}
            </div>
            <a href="#contato" className="text-link faq-contact">Ainda ficou com alguma dúvida? <Arrow /></a>
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
              <h2 id="contact-title">Seu próximo<br />movimento<br /><em>começa aqui.</em></h2>
              <p>Uma conversa para entender você.<br />Um primeiro passo para o seu cuidado.</p>
              <button type="button" className="primary-button contact-whatsapp" onClick={whatsapp}>Conversar pelo WhatsApp <span><Arrow /></span></button>
              <span className="contact-demo-note">WhatsApp demonstrativo · {contact.whatsappLabel}</span>
            </div>
            <div className="contact-location">
              <div className="map-frame">
                {mapLoaded ? <iframe title="Localização do atendimento de Rudy Mollick no Google Maps" src={`https://maps.google.com/maps?q=${address}&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <div className="map-preview"><div className="map-roads" aria-hidden="true" /><span className="map-pin" aria-hidden="true"><svg width="28" height="34" viewBox="0 0 24 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11c0 7-9 16-9 16S3 18 3 11a9 9 0 0 1 18 0Z" /><circle cx="12" cy="11" r="3" /></svg></span><span>CAPIM MACIO · NATAL, RN</span><button type="button" onClick={() => setMapLoaded(true)}>Carregar mapa do Google <Arrow /></button></div>}
              </div>
              <div className="location-caption"><span>UM LUGAR PARA CUIDAR DE VOCÊ.</span><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Traçar rota <Arrow /></a></div>
              <div className="contact-detail-grid">
                <div><h3>ONDE ENCONTRAR</h3><address>{contact.address}</address></div>
                <div><h3>HORÁRIOS</h3><p>{contact.hours}</p><a href={contact.instagram} target="_blank" rel="noopener noreferrer">Consultar pelo Instagram ↗</a></div>
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
