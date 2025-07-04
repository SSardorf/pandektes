# Dockerfile for NestJS app
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


EXPOSE 3000

CMD ["pnpm", "start:prod"] 