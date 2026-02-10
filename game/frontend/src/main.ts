import './style.css';
import { render } from "./renderer/render";
import type { GameState } from "./types/gameState";

const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Missing required DOM elements to start the game");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Cannot get canvas context");
}

// Data received from Main FE via postMessage
interface GameInitData {
  matchId: string;
  player: {
    id: string;
    username: string;
  };
  gameWsUrl: string;
  accessToken: string;
}

let ws: WebSocket | null = null;
let currentState: GameState | null = null;
let isConnected = false;
let gameInitData: GameInitData | null = null;
const leftKeys = new Set<string>();
const rightKeys = new Set<string>();

/**
 * Connect to Game BE WebSocket with matchId and token
 * Format: wss://game-be.domain/ws?matchId=m456&token=JWT_TOKEN
 */
function connectWebSocket(data: GameInitData) {
  if (!data.gameWsUrl || !data.matchId || !data.accessToken) {
    console.error("❌ Missing required data to connect:", data);
    return;
  }

  // Build WebSocket URL with matchId and token as query params
  const url = new URL(data.gameWsUrl);
  url.searchParams.set('matchId', data.matchId);
  url.searchParams.set('token', data.accessToken);
  
  const wsUrl = url.toString();
  console.log(`🔌 Attempting to connect to WebSocket: ${wsUrl.replace(/token=[^&]+/, 'token=***')}`);
  
  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ Connected to game server");
      isConnected = true;
      updateConnectionStatus();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "STATE_UPDATE" && ctx) {
          currentState = message.state as GameState;
          // Trigger render
          if (currentState) {
            render(ctx, currentState);
          }
        } else if (message.type === "GAME_OVER") {
          console.log("🎮 Game Over!", message.result);
          // Display game over message
          displayGameOver(message.result);
        } else {
          console.log("📨 Received message:", message.type);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      isConnected = false;
      updateConnectionStatus();
    };

    ws.onclose = (event) => {
      console.log(`🔌 WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
      isConnected = false;
      updateConnectionStatus();
      
      // Only reconnect if not a normal closure (code 1000)
      if (event.code !== 1000 && gameInitData) {
        setTimeout(() => {
          console.log("🔄 Attempting to reconnect...");
          connectWebSocket(gameInitData!);
        }, 3000);
      }
    };
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
    isConnected = false;
  }
}

/**
 * Send input to Game BE
 * Format: { type: "INPUT", action: "MOVE_UP" | "MOVE_DOWN" | "STOP", paddle?: "left" | "right" }
 * paddle specifies which paddle - both browsers can control both paddles (local co-op on same computer)
 */
function sendInput(action: 'MOVE_UP' | 'MOVE_DOWN' | 'STOP', paddle: 'left' | 'right') {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "INPUT", action, paddle }));
  } else {
    console.warn("Cannot send input: WebSocket not connected");
  }
}

// Handle keyboard input
// Left paddle: W/S, Right paddle: ArrowUp/ArrowDown
// Both browsers can control both paddles (local co-op on same computer)
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  // Prevent default to avoid scrolling
  if (['w', 's', 'arrowup', 'arrowdown'].includes(key)) {
    e.preventDefault();
  }

  if (key === 'w') {
    if (!leftKeys.has(key)) {
      leftKeys.add(key);
      sendInput('MOVE_UP', 'left');
    }
  } else if (key === 's') {
    if (!leftKeys.has(key)) {
      leftKeys.add(key);
      sendInput('MOVE_DOWN', 'left');
    }
  } else if (key === 'arrowup') {
    if (!rightKeys.has(key)) {
      rightKeys.add(key);
      sendInput('MOVE_UP', 'right');
    }
  } else if (key === 'arrowdown') {
    if (!rightKeys.has(key)) {
      rightKeys.add(key);
      sendInput('MOVE_DOWN', 'right');
    }
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();

  if (key === 'w' || key === 's') {
    leftKeys.delete(key);
    if (leftKeys.size === 0) {
      sendInput('STOP', 'left');
    }
  } else if (key === 'arrowup' || key === 'arrowdown') {
    rightKeys.delete(key);
    if (rightKeys.size === 0) {
      sendInput('STOP', 'right');
    }
  }
});

/**
 * Listen for postMessage from Main FE
 * Expected data: { matchId, player: { id, username }, gameWsUrl, accessToken }
 */
window.addEventListener("message", (event) => {
  // Security: Always validate origin
  // In production, validate against known Main FE origin
  console.log("📨 Received postMessage from:", event.origin);
  
  try {
    const data = event.data as GameInitData;
    
    // Validate required fields
    if (!data.matchId || !data.player || !data.gameWsUrl || !data.accessToken) {
      console.error("❌ Invalid game init data:", data);
      return;
    }
    
    console.log("✅ Received game init data:", {
      matchId: data.matchId,
      player: data.player.username,
      gameWsUrl: data.gameWsUrl
    });
    
    gameInitData = data;
    
    // Connect to WebSocket
    connectWebSocket(data);
  } catch (error) {
    console.error("Error handling postMessage:", error);
  }
});

function displayGameOver(result: { winnerId: string; score: Record<string, number> }) {
  // Create or update game over message
  let gameOverEl = document.getElementById('game-over-message');
  if (!gameOverEl) {
    gameOverEl = document.createElement('div');
    gameOverEl.id = 'game-over-message';
    gameOverEl.style.position = 'fixed';
    gameOverEl.style.top = '50%';
    gameOverEl.style.left = '50%';
    gameOverEl.style.transform = 'translate(-50%, -50%)';
    gameOverEl.style.backgroundColor = 'rgba(0,0,0,0.9)';
    gameOverEl.style.color = '#fff';
    gameOverEl.style.padding = '2rem';
    gameOverEl.style.borderRadius = '8px';
    gameOverEl.style.zIndex = '2000';
    gameOverEl.style.textAlign = 'center';
    document.body.appendChild(gameOverEl);
  }
  
  const winnerName = gameInitData?.player.username === result.winnerId ? 
    gameInitData.player.username : 'Opponent';
  
  gameOverEl.innerHTML = `
    <h2>Game Over!</h2>
    <p>Winner: ${winnerName}</p>
    <p>Scores: ${JSON.stringify(result.score)}</p>
  `;
}

// Start render loop
function renderLoop() {
  if (ctx) {
    render(ctx, currentState);
  }
  requestAnimationFrame(renderLoop);
}

// Connection status indicator
function updateConnectionStatus() {
  const statusEl = document.getElementById('connection-status');
  if (statusEl) {
    if (isConnected) {
      statusEl.textContent = '🟢 Connected';
      statusEl.style.color = '#4ade80';
    } else {
      statusEl.textContent = '🔴 Disconnected';
      statusEl.style.color = '#ef4444';
    }
  }
}

// Create connection status element if it doesn't exist
if (!document.getElementById('connection-status')) {
  const statusEl = document.createElement('div');
  statusEl.id = 'connection-status';
  statusEl.style.position = 'fixed';
  statusEl.style.top = '10px';
  statusEl.style.right = '10px';
  statusEl.style.padding = '8px 16px';
  statusEl.style.backgroundColor = 'rgba(0,0,0,0.7)';
  statusEl.style.color = '#ef4444';
  statusEl.style.borderRadius = '4px';
  statusEl.style.fontSize = '14px';
  statusEl.style.zIndex = '1000';
  statusEl.textContent = '🔴 Waiting for game data...';
  document.body.appendChild(statusEl);
}

// Initialize render loop (will wait for postMessage to connect)
renderLoop();

// Update connection status periodically
setInterval(updateConnectionStatus, 500);
