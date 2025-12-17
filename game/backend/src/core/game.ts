import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { checkCollision } from "./physics.js";
import { AIController } from "../AI/aiController.js";
import type { GameState, InputEvent } from "../types/gameState.js";

type GameMode = "2P" | "AI" | null;

export class Game {
  private canvasWidth: number;
  private canvasHeight: number;
  private ball: Ball;
  private leftPlayer: Paddle;
  private rightPlayer: Paddle;
  private keys: Record<string, boolean> = {};
  private gameMode: GameMode = null;
  private gameMessage: string | null = "Welcome to Pong!";
  private aiController: AIController | null = null;
  private aiInterval: NodeJS.Timeout | null = null;
  private stepDiff = 0;
  private remainSteps = 0;
  private gameLoopInterval: NodeJS.Timeout | null = null;
  private onStateUpdate: ((state: GameState) => void) | null = null;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.ball = new Ball(canvasWidth / 2, canvasHeight / 2);
    this.leftPlayer = new Paddle("Player1", 30, canvasHeight / 2 - 50);
    this.rightPlayer = new Paddle("Player2", canvasWidth - 40, canvasHeight / 2 - 50);

    this.startGameLoop();
  }

  public setOnStateUpdate(callback: (state: GameState) => void) {
    this.onStateUpdate = callback;
  }

  public handleInput(event: InputEvent) {
    const normalizeKey = (key: string) => (key.length === 1 ? key.toLowerCase() : key);
    const normalizedKey = normalizeKey(event.key);
    this.keys[normalizedKey] = event.type === 'keydown';
  }

  public getState(): GameState {
    return {
      ball: {
        x: this.ball.x,
        y: this.ball.y,
        radius: this.ball.radius,
      },
      leftPlayer: {
        name: this.leftPlayer.name,
        x: this.leftPlayer.x,
        y: this.leftPlayer.y,
        width: this.leftPlayer.width,
        height: this.leftPlayer.height,
        life: this.leftPlayer.life,
      },
      rightPlayer: {
        name: this.rightPlayer.name,
        x: this.rightPlayer.x,
        y: this.rightPlayer.y,
        width: this.rightPlayer.width,
        height: this.rightPlayer.height,
        life: this.rightPlayer.life,
      },
      gameMessage: this.gameMessage,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
    };
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

  public stop() {
    this.gameMode = null;
    this.stopAI();
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }

  private moveLeftPaddle() {
    if (this.keys["w"] && this.leftPlayer.y > 0) this.leftPlayer.moveUp();
    if (this.keys["s"] && this.leftPlayer.y + this.leftPlayer.height < this.canvasHeight)
      this.leftPlayer.moveDown();
  }

  private moveRightPaddle() {
    if (this.keys["ArrowUp"] && this.rightPlayer.y > 0) this.rightPlayer.moveUp();
    if (
      this.keys["ArrowDown"] &&
      this.rightPlayer.y + this.rightPlayer.height < this.canvasHeight
    )
      this.rightPlayer.moveDown();
  }

  private startAI() {
    this.stopAI();
    this.aiController = new AIController(this.keys, this.canvasHeight);
    this.aiInterval = setInterval(() => {
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
    this.ball.x = this.canvasWidth / 2;
    this.ball.y = this.canvasHeight / 2;
    this.ball.speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() + 6);
    this.ball.speedY = (Math.random() - 0.5) * 10;
    this.leftPlayer.y = this.canvasHeight / 2 - this.leftPlayer.height / 2;
    this.rightPlayer.y = this.canvasHeight / 2 - this.rightPlayer.height / 2;
    this.leftPlayer.life = this.leftPlayer.defaultLife;
    this.rightPlayer.life = this.rightPlayer.defaultLife;
    this.gameMessage = null;

    Object.keys(this.keys).forEach((key) => (this.keys[key] = false));
  }

  private checkState() {
    if (this.ball.x < 0) {
      this.ball.x = this.leftPlayer.x + this.leftPlayer.width + this.ball.radius;
      this.ball.y = this.leftPlayer.y + this.leftPlayer.height / 2;
      this.ball.speedX = Math.abs(this.ball.speedX);
      this.ball.speedY = (Math.random() - 0.5) * 10;
      if (--this.leftPlayer.life <= 0) {
        this.gameMessage = `${this.rightPlayer.name} won!`;
        this.gameMode = null;
        this.stopAI();
      }
    }

    if (this.ball.x > this.canvasWidth) {
      this.ball.x = this.rightPlayer.x - this.ball.radius;
      this.ball.y = this.rightPlayer.y + this.rightPlayer.height / 2;
      this.ball.speedX = -Math.abs(this.ball.speedX);
      this.ball.speedY = (Math.random() - 0.5) * 10;
      if (--this.rightPlayer.life <= 0) {
        this.gameMessage = `${this.leftPlayer.name} won!`;
        this.gameMode = null;
        this.stopAI();
      }
    }
  }

  private startGameLoop() {
    const TARGET_FPS = 60;
    const FRAME_TIME = 1000 / TARGET_FPS;
    let lastState: GameState | null = null;

    this.gameLoopInterval = setInterval(() => {
      if (this.gameMode) {
        this.ball.move();
        this.ball.bounce(this.canvasHeight);

        checkCollision(this.ball, this.leftPlayer);
        checkCollision(this.ball, this.rightPlayer);

        if (this.aiController && this.ball.x > this.canvasWidth / 3) {
          this.remainSteps = this.aiController.control(this.remainSteps);
        }

        this.moveLeftPaddle();
        this.moveRightPaddle();

        this.checkState();
      }

      // Send state update to frontend
      if (this.onStateUpdate) {
        const currentState = this.getState();
        
        // Always send updates when game is active
        if (this.gameMode !== null) {
          this.onStateUpdate(currentState);
          lastState = currentState;
        } 
        // When game ends, only send update if message changed (game just ended)
        else if (currentState.gameMessage && (!lastState || lastState.gameMessage !== currentState.gameMessage)) {
          this.onStateUpdate(currentState);
          lastState = currentState;
        }
        // If game is over and already sent the end message, don't send more updates
      }
    }, FRAME_TIME);
  }
}
