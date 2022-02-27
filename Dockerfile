FROM node:16-alpine AS BUILD_IMAGE
WORKDIR /usr/app
COPY . /usr/app

RUN npm install && npm run build
RUN npm install -g pkg

RUN npx pkg -o ./server -t node16-alpine-x64 ./build/src/index.js

FROM alpine:3.15
WORKDIR /usr/app

ENV TZ="Europe/Vilnius"

COPY --from=BUILD_IMAGE /usr/app/server ./

# every 24h
RUN echo '0 0 * * * /usr/app/server' > /etc/crontabs/root
CMD ["crond", "-f", "-d", "8"]

# CMD ["./server"]

