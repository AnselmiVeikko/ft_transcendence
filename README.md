*This project has been created as part
of the 42 curriculum by ahentton, shachowd, eelaine, fsolomon, hitran .*

# Description

Pong is a full-stack web application built as the final team project at Hive Helsinki (42 Network).

The project combines real-time gameplay with friends and AI, user and friend management, secure authentication and focuses on modern backend architecture, secure API design, and containerized deployment.

# Features List

| Feature | Description | Responsible User(s) |
|---------|-------------|-------------------|
| **User Management** | Registration, login, profile update, avatar change | `shachowd, fsolomon, eelaine` |
| **Secure Authentication** | JWT + cookie-based login and authentication | `ahentton, hitran, eelaine` |
| **Play Real-Time Game** | Pong matches with friends through real-time matchmaking and AI opponents | `hitran, eelaine, ahentton` |
| **Friend Management** | Manage friend requests, search friends, see online status | `fsolomon, shachowd` |
| **Containerized Deployment** | Dockerized multi-service deployment for easy setup | `hitran, shachowd` |
| **Deployment Infrastructure** | Reverse proxy and https/tls termination | `ahentton` |



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

# Instructions

## Prerequisites
1. Docker ([install](https://docs.docker.com/get-started/))
2. Docker Compose ([install](https://docs.docker.com/compose/))
3. Make tool ([install](https://sp21.datastructur.es/materials/guides/make-install.html))
4. Rename .env_example file as .env and update credentials
5. Make sure port 3000 and 8443 are not in use

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
- Setting up and structuring the initial backend server.
- Designing and implementing the database schema for user and friend management.
- Integrating Prisma ORM into backend services.
- Developing REST API endpoints for
  - User management: registration, profile update, avatar change, profile view.
  - Friend management: sending, accepting, declining, deleting friend requests, and friends search, suggestion, pending request.
- Designing avatar upload handling with validation, image processing, and Docker volume based storage.
- Containerizing the backend service using Docker and Docker Compose
- Facilitating team meetings.

### Challenges
- Structuring the backend architecture.
- Working with Prisma ORM.
- Designing consistent and maintainable REST APIs.
- Handling secure file uploads and containerized storage environments.

## hitran (Trung Tran)

### Contributions
- Designed and implemented the real-time Pong game module.
- Built game backend (Express + ws) with server-authoritative physics and state management.
- Implemented WebSocket-based multiplayer synchronization.
- Developed AI opponent using trajectory prediction with controlled reaction delay.
- Integrated game service with main backend for authentication and match result persistence.

### Challenges
- Real-time synchronization and fairness.
- AI balancing.
- Secure inter-service communication.

## eelaine

### Contributions
- Implemented frontend anguage switching support
- Fixed cross-browser compatibility
- Contributed to user management features on the frontend
- Worked on authentication flows (JWT + cookie-based login)
- Developed responsive UI components

### Challenges
- Learning to use typescript in a large frontend project
- Ensuring accessibility and usability for international users
- Understanding browser compatibility issues
- Integrating authentication and user management securely on the frontend

## fsolomon

### Contributions
- Implemented a friends system on Frontend (add/remove friends, friends list, pending requests, and friend suggestions)
- Advanced search functionality with pagination, status filters and sorting
- JWT cookie refresh on frontend
- Implemented reusable Header component and protected routes with 404 page redirection
- Responsive UI components with dark mode support

### Challenges
- Managing state across multiple asynchronous operations
- learning Tailwind css and typescript
- Addressing UI issues related to responsive design


# Resources

### Backend

- [Fastify](https://fastify.dev/docs/latest/Guides/)
- [Node.js](https://nodejs.org/docs/latest/api/)
- [TypeScript](https://www.typescriptlang.org/docs/)

- [Authentication](https://www.reddit.com/r/node/comments/1gjjdnw/why_use_refresh_access_tokens_for_jwt/)
- [Authentication](https://fullstackopen.com/en/part4/token_authentication)
- [HTTP](https://devhints.io/http-status)
- [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

### Frontend
FILL FRONTEND REFERENCES HERE
- [React](https://react.dev/versions)
- [TypeScript](https://react.dev/learn/typescript)
- [TailwindCSS](https://v2.tailwindcss.com/docs)
- [ReactIcons](https://react-icons.github.io/react-icons/)

### Game
- [Websockets](https://datatracker.ietf.org/doc/html/rfc6455)
- [Express](https://expressjs.com/)
- [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

**AI usage:**

  - Learning standard practices in API building.
  - Learning typescipt syntax.
	- Learning trade-offs between different practices.
	- Seeking optimized solutions accomodating modern standards.
	- Repetitive tasks, like writing simple schemas etc.
  - Structuring secure authentication across multiple services (JWT validation, HTTP-only cookies, token verification across WebSocket connections).
  - Debugging assistance and concept clarification during development.
