import { Ball } from "../core/ball";
import { Paddle } from "../core/paddle";

export function render(ctx: CanvasRenderingContext2D, ball: Ball, player: Paddle, ai: Paddle) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(ai.x, ai.y, ai.width, ai.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}
