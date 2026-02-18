export interface GameState {
  ball: {
    x: number;
    y: number;
    radius: number;
  };
  leftPlayer: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    life: number;
  };
  rightPlayer: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    life: number;
  };
  gameMessage: string | null;
  canvasWidth: number;
  canvasHeight: number;
}

