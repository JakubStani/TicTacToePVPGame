FROM node:18

WORKDIR usr/src/backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 443
RUN apt-get update && apt-get install -y curl && \
    curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" && \
    chmod +x mkcert-v*-linux-amd64 && \
    cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert && \
    mkcert -cert-file /usr/src/backend/cert.pem -key-file /usr/src/backend/key.pem localhost
CMD ["node","index.js"]