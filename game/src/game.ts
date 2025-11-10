import { Ball } from "./core/ball";
import { Paddle } from "./core/paddle";
import { checkCollision } from "./core/physics";
import { aiMove } from "./AI/simpleAI";
import { render } from "./renderer/canvasRenderer";

export function initGame() {
  const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const ball = new Ball(canvas.width / 2, canvas.height / 2);
  const player = new Paddle(30, canvas.height / 2 - 50);
  const ai = new Paddle(canvas.width - 40, canvas.height / 2 - 50);

  let isRunning = false;

  const keys = {
	ArrowUp: false,
	ArrowDown: false,
  };

  window.addEventListener('keydown', (e) => {
  	if (e.key === 'ArrowUp') keys.ArrowUp = true;
  	if (e.key === 'ArrowDown') keys.ArrowDown = true;
  });

  window.addEventListener('keyup', (e) => {
  	if (e.key === 'ArrowUp') keys.ArrowUp = false;
  	if (e.key === 'ArrowDown') keys.ArrowDown = false;
  });

  function movepaddle() {
	if (keys.ArrowUp && player.y > 0) {
		player.moveUp();
	}
	if (keys.ArrowDown && player.y + player.height < canvas.height) {
		player.moveDown();
	}
  }

  const startBtn = document.getElementById("startBtn")!;

  startBtn.addEventListener("click", () => {
	if (isRunning) return;
	isRunning = true;
	loop();
  });

function stopGame() {
  isRunning = false;
  startBtn.disabled = false;
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 60, canvas.height / 2);
}

  function loop() {
    if (!isRunning) return;

    ball.move();
    ball.bounce(canvas.height);
	movepaddle()
    checkCollision(ball, player);
    checkCollision(ball, ai);
    aiMove(ai, ball, canvas.height);

    if (ball.x < 0 || ball.x > canvas.width) ball.reset(canvas.width, canvas.height);

    render(ctx, ball, player, ai);
    requestAnimationFrame(loop);
  }
}
