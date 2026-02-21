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

COPY cert/internal-ca.crt /app/certs/internal-ca.crt
ENV NODE_EXTRA_CA_CERTS=/app/cert/internal-ca.crt

EXPOSE 3000
