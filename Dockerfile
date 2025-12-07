# ---------- 1) Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# ---- Optional debug (uncomment if you need to see build output structure)
# RUN ls -la dist/ && if [ -d "dist/src" ]; then ls -la dist/src/; fi

# Remove dev deps for smaller final image
RUN npm prune --omit=dev


# ---------- 2) Runtime stage ----------
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# This handles BOTH possible Nest build outputs:
# - dist/main.js
# - dist/src/main.js
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; else node dist/src/main.js; fi"]
