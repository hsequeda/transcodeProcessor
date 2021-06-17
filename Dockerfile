FROM node:14
WORKDIR /usr/src/app


COPY package*.json tsconfig*.json ./
RUN npm install

COPY src/ src/

RUN npm run build

RUN  rm -r src
RUN apt-get update -y; apt-get install -y ffmpeg
RUN mkdir /ffmpeg_output

CMD [ "npm", "run" , "start:prod"  ]
