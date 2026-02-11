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
import { reportResultToMainBE } from "../utils/matchResult.js";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const MAIN_BE_URL = process.env.MAIN_BE_URL || "http://backend:3000";
const GAME_SERVICE_TOKEN = process.env.GAME_SERVICE_TOKEN || "";

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

    const players = matchManager.getMatchPlayers(this.matchId);
    const isLeftPlayer = players[0]?.userId === userId;

    if (message.action === "MOVE_UP") {
      const key = isLeftPlayer ? "w" : "ArrowUp";
      this.game.handleInput({ type: "keydown", key });
    } else if (message.action === "MOVE_DOWN") {
      const key = isLeftPlayer ? "s" : "ArrowDown";
      this.game.handleInput({ type: "keydown", key });
    } else if (message.action === "STOP") {
      if (isLeftPlayer) {
        this.game.handleInput({ type: "keyup", key: "w" });
        this.game.handleInput({ type: "keyup", key: "s" });
      } else {
        this.game.handleInput({ type: "keyup", key: "ArrowUp" });
        this.game.handleInput({ type: "keyup", key: "ArrowDown" });
      }
    }
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

    const winnerId =
      player1.username === winnerName
        ? player1.userId
        : player2?.username === winnerName
          ? player2.userId
          : null;
    if (!winnerId) return;

    const state = this.game?.getState();
    if (!state) return;

    const score: Record<string, number> = { [player1.userId]: state.leftPlayer.life };
    if (player2) score[player2.userId] = state.rightPlayer.life;

    reportResultToMainBE(this.matchId, winnerId);
    this.sendGameOverToAll(winnerId, score);

    if (this.game) {
      this.game.stop();
      this.game = null;
    }
  }

  //private async reportResultToMainBE(
  //  winnerId: string,
  //  score: Record<string, number>
  //): Promise<void> {
  //  try {
  //    const url = `${MAIN_BE_URL}/matches/${this.matchId}/result`;
  //    const body: MatchResult = { winnerId, score };
  //    const res = await fetch(url, {
  //      method: "POST",
  //      headers: {
  //        "Content-Type": "application/json",
  //        ...(GAME_SERVICE_TOKEN && {
  //          Authorization: `Bearer ${GAME_SERVICE_TOKEN}`,
  //        }),
  //      },
  //      body: JSON.stringify(body),
  //    });
  //    if (!res.ok) {
  //      const text = await res.text();
  //      console.error(`Failed to report result: ${res.status} ${res.statusText}`, text);
  //    } else {
  //      console.log(`Reported match result to Main BE for match ${this.matchId}`);
  //    }
  //  } catch (e) {
  //    console.error("Error reporting result to Main BE:", e);
  //  }
  //}

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
