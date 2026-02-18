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

// Data received from Main FE via postMessage (strings = i18n for selected language)
interface GameInitData {
  matchId: string;
  player: {
    id: string;
    username: string;
  };
  gameWsUrl: string;
  accessToken: string;
  strings?: {
    welcome: string;
    gameOverTemplate: string;
    youWon: string;
    youLost: string;
    opponent: string;
    connected: string;
    disconnected: string;
    waiting: string;
    controls: string;
    moveLeft: string;
    moveRight: string;
  };
}

let ws: WebSocket | null = null;
let currentState: GameState | null = null;
let isConnected = false;
let gameInitData: GameInitData | null = null;
let gameStrings: GameInitData["strings"] = undefined;
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
          // Trigger render (always pass welcome text even if state exists, for consistency)
          render(ctx, currentState, gameStrings?.welcome);
        } else if (message.type === "GAME_OVER") {
          console.log("🎮 Game Over!", message.result);
          const result = message.result as { winnerId: string; score: Record<string, number> };
          const isWinner = result.winnerId === gameInitData?.player.id;
          const translatedMessage = isWinner
            ? (gameStrings?.youWon ?? "You won!")
            : (gameStrings?.youLost ?? "You lost!");
          if (currentState) {
            currentState = { ...currentState, gameMessage: translatedMessage };
          }
          if (ctx) render(ctx, currentState, gameStrings?.welcome);
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
 * - Init: { matchId, player, gameWsUrl, accessToken, strings? }
 * - STRINGS_UPDATE: { type: 'STRINGS_UPDATE', strings } when main FE language changes
 */
window.addEventListener("message", (event) => {
  try {
    const data = event.data as GameInitData & { type?: string; strings?: GameInitData["strings"] };

    if (data.type === "STRINGS_UPDATE" && data.strings) {
      gameStrings = data.strings;
      // Update connection status and controls with new strings
      updateConnectionStatus();
      updateControlsText();
      // Re-render to update welcome message if we're on welcome screen
      if (ctx && !currentState) {
        render(ctx, null, gameStrings.welcome);
      }
      return;
    }

    // Security: Always validate origin
    if (!data.matchId || !data.player || !data.gameWsUrl || !data.accessToken) {
      return;
    }

    console.log("✅ Received game init data:", {
      matchId: data.matchId,
      player: data.player.username,
      gameWsUrl: data.gameWsUrl
    });

    gameInitData = data;
    gameStrings = data.strings;
    
    // Update UI with translated strings
    updateConnectionStatus();
    updateControlsText();

    connectWebSocket(data);
  } catch (error) {
    console.error("Error handling postMessage:", error);
  }
});

// Start render loop
function renderLoop() {
  if (ctx) {
    render(ctx, currentState, gameStrings?.welcome);
  }
  requestAnimationFrame(renderLoop);
}

// Update controls text with translations
function updateControlsText() {
  const controlsTitle = document.querySelector('.tips-title');
  const controlsList = document.querySelector('.tips-card ul');
  if (controlsTitle && gameStrings?.controls) {
    controlsTitle.textContent = gameStrings.controls;
  }
  if (controlsList && gameStrings?.moveLeft && gameStrings?.moveRight) {
    const items = controlsList.querySelectorAll('li');
    if (items.length >= 2) {
      items[0].textContent = `W / S ${gameStrings.moveLeft}`;
      items[1].textContent = `↑ / ↓ ${gameStrings.moveRight}`;
    }
  }
}

// Connection status indicator
function updateConnectionStatus() {
  const statusEl = document.getElementById('connection-status');
  if (statusEl) {
    if (isConnected) {
      statusEl.textContent = `🟢 ${gameStrings?.connected ?? 'Connected'}`;
      statusEl.style.color = '#4ade80';
    } else {
      statusEl.textContent = `🔴 ${gameStrings?.disconnected ?? 'Disconnected'}`;
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
  statusEl.textContent = `🔴 ${gameStrings?.waiting ?? 'Waiting for game data...'}`;
  document.body.appendChild(statusEl);
  // Update initial status text when strings are received
  const updateInitialStatus = () => {
    const waiting = gameStrings?.waiting;
    if (waiting && statusEl.textContent?.includes('Waiting')) {
      statusEl.textContent = `🔴 ${waiting}`;
    }
  };
  // Check periodically until strings are loaded
  const checkInterval = setInterval(() => {
    if (gameStrings?.waiting) {
      updateInitialStatus();
      clearInterval(checkInterval);
    }
  }, 100);
  setTimeout(() => clearInterval(checkInterval), 5000);
}

// Initialize render loop (will wait for postMessage to connect)
renderLoop();

// Update connection status periodically
setInterval(updateConnectionStatus, 500);
