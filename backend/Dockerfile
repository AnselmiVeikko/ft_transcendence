FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./

RUN npm install

COPY src ./src
COPY prisma ./prisma

EXPOSE 3000
