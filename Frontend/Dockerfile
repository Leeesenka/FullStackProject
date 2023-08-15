# Use an official Node.js runtime as the base image
FROM node:latest

WORKDIR /app

RUN npm install -g npm@latest

COPY . .

WORKDIR /app/my-react-app

RUN npm install
RUN npm install -g serve
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]

