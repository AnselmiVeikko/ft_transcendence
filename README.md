# Online Pong Game Platform

A full-stack web application built as the final team project at Hive Helsinki (42 Network).

The project combines real-time gameplay with friends and AI, user management, secure authentication and focuses on modern backend architecture, secure API design, and containerized deployment.

# Project Feature

- User management: Registration, login, profile update, avatar change.
- Secure authentication: JWT + cookie based login and authentication.
- Play real-time game: Pong matches with friends through real-time matchmaking and with AI.
- Friend management: Manage friend requests, Search friends, See status.
- Containerized deployment – Dockerized multi-service deployment

# Tech Stack
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

 # Team

| Name | GitHub | Thematic Role | Responsible For |
|------|--------|---------------|------------------|
| Anselmi Veikko | [AnselmiVeikko](https://github.com/AnselmiVeikko) | Project Manager (PM) | Backend Development |
| Finnan Solomon | [finye](https://github.com/finye) | Product Owner (PO) | Frontend Development |
| Trung Tran | [tranhieutrung](https://github.com/tranhieutrung) | Technical Lead, Game  | Game Development |
| Eetu Laine | [eetulaine](https://github.com/eetulaine) | Technical Lead, Frontend | Frontend Development |
| Shahnaj Chowdhury | [shahnajsc](https://github.com/shahnajsc) | Technical Lead, Backend | Backend Development |
