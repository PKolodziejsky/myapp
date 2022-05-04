FROM node:14

WORKDIR /src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prebuild

RUN npm run build

EXPOSE 3030

CMD ["npm", "run", "start:prod"]
