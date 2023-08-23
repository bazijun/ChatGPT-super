# build stage
FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18.0-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/.env /app/.env

WORKDIR /app

RUN npm install --production

EXPOSE 9527

CMD ["node", "/app/src/main.js"]
