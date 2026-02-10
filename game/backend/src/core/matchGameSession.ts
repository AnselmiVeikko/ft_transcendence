/**
 * MatchGameSession
 * One shared Game per match. Holds all client WebSockets for that match.
 * Starts game only when both players have connected (PVP). Broadcasts STATE_UPDATE to all.
 */

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

export class MatchGameSession {
  private matchId: string;
  private game: Game | null = null;
  private sockets = new Map<string, AuthenticatedWebSocket>();
  private gameStarted = false;
  private lastWinner: string | null = null;

  constructor(matchId: string) {
    this.matchId = matchId;
  }

  addSocket(userId: string, username: string, ws: AuthenticatedWebSocket): void {
    if (this.sockets.has(userId)) {
      console.warn(`User ${userId} already in match ${this.matchId}`);
      return;
    }
    this.sockets.set(userId, ws);

    const match = matchManager.getMatch(this.matchId);
    const players = matchManager.getMatchPlayers(this.matchId);
    const isPvP = match?.gameMode === "PVP";

    if (isPvP && players.length >= 2 && this.sockets.size === 2 && !this.game) {
      this.startGame();
    }
  }

  removeSocket(userId: string): void {
    this.sockets.delete(userId);
    if (this.game) {
      this.game.stop();
      this.game = null;
    }
    this.gameStarted = false;
    if (this.sockets.size === 0) {
      removeSession(this.matchId);
    }
  }

  handleMessage(userId: string, data: Buffer): void {
    try {
      const message = JSON.parse(data.toString()) as InputMessage;
      if (message.type === "INPUT") {
        this.handleInput(userId, message);
      }
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  }

  private handleInput(userId: string, message: InputMessage): void {
    if (!this.game || !this.gameStarted) return;
    if (!matchManager.isUserInMatch(this.matchId, userId)) return;

    // Use message.paddle when present (both browsers can control both paddles - local co-op).
    // Fallback: derive from userId for older clients.
    const players = matchManager.getMatchPlayers(this.matchId);
    const isLeftPlayer =
      message.paddle !== undefined
        ? message.paddle === 'left'
        : players[0]?.userId === userId;
    applyInputToGame(message, isLeftPlayer, (ev) => this.game!.handleInput(ev));
  }

  private startGame(): void {
    if (this.game) {
      this.game.stop();
    }

    const players = matchManager.getMatchPlayers(this.matchId);
    const player1 = players[0]?.username ?? "Player1";
    const player2 = players[1]?.username ?? "Player2";

    this.game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);
    this.game.setOnStateUpdate((state: GameState) => this.broadcastState(state));
    this.game.setOnGameEnd((winner: string) => this.handleGameEndByWinner(winner));

    const match = matchManager.getMatch(this.matchId);
    const gameMode = match?.gameMode === "PVP" ? "2P" : "AI";
    this.game.start(gameMode, player1, gameMode === "AI" ? undefined : player2);

    this.gameStarted = true;
    matchManager.updateMatchState(this.matchId, "playing");
    console.log(`Game started for match ${this.matchId} (both players connected)`);
  }

  private broadcastState(state: GameState): void {
    const msg: StateUpdateMessage = { type: "STATE_UPDATE", state };
    const payload = JSON.stringify(msg);
    for (const [, ws] of this.sockets) {
      if (ws.readyState === 1) {
        try {
          ws.send(payload);
        } catch (e) {
          console.error("Error sending state update:", e);
        }
      }
    }
  }

  private handleGameEndByWinner(winnerName: string): void {
    if (this.lastWinner) return;
    this.lastWinner = winnerName;
    this.gameStarted = false;
    matchManager.updateMatchState(this.matchId, "finished");

    const players = matchManager.getMatchPlayers(this.matchId);
    const player1 = players[0];
    const player2 = players[1];
    if (!player1) return;

    const winnerId = getWinnerIdFromWinnerName(players, winnerName);
    if (!winnerId) return;

    const state = this.game?.getState();
    if (!state) return;

    const score = buildScoreFromState(state, player1, player2);
    reportResultToMainBE(this.matchId, winnerId);
    this.sendGameOverToAll(winnerId, score);

    if (this.game) {
      this.game.stop();
      this.game = null;
    }
  }

  private sendGameOverToAll(
    winnerId: string,
    score: Record<string, number>
  ): void {
    const msg: GameOverMessage = {
      type: "GAME_OVER",
      result: { winnerId, score },
    };
    const payload = JSON.stringify(msg);
    for (const [, ws] of this.sockets) {
      if (ws.readyState === 1) {
        try {
          ws.send(payload);
        } catch (e) {
          console.error("Error sending game over:", e);
        }
      }
    }
  }
}

const sessions = new Map<string, MatchGameSession>();

export function getOrCreateSession(matchId: string): MatchGameSession {
  let s = sessions.get(matchId);
  if (!s) {
    s = new MatchGameSession(matchId);
    sessions.set(matchId, s);
  }
  return s;
}

export function removeSession(matchId: string): void {
  sessions.delete(matchId);
}
