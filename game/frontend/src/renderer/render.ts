import type { GameState } from "../types/gameState";

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export function render(ctx: CanvasRenderingContext2D, state: GameState | null) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  // If no state, render welcome screen
  if (!state) {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#050816");
    gradient.addColorStop(0.45, "#0a1133");
    gradient.addColorStop(1, "#1a0f2f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Welcome message
    ctx.fillStyle = "#ffebf7";
    ctx.font = "600 34px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Welcome to Pong!", width / 2, height / 2 - 20);
    ctx.font = "400 18px 'Space Grotesk', sans-serif";
    ctx.fillText("Click a button to start", width / 2, height / 2 + 20);
    return;
  }

  const { leftPlayer, rightPlayer, ball, gameMessage: message } = state;

  // Background gradient + center glow
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#050816");
  gradient.addColorStop(0.45, "#0a1133");
  gradient.addColorStop(1, "#1a0f2f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  const midGradient = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, 320);
  midGradient.addColorStop(0, "rgba(122,91,255,0.35)");
  midGradient.addColorStop(1, "rgba(5,8,22,0)");
  ctx.fillStyle = midGradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Center divider
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 22]);
  ctx.beginPath();
  ctx.moveTo(width / 2, 30);
  ctx.lineTo(width / 2, height - 30);
  ctx.stroke();
  ctx.restore();

  // Draw paddles with glow
  ctx.save();
  ctx.shadowBlur = 25;

  ctx.fillStyle = "#7a5bff";
  ctx.shadowColor = "rgba(122,91,255,0.8)";
  ctx.fillRect(leftPlayer.x, leftPlayer.y, leftPlayer.width, leftPlayer.height);

  ctx.fillStyle = "#25d8ff";
  ctx.shadowColor = "rgba(37,216,255,0.8)";
  ctx.fillRect(rightPlayer.x, rightPlayer.y, rightPlayer.width, rightPlayer.height);
  ctx.restore();

  // Draw ball
  ctx.save();
  const ballGradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 4, ball.x, ball.y, ball.radius + 6);
  ballGradient.addColorStop(0, "#fff9f5");
  ballGradient.addColorStop(0.6, "#ff72d8");
  ballGradient.addColorStop(1, "rgba(255,114,216,0.2)");
  ctx.fillStyle = ballGradient;
  ctx.shadowColor = "rgba(255,114,216,0.7)";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Scoreboard background
  ctx.save();
  ctx.fillStyle = "rgba(5,8,22,0.6)";
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  const panelHeight = 60;
  drawRoundedRect(ctx, 40, 15, width - 80, panelHeight, 14);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Labels
  ctx.fillStyle = "#f8fbff";
  ctx.font = "600 20px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(leftPlayer.name, width / 6, 50);
  ctx.fillText(rightPlayer.name, (width / 6) * 5, 50);

  // Lives as hearts
  ctx.font = "700 22px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#ff6b81";
  for (let i = 0; i < leftPlayer.life; i++) {
    ctx.fillText("♥", width / 3 + i * 26, 50);
  }
  ctx.fillStyle = "#25d8ff";
  for (let i = 0; i < rightPlayer.life; i++) {
    ctx.fillText("♥", width * 2 / 3 - i * 26, 50);
  }

  // Winner / status message
  if (message) {
    ctx.save();
    ctx.fillStyle = "rgba(5,8,22,0.8)";
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, width / 2 - 220, height / 2 - 80, 440, 120, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffebf7";
    ctx.font = "600 34px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(message, width / 2, height / 2);
    ctx.restore();
  }
}
