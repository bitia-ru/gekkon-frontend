FROM node:11-alpine AS builder

RUN npm config set unsafe-perm true

COPY . /app
WORKDIR /app

RUN npm i --production

ARG apiUrl
ARG clientId
ENV API_URL ${apiUrl}
ENV CLIENT_ID ${clientId}

RUN npm run build --development

FROM nginx:1.15-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist/index-*.js /app/dist/index.html ./

RUN mkdir public
COPY public/img ./public/img
COPY public/fonts ./public/fonts

COPY docker/configs/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
