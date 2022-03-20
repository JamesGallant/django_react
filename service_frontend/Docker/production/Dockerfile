# pull official base image ---> Current node version 17 has issues with build
FROM node:16-alpine3.12 as react-app

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY . .

# install app dependencies
RUN npm ci --silent
RUN npm -g install serve
RUN npm install -g serve

# build
RUN npm run build

RUN rm -r Docker/ environments/ src/ 
RUN rm README.md  jest.config.js tsconfig.json

ENV CHOKIDAR_USEPOLLING=true,REACT_APP_SITE_NAME=TestSite,REACT_APP_BASE_API=https://service-backend-kme4ufga4a-ez.a.run.app/api/v1/
CMD exec serve -s build -l $PORT