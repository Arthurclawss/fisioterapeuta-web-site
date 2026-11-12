export const contact = {
  address: 'Rua Walter Duarte Pereira, 1620 - Capim Macio, Natal - RN, 59082-470',
  instagram: 'https://www.instagram.com/dr.rudymollick/',
  email: 'rudymollick@outlook.com',
  // Deliberately non-routable display value, requested for this demonstration.
  whatsapp: null,
  whatsappLabel: '(84) 9XXXX-XXXX',
  hours: 'Consulte a disponibilidade ao agendar.',
  registration: null,
};

// These are fictional examples explicitly requested by the owner.
// Keep the visible illustrative label until replaced with authorized real quotes.
export const testimonials = [
  { name: 'Marina A.', initials: 'MA', quote: 'Ter espaço para explicar o que eu estava sentindo fez toda a diferença. Gostei de entender cada etapa do cuidado.' },
  { name: 'Lucas R.', initials: 'LR', quote: 'A conversa foi clara e atenciosa. Pude falar sobre minha rotina e tirar minhas dúvidas com tranquilidade.' },
  { name: 'Cláudia M.', initials: 'CM', quote: 'O que mais gostei foi da atenção aos detalhes e da forma simples de explicar os próximos passos.' },
];

export const faqs = [
  { question: 'Como faço para agendar uma avaliação?', answer: 'Entre em contato pelos canais do Rudy para consultar a disponibilidade e combinar seu atendimento. Nesta demonstração, você pode falar pelo Instagram.' },
  { question: 'Quanto tempo dura a consulta?', answer: 'A duração depende do atendimento. Confirme o tempo previsto ao agendar para organizar sua rotina com tranquilidade.' },
  { question: 'Quais são as formas de pagamento?', answer: 'Consulte os valores e as formas de pagamento diretamente com o Rudy antes de confirmar o seu horário.' },
  { question: 'O que devo levar à primeira consulta?', answer: 'Ao agendar, pergunte quais documentos e exames anteriores são necessários para o seu atendimento.' },
  { question: 'Como encontro o local de atendimento?', answer: `O endereço informado é ${contact.address}. Você pode consultar o mapa e traçar sua rota na seção de localização.` },
];
