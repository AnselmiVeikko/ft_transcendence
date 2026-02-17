/**
 * Match Manager
 * Tracks active matches and their players
 */

export interface Match {
  matchId: string;
  players: Array<{
    userId: string;
    username: string;
    socket?: any; // WebSocket connection
  }>;
  state: 'waiting' | 'playing' | 'finished';
  gameMode: 'PVP' | 'AI';
}

export class MatchManager {
  private matches: Map<string, Match> = new Map();

  /**
   * Create or get a match
   */
  createOrGetMatch(matchId: string, userId: string, username: string, gameMode: 'PVP' | 'AI' = 'PVP'): Match {
    let match = this.matches.get(matchId);
    
    if (!match) {
      match = {
        matchId,
        players: [{ userId, username }],
        state: 'waiting',
        gameMode
      };
      this.matches.set(matchId, match);
    } else {
      // Add player if not already in match
      const playerExists = match.players.some(p => p.userId === userId);
      if (!playerExists) {
        match.players.push({ userId, username });
      }
    }

    return match;
  }

  /**
   * Get match by ID
   */
  getMatch(matchId: string): Match | undefined {
    return this.matches.get(matchId);
  }

  /**
   * Check if user belongs to match
   */
  isUserInMatch(matchId: string, userId: string): boolean {
    const match = this.getMatch(matchId);
    if (!match) return false;
    return match.players.some(p => p.userId === userId);
  }

  /**
   * Update match state
   */
  updateMatchState(matchId: string, state: Match['state']): void {
    const match = this.getMatch(matchId);
    if (match) {
      match.state = state;
    }
  }

  /**
   * Get all players in match
   */
  getMatchPlayers(matchId: string): Array<{ userId: string; username: string }> {
    const match = this.getMatch(matchId);
    return match ? match.players.map(p => ({ userId: p.userId, username: p.username })) : [];
  }
}

// Singleton instance
export const matchManager = new MatchManager();

