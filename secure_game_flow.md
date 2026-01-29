# Secure Game Flow (Main FE / Main BE / Game FE / Game BE)

This document describes a **secure, production-grade flow** for handling matchmaking, game loading, authentication, real-time input, and result reporting in a **microservice architecture**.

---

## Architecture Overview

```
User
 │
 ▼
Main FE ───────────▶ Main BE (Auth + Match Service)
 │                        │
 │ iframe + JWT           │ private key (RS256)
 ▼                        ▼
Game FE ───────────▶ Game BE (Authoritative, WebSocket)
```

---

## 0. JWT & RS256 Setup (IMPORTANT)

This section explains **how JWT is signed and verified** between Main BE and Game BE.

### 0.1 Generate RSA key pair (one-time setup)

```bash
# Generate private key (used only by Main BE)
openssl genrsa -out jwt_private.pem 4096

# Generate public key (shared with Game BE)
openssl rsa -in jwt_private.pem -pubout -out jwt_public.pem
```

| Key | Stored at | Purpose |
|---|---|---|
| `jwt_private.pem` | Main BE | Sign JWT |
| `jwt_public.pem` | Game BE | Verify JWT |

⚠️ **Never share the private key**

---

### 0.2 JWT Signing (Main BE)

Main BE acts as the **Auth Server** and signs JWT using **RS256**.

#### JWT payload (recommended)
```json
{
  "sub": "u123",
  "username": "Alice",
  "iss": "main-be",
  "aud": "game-be",
  "exp": 1719999999
}
```

#### Example (Node.js)
```ts
jwt.sign(payload, PRIVATE_KEY, {
  algorithm: "RS256"
});
```

---

### 0.3 JWT Verification (Game BE)

Game BE is a **Resource Server**.  
It **does NOT call Main BE** to verify tokens.

Instead, it verifies JWT locally using the **public key**.

#### Verification rules
- Signature must be valid (RS256)
- `exp` must not be expired
- `iss` must be `main-be`
- `aud` must be `game-be`

#### Example (Node.js)
```ts
jwt.verify(token, PUBLIC_KEY, {
  algorithms: ["RS256"],
  issuer: "main-be",
  audience: "game-be"
});
```

✅ If verification succeeds → user is authenticated  
❌ If verification fails → reject request / close WebSocket

---

## 1. User Login

**Responsible components**
- Main FE
- Main BE

### Flow
1. User opens Main FE
2. Main FE sends login request to Main BE
3. Main BE authenticates the user
4. Main BE returns a JWT and user info

### Response example
```json
{
  "accessToken": "JWT_RS256",
  "user": {
    "id": "u123",
    "username": "Alice"
  }
}
```

**Security rules**
- JWT is signed by Main BE using RS256
- JWT is stored only in memory on the FE

---

## 2. User Clicks Play → Create Match

**Responsible components**
- Main FE
- Main BE

### Request (Main FE → Main BE)
```http
POST /matches
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "mode": "PVP",
  "settings": {
    "maxScore": 5
  }
}
```

### Main BE processing
1. Verify JWT
2. Extract `userId`
3. Create match in DB or memory

```json
{
  "matchId": "m456",
  "players": ["u123"],
  "mode": "PVP",
  "state": "waiting"
}
```

### Response
```json
{
  "matchId": "m456",
  "gameUrl": "https://game-fe.domain",
  "gameWsUrl": "wss://game-be.domain/ws",
  "player": {
    "id": "u123",
    "username": "Alice"
  }
}
```

---

## 3. Load Game FE (iframe) and Pass Data

**Responsible components**
- Main FE
- Game FE

### Load iframe
```html
<iframe src="https://game-fe.domain"></iframe>
```

### Pass data using PostMessage
```ts
iframe.contentWindow.postMessage(
  {
    matchId: "m456",
    player: {
      id: "u123",
      username: "Alice"
    },
    gameWsUrl: "wss://game-be.domain/ws",
    accessToken: "JWT_RS256"
  },
  "https://game-fe.domain"
);
```

**Security rules**
- Always validate `event.origin`
- Use HTTPS
- JWT is only used to open WebSocket connection

---

## 4. Game FE Connects to Game BE (Authenticate Once)

**Responsible components**
- Game FE
- Game BE

### WebSocket connection
```ts
new WebSocket(
  `wss://game-be.domain/ws?matchId=m456&token=${JWT}`
);
```

### Game BE handshake logic
1. Extract JWT
2. Verify JWT using **public key**
3. Check `exp`, `iss`, `aud`
4. Extract `userId`
5. Verify `userId` belongs to match
6. Bind identity to socket context

```text
socket.userId = "u123"
socket.matchId = "m456"
```

If verification fails → close connection.

---

## 5. Handling Player Input (Authoritative)

**Responsible components**
- Game FE
- Game BE

### Input message (Game FE → Game BE)
```json
{
  "type": "INPUT",
  "action": "MOVE_UP"
}
```

**Rules**
- Do NOT send userId, username, or JWT
- Game BE trusts only socket context

### Game BE input handling
```text
onMessage(socket, msg):
  userId = socket.userId
  match = getMatch(socket.matchId)

  if userId not in match.players:
      ignore or disconnect

  applyAction(match, userId, msg.action)
```

### State broadcast
```json
{
  "type": "STATE_UPDATE",
  "state": {
    "ball": {},
    "paddles": {},
    "score": {}
  }
}
```

Game BE is **fully authoritative**.

---

## 6. Game End → Report Result

**Responsible components**
- Game BE
- Main BE
- Game FE

### Game BE detects end condition
```json
{
  "matchId": "m456",
  "winnerId": "u123",
  "score": {
    "u123": 5,
    "u789": 3
  }
}
```

### Game BE → Main BE (server-to-server)
```http
POST /matches/m456/result
Authorization: Bearer <GAME_SERVICE_TOKEN>
```

```json
{
  "winnerId": "u123",
  "score": {
    "u123": 5,
    "u789": 3
  }
}
```

**Notes**
- This token is NOT a user JWT
- Use service-to-service authentication only

### Game BE → Game FE
```json
{
  "type": "GAME_OVER",
  "result": {
    "winnerId": "u123",
    "score": {}
  }
}
```

---

## Security Checklist

- JWT signed by Main BE using RS256
- Game BE verifies JWT using public key (no API call)
- Authentication only during WebSocket handshake
- No trust in FE-provided identity
- Match ownership verification
- Separate service-to-service authentication

---

## Summary

This flow ensures:
- Strong authentication
- Clear service boundaries
- Secure real-time gameplay
- Scalable microservice architecture
- Compliance with 42 Transcendence expectations
