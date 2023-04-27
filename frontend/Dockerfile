FROM node:18-alpine as frontend

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

COPY . ./

RUN npm run build

FROM nginx:1.22.1 as runner
COPY --from=frontend /app/build /usr/share/nginx/html
COPY --from=frontend /app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80