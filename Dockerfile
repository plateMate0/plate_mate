FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# IMPORTANT: Generate Prisma client
RUN npx prisma generate

# Now build the NestJS project
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
