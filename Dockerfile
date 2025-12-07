FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build

RUN node -e "const fs=require('fs');fs.writeFileSync('./dist/main.js', \"require('./src/main.js');\\n\");"

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
