# ============================
# Stage 1: Build stage
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy config files (cache dependency layer)
COPY package*.json ./
COPY tsconfig.* ./

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

# Copy build output from stage 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modu es ./node_modules

EXPOSE 4000

# Run the server
CMD ["node", "dist/app.js"]
 