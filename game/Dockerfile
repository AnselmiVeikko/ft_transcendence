# ============================
# Stage 1: Build stage
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy config files (cache dependency layer)
COPY package*.json ./
COPY vite.config.* ./
COPY tsconfig.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./

RUN npm install

# Copy source code
COPY . .

# Build project (create dist)
RUN npm run build

# ============================
# Stage 2: Runtime stage
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

# Install serve tool
RUN npm install -g serve

# Copy build output from stage 1
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# Run the server
CMD ["serve", "-s", "dist", "-l", "5173"]
