# ==========================================
# Task Service Dockerfile
# ==========================================
# Multi-stage build for production-ready image

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
COPY apps/task/package.json ./apps/task/

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

# Copy and build task service
WORKDIR /app/apps/task
COPY apps/task/ ./
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
COPY apps/task/package.json ./apps/task/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder stage
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/packages/kafka/dist ./packages/kafka/dist
COPY --from=builder /app/packages/kafka/package.json ./packages/kafka/package.json
COPY --from=builder /app/packages/proto ./packages/proto
COPY --from=builder /app/apps/task/dist ./apps/task/dist

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set working directory to the service
WORKDIR /app/apps/task

# Expose the gRPC port
EXPOSE 50052

# Set environment variables
ENV NODE_ENV=production
ENV GRPC_PORT=50052

# Start the application
CMD ["node", "dist/index.js"]

