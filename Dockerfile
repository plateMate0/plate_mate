FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

# ✅ Create dist/main.js if your build outputs dist/src/main.js
RUN node -e "const fs=require('fs'); \
  if (!fs.existsSync('./dist/main.js') && fs.existsSync('./dist/src/main.js')) { \
    fs.writeFileSync('./dist/main.js', \"require('./src/main.js');\\n\"); \
  }"

# ✅ Debug (optional, you can remove later)
RUN ls -la dist/ && if [ -d \"dist/src\" ]; then ls -la dist/src/; fi

EXPOSE 3000

# ✅ Important: run the shim
CMD ["node", "dist/main.js"]
