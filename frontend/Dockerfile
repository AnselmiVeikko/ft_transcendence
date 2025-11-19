FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.* ./
COPY tsconfig.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY eslint.config.* ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]