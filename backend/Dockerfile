FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./

RUN npm install

COPY src ./src
COPY prisma ./prisma

RUN mkdir -p /uploads/avatars/default
COPY assets/00000000-0000-0000-0000-000000000000.webp uploads/avatars/default/00000000-0000-0000-0000-000000000000.webp

EXPOSE 3000
