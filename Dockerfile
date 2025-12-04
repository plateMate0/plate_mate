FROM node:18-alpine

WORKDIR /app

# 1) تثبيت الباكجات
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 2) نسخ الكود كامل
COPY . .

# 3) توليد Prisma client
RUN npx prisma generate

# 4) Build NestJS → يطلع dist/src/main.js
RUN npm run build

# 5) 🔥 إنشاء ملف dist/main.js يوجّه لـ dist/src/main.js
RUN node -e "const fs=require('fs');fs.writeFileSync('./dist/main.js', \"require('./src/main.js');\\n\");"

EXPOSE 3000

# 6) شغّل dist/main.js (سواء المنصة أو CMD، كله رح يشتغل)
CMD ["node", "dist/main.js"]
