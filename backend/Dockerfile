FROM node:18

WORKDIR usr/src/backend

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD ["node","index.js"]