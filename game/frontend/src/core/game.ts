import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { checkCollision } from "./physics";
import { AIController } from "../AI/aiController";
import { render } from "../renderer/render";

type GameMode = "2P" | "AI" | null;

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ball: Ball;
  private leftPlayer: Paddle;
  private rightPlayer: Paddle;
  private keys: Record<string, boolean> = {};
  private gameMode: GameMode = null;
  private gameMessage: string | null = "Welcome to Pong!";
  private aiController: AIController | null = null;
  private aiInterval: number | null = null;
  private stepDiff = 0;
  private remainSteps = 0;

  public getCtx() { return this.ctx; }
  public getBall() { return this.ball; }
  public getLeftPlayer() { return this.leftPlayer; }
  public getRightPlayer() { return this.rightPlayer; }
  public getGameMessage() { return this.gameMessage; }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas context");
    this.ctx = ctx;

    this.ball = new Ball(canvas.width / 2, canvas.height / 2);
    this.leftPlayer = new Paddle("Player1", 30, canvas.height / 2 - 50);
    this.rightPlayer = new Paddle("Player2", canvas.width - 40, canvas.height / 2 - 50);

    this.registerInputHandlers();
    this.gameLoop();
  }

  start(gameMode: "2P" | "AI", player1: string, player2?: string) {
    this.gameMode = gameMode;
    this.leftPlayer.name = player1 || "Player1";
    this.rightPlayer.name =
      gameMode === "AI" ? "AI" : player2 && player2.trim() ? player2 : "Player2";

    this.resetGame();

    if (gameMode === "AI") {
      this.startAI();
    } else {
      this.stopAI();
    }
  }

  private registerInputHandlers() {
    const normalizeKey = (key: string) => (key.length === 1 ? key.toLowerCase() : key);

    window.addEventListener("keydown", (e) => {
      this.keys[normalizeKey(e.key)] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[normalizeKey(e.key)] = false;
    });
  }

  private moveLeftPaddle() {
    if (this.keys["w"] && this.leftPlayer.y > 0) this.leftPlayer.moveUp();
    if (this.keys["s"] && this.leftPlayer.y + this.leftPlayer.height < this.canvas.height)
      this.leftPlayer.moveDown();
  }

  private moveRightPaddle() {
    if (this.keys["ArrowUp"] && this.rightPlayer.y > 0) this.rightPlayer.moveUp();
    if (
      this.keys["ArrowDown"] &&
      this.rightPlayer.y + this.rightPlayer.height < this.canvas.height
    )
      this.rightPlayer.moveDown();
  }

  private startAI() {
    this.stopAI();
    this.aiController = new AIController(this.keys, this.canvas.height);
    this.aiInterval = window.setInterval(() => {
      if (!this.aiController || !this.gameMode) return;
      this.stepDiff = this.aiController.calculateSteps(this.ball, this.rightPlayer);
      this.remainSteps = this.stepDiff;
    }, 1000);
  }

  private stopAI() {
    this.aiController = null;
    if (this.aiInterval) {
      clearInterval(this.aiInterval);
      this.aiInterval = null;
    }
    this.stepDiff = 0;
    this.remainSteps = 0;
  }

  private resetGame() {
    this.ball.reset(this.canvas.width / 2, this.canvas.height / 2);
    this.leftPlayer.y = this.canvas.height / 2 - this.leftPlayer.height / 2;
    this.rightPlayer.y = this.canvas.height / 2 - this.rightPlayer.height / 2;
    this.leftPlayer.life = this.leftPlayer.defaultLife;
    this.rightPlayer.life = this.rightPlayer.defaultLife;
    this.gameMessage = null;

    Object.keys(this.keys).forEach((key) => (this.keys[key] = false));
  }

  private checkState() {
    if (this.ball.x < 0) {
      this.ball.reset(
        this.leftPlayer.x + this.leftPlayer.width + this.ball.radius,
        this.leftPlayer.y + this.leftPlayer.height / 2
      );
      if (--this.leftPlayer.life <= 0) {
        this.gameMessage = `${this.rightPlayer.name} won!`;
        this.gameMode = null;
        this.stopAI();
      }
    }

    if (this.ball.x > this.canvas.width) {
      this.ball.reset(
        this.rightPlayer.x - this.ball.radius,
        this.rightPlayer.y + this.rightPlayer.height / 2
      );
      if (--this.rightPlayer.life <= 0) {
        this.gameMessage = `${this.leftPlayer.name} won!`;
        this.gameMode = null;
        this.stopAI();
      }
    }
  }

  private gameLoop = () => {
    if (this.gameMode) {
      this.ball.move();
      this.ball.bounce(this.canvas.height);

      checkCollision(this.ball, this.leftPlayer);
      checkCollision(this.ball, this.rightPlayer);

      if (this.aiController && this.ball.x > this.canvas.width / 3) {
        this.remainSteps = this.aiController.control(this.remainSteps);
      }

      this.moveLeftPaddle();
      this.moveRightPaddle();

      this.checkState();
    }

    render(this);
    requestAnimationFrame(this.gameLoop);
  };
}
