FROM node:24.10-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --production=false
RUN npm run build

FROM node:24.10-alpine AS runner
WORKDIR /app
COPY packeage*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s \
  CMD wget -q -O- --timeout=2 http://localhost:4000/ || exit 1

CMD ["npm", "run", "start:prod"]
