FROM node:18-alpine

WORKDIR /app

COPY users/package*.json /app/

RUN npm install
COPY /users /app
EXPOSE 3000


CMD ["npm", "start"]