FROM node:18

WORKDIR usr/src/backend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node","index.js"]