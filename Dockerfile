FROM node:16-alpine

WORKDIR /GraphqlWithNode

COPY . .

RUN npm install -g nodemon

RUN npm install 

CMD ["nodemon", "app"]