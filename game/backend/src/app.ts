import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { GameManager } from './core/gameManager.js';
import { verifyJWT, extractAuthParams } from './utils/jwt.js';
import { matchManager } from './core/matchManager.js';
import { getOrCreateSession } from './core/matchGameSession.js';
import type { AuthenticatedWebSocket } from './types/gameState.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Game server is running');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get('/ws-test', (req: Request, res: Response) => {
  res.json({ 
    ok: true, 
    message: 'WebSocket server is running',
    wsUrl: `ws://${req.headers.host}/ws`
  });
});

const server = createServer(app);
const wss = new WebSocketServer({ 
  server, 
  path: '/ws',
  perMessageDeflate: false,
  clientTracking: true
});

wss.on('connection', (ws: WebSocket, request) => {
  const origin = request.headers.origin || 'unknown';
  console.log('📡 New WebSocket connection attempt from:', origin);
  console.log('Connection URL:', request.url);

  // Extract matchId and token from query params
  // Expected format: ws://host/ws?matchId=m456&token=JWT_TOKEN
  const { matchId, token } = extractAuthParams(request.url || '');

  if (!matchId || !token) {
    console.error('❌ Missing matchId or token in WebSocket URL');
    ws.close(1008, 'Missing matchId or token');
    return;
  }

  // Verify JWT token
  const payload = verifyJWT(token);
  if (!payload) {
    console.error('❌ JWT verification failed');
    ws.close(1008, 'Authentication failed');
    return;
  }

  const userId = payload.sub;
  const username = payload.username;

  console.log(`✅ Authenticated user: ${username} (${userId}) for match: ${matchId}`);

  // Create or get match and verify user belongs to it
  const match = matchManager.createOrGetMatch(matchId, userId, username);
  
  if (!matchManager.isUserInMatch(matchId, userId)) {
    console.error(`❌ User ${userId} not authorized for match ${matchId}`);
    ws.close(1008, 'Not authorized for this match');
    return;
  }

  // Bind identity to socket context
  // Create a wrapper object that implements AuthenticatedWebSocket
  const authWs: AuthenticatedWebSocket = {
    userId,
    matchId,
    username,
    on: (event: string, listener: (...args: any[]) => void) => {
      ws.on(event as any, listener);
    },
    send: (data: string) => {
      ws.send(data);
    },
    close: (code?: number, reason?: string) => {
      ws.close(code, reason);
    },
    get readyState() {
      return ws.readyState;
    }
  };

  const session = getOrCreateSession(matchId);
  session.addSocket(userId, username, authWs);

  ws.on('message', (data: Buffer) => {
    session.handleMessage(userId, data);
  });

  ws.on('close', (code, reason) => {
    console.log(`🔌 WebSocket connection closed. Code: ${code}, Reason: ${reason.toString()}`);
    session.removeSocket(userId);
  });

  ws.on('error', (error: Error) => {
    console.error('❌ WebSocket error:', error);
    session.removeSocket(userId);
  });
});

// Log when upgrade requests are received
server.on('upgrade', (request, socket, head) => {
  console.log('📡 WebSocket upgrade request:', request.url);
  console.log('Headers:', JSON.stringify(request.headers, null, 2));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log(`WebSocket server available at ws://0.0.0.0:${port}/ws`);
});

export default app;