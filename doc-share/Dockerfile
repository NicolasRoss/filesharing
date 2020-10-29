FROM node:12

WORKDIR /docker/app


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "startHTTPS"]
