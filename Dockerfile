FROM node:20-slim

RUN npx -y playwright@1.48.0 install --with-deps chromium

WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .

EXPOSE 3000
CMD ["node", "server.js"]
