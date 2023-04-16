FROM node:18
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

EXPOSE 50051
COPY . ./
CMD [ "node", "index.js" ]