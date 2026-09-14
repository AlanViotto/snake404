# Snake404.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=000)](#)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-success)](#)

A lightweight, dependency-free Snake game made especially for **404 pages**, error screens and playful web experiences.

**Created by [Alan Viotto](http://linkedin.com/in/AlanViotto) | [Viotto & Co.](https://viotto.digital)**

🎮 **[Play the demo](https://alanviotto.github.io/snake404/)**

Try the Classic, Ocean, Sunset and Violet palettes in the demo, or customize the background, grid, snake, head and food colors. Switch between dark/light modes and 1:1, 4:5, 9:16 and 16:9 aspect ratios. Changing the aspect ratio restarts the game; color changes apply immediately.

## Features

- Zero dependencies
- Canvas 2D
- UMD for `<script>`
- ES Modules for modern bundlers
- CommonJS compatibility via UMD
- TypeScript definitions
- Responsive layout
- Keyboard: arrow keys and WASD
- Touch/swipe
- Mobile controls
- High score in `localStorage`
- Pause on window blur
- Customizable themes and labels
- Events/callbacks for analytics
- Programmatic API
- Automatic initialization via `data-snake404`
- MIT License

## Plain HTML

```html
<link rel="stylesheet" href="/snake404/snake404.css">

<div id="snake404"></div>

<script src="/snake404/snake404.js"></script>
<script>
  Snake404.init("#snake404");
</script>
```

Or without manual JavaScript initialization:

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

## ES Modules in the browser

```html
<link rel="stylesheet" href="/snake404/snake404.css">
<div id="snake404"></div>

<script type="module">
  import Snake404 from "/snake404/snake404.esm.js";
  Snake404.init("#snake404");
</script>
```

## Customization

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
    subtitle: "You are lost. So is the snake.",
    start: "Start",
    restart: "Try again"
  },
  onScore(score) {
    console.log("Score:", score);
  },
  onGameOver(score) {
    console.log("Game over:", score);
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

## Main options

| Option | Default | Description |
|---|---:|---|
| `cellSize` | `20` | Approximate size of each cell in pixels |
| `speed` | `110` | Initial movement interval in milliseconds |
| `minSpeed` | `55` | Minimum movement interval in milliseconds |
| `speedStep` | `2` | Movement interval reduction per point in milliseconds |
| `initialLength` | `4` | Initial snake length |
| `pauseOnBlur` | `true` | Pause when switching windows |
| `wrap` | `false` | Allow wrapping through walls |
| `showScore` | `true` | Show the score |
| `showControls` | `true` | Show mobile controls |
| `autoStart` | `false` | Start automatically |

## Compatibility

The package works with any technology that delivers HTML and JavaScript to the browser. Examples:

- Static HTML
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

## Author

**[Alan Viotto](http://linkedin.com/in/AlanViotto) | [Viotto & Co.](https://viotto.digital)**

## License

MIT. Personal and commercial use permitted.
