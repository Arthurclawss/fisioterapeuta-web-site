export const contact = {
  address: 'Rua Walter Duarte Pereira, 1620 - Capim Macio, Natal - RN, 59082-470',
  instagram: 'https://www.instagram.com/dr.rudymollick/',
  email: 'rudymollick@outlook.com',
  // Temporary contact supplied by the site owner; preserve the supplied digits.
  whatsapp: '558488734892',
  whatsappLabel: '(84) 8873-4892',
  hours: 'Atendimento exclusivo mediante agendamento prévio.',
  registration: null,
};

// Transcribed from the Google Maps review screenshots supplied by the owner.
// Ratings refer to these individual reviews, not an aggregate business rating.
export const testimonials = [
  { name: 'Milena Assis', initials: 'MA', rating: 5, quote: 'Ótimo profissional, ambiente perfeito aconchegante, super recomendo.' },
  { name: 'Ricardo Addario', initials: 'RA', rating: 5, quote: 'Profissionalismo de primeira, muito gente boa e atencioso 🙏🏻' },
  { name: 'Marreiros Almeida', initials: 'MA', rating: 5, quote: 'Rudy tem um atendimento especial. É super atencioso e da atenção ao real problema apresentado, com um acompanhamento incrível. Ele realmente tem uma técnica eficaz e de um resultado visto a curto prazo. Indico a todos.' },
];

export const faqs = [
  { question: 'Como faço para agendar uma avaliação?', answer: 'Entre em contato pelo WhatsApp para consultar a disponibilidade e combinar seu atendimento. Você também pode falar pelo Instagram.' },
  { question: 'Quanto tempo dura a consulta?', answer: 'A duração depende do atendimento. Confirme o tempo previsto ao agendar para organizar sua rotina com tranquilidade.' },
  { question: 'Quais são as formas de pagamento?', answer: 'Consulte os valores e as formas de pagamento diretamente com o Rudy antes de confirmar o seu horário.' },
  { question: 'O que devo levar à primeira consulta?', answer: 'Ao agendar, pergunte quais documentos e exames anteriores são necessários para o seu atendimento.' },
  { question: 'Como encontro o local de atendimento?', answer: `O endereço informado é ${contact.address}. Você pode consultar o mapa e traçar sua rota na seção de localização.` },
];
