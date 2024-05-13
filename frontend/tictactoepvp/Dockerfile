FROM node:18

WORKDIR usr/src/frontend/tictactoepvp

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000
RUN apt-get update && apt-get install -y curl && \
    curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" && \
    chmod +x mkcert-v*-linux-amd64 && \
    cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert && \
    mkcert -cert-file /usr/src/frontend/tictactoepvp/cert.pem -key-file /usr/src/frontend/tictactoepvp/key.pem localhost

CMD ["npm","start"]