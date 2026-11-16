# Base
FROM node:22-bookworm-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# development
FROM base AS development

ENV NODE_ENV=development

# Install all dependencies
COPY package*.json ./
RUN npm install

# logs directory with permissions
RUN mkdir -p logs && chown -R node:node /app

# Copy application files
COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Production deps
FROM base AS prod-deps

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# production
FROM base AS production

ENV NODE_ENV=production
ENV PORT=5000

# permissions
RUN mkdir -p logs && chown -R node:node /app

# Copy production node_modules
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules

# Copy app code and migration assets
COPY --chown=node:node package.json ./
COPY --chown=node:node drizzle.config.js ./
COPY --chown=node:node drizzle ./drizzle
COPY --chown=node:node src ./src

USER node

EXPOSE 5000

# Health check on /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 5000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "start"]
