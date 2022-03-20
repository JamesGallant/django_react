# pull official base image 
FROM python:3.9-slim 

# set work directory 
WORKDIR /usr/src/app 

# set environment variables 
ARG DEBIAN_FRONTEND=noninteractive 
ENV PYTHONDONTWRITEBYTECODE 1 
ENV PYTHONUNBUFFERED 1 

# install psycopg2 dependencies 
RUN apt-get -qqy update 
RUN apt-get -qqy install postgresql gcc python3-dev libpq-dev 

# cryptography dependencies
RUN apt-get -qqy install build-essential libssl-dev libffi-dev python3-dev cargo 

# install dependencies 
RUN pip install --upgrade pip 

# copy project 
COPY . . 

# install dependencies 
RUN pip install -r requirements/production.txt

# set work directory
RUN rm -f README.md && \
    rm -r docs && \
    rm -r environments && \
    rm -r requirements

WORKDIR /usr/src/app/src
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 service_backend.wsgi:application