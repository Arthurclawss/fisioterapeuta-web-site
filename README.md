# Rudy Mollick — hero

Hero e seções de apoio em Next.js (App Router), React, Tailwind CSS, GSAP/ScrollTrigger e Framer Motion. Node.js 20.9 ou superior.

A rolagem suave global usa Lenis, sincronizado ao ticker do GSAP e ao ScrollTrigger. Links de navegação e transições compartilham o mesmo controlador. Gestos de toque continuam nativos; movimento reduzido desativa o controlador. A entrada da seção 04 usa o progresso real da rolagem, sem uma segunda camada de atraso sobre o Lenis.

A sobreposição da seção 04 só é ativada com a classe `motion-ready`, dentro do efeito de layout que prepara as animações. Antes da hidratação, ela permanece no fluxo normal, evitando aparecer sobre a hero. Os elementos de entrada também têm uma base de opacidade no CSS para não exibir um quadro visível antes do GSAP definir seus estados. Sem JavaScript ou com movimento reduzido, o conteúdo segue visível.

As seções 02 e 03 compartilham uma camada contínua de escurecimento para evitar pulsos de cor na troca. Textos planos usam transformações 2D; a perspectiva fica apenas nas peças do Fold Text. Os títulos não recebem uma segunda entrada de opacidade no contêiner. As entradas de tratamento e depoimentos preservam seus estados ao recalcular o layout, e FAQ/depoimentos só solicitam recálculo quando a altura muda. No celular, as entradas tocam uma vez por visita para evitar reinícios junto aos limites de rolagem.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. Para gerar a versão estática: `npm run build` (saída em `out/`).

## Efeitos

- Os títulos usam adaptações dos efeitos [Fold Text](https://reactbits.dev/text-animations/fold-text) e [Split Text](https://reactbits.dev/text-animations/split-text). A dobra em perspectiva aparece na hero, nas frases azuis de tratamento, depoimentos e FAQ, e na frase final de agendamento. O plugin GSAP SplitText divide a primeira linha do tratamento em letras e os títulos de cuidado, apresentação, etapas, depoimentos e FAQ em palavras. As mesmas timelines controlam texto e cenas. A seção 04 preserva seu atraso de chegada; as dobras das seções 04 e 05 se abrem durante a subida. Sem JavaScript ou com movimento reduzido, o texto permanece legível.

- GSAP controla a entrada de texto e foto. ScrollTrigger fixa a cena no desktop: o texto inicial sai, o retrato se desloca para a esquerda e, após a foto parar, entra o conteúdo de “Como posso te ajudar” à direita. Continuando a rolar, esse texto sai e dá lugar a “Conheça o Rudy”, mantendo a mesma imagem na mesma posição. Ao rolar de volta, a sequência se inverte.
- Em telas menores, o parallax é leve e não prende a rolagem.
- Framer Motion controla os botões e a abertura/saída do menu móvel, em elementos separados das transformações de GSAP.
- `prefers-reduced-motion` desativa as animações e preserva todo o conteúdo.
- A seção 04, “Tratamento especializado”, reúne a apresentação e três cartões de abordagem. Abaixo, “Como funciona o seu cuidado?” ocupa toda a largura, com conversa, avaliação e orientação. No celular, a sequência fica vertical. Os blocos entram com GSAP/ScrollTrigger e o fundo acompanha a rolagem com parallax leve.
- No desktop, a cena do Rudy continua fixa durante mais uma tela de rolagem. A seção 04 sobe em uma camada opaca à frente até cobrir a tela, com uma sombra na borda superior. A sobreposição se inverte ao subir e é desativada com movimento reduzido.
- Ao chegar ao topo, a seção 04 mantém o enquadramento por mais 25% da altura da tela de rolagem (máximo de 320 px), depois libera a continuação. Essa pausa é controlada pelo ScrollTrigger `treatment-hold` e não se aplica ao celular ou à preferência por movimento reduzido.
- A entrada mais lenta dos elementos da seção 04 vai de `top 65%` até `top -15%`, terminando durante essa pausa. Os cartões e etapas têm intervalos maiores, sem reiniciar suas animações nos recálculos de layout.
- A chegada da seção 04 acompanha a rolagem nativa, sem salto automático nem bloqueio da roda do mouse. No desktop, título, textos, cartões e etapas aparecem gradualmente conforme a seção sobe, com suavização do ScrollTrigger. Ao parar a rolagem, a sequência permanece naquele ponto; ao subir, ela se inverte. O enquadramento ainda faz uma pausa breve ao chegar ao topo.
- Os efeitos de spotlight nos cartões, título por palavras e reflexo no botão são implementações próprias inspiradas nos componentes [Spotlight Card](https://reactbits.dev/components/spotlight-card), [Split Text](https://reactbits.dev/text-animations/split-text) e [Glare Hover](https://reactbits.dev/animations/glare-hover) do React Bits. Não foi adicionada uma dependência do React Bits. O título usa GSAP; os cartões usam CSS e Framer Motion. Os efeitos de cursor não escondem conteúdo e são desativados em telas de toque e com movimento reduzido.
- Os três cartões inclinam até 6 graus, com perspectiva de 900 px e escala de 1,018. O lado sob o cursor recua e o oposto avança. Molas do Framer Motion suavizam a resposta e o retorno ao retirar o cursor. O efeito não interfere nas transformações de entrada aplicadas ao contêiner pelo GSAP.

## Conteúdo e imagens

As seções 05 e 06 incluem três avaliações do Google transcritas das imagens fornecidas pelo proprietário, perguntas frequentes em acordeão, imagem estática do mapa do Google, endereço, Instagram, contato e rodapé. A seção 05 sobe sobre a cena de contato fixa, revelando-a por baixo no desktop; em celular, telas baixas e movimento reduzido, ambas seguem o fluxo normal.

Os dados ficam em `app/data/site-content.js`. O endereço, Instagram e WhatsApp temporário foram fornecidos pelo proprietário. O e-mail foi conferido no [perfil público do Rudy](https://linktr.ee/Dr.rudymollick). Os botões do FAQ e agendamento abrem o número temporário; substitua `contact.whatsapp` e `contact.whatsappLabel` ao receber o contato definitivo do Rudy. Horários, registro profissional, duração e pagamento ainda dependem de confirmação.

O mapa usa duas capturas estáticas do Google Maps do endereço fornecido, em `public/images/location-map.png` e `location-map-mobile.png`, mantendo o marcador e a atribuição visíveis. O escurecimento é aplicado por CSS. Nenhum iframe é carregado; “Traçar rota” abre o endereço no Google Maps. A política de privacidade fica em `/privacidade` e descreve esse comportamento. O atendimento é informado como exclusivo mediante agendamento prévio.

O logo aparece ampliado como marca-d’água no fundo da cena principal, com opacidade de 8,5% e parallax discreto. É decorativo, fica atrás da foto e dos textos, e não intercepta cliques.

Os PNGs com transparência estão em `public/images`. Foram preparados com edição por IA a partir dos arquivos enviados; revisar detalhes de marca e rosto antes de publicar.

Não há envio de formulário nem coleta de dados clínicos pelo site.
