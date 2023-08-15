# Use an official Node.js runtime as the base image
FROM node:latest

WORKDIR /app

RUN npm install -g npm@latest

COPY . .

WORKDIR /app/my-react-app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
