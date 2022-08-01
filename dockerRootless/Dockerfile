FROM node:16-alpine3.15
RUN adduser -D -u 2500 -h /home/elevatorserver elevatorserver
COPY Bundle/dist /home/elevatorserver/dist
COPY Backend/package.json /home/elevatorserver/package.json
WORKDIR /home/elevatorserver
RUN npm install
RUN rm package.json
RUN chown elevatorserver:elevatorserver -R /home/elevatorserver
RUN chmod -R 755 /home/elevatorserver
USER elevatorserver
CMD ["node", "dist/main.js"]
