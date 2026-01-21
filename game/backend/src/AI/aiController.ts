import { Ball } from "../core/ball.js";
import { Paddle } from "../core/paddle.js";

type KeyMap = Record<string, boolean>;

export class AIController {
  private keys: KeyMap;
  private canvasHeight: number;

  constructor(keys: KeyMap, canvasHeight: number) {
    this.keys = keys;
    this.canvasHeight = canvasHeight;
  }

  // predict the ball's position
  predictBallY(ball: Ball, aiPaddle: Paddle): number {
    let x = ball.x;
    let y = ball.y;
    let vx = ball.speedX;
    let vy = ball.speedY;

    for (let i = 0; i < 3000; i++) {
      if (vx < 0 && x <= aiPaddle.x) break;
      x += vx;
      y += vy;

      if (y <= 0 || y >= this.canvasHeight) {
        vy = -vy;
      }

      if (vx > 0 && x >= aiPaddle.x) break;
    }

    return y;
  }
  
  calculateSteps(ball: Ball, aiPaddle: Paddle) : number {
    return Math.floor(
      (this.predictBallY(ball, aiPaddle) - (aiPaddle.y + aiPaddle.height / 2)) 
        / aiPaddle.speed);
  }

  control(stepDiff: number): number {
    // reset keys
    this.keys["ArrowUp"] = false;
      this.keys["ArrowDown"] = false;
      let moveKey: "ArrowUp" | "ArrowDown" | null = null;

    if (stepDiff < 0) {
      moveKey = "ArrowUp";
      stepDiff++;
    } else if (stepDiff > 0) {
      moveKey = "ArrowDown";
      stepDiff--;
    } else {
      moveKey = null;
    }
        
    if (moveKey)
      this.keys[moveKey] = true;

    return stepDiff;
  }
}
