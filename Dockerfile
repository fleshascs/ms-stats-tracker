FROM node:16-alpine AS BUILD_IMAGE
WORKDIR /usr/app

COPY package*.json ./
RUN npm install
RUN npm install -g pkg

COPY . .
RUN npm run build
RUN npx pkg -o ./server -t node16-alpine-x64 ./build/src/index.js

FROM alpine:3.15
WORKDIR /usr/app

ENV TZ="Europe/Vilnius"
ENV WORKDIR=/usr/app 

COPY --from=BUILD_IMAGE /usr/app/server ./

# every 24h
RUN echo '0 0 * * * /usr/app/server' > /etc/crontabs/root

# every minute for debugging
# RUN echo '* * * * * /usr/app/server' > /etc/crontabs/root
CMD ["crond", "-f", "-d", "8"]

# CMD ["./server"]

