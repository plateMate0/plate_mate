# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# 1) Install all deps (including dev) for build + prisma
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 2) Copy the rest of the project
COPY . .

# 3) Generate Prisma client
RUN npx prisma generate

# 4) Build NestJS → ينتج dist/src/main.js
RUN npm run build


# ---------- Stage 2: Runtime ----------
FROM node:18-alpine AS runner

WORKDIR /app

# فقط deps بدون dev لتخفيف الصورة
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# ننسخ الـ dist والـ prisma من مرحلة الـ build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# ✅ شغّل الملف الصحيح
CMD ["node", "dist/src/main.js"]
