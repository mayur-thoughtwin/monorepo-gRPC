# ==========================================
# Notification Service Dockerfile
# ==========================================
# Multi-stage build for production-ready image
# NOTE: This service uses Kafka only (no gRPC)

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files for all packages (for dependency resolution)
COPY packages/proto/package.json ./packages/proto/
COPY packages/db/package.json ./packages/db/
COPY packages/kafka/package.json ./packages/kafka/
COPY apps/notification/package.json ./apps/notification/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code for shared packages
COPY packages/proto/ ./packages/proto/
COPY packages/db/ ./packages/db/
COPY packages/kafka/ ./packages/kafka/

# Build shared packages
WORKDIR /app/packages/db
RUN pnpm build

WORKDIR /app/packages/kafka
RUN pnpm build

# Copy and build notification service
WORKDIR /app/apps/notification
COPY apps/notification/ ./
RUN pnpm build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files
COPY packages/proto/package.json ./packages/proto/
COPY packages/db/package.json ./packages/db/
COPY packages/kafka/package.json ./packages/kafka/
COPY apps/notification/package.json ./apps/notification/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder stage
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/packages/kafka/dist ./packages/kafka/dist
COPY --from=builder /app/packages/kafka/package.json ./packages/kafka/package.json
COPY --from=builder /app/packages/proto ./packages/proto
COPY --from=builder /app/apps/notification/dist ./apps/notification/dist

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set working directory to the service
WORKDIR /app/apps/notification

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]

