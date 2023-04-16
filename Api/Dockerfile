FROM node:18-alpine as api
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

EXPOSE 8000
COPY . ./
CMD [ "node", "index.js" ]