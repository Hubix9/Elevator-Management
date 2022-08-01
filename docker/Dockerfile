FROM node:16-alpine3.15
RUN mkdir /elevatorserver
COPY Bundle/dist /elevatorserver/dist
COPY Backend/package.json /elevatorserver/package.json
WORKDIR /elevatorserver
RUN npm install
RUN rm package.json
CMD ["node", "dist/main.js"]
