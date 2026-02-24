*This project has been created as part
of the 42 curriculum by ahentton, shachowd, eelaine, fsolomon, hitran .*

# Description

(PROJECT NAME HERE_) is a full-stack web application built as the final team project at Hive Helsinki (42 Network).

The project combines real-time gameplay with friends and AI, user management, secure authentication and focuses on modern backend architecture, secure API design, and containerized deployment.

# Instructions

## Prerequisites
1. Docker ([install](https://docs.docker.com/get-started/))
2. Docker Compose ([install](https://docs.docker.com/compose/))
3. Make tool ([install](https://sp21.datastructur.es/materials/guides/make-install.html))
4. Make sure port 3000 and 8443 are not in use

### Installation
1. Clone git repository in your local directory
```bash
	git clone git@github.com:AnselmiVeikko/ft_transcendence.git
```

2. Build and start all the docker containers

```bash
	cd ft_transcendence

	make run
```

### Usage
Navigate (Note: You may receive a security warning because the site uses a self-signed TLS certificate. Click “Advanced” and then “Proceed to localhost (unsafe)” to continue browsing)
```
	https://localhost:8443
```


### Clean
To stop and remove all the containers and volumes run

```
	make clean
```

# Resources

### Backend

- [Fastify](https://fastify.dev/docs/latest/Guides/)
- [Node.js](https://nodejs.org/docs/latest/api/)
- [TypeScript](https://www.typescriptlang.org/docs/)

- [Authentication](https://www.reddit.com/r/node/comments/1gjjdnw/why_use_refresh_access_tokens_for_jwt/)
- [Authentication](https://fullstackopen.com/en/part4/token_authentication)
- [HTTP](https://devhints.io/http-status)
- [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

**AI usage:**  

	- Learning standard practices in API building
	- Learning typescipt syntax
	- Learning trade-offs between different practices
	- Seeking optimized solutions accomodating modern standards
	- Repetitive tasks, like writing simple schemas etc.

### Frontend
FILL FRONTEND REFERENCES HERE

### Game
FILL GAME REFERENCES HERE

# Technical Stack
## Frontend
 ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
 ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
 ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
 ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
## Backend
 ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
 ![Fastify](https://img.shields.io/badge/Fastify-000000?logo=fastify&logoColor=white)
 ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
 ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
 ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
## Database
 ![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
## Infrastructure
 ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
 ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white)

## Communication and Protocols

**REST API:** Used for predictable CRUD operations (authentication, profiles, friends, avatar management).

**WebSocket:** Used for real-time bidirectional communication during gameplay and matchmaking.

**HTTP/HTTPS:** HTTPS is used for secure client-to-server communication and all backend operations via Nginx. Communication between frontend and game services within the Docker network uses HTTP.  HTTP is also responsible for carrying JWT authentication cookies.

**Nginx:** Acts as a reverse proxy, routing requests to backend services and handling TLS termination.

**Data Format (Notation):** JSON for API communication and Markdown for project documentation.


# Installation and Usage

### Prerequisites
1. Docker ([install](https://docs.docker.com/get-started/))
2. Docker Compose ([install](https://docs.docker.com/compose/))
3. Make tool ([install](https://sp21.datastructur.es/materials/guides/make-install.html))
4. Make sure port 3000 and 8443 are not in use

### Installation
1. Clone git repository in your local directory
```bash
	git clone git@github.com:AnselmiVeikko/ft_transcendence.git
```

2. Build and start all the docker containers

```bash
	cd ft_transcendence

	make run
```

### Usage

Navigate (Note: You may receive a security warning because the site uses a self-signed TLS certificate. Click “Advanced” and then “Proceed to localhost (unsafe)” to continue browsing)
```
	https://localhost:8443
```


### Clean
To stop and remove all the containers and volumes run

```
	make clean
```

 # Team Information

| Name | GitHub | Thematic Role | Responsible For |
|------|--------|---------------|------------------|
| Anselmi Veikko | [AnselmiVeikko](https://github.com/AnselmiVeikko) | Project Manager (PM) | Backend Development |
| Finnan Solomon | [finye](https://github.com/finye) | Product Owner (PO) | Frontend Development |
| Trung Tran | [tranhieutrung](https://github.com/tranhieutrung) | Technical Lead, Game  | Game Development |
| Eetu Laine | [eetulaine](https://github.com/eetulaine) | Technical Lead, Frontend | Frontend Development |
| Shahnaj Chowdhury | [shahnajsc](https://github.com/shahnajsc) | Technical Lead, Backend | Backend Development |

# Project Management

For this project, we mainly used discord for communication.
We would have weekly meetings, with the date decided by vote.
In said meetings, we went over current tasks and split the workload.
We used GitHub Projects for logging progress and current tasks.

# Database Schema

Our database is structured around one main model for the user,

```prisma
model user_info {
  userId      String       @id @default(cuid())
  userName    String       @unique
  email       String       @unique
  password    String
  avatarName  String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @default(now())
  status      OnlineStatus @default(OFFLINE)

  // Relation with friend_request
  sentRequests      friend_request[] @relation("Sender")
  receivedRequests  friend_request[] @relation("Receiver")
}
```

which requires and is required friend request model to work

```prisma
model friend_request {
  friendRId       String        @id @default(cuid())
  senderId        String
  receiverId      String
  requestStatus   FriendRequestStatus   @default(PENDING)
  sentAt          DateTime  @default(now())
  updatedAt       DateTime?

  // Relation with user_info
  sender    user_info @relation("Sender", fields: [senderId], references: [userId])
  receiver  user_info @relation("Receiver", fields: [receiverId], references: [userId])

  @@unique([senderId, receiverId])
}
```

For the game, we have a similiar model in smaller scale

```prisma
model game_match {
  matchId      String @id @default(cuid())
  playerOneId  String
  playerTwoId  String?
  status       MatchStatus @default(MATCHMAKING)
}
```

@unique keyword is used in combination with other methods to
prevent possible data races in DB operations. 
cuid() is used to create unique ID's for matches, users and friend request.

# Features List

| Feature | Description | Responsible User(s) |
|---------|-------------|-------------------|
| **User Management** | Registration, login, profile update, avatar change | `shachowd, fsolomon, eelaine` |
| **Secure Authentication** | JWT + cookie-based login and authentication | `ahentton, hitran, eelaine` |
| **Play Real-Time Game** | Pong matches with friends through real-time matchmaking and AI opponents | `hitran, eelaine, ahentton` |
| **Friend Management** | Manage friend requests, search friends, see online status | `fsolomon, shachowd` |
| **Containerized Deployment** | Dockerized multi-service deployment for easy setup | `hitran, shachowd` |
| **Deployment Infrastructure** | Reverse proxy and https/tls termination | `ahentton` |

# Modules

## Framework for both front-end and backend

### Justification
Following industry standards & preparation for real web-development job.

### Implementation
React and Fastify.

### Contributors
fsolomon, eelaine, shachowd, ahentton

### Points
+2

---

## Real time features with websockets

### Justification
Prerequisite for remote players & more durable game logic.

### Implementation
Real-time communication was implemented using the ws WebSocket library on the game server.

- Established persistent WebSocket connections between clients and the game backend.

- Implemented authoritative server logic for updating ball physics and validating player inputs. Clients only send input events and render the received game state.

- Ensured synchronization between Game frontend, Game backend and Main backend

This architecture prevents cheating and keeps the gameplay consistent across different machines.

### Contributors
hitran

### Points
+2

---

## ORM for backend

### Justification
Improves database abstraction, maintainability and type safety.

### Implementation
Prisma ORM integrated with backend services.

### Contributors
shachowd

### Points
+1

---

## Advanced search functions

### Justification
Enhances user experience by efficient filtering and discovery of users and friends.

### Implementation
WRITE HERE

### Contributors
WRITE HERE

### Points
+1

---

## Multiple languages frontend

### Justification
Improves accessibility and usability for international users.

### Implementation
Frontend internationalization (i18n) with language switching support.

### Contributors
WRITE HERE

### Points
+1

---

## Support for additional browsers

### Justification
Ensures compatibility and consistent experience across major browsers.

### Implementation
Cross-browser testing and compatibility fixes.

### Contributors
WRITE HERE

### Points
+1

---

## Standard user management

### Justification
Provides essential account handling including registration, authentication, and profile management.

### Implementation
User schema design, authentication flow, and profile update endpoints.

### Contributors
WRITE HERE

### Points
+2

---

## AI opponent in game

### Justification
The AI opponent enables single-player gameplay and enhances user experience by allowing players to practice without requiring another online player.

### Implementation
The AI logic is implemented on the server-side within the game backend.

- The AI paddle movement is calculated based on reading the current ball position
and predicting the ball’s future trajectory

- To maintain fairness and allow human players to win, the AI refreshes its decision logic only once per second.

### Contributors
hitran

### Points
+2

---

## Game

### Justification
The game is the core feature of the project, providing interactive real-time Pong gameplay between users or against AI.

### Implementation
The game architecture is separated into Frontend (FE) and Backend (BE) services.

- Frontend (Game Client): Built using React + TypeScript, uses Canvas for rendering ball movement, paddle positions, score updates. 

- Backend (Game Server): Built using Express. It handles the ball physics, collision detection, score tracking, match state transitions. It communicates with the main backend to verify authenticated users, send final match results.

This separation ensures:

- Clear division of responsibility

- Secure, server-authoritative gameplay

- Scalable and modular architecture

### Contributors
hitran

### Points
+2

---

## Remote players on different computers

### Justification
Enables multiplayer functionality across separate machines over the network.

### Implementation
WebSocket-based real-time synchronization between clients.

### Contributors
WRITE HERE

### Points
+2

---

## Backend as microservices

### Justification
Improves scalability, modularity, and separation of concerns.

### Implementation
Service separation with containerized deployment and internal networking.

### Contributors
WRITE HERE

### Points
+2

---

## Custom module: JWT authentication via cookies

### Justification
Verifies user access and protects application endpoints.

### Implementation
JWT authentication with HTTP-only cookies.

### Contributors
ahentton

### Points
+1

---

## Total points = 19


# Individual Contributions

## ahentton

### Contributions
- Designing the schema/response infrastructure for the backend.
- Creating Login/logout endpoints.
- Security features like JWT authentication via cookies, reverse proxy, https/tsl termination.
- Game logic on main backend; tracking match status, crafting a smooth matchmaking system.
- ToS & Privacy policy.
- Mapping out progress and urgent tasks in meetings.

### Challenges
I faced many challenges during this project, here are the major ones listed:
- Learning typescript & general rest API fundamentals.
- Learning standard practices for authentication and general security.
- Reviewing others code on an unfamiliar stack.


## shachowd

### Contributions
### Challenges

## hitran

### Contributions
### Challenges

## eelaine

### Contributions
### Challenges

## fsolomon

### Contributions
### Challenges