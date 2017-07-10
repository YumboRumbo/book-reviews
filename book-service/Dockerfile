FROM mhart/alpine-node:8.1.3

RUN addgroup -S app && adduser -S -g app app

ENV HOME=/home/app

WORKDIR $HOME
COPY package.json $HOME/

RUN echo //registry.npmjs.org/:_authToken=24bdafbb-afed-46d0-a7f1-000011ada46b >> $HOME/.npmrc  &&\
  npm install

COPY index.js $HOME/index.js
RUN chown -R app:app $HOME/*

USER app
CMD node ./index.js
