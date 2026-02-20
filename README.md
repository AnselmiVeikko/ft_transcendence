# Online Pong Game Platform

This is a full-stack web application built as part of the 42 curriculum, combining real-time gameplay with social networking features.
The project focuses on modern web development practices, security, scalability, and clean architecture.

# Project Feature

- Manage profiles and avatars
- Secure authentication
- Play real-time Pong matches with AI
- Play real-time Pong matches with friends
- Add friends and manage friend requests
- See online/offline status
- Search friends

# Tech Stack
### Frontend
 ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
 ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
 ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
 ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
### Backend
 ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
 ![Fastify](https://img.shields.io/badge/Fastify-000000?logo=fastify&logoColor=white)
 ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
 ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
 ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
### Database
 ![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
### Infrastructure
 ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
 ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white)


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
