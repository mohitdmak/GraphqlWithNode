FROM node:16-alpine

WORKDIR /GraphqlWithNode

COPY . .

RUN npm install -g nodemon

RUN npm install

RUN npm run test

CMD ["npm", "run", "start"]