import './style.css';
import { render } from "./renderer/render";
import type { GameState, InputEvent, GameStartEvent } from "./types/gameState";

const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
const play2PButton = document.getElementById("play2PButton");
const playAIButton = document.getElementById("playAIButton");

if (!canvas || !play2PButton || !playAIButton) {
  throw new Error("Missing required DOM elements to start the game");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Cannot get canvas context");
}

// WebSocket connection
// In browser, use the same hostname and port as the frontend, but connect to backend port
const getWebSocketURL = () => {
  const envUrl = (import.meta as any).env?.VITE_WS_URL;
  if (envUrl) return envUrl;
  
  // Use window.location to determine the correct WebSocket URL
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    // Backend runs on port 4000
    return `${protocol}//${host}:4000/game`;
  }
  
  // Fallback
  return `ws://localhost:4000/game`;
};

const WS_URL = getWebSocketURL();
let ws: WebSocket | null = null;
let currentState: GameState | null = null;
let isConnected = false;

function connectWebSocket() {
  console.log(`🔌 Attempting to connect to WebSocket: ${WS_URL}`);
  
  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("✅ Connected to game server");
      console.log("WebSocket URL:", WS_URL);
      isConnected = true;
      updateConnectionStatus();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "connected") {
          console.log("✅ Server confirmed connection:", message.message);
        } else if (message.type === "state" && ctx) {
          currentState = message.state as GameState;
          // Trigger render
          if (currentState) {
            render(ctx, currentState);
          }
        } else {
          // Only log non-state messages
          console.log("📨 Received message:", message.type);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      console.error("Error details:", {
        type: error.type,
        target: error.target,
        url: WS_URL
      });
      isConnected = false;
    };

    ws.onclose = (event) => {
      console.log(`🔌 WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
      isConnected = false;
      updateConnectionStatus();
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log("🔄 Attempting to reconnect...");
        connectWebSocket();
      }, 3000);
    };
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
    isConnected = false;
  }
}

function sendInput(event: InputEvent) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "input", input: event }));
  } else {
    console.warn("Cannot send input: WebSocket not connected");
  }
}

function startGame(event: GameStartEvent) {
  console.log("startGame called. WebSocket state:", {
    ws: ws ? "exists" : "null",
    readyState: ws?.readyState,
    OPEN: WebSocket.OPEN,
    isConnected: isConnected
  });
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("Starting game:", event);
    ws.send(JSON.stringify({ type: "start", ...event }));
  } else {
    console.error("Cannot start game: WebSocket not connected. ReadyState:", ws?.readyState);
    console.error("WebSocket states: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3");
    
    // Try to reconnect if not connected
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      console.log("Attempting to reconnect...");
      connectWebSocket();
      // Wait a bit and try again
      setTimeout(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          console.log("Reconnected! Starting game now...");
          ws.send(JSON.stringify({ type: "start", ...event }));
        } else {
          alert("Cannot start game: Not connected to server. Please check the browser console for errors.");
        }
      }, 1000);
    } else {
      alert("Cannot start game: Not connected to server. Please wait for connection...");
    }
  }
}

// Handle keyboard input
const normalizeKey = (key: string) => (key.length === 1 ? key.toLowerCase() : key);

window.addEventListener("keydown", (e) => {
  sendInput({ type: "keydown", key: normalizeKey(e.key) });
});

window.addEventListener("keyup", (e) => {
  sendInput({ type: "keyup", key: normalizeKey(e.key) });
});

// Button handlers
play2PButton.addEventListener("click", () => {
  startGame({ gameMode: "2P", player1: "Player1", player2: "Player2" });
});

playAIButton.addEventListener("click", () => {
  startGame({ gameMode: "AI", player1: "Player1" });
});

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
  statusEl.textContent = '🔴 Disconnected';
  document.body.appendChild(statusEl);
}

// Initialize
connectWebSocket();
renderLoop();

// Update connection status periodically
setInterval(updateConnectionStatus, 500);
