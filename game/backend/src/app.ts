import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { GameManager } from './gameManager.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
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
    wsUrl: `ws://${req.headers.host}/game`
  });
});

const server = createServer(app);
const wss = new WebSocketServer({ 
  server, 
  path: '/game',
  perMessageDeflate: false,
  clientTracking: true
});

wss.on('connection', (ws: WebSocket, request) => {
  const origin = request.headers.origin || 'unknown';
  console.log('✅ New WebSocket connection from:', origin);
  console.log('Connection URL:', request.url);
  
  const gameManager = new GameManager(ws);

  // Send welcome message
  try {
    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected successfully' }));
  } catch (error) {
    console.error('Error sending welcome message:', error);
  }

  ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason.toString()}`);
    gameManager.cleanup();
  });

  ws.on('error', (error: Error) => {
    console.error('WebSocket error:', error);
    gameManager.cleanup();
  });
});

// Log when upgrade requests are received
server.on('upgrade', (request, socket, head) => {
  console.log('📡 WebSocket upgrade request:', request.url);
  console.log('Headers:', JSON.stringify(request.headers, null, 2));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log(`WebSocket server available at ws://0.0.0.0:${port}/game`);
});

export default app;