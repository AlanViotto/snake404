export type Snake404Theme = {
  background?: string;
  grid?: string;
  snake?: string;
  snakeHead?: string;
  food?: string;
};

export type Snake404Labels = {
  title?: string;
  subtitle?: string;
  start?: string;
  restart?: string;
  score?: string;
  best?: string;
  hint?: string;
  paused?: string;
  gameOver?: string;
  continue?: string;
};

export type Snake404Options = {
  cellSize?: number;
  speed?: number;
  minSpeed?: number;
  speedStep?: number;
  initialLength?: number;
  pauseOnBlur?: boolean;
  wrap?: boolean;
  showScore?: boolean;
  showControls?: boolean;
  autoStart?: boolean;
  theme?: Snake404Theme;
  labels?: Snake404Labels;
  onStart?: (game: SnakeGame) => void;
  onScore?: (score: number, game: SnakeGame) => void;
  onGameOver?: (score: number, game: SnakeGame) => void;
};

export class SnakeGame {
  constructor(target: string | HTMLElement, options?: Snake404Options);
  score: number;
  best: number;
  running: boolean;
  paused: boolean;
  start(): void;
  pause(): void;
  resume(): void;
  togglePause(): void;
  destroy(): void;
}

export function init(target: string | HTMLElement, options?: Snake404Options): SnakeGame;
export function autoInit(): void;

declare const Snake404: {
  version: string;
  Game: typeof SnakeGame;
  defaults: object;
  init: typeof init;
  autoInit: typeof autoInit;
};

export default Snake404;
