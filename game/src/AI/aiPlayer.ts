import { Ball } from "../core/ball";
import { Paddle } from "../core/paddle";

type KeyMap = Record<string, boolean>;

export class AIPlayer {
  private keys: KeyMap;
  private canvasHeight: number;

  constructor(keys: KeyMap, canvasHeight: number) {
    this.keys = keys;
    this.canvasHeight = canvasHeight;
  }

  // predict the ball direction
  predictBallY(ball: Ball): number {
    let x = ball.x;
    let y = ball.y;
    let vx = ball.speedX;
    let vy = ball.speedY;

    // Simulate the incoming ball
    for (let i = 0; i < 120; i++) {
      x += vx;
      y += vy;

      if (y <= 0 || y >= this.canvasHeight) {
        vy = -vy;
      }

      if (x > 900) break;
    }

    return y;
  }

  update(ball: Ball, aiPaddle: Paddle) {
    const predictedY = this.predictBallY(ball);
    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;

    // Reset keys
    this.keys["ArrowUp"] = false;
    this.keys["ArrowDown"] = false;

    if (predictedY < paddleCenter - 10) {
      this.keys["ArrowUp"] = true;
    } else if (predictedY > paddleCenter + 10) {
      this.keys["ArrowDown"] = true;
    }
  }
}
