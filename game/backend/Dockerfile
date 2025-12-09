FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 4000
