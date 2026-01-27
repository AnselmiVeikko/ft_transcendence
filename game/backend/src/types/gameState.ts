export interface GameState {
  ball: {
    x: number;
    y: number;
    radius: number;
  };
  leftPlayer: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    life: number;
  };
  rightPlayer: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    life: number;
  };
  gameMessage: string | null;
  canvasWidth: number;
  canvasHeight: number;
}

// Input message format (Game FE → Game BE)
// According to secure_game_flow.md: Do NOT send userId, username, or JWT
export interface InputMessage {
  type: 'INPUT';
  action: 'MOVE_UP' | 'MOVE_DOWN' | 'STOP';
}

// State update message format (Game BE → Game FE)
export interface StateUpdateMessage {
  type: 'STATE_UPDATE';
  state: GameState;
}

// Game over message format (Game BE → Game FE)
export interface GameOverMessage {
  type: 'GAME_OVER';
  result: {
    winnerId: string;
    score: Record<string, number>;
  };
}

// Match result to send to Main BE
export interface MatchResult {
  winnerId: string;
  score: Record<string, number>;
}

// Extended WebSocket with user context
export interface AuthenticatedWebSocket {
  userId?: string;
  matchId?: string;
  username?: string;
  on(event: string, listener: (...args: any[]) => void): void;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  readonly readyState: number;
}

