FROM node:18-alpine as frontend

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

COPY . ./

CMD [ "npm", "start" ]

EXPOSE 3000