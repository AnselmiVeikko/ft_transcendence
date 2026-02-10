/**
 * Helpers for match result: resolve winner, build score, report to Main BE.
 */

import type { GameState, MatchResult } from "../types/gameState.js";
import { getMainBeUrl, getGameServiceToken } from "./gameConfig.js";

export type MatchPlayer = { userId: string; username: string };

/**
 * Resolve winner userId from winner display name and match players.
 */
export function getWinnerIdFromWinnerName(
  players: MatchPlayer[],
  winnerName: string
): string | null {
  const player1 = players[0];
  const player2 = players[1];
  if (!player1) return null;
  if (player1.username === winnerName) return player1.userId;
  if (player2?.username === winnerName) return player2.userId;
  return null;
}

/**
 * Build score map (userId -> remaining life) from game state and players.
 */
export function buildScoreFromState(
  state: GameState,
  player1: MatchPlayer,
  player2: MatchPlayer | undefined
): Record<string, number> {
  const score: Record<string, number> = { [player1.userId]: state.leftPlayer.life };
  if (player2) score[player2.userId] = state.rightPlayer.life;
  return score;
}

/**
 * POST match result to Main BE. Logs errors; does not throw.
 */
export async function reportResultToMainBE(
  matchId: string,
  winnerId: string,
  score: Record<string, number>
): Promise<void> {
  try {
    const url = `${getMainBeUrl()}/matches/${matchId}/result`;
    const body: MatchResult = { winnerId, score };
    const token = getGameServiceToken();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Failed to report result: ${res.status} ${res.statusText}`, text);
    } else {
      console.log(`Reported match result to Main BE for match ${matchId}`);
    }
  } catch (e) {
    console.error("Error reporting result to Main BE:", e);
  }
}
