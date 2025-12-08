FROM node:25-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:25-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:25-alpine AS runner
WORKDIR /app

COPY --from=builder /app ./
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s \
  CMD wget -q -O- --timeout=2 http://localhost:4000/ || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod"]
