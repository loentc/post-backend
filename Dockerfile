FROM node:18.19.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8100

CMD ["npm", "run", "start"]