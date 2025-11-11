import { Ball } from "./core/ball";
import { Paddle } from "./core/paddle";
import { checkCollision } from "./core/physics";
import { aiMove } from "./AI/simpleAI";
import { render } from "./renderer/canvasRenderer";

export function initGame() {
  const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const ball = new Ball(canvas.width / 2, canvas.height / 2);
  const leftPlayer = new Paddle(30, canvas.height / 2 - 50);
  const rightPlayer = new Paddle(canvas.width - 40, canvas.height / 2 - 50);
  // const ai = new Paddle(canvas.width - 40, canvas.height / 2 - 50);

  let isRunning2P = false;
  let isRunningAI = false;

  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    W: false,
    S: false,
  };

  window.addEventListener('keydown', (e) => {
  	if (e.key === 'ArrowUp') keys.ArrowUp = true;
  	if (e.key === 'ArrowDown') keys.ArrowDown = true;
    if (e.key === 'w') keys.W = true;
  	if (e.key === 's') keys.S = true;
  });

  window.addEventListener('keyup', (e) => {
  	if (e.key === 'ArrowUp') keys.ArrowUp = false;
  	if (e.key === 'ArrowDown') keys.ArrowDown = false;
    if (e.key === 'w') keys.W = false;
  	if (e.key === 's') keys.S = false;
  });

  function moveLeftPaddle() {
    if (keys.W && leftPlayer.y > 0) {
      leftPlayer.moveUp();
    }
    if (keys.S && leftPlayer.y + leftPlayer.height < canvas.height) {
      leftPlayer.moveDown();
    }
  }

  function moveRightPaddle() {
    if (keys.ArrowUp && rightPlayer.y > 0) {
      rightPlayer.moveUp();
    }
    if (keys.ArrowDown && rightPlayer.y + rightPlayer.height < canvas.height) {
      rightPlayer.moveDown();
    }
  }

  const playWAiBtn = document.getElementById("playWAiBtn")!;
  const playBtn = document.getElementById("2PlayerBtn")!;

  playWAiBtn.addEventListener("click", () => {
    if (isRunningAI) return;
    if (isRunning2P) isRunning2P = false;
    isRunningAI = true;
    resetGame();
    loop();
  });

  playBtn.addEventListener("click", () => {
    if (isRunning2P) return;
    if (isRunningAI) isRunningAI = false;
    isRunning2P = true;
    resetGame();
    loop();
  });

// function stopGame() {
//   // isRunning = false;
//   // startBtn.disabled = false;
//   ctx.fillStyle = "#fff";
//   ctx.font = "24px Arial";
//   ctx.fillText("Game Over", canvas.width / 2 - 60, canvas.height / 2);
// }
  function resetGame() {
    ball.reset(canvas.width, canvas.height);
    leftPlayer.y = canvas.height / 2 - leftPlayer.height / 2;
    rightPlayer.y = canvas.height / 2 - rightPlayer.height / 2;
  }
  function loop() {
    if (!isRunning2P && !isRunningAI) return;

    ball.move();
    ball.bounce(canvas.height);
    checkCollision(ball, leftPlayer);
    checkCollision(ball, rightPlayer);
    moveLeftPaddle()
    if (isRunning2P) moveRightPaddle();
    else aiMove(rightPlayer, ball, canvas.height);

    if (ball.x < 0 || ball.x > canvas.width) ball.reset(canvas.width, canvas.height);

    render(ctx, ball, leftPlayer, rightPlayer);
    requestAnimationFrame(loop);
  }
}
