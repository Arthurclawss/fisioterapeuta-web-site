# Rudy Mollick — hero

Hero e seções de apoio em Next.js (App Router), React, Tailwind CSS, GSAP/ScrollTrigger e Framer Motion. Node.js 20.9 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. Para gerar a versão estática: `npm run build` (saída em `out/`).

## Efeitos

- GSAP controla a entrada de texto e foto. ScrollTrigger fixa a cena no desktop: o texto inicial sai, o retrato se desloca para a esquerda e, após a foto parar, entra o conteúdo de “Como posso te ajudar” à direita. Continuando a rolar, esse texto sai e dá lugar a “Conheça o Rudy”, mantendo a mesma imagem na mesma posição. Ao rolar de volta, a sequência se inverte.
- Em telas menores, o parallax é leve e não prende a rolagem.
- Framer Motion controla os botões e a abertura/saída do menu móvel, em elementos separados das transformações de GSAP.
- `prefers-reduced-motion` desativa as animações e preserva todo o conteúdo.
- A seção 04, “Tratamento especializado”, usa duas linhas alternadas de apresentação e seis destaques com ícones. Os blocos entram com GSAP/ScrollTrigger e o fundo acompanha a rolagem com parallax leve. Em telas menores, a composição vira uma coluna.
- No desktop, a cena do Rudy continua fixa durante mais uma tela de rolagem. A seção 04 sobe em uma camada opaca à frente até cobrir a tela, com uma sombra na borda superior. A sobreposição se inverte ao subir e é desativada com movimento reduzido.
- Ao chegar ao topo, a seção 04 mantém o enquadramento por mais 35% da altura da tela de rolagem (máximo de 420 px), depois libera a continuação. Essa pausa é controlada pelo ScrollTrigger `treatment-hold` e não se aplica ao celular ou à preferência por movimento reduzido.
- Os efeitos de spotlight nos cartões, título por palavras e reflexo no botão são implementações próprias inspiradas nos componentes [Spotlight Card](https://reactbits.dev/components/spotlight-card), [Split Text](https://reactbits.dev/text-animations/split-text) e [Glare Hover](https://reactbits.dev/animations/glare-hover) do React Bits. Não foi adicionada uma dependência do React Bits. O título usa GSAP; os cartões usam CSS e Framer Motion. Os efeitos de cursor não escondem conteúdo e são desativados em telas de toque e com movimento reduzido.
- Os seis cartões inclinam até 6 graus, com perspectiva de 900 px e escala de 1,018. O lado sob o cursor recua e o oposto avança. Molas do Framer Motion suavizam a resposta e o retorno ao retirar o cursor. O efeito não interfere nas transformações de entrada aplicadas ao contêiner pelo GSAP.

## Conteúdo e imagens

O logo aparece ampliado como marca-d’água no fundo da cena principal, com opacidade de 8,5% e parallax discreto. É decorativo, fica atrás da foto e dos textos, e não intercepta cliques.

Os PNGs com transparência estão em `public/images`. Foram preparados com edição por IA a partir dos arquivos enviados; revisar detalhes de marca e rosto antes de publicar.

O botão de atendimento leva ao site oficial porque o WhatsApp ainda não foi confirmado. A hero principal é acompanhada de duas seções curtas para demonstrar a transição na rolagem. Não há envio de formulário nem coleta de dados.
