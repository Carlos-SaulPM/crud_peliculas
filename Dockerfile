FROM node:22.14-alpine

RUN mkdir -p /home/app
RUN npm install --global corepack@latest
RUN corepack enable pnpm

COPY . /home/app

WORKDIR /home/app

RUN pnpm i

EXPOSE 3000
CMD ["pnpm", "dev"]