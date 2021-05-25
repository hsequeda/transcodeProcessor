FROM node:14
WORKDIR /usr/src/app


COPY package*.json tsconfig*.json ./
RUN npm install

COPY src/ src/

RUN npm run build

RUN  rm -r src

CMD [ "npm", "npm" , "start:prod"  ]
