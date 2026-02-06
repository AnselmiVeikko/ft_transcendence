import { Game } from "./game.js";
import type {
  GameState,
  InputMessage,
  StateUpdateMessage,
  GameOverMessage,
  AuthenticatedWebSocket,
} from "../types/gameState.js";
import { matchManager } from "./matchManager.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../utils/gameConfig.js";
import {
  getWinnerIdFromWinnerName,
  buildScoreFromState,
  reportResultToMainBE,
} from "../utils/matchResult.js";
import { applyInputToGame } from "../utils/gameInput.js";

export class GameManager {
  private game: Game | null = null;
  private ws: AuthenticatedWebSocket;
  private matchId: string;
  private userId: string;
  private username: string;
  private gameStarted: boolean = false;
  private lastWinner: string | null = null;

  constructor(ws: AuthenticatedWebSocket, matchId: string, userId: string, username: string) {
    this.ws = ws;
    this.matchId = matchId;
    this.userId = userId;
    this.username = username;
    this.setupWebSocketHandlers();
    this.startGame();
  }

  private setupWebSocketHandlers() {
    this.ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(message);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  }

  private handleMessage(message: any) {
    console.log("Received message:", message.type);
    
    // According to secure_game_flow.md, only INPUT messages are accepted
    if (message.type === "INPUT") {
      this.handleInput(message as InputMessage);
    } else {
      console.warn("Unknown message type:", message.type);
    }
  }

  /**
   * Start game automatically when connection is authenticated
   */
  private startGame() {
    if (this.game) {
      this.game.stop();
    }

    const match = matchManager.getMatch(this.matchId);
    if (!match) {
      console.error(`Match ${this.matchId} not found`);
      return;
    }

    // Get player names from match
    const players = matchManager.getMatchPlayers(this.matchId);
    const player1 = players[0]?.username || this.username;
    const player2 = players[1]?.username || "AI"; // Default to AI if single player

    this.game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Set up state update callback - send STATE_UPDATE messages
    this.game.setOnStateUpdate((state: GameState) => {
      this.sendStateUpdate(state);
    });

    // Set up game end callback
    this.game.setOnGameEnd((winner: string) => {
      this.handleGameEndByWinner(winner);
    });

    const gameMode = match.gameMode === 'PVP' ? '2P' : 'AI';
    this.game.start(gameMode, player1, gameMode === 'AI' ? undefined : player2);
    this.gameStarted = true;
    matchManager.updateMatchState(this.matchId, 'playing');
    
    console.log(`Game started for match ${this.matchId}`);
  }

  /**
   * Handle input message
   * According to secure_game_flow.md: Do NOT send userId, username, or JWT
   * Game BE trusts only socket context (this.userId)
   */
  private handleInput(message: InputMessage) {
    if (!this.game || !this.gameStarted) return;

    if (!matchManager.isUserInMatch(this.matchId, this.userId)) {
      console.warn(`User ${this.userId} not authorized for match ${this.matchId}`);
      return;
    }

    const players = matchManager.getMatchPlayers(this.matchId);
    const isLeftPlayer = players[0]?.userId === this.userId;
    applyInputToGame(message, isLeftPlayer, (ev) => this.game!.handleInput(ev));
  }

  /**
   * Send state update to Game FE
   * Format: { type: "STATE_UPDATE", state: GameState }
   */
  private sendStateUpdate(state: GameState) {
    // WebSocket.OPEN = 1
    if (this.ws && this.ws.readyState === 1) {
      try {
        const message: StateUpdateMessage = {
          type: "STATE_UPDATE",
          state
        };
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("Error sending state update:", error);
      }
    }
  }

  /**
   * Handle game end by checking game state
   */
  private handleGameEnd(state: GameState) {
    if (!state.gameMessage || !state.gameMessage.includes('won')) {
      return;
    }

    // Extract winner name from message
    const winnerMatch = state.gameMessage.match(/(\w+)\s+won/);
    if (!winnerMatch || !winnerMatch[1]) return;

    const winnerName = winnerMatch[1];
    this.handleGameEndByWinner(winnerName);
  }

  /**
   * Handle game end by winner name
   */
  private handleGameEndByWinner(winnerName: string) {
    if (this.lastWinner) return;

    this.lastWinner = winnerName;
    this.gameStarted = false;
    matchManager.updateMatchState(this.matchId, "finished");

    const players = matchManager.getMatchPlayers(this.matchId);
    const player1 = players[0];
    const player2 = players[1];

    if (!player1) {
      console.error(`No players found in match ${this.matchId}`);
      return;
    }

    const winnerId = getWinnerIdFromWinnerName(players, winnerName);
    if (!winnerId) {
      console.error(`Could not find winner userId for winner name: ${winnerName}`);
      return;
    }

    const state = this.game?.getState();
    if (!state) return;

    const score = buildScoreFromState(state, player1, player2);
    reportResultToMainBE(this.matchId, winnerId, score);
    this.sendGameOver(winnerId, score);
  }

  /**
   * Send GAME_OVER message to Game FE
   */
  private sendGameOver(winnerId: string, score: Record<string, number>) {
    // WebSocket.OPEN = 1
    if (this.ws && this.ws.readyState === 1) {
      try {
        const message: GameOverMessage = {
          type: "GAME_OVER",
          result: {
            winnerId,
            score
          }
        };
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("Error sending game over message:", error);
      }
    }
  }

  public cleanup() {
    if (this.game) {
      this.game.stop();
      this.game = null;
    }
    this.gameStarted = false;
  }
}

