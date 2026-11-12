# Rudy Mollick — hero

Hero e seções de apoio em Next.js (App Router), React, Tailwind CSS, GSAP/ScrollTrigger e Framer Motion. Node.js 20.9 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. Para gerar a versão estática: `npm run build` (saída em `out/`).

## Efeitos

- GSAP controla a entrada de texto e foto. ScrollTrigger fixa a cena no desktop: o texto inicial sai, o retrato se desloca para a esquerda e, após a foto parar, entra o conteúdo de “Como posso te ajudar” à direita. Ao rolar de volta, a sequência se inverte.
- Em telas menores, o parallax é leve e não prende a rolagem.
- Framer Motion controla os botões e a abertura/saída do menu móvel, em elementos separados das transformações de GSAP.
- `prefers-reduced-motion` desativa as animações e preserva todo o conteúdo.

## Conteúdo e imagens

Os PNGs com transparência estão em `public/images`. Foram preparados com edição por IA a partir dos arquivos enviados; revisar detalhes de marca e rosto antes de publicar.

O botão de atendimento leva ao site oficial porque o WhatsApp ainda não foi confirmado. A hero principal é acompanhada de duas seções curtas para demonstrar a transição na rolagem. Não há envio de formulário nem coleta de dados.
