# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

# ✅ اصنع dist/main.js كـ entrypoint ثابت
# بيحوّل التشغيل إلى dist/src/main.js
RUN printf "require('./src/main.js');\n" > dist/main.js

# (اختياري للتشخيص)
RUN ls -R dist

# ---------- Stage 2: Runtime ----------
FROM node:18-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
