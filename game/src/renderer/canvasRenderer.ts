import { Ball } from "../core/ball";
import { Paddle } from "../core/paddle";

function renderLives(ctx: CanvasRenderingContext2D, leftLife: number, rightLife: number) {
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.textAlign = "start";

  // Left player
  for (let i = 0; i < leftLife; i++) {
    ctx.fillText("♥", 50 + i * 25, 30); // 25px is the distance between hearts
  }

  // Right player
  for (let i = 0; i < rightLife; i++) {
    ctx.fillText("♥", ctx.canvas.width - 50 - i * 25, 30);
  }
}

export function render(
  ctx: CanvasRenderingContext2D, 
  ball: Ball, 
  leftPlayer: Paddle, 
  rightPlayer: Paddle,
  message: string | null) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw paddles
  ctx.fillStyle = "white";
  ctx.fillRect(leftPlayer.x, leftPlayer.y, leftPlayer.width, leftPlayer.height);
  ctx.fillRect(rightPlayer.x, rightPlayer.y, rightPlayer.width, rightPlayer.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw life
  renderLives(ctx, leftPlayer.life, rightPlayer.life);

  // Draw message
  if (message) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
  }
}
