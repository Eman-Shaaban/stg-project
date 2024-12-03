FROM node:18-alpine

WORKDIR /app

COPY simulation-orchestrator/package*.json /app/

RUN npm install
COPY /simulation-orchestrator /app
EXPOSE 4000


CMD ["npm", "start"]