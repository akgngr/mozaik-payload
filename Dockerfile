# syntax=docker/dockerfile:1

# =========================================================================
# Multi-stage Dockerfile for Next.js 16 + Payload CMS 3 (Coolify-ready)
# =========================================================================

# --- Stage 1: Base Environment ---
FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install required system packages for sharp and crypto
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Enable and pin pnpm version
RUN corepack enable && corepack prepare pnpm@9.15.1 --activate

# --- Stage 2: Dependencies Installation ---
FROM base AS deps
WORKDIR /app

ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Stage 3: Build Application ---
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (with fallbacks for static generation)
ARG DATABASE_URI="postgresql://postgres:postgres@localhost:5432/mosaik"
ARG PAYLOAD_SECRET="temporary_build_secret_min_32_characters_123456"
ARG NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
ARG CLOUDINARY_CLOUD_NAME=""
ARG CLOUDINARY_API_KEY=""
ARG CLOUDINARY_API_SECRET=""

ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
ENV CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
ENV CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# Generate Payload types & importmap if needed, then build Next.js
RUN pnpm payload generate:importmap || true
RUN pnpm next build

# --- Stage 4: Production Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy built application and runtime dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Use non-root node user
USER node

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/graphql-playground || exit 1

CMD ["pnpm", "start"]
