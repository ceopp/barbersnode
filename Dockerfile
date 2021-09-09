FROM node:14.9.0-alpine3.10
EXPOSE 3000

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm ci

COPY . /home/app

CMD npm run start