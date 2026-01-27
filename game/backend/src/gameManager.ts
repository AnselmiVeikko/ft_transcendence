import { Game } from "./core/game.js";
import type { GameState, InputEvent, GameStartEvent } from "./types/gameState.js";
import { WebSocket } from "ws";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export class GameManager {
  private game: Game | null = null;
  private ws: WebSocket | null = null;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(message);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    this.ws.on("close", () => {
      if (this.game) {
        this.game.stop();
        this.game = null;
      }
    });
  }

  private handleMessage(message: any) {
    console.log("Received message:", message.type);
    switch (message.type) {
      case "start":
        this.handleStart(message as GameStartEvent);
        break;
      case "input":
        this.handleInput(message.input as InputEvent);
        break;
      default:
        console.warn("Unknown message type:", message.type);
    }
  }

  private handleStart(event: GameStartEvent) {
    console.log("Starting game with event:", event);
    
    if (this.game) {
      this.game.stop();
    }

    this.game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);
    this.game.setOnStateUpdate((state: GameState) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: "state", state }));
        } catch (error) {
          console.error("Error sending game state:", error);
        }
      }
    });

    this.game.start(event.gameMode, event.player1, event.player2);
    console.log("Game started successfully");
  }

  private handleInput(event: InputEvent) {
    if (this.game) {
      this.game.handleInput(event);
    }
  }

  public cleanup() {
    if (this.game) {
      this.game.stop();
      this.game = null;
    }
  }
}

