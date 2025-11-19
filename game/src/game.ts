import { Ball } from "./core/ball";
import { Paddle } from "./core/paddle";
import { checkCollision } from "./core/physics";
import { AIPlayer } from "./AI/aiPlayer";
import { render } from "./renderer/canvasRenderer";

type GameMode = "2P" | "AI" | null;

export function initGame() {
  const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const ball = new Ball(canvas.width / 2, canvas.height / 2);
  const leftPlayer = new Paddle(30, canvas.height / 2 - 50);
  const rightPlayer = new Paddle(canvas.width - 40, canvas.height / 2 - 50);

  let gameMode: GameMode = null;
  let gameMessage: string | null = null;

  // Input handling
  const keys: Record<string, boolean> = {};

  // create AI player
  const aiPlayer = new AIPlayer(keys, canvas.height);

  function normalizeKey(key: string) {
    if (key.length === 1) return key.toLowerCase();
    return key;
  }

  window.addEventListener("keydown", (e) => keys[normalizeKey(e.key)] = true);
  window.addEventListener("keyup", (e) => keys[normalizeKey(e.key)] = false);


  // Paddle movement
  function moveLeftPaddle() {
    if ((keys["w"]) && leftPlayer.y > 0) leftPlayer.moveUp();
    if ((keys["s"]) && leftPlayer.y + leftPlayer.height < canvas.height) leftPlayer.moveDown();
  }

  function moveRightPaddle() {
    if (keys["ArrowUp"] && rightPlayer.y > 0) rightPlayer.moveUp();
    if (keys["ArrowDown"] && rightPlayer.y + rightPlayer.height < canvas.height) rightPlayer.moveDown();
  }

  // Buttons
  const playAIButton = document.getElementById("playAIButton")!;
  const play2PButton = document.getElementById("play2PButton")!;

  let aiInterval: number | null = null;

  playAIButton.addEventListener("click", () => {
    gameMode = "AI";
    resetGame();

    // clear previous interval 
    if (aiInterval) clearInterval(aiInterval);

    // create an AI update once per second
    aiInterval = window.setInterval(() => {
      aiPlayer.update(ball, rightPlayer);
    }, 1000);
  });

  play2PButton.addEventListener("click", () => {
    gameMode = "2P";
    resetGame();
  });

  function resetGame() {
    ball.reset(canvas.width, canvas.height);
    leftPlayer.y = canvas.height / 2 - leftPlayer.height / 2;
    rightPlayer.y = canvas.height / 2 - rightPlayer.height / 2;
    leftPlayer.life = leftPlayer.defaultLife;
    rightPlayer.life = rightPlayer.defaultLife;
    gameMessage = null;
  }

  function gameLoop() {
  
    if (gameMode) {
      ball.move();
      ball.bounce(canvas.height);

      checkCollision(ball, leftPlayer);
      checkCollision(ball, rightPlayer);

      if (gameMode === "AI") {
        setInterval(() => aiPlayer.update(ball, rightPlayer), 1000);
      }

      moveLeftPaddle();
      moveRightPaddle();

      if (ball.x < 0) {
        leftPlayer.life -= 1;
        ball.reset(canvas.width, canvas.height);
      }

      if (ball.x > canvas.width) {
        rightPlayer.life -= 1;
        ball.reset(canvas.width, canvas.height);
      }
      if (leftPlayer.life <= 0) {
        gameMessage = "Player 2 wins!";
        gameMode = null;
      }

      if (rightPlayer.life <= 0) {
        gameMessage = "Player 1 wins!";
        gameMode = null;
      }
    }

    render(ctx, ball, leftPlayer, rightPlayer, gameMessage);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
