const DEFAULTS = {
  cellSize: 20,
  speed: 110,
  minSpeed: 55,
  speedStep: 2,
  initialLength: 4,
  pauseOnBlur: true,
  wrap: false,
  showScore: true,
  showControls: true,
  autoStart: false,
  theme: {
    background: "#0b0d10",
    grid: "rgba(255,255,255,.045)",
    snake: "#ffffff",
    snakeHead: "#c7ff5e",
    food: "#ff5e7a"
  },
  labels: {
    title: "404",
    subtitle: "Página não encontrada. Pelo menos o Snake está aqui.",
    start: "Jogar",
    restart: "Jogar novamente",
    score: "Pontos",
    best: "Recorde",
    hint: "Use as setas/WASD ou deslize na tela.",
    paused: "Pausado",
    gameOver: "Fim de jogo",
    continue: "Continuar"
  },
  onStart: null,
  onScore: null,
  onGameOver: null
};

const DIRS = {
  ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 }
};

function merge(a, b) {
  const out = { ...a };
  if (!b) return out;
  for (const key of Object.keys(b)) {
    out[key] = (
      b[key] && typeof b[key] === "object" && !Array.isArray(b[key]) &&
      a[key] && typeof a[key] === "object" && !Array.isArray(a[key])
    ) ? merge(a[key], b[key]) : b[key];
  }
  return out;
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

class SnakeGame {
  constructor(target, options = {}) {
    if (typeof document === "undefined") {
      throw new Error("Snake404 requires a browser DOM.");
    }

    this.root = typeof target === "string" ? document.querySelector(target) : target;
    if (!this.root) throw new Error("Snake404: target element not found.");

    this.options = merge(DEFAULTS, options);
    this.storageKey = "snake404-best";
    this.best = this.readBest();
    this.running = false;
    this.paused = false;
    this.raf = null;
    this.lastFrame = 0;
    this.accumulator = 0;
    this.touchStart = null;
    this.resizeObserver = null;

    this.keyHandler = this.onKeyDown.bind(this);
    this.blurHandler = this.onBlur.bind(this);

    this.mount();
    this.resize();
    this.reset();

    if (this.options.autoStart) this.start();
  }

  readBest() {
    try {
      return parseInt(localStorage.getItem(this.storageKey) || "0", 10);
    } catch {
      return 0;
    }
  }

  writeBest() {
    try {
      localStorage.setItem(this.storageKey, String(this.best));
    } catch {}
  }

  mount() {
    this.root.classList.add("snake404");
    this.root.setAttribute("tabindex", "0");

    this.root.innerHTML = `
      <div class="snake404__shell">
        <div class="snake404__copy">
          <div class="snake404__eyebrow">${esc(this.options.labels.title)}</div>
          <h1 class="snake404__title">${esc(this.options.labels.subtitle)}</h1>
          <div class="snake404__stats" ${this.options.showScore ? "" : "hidden"}>
            <span>${esc(this.options.labels.score)} <strong data-score>0</strong></span>
            <span>${esc(this.options.labels.best)} <strong data-best>${this.best}</strong></span>
          </div>
        </div>

        <div class="snake404__stage">
          <canvas class="snake404__canvas" aria-label="Snake game"></canvas>
          <div class="snake404__overlay" data-overlay>
            <div class="snake404__overlayCard">
              <strong class="snake404__overlayTitle" data-overlay-title>${esc(this.options.labels.title)}</strong>
              <span class="snake404__overlayText" data-overlay-text>${esc(this.options.labels.hint)}</span>
              <button class="snake404__button" type="button" data-action="start">${esc(this.options.labels.start)}</button>
            </div>
          </div>
        </div>

        <div class="snake404__controls" ${this.options.showControls ? "" : "hidden"}>
          <button type="button" data-dir="ArrowUp" aria-label="Cima">↑</button>
          <div>
            <button type="button" data-dir="ArrowLeft" aria-label="Esquerda">←</button>
            <button type="button" data-dir="ArrowDown" aria-label="Baixo">↓</button>
            <button type="button" data-dir="ArrowRight" aria-label="Direita">→</button>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.root.querySelector(".snake404__canvas");
    this.ctx = this.canvas.getContext("2d");
    this.scoreEl = this.root.querySelector("[data-score]");
    this.bestEl = this.root.querySelector("[data-best]");
    this.overlay = this.root.querySelector("[data-overlay]");
    this.overlayTitle = this.root.querySelector("[data-overlay-title]");
    this.overlayText = this.root.querySelector("[data-overlay-text]");
    this.startBtn = this.root.querySelector('[data-action="start"]');

    this.startBtn.addEventListener("click", () => {
      if (this.running && this.paused) return this.resume();
      if (!this.running) this.start();
    });

    this.root.querySelectorAll("[data-dir]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setDirection(btn.dataset.dir);
        this.root.focus({ preventScroll: true });
        if (!this.running) this.start();
      });
    });

    this.canvas.addEventListener("pointerdown", (e) => {
      this.touchStart = { x: e.clientX, y: e.clientY };
    });

    this.canvas.addEventListener("pointerup", (e) => {
      if (!this.touchStart) return;
      const dx = e.clientX - this.touchStart.x;
      const dy = e.clientY - this.touchStart.y;
      const threshold = 18;

      if (Math.max(Math.abs(dx), Math.abs(dy)) >= threshold) {
        const code = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? "ArrowRight" : "ArrowLeft")
          : (dy > 0 ? "ArrowDown" : "ArrowUp");

        this.setDirection(code);
        if (!this.running) this.start();
      }
      this.touchStart = null;
    });

    document.addEventListener("keydown", this.keyHandler);
    window.addEventListener("blur", this.blurHandler);

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.root);
    } else {
      this.resizeFallback = () => this.resize();
      window.addEventListener("resize", this.resizeFallback);
    }
  }

  resize() {
    const stage = this.root.querySelector(".snake404__stage");
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.width = rect.width;
    this.height = rect.height;

    const cell = Math.max(12, this.options.cellSize);
    this.cols = Math.max(10, Math.floor(this.width / cell));
    this.rows = Math.max(10, Math.floor(this.height / cell));
    this.cellW = this.width / this.cols;
    this.cellH = this.height / this.rows;

    if (this.snake) {
      this.snake = this.snake.map((s) => ({
        x: Math.max(0, Math.min(this.cols - 1, s.x)),
        y: Math.max(0, Math.min(this.rows - 1, s.y))
      }));
      this.food = this.placeFood();
      this.draw();
    }
  }

  reset() {
    const cx = Math.floor(this.cols / 2);
    const cy = Math.floor(this.rows / 2);

    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.currentSpeed = this.options.speed;
    this.snake = [];

    for (let i = 0; i < this.options.initialLength; i++) {
      this.snake.push({ x: cx - i, y: cy });
    }

    this.food = this.placeFood();
    this.updateScore();
    this.draw();
  }

  start() {
    this.reset();
    this.running = true;
    this.paused = false;
    this.overlay.hidden = true;
    this.root.focus({ preventScroll: true });
    this.lastFrame = performance.now();
    this.accumulator = 0;

    if (typeof this.options.onStart === "function") this.options.onStart(this);

    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame((t) => this.loop(t));
  }

  pause() {
    if (!this.running || this.paused) return;
    this.paused = true;
    this.overlay.hidden = false;
    this.overlayTitle.textContent = this.options.labels.paused;
    this.overlayText.textContent = this.options.labels.hint;
    this.startBtn.textContent = this.options.labels.continue;
  }

  resume() {
    if (!this.running || !this.paused) return;
    this.paused = false;
    this.overlay.hidden = true;
    this.lastFrame = performance.now();
    this.accumulator = 0;
  }

  togglePause() {
    this.paused ? this.resume() : this.pause();
  }

  onBlur() {
    if (this.options.pauseOnBlur) this.pause();
  }

  onKeyDown(e) {
    const code = e.code || e.key;
    const focused = this.root === document.activeElement || this.root.contains(document.activeElement);

    if (code === "Space" && focused) {
      e.preventDefault();
      this.togglePause();
      return;
    }

    if (!DIRS[code] || !focused) return;

    e.preventDefault();
    this.setDirection(code);
    if (!this.running) this.start();
  }

  setDirection(code) {
    const next = DIRS[code];
    if (!next) return;

    const isOpposite =
      next.x === -this.direction.x &&
      next.y === -this.direction.y;

    if (!isOpposite) this.nextDirection = next;
  }

  loop(time) {
    if (!this.running) return;

    if (!this.paused) {
      const delta = Math.min(100, time - this.lastFrame);
      this.lastFrame = time;
      this.accumulator += delta;

      while (this.accumulator >= this.currentSpeed) {
        this.tick();
        this.accumulator -= this.currentSpeed;
        if (!this.running) break;
      }

      this.draw();
    } else {
      this.lastFrame = time;
    }

    if (this.running) {
      this.raf = requestAnimationFrame((t) => this.loop(t));
    }
  }

  tick() {
    this.direction = this.nextDirection;
    const head = this.snake[0];
    let nx = head.x + this.direction.x;
    let ny = head.y + this.direction.y;

    if (this.options.wrap) {
      nx = (nx + this.cols) % this.cols;
      ny = (ny + this.rows) % this.rows;
    } else if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows) {
      return this.gameOver();
    }

    const hitSelf = this.snake.some((part, index) =>
      index > 0 && part.x === nx && part.y === ny
    );

    if (hitSelf) return this.gameOver();

    this.snake.unshift({ x: nx, y: ny });

    if (nx === this.food.x && ny === this.food.y) {
      this.score += 1;
      this.currentSpeed = Math.max(
        this.options.minSpeed,
        this.options.speed - this.score * this.options.speedStep
      );
      this.food = this.placeFood();
      this.updateScore();

      if (typeof this.options.onScore === "function") {
        this.options.onScore(this.score, this);
      }
    } else {
      this.snake.pop();
    }
  }

  placeFood() {
    let point = { x: 0, y: 0 };
    if (!this.cols || !this.rows) return point;

    for (let tries = 0; tries < 500; tries++) {
      point = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows)
      };

      if (!this.snake || !this.snake.some((s) => s.x === point.x && s.y === point.y)) {
        return point;
      }
    }

    return point;
  }

  updateScore() {
    if (this.scoreEl) this.scoreEl.textContent = this.score;

    if (this.score > this.best) {
      this.best = this.score;
      this.writeBest();
    }

    if (this.bestEl) this.bestEl.textContent = this.best;
  }

  gameOver() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.updateScore();

    this.overlay.hidden = false;
    this.overlayTitle.textContent = this.options.labels.gameOver;
    this.overlayText.textContent =
      `${this.options.labels.score}: ${this.score} · ${this.options.labels.best}: ${this.best}`;
    this.startBtn.textContent = this.options.labels.restart;

    if (typeof this.options.onGameOver === "function") {
      this.options.onGameOver(this.score, this);
    }
  }

  roundedRect(x, y, w, h, r) {
    const ctx = this.ctx;
    const radius = Math.min(r, w / 2, h / 2);

    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, w, h, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    }
    ctx.fill();
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx || !this.width || !this.height) return;

    const theme = this.options.theme;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;

    for (let x = 1; x < this.cols; x++) {
      const px = Math.round(x * this.cellW) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, this.height);
      ctx.stroke();
    }

    for (let y = 1; y < this.rows; y++) {
      const py = Math.round(y * this.cellH) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(this.width, py);
      ctx.stroke();
    }

    const padX = Math.max(2, this.cellW * 0.12);
    const padY = Math.max(2, this.cellH * 0.12);

    this.snake.forEach((part, i) => {
      ctx.fillStyle = i === 0 ? theme.snakeHead : theme.snake;
      this.roundedRect(
        part.x * this.cellW + padX,
        part.y * this.cellH + padY,
        this.cellW - padX * 2,
        this.cellH - padY * 2,
        Math.min(this.cellW, this.cellH) * 0.28
      );
    });

    ctx.fillStyle = theme.food;
    const fx = this.food.x * this.cellW + this.cellW / 2;
    const fy = this.food.y * this.cellH + this.cellH / 2;
    const radius = Math.max(4, Math.min(this.cellW, this.cellH) * 0.28);

    ctx.beginPath();
    ctx.arc(fx, fy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    document.removeEventListener("keydown", this.keyHandler);
    window.removeEventListener("blur", this.blurHandler);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.resizeFallback) window.removeEventListener("resize", this.resizeFallback);
    this.root.innerHTML = "";
    this.root.classList.remove("snake404");
  }
}

function init(target, options) {
  return new SnakeGame(target, options);
}

function autoInit() {
  if (typeof document === "undefined") return;

  document.querySelectorAll("[data-snake404]").forEach((el) => {
    if (el.__snake404) return;

    let options = {};
    const raw = el.getAttribute("data-snake404-options");

    if (raw) {
      try {
        options = JSON.parse(raw);
      } catch {
        console.warn("Snake404: invalid JSON in data-snake404-options.");
      }
    }

    el.__snake404 = init(el, options);
  });
}

export { SnakeGame, DEFAULTS as defaults, init, autoInit };
export default { version: "1.0.1", Game: SnakeGame, defaults: DEFAULTS, init, autoInit };

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
}
