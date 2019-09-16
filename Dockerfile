FROM node:10.4.0-alpine

ADD putio_client /app

WORKDIR /app
RUN npm install

CMD node app.js
