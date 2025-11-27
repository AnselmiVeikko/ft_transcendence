import { Game } from "../core/game";

export function render(game: Game) {
  const ctx = game.getCtx();
  const leftPlayer = game.getLeftPlayer();
  const rightPlayer = game.getRightPlayer();
  const ball = game.getBall();
  const message = game.getGameMessage();

  ctx.clearRect(0, 0,ctx.canvas.width,ctx.canvas.height);

  // Draw paddles
  ctx.fillStyle = "white";
  ctx.fillRect(leftPlayer.x, leftPlayer.y, leftPlayer.width, leftPlayer.height);
  ctx.fillRect(rightPlayer.x, rightPlayer.y, rightPlayer.width, rightPlayer.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw info 
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";

  // Left player
  ctx.fillText(leftPlayer.name,ctx.canvas.width/8, 30);
  for (let i = 0; i < leftPlayer.life; i++) {
    ctx.fillText("♥",ctx.canvas.width*3/8 + (i - 1) * 25, 30); // 25px is the distance between hearts
  }

  // Right player
  ctx.fillText(rightPlayer.name,ctx.canvas.width *7 /8, 30);
  for (let i = 0; i < rightPlayer.life; i++) {
    ctx.fillText("♥",ctx.canvas.width * 5 / 8 + (i - 1) * 25, 30);
  }

  // Draw message
  if (message) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText(message,ctx.canvas.width / 2,ctx.canvas.height / 2 - 40);
  }
}
