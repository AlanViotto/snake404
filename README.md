# Snake404.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=000)](#)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-success)](#)

A lightweight, dependency-free Snake game made especially for **404 pages**, error screens and playful web experiences.

**Created by [Alan Viotto](https://github.com/AlanViotto) | [Viotto & Co.](https://viotto.digital)**

🎮 **[Jogue o demo](https://alanviotto.github.io/snake404/)**

## Recursos

- Zero dependências
- Canvas 2D
- UMD para `<script>`
- ES Modules para bundlers modernos
- CommonJS compatibility via UMD
- TypeScript definitions
- Responsivo
- Teclado: setas e WASD
- Touch/swipe
- Controles mobile
- Recorde em `localStorage`
- Pausa ao perder foco
- Temas e textos customizáveis
- Eventos/callbacks para analytics
- API programática
- Inicialização automática via `data-snake404`
- MIT License

## HTML puro

```html
<link rel="stylesheet" href="/snake404/snake404.css">

<div id="snake404"></div>

<script src="/snake404/snake404.js"></script>
<script>
  Snake404.init("#snake404");
</script>
```

Ou sem JavaScript manual:

```html
<div data-snake404></div>
<script src="/snake404/snake404.js"></script>
```

## PHP

```php
<?php http_response_code(404); ?>

<link rel="stylesheet" href="/assets/snake404.css">
<div id="snake404"></div>

<script src="/assets/snake404.js"></script>
<script>
  Snake404.init("#snake404");
</script>
```

## npm / Vite / Webpack / Parcel

```bash
npm install snake404
```

```js
import Snake404 from "snake404";
import "snake404/dist/snake404.css";

const game = Snake404.init("#snake404");
```

## React

```jsx
import { useEffect, useRef } from "react";
import Snake404 from "snake404";
import "snake404/dist/snake404.css";

export default function NotFound() {
  const root = useRef(null);

  useEffect(() => {
    const game = Snake404.init(root.current);
    return () => game.destroy();
  }, []);

  return <div ref={root} />;
}
```

## Next.js

Use a Client Component:

```jsx
"use client";

import { useEffect, useRef } from "react";
import Snake404 from "snake404";
import "snake404/dist/snake404.css";

export default function NotFound() {
  const root = useRef(null);

  useEffect(() => {
    const game = Snake404.init(root.current);
    return () => game.destroy();
  }, []);

  return <div ref={root} />;
}
```

## Vue

```vue
<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import Snake404 from "snake404";
import "snake404/dist/snake404.css";

const el = ref(null);
let game;

onMounted(() => {
  game = Snake404.init(el.value);
});

onBeforeUnmount(() => {
  game?.destroy();
});
</script>

<template>
  <div ref="el"></div>
</template>
```

## Svelte

```svelte
<script>
  import { onMount } from "svelte";
  import Snake404 from "snake404";
  import "snake404/dist/snake404.css";

  let el;

  onMount(() => {
    const game = Snake404.init(el);
    return () => game.destroy();
  });
</script>

<div bind:this={el}></div>
```

## ES Module direto no navegador

```html
<link rel="stylesheet" href="/snake404/snake404.css">
<div id="snake404"></div>

<script type="module">
  import Snake404 from "/snake404/snake404.esm.js";
  Snake404.init("#snake404");
</script>
```

## Personalização

```js
Snake404.init("#snake404", {
  speed: 100,
  wrap: false,
  theme: {
    background: "#050505",
    snake: "#fff",
    snakeHead: "#d6ff58",
    food: "#ff4d6d",
    grid: "rgba(255,255,255,.04)"
  },
  labels: {
    title: "404",
    subtitle: "Você se perdeu. A cobrinha também.",
    start: "Começar",
    restart: "Tentar de novo"
  },
  onScore(score) {
    console.log("Pontos:", score);
  },
  onGameOver(score) {
    console.log("Fim:", score);
  }
});
```

## CSS custom properties

```css
#snake404 {
  --snake404-accent: #ffd400;
  --snake404-bg: #090909;
  --snake404-panel: #111;
}
```

## API

```js
const game = Snake404.init("#snake404");

game.start();
game.pause();
game.resume();
game.togglePause();
game.destroy();
```

## Principais opções

| Opção | Padrão | Descrição |
|---|---:|---|
| `cellSize` | `20` | Tamanho aproximado de cada célula |
| `speed` | `110` | Intervalo inicial em ms |
| `minSpeed` | `55` | Limite mínimo de velocidade |
| `speedStep` | `2` | Quanto acelera por ponto |
| `initialLength` | `4` | Comprimento inicial |
| `pauseOnBlur` | `true` | Pausa ao trocar de janela |
| `wrap` | `false` | Permite atravessar paredes |
| `showScore` | `true` | Exibe pontuação |
| `showControls` | `true` | Exibe controles mobile |
| `autoStart` | `false` | Inicia automaticamente |

## Compatibilidade

O pacote é compatível com qualquer tecnologia que entregue HTML e JavaScript ao navegador. Exemplos:

- HTML estático
- PHP
- WordPress
- Laravel
- Symfony
- React
- Next.js
- Vue
- Nuxt
- Svelte
- Astro
- Angular
- Django/Jinja
- Flask
- Ruby on Rails
- ASP.NET Razor
- Java/JSP
- Shopify themes
- Electron
- Capacitor
- WebViews

## Publicação

O `package.json` já está preparado para publicação no npm.

Antes de publicar, altere:

- confirme se o nome `snake404` está disponível no npm
- revise a versão antes de cada release

Depois:

```bash
npm login
npm publish
```

## Repositório público

Repositório oficial planejado:

```text
https://github.com/AlanViotto/snake404
```

Clone:

```bash
git clone https://github.com/AlanViotto/snake404.git
cd snake404
```

A proposta do projeto é ser simples de incorporar, fácil de customizar e livre para uso em projetos pessoais e comerciais.

Contribuições, issues e pull requests são bem-vindos.

## Autor

**Alan Viotto | Viotto & Co.**

- Website: https://viotto.digital
- GitHub: https://github.com/AlanViotto

## Licença

MIT. Uso comercial e pessoal permitido.
