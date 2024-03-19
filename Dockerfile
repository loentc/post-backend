FROM node:18.19.0-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# RUN npx prisma migrate deploy
# RUN npx prisma generate
RUN npm run build

RUN npx prisma generate
CMD ["npm", "run", "seed"]
ENTRYPOINT ["npm", "run", "prod"]