# pull official base image ---> Current node version 17 has issues with build
FROM node:16-alpine3.12

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --silent

# add app
COPY . .