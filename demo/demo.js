(() => {
  const palettes = {
    classic: { dark: ["#ffffff", "#c7ff5e", "#ff5e7a"], light: ["#365314", "#4d7c0f", "#be123c"] },
    ocean: { dark: ["#7dd3fc", "#22d3ee", "#fbbf24"], light: ["#0369a1", "#0e7490", "#b45309"] },
    sunset: { dark: ["#fdba74", "#fb923c", "#f472b6"], light: ["#9a3412", "#c2410c", "#be185d"] },
    violet: { dark: ["#c4b5fd", "#a78bfa", "#5eead4"], light: ["#5b21b6", "#7c3aed", "#0f766e"] }
  };
  const surfaces = {
    dark: { background: "#0b0d10", grid: "#222830" },
    light: { background: "#f8fafc", grid: "#dce3eb" }
  };
  const ratios = { "1:1": [1, 1], "4:5": [4, 5], "9:16": [9, 16], "16:9": [16, 9] };
  const root = document.querySelector("#game");
  const palette = document.querySelector("#palette");
  const mode = document.querySelector("#mode");
  const ratio = document.querySelector("#ratio");
  const colors = Object.fromEntries(["background", "grid", "snake", "snakeHead", "food"].map(key => [key, document.querySelector(`#color-${key}`)]));
  let game;

  function theme() {
    return Object.fromEntries(Object.entries(colors).map(([key, input]) => [key, input.value]));
  }

  function updateColors() {
    if (!game) return;
    Object.assign(game.options.theme, theme());
    game.draw();
  }

  function applyPalette() {
    if (palette.value === "custom") return;
    const [snake, snakeHead, food] = palettes[palette.value][mode.value];
    const values = { ...surfaces[mode.value], snake, snakeHead, food };
    for (const [key, value] of Object.entries(values)) colors[key].value = value;
    updateColors();
  }

  function applyMode() {
    document.documentElement.dataset.mode = mode.value;
    document.querySelector('meta[name="theme-color"]').content = mode.value === "light" ? "#f4f6f8" : "#07090b";
    applyPalette();
  }

  function mount() {
    const [width, height] = ratios[ratio.value];
    root.style.setProperty("--board-ratio", `${width} / ${height}`);
    root.style.setProperty("--board-width", `${Math.min(960, 560 * width / height)}px`);
    if (game) game.destroy();
    game = Snake404.init(root, {
      theme: theme(),
      labels: { subtitle: "O caminho acabou. O jogo começa aqui." }
    });
  }

  palette.addEventListener("change", applyPalette);
  mode.addEventListener("change", applyMode);
  ratio.addEventListener("change", () => {
    mount();
    document.querySelector("#settings-status").textContent = `Formato ${ratio.value.replace(":", " por ")} aplicado. Partida reiniciada.`;
  });
  for (const input of Object.values(colors)) {
    input.addEventListener("input", () => {
      palette.value = "custom";
      updateColors();
    });
  }
  applyMode();
  mount();
})();
