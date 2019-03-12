FROM node:11-alpine AS builder

RUN npm config set unsafe-perm true

COPY . /app
WORKDIR /app

RUN npm i --development

ARG apiUrl
ENV API_URL ${apiUrl}

RUN npm run build --development

FROM nginx:1.15-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist/index.js /app/dist/index.html ./

RUN mkdir public
COPY public/route-card-img ./public/route-card-img
COPY public/fonts ./public/fonts
COPY public/header-img ./public/header-img
COPY public/info-block-img ./public/info-block-img
COPY public/logo-img ./public/logo-img
COPY public/main-nav-img ./public/main-nav-img
COPY public/main-page-header-img ./public/main-page-header-img
COPY public/social-links-sprite ./public/social-links-sprite
COPY public/spot-card-img ./public/spot-card-img
COPY public/spot-card-sprite ./public/spot-card-sprite
COPY public/user-icon ./public/user-icon
COPY public/view-mode-switcher-sprite ./public/view-mode-switcher-sprite

COPY docker/configs/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
