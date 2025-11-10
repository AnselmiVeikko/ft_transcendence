import { Paddle } from "../core/paddle";
import { Ball } from "../core/ball";

export function aiMove(ai: Paddle, ball: Ball, canvasHeight: number) {
  const targetY = ball.y - ai.height / 2;
  const diff = targetY - ai.y;
  ai.y += diff * 0.1; // interact speed (0.1 = slow, 1.0 = fast)
  ai.clamp(canvasHeight);
}
