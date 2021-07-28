# Documentation for CookieCutter SaaS
<!-- badges: start -->
[![.github/workflows/service_accounts_test.yml](https://github.com/JamesGallant/django_react/actions/workflows/service_accounts_test.yml/badge.svg)](https://github.com/JamesGallant/django_react/actions/workflows/service_accounts_test.yml)
[![Node.js CI](https://github.com/JamesGallant/django_react/actions/workflows/service_frontend_tests.yml/badge.svg)](https://github.com/JamesGallant/django_react/actions/workflows/service_frontend_tests.yml)
<!-- badges: stop -->
## Todo
Add a split between development and production. Right now in django this can be handled using the environ file
Auto documentation builder. 

Things to implement
 - second service
 - Redis caching
 - RabbitMQ or Kafka for messaging?
 - Spinx or autodoc
 - celery
 - prodcution environments
 - backup database
 - test coverage
 - integration testing
 - stress testing
 - CI/CD
 
## Introduction
This is the entry point for the CookieCutter SaaS documentation. This document serves as the total overview of the project 
and should contain information regarding each micro-service type in the project as well as a docker-compose to launch the 
entire project. Each microservice must have its own documentation indicating the overall system design for that service.
This is boilerplate and should only function as a guideline. Remember to update the documentation as you go or change 
things. 

## launching microservices
Currently these services will launch using docker-compose when in development. 

To launch a service
```
docker-compose -d up .
```

To build a service
```
docker-compose build .
```
To run commands within a container
```
docker-compose run --rm <containerID> <command>
```

## Services
Two initial services are generated. Update this section as new services are created. Each new microservice is a new 
django-rest-framework project with a slightly modified directory structure which must be updated in docker-compose.yml.
Under services add a name for the new service that's created, this name must be unique. Services must restart and run
the runserver django command. The ports are mapped from 8000 to in incremental port which starts at 8001. Below is a 
table with the assigned ports update these as new services are created. All services depend on a database. The main
directory contains the docker-compose.yaml file that controls and launches all the services. If it is necessary to remap
the ports, check environmental files to change the port options

### Frontend
This is the react front end and its where the ui lives. It functions similar to the backend service however here 
we use React and typescript. The default front end service will display some data from the default backend. More in depth
details of the front end should be documented in the front end readme. 

The development server is spun up using the frontend service in the docker-compose file. below is a commented version
of each method

To start development make sure that all dependencies are installed by running the following:

```
cd frontend
npm install
```

```yaml
  # name of the service
  frontend:
    
    build:
     # the frontend working directory on the local system
     context: ./frontend
     # points to the dockerfile
     dockerfile: ./Docker/Dockerfile
    # image name
    image: react_frontend_service
    restart: always
    # start the dev server
    command: npm start
    # mapping the working directory to the container dir for hot reloading
    volumes:
      - ./frontend/:/usr/src/app/
      - usr/src/app/node_modules
    # exposed ports
    ports:
      - "8010:3000"
    # points to the environment file
    env_file:
      - ./frontend/environments/.development.env
    depends_on:
      - postgres_database
```

### Accounts
This is a authentication service for user accounts. All other backend services should follow this models example. 
Detailed explanation should be in a readme within each microservice. Each django service will also have its own
dependencies. Create a virtual environment within the microservice and install the dependencies with pip

```
mkdir venv
cd venv
python -m venv .
Scripts\activate.bat
cd ../
pip install -r requirements\requirements.txt
```

The data within these files will eventually be used to create a container and will be spun up using docker-compose. Below
is a commented of the yaml file for the microservices to gain a better understanding of how it functions

```yaml
# this is the service name
  backend_service_1:
    # call the build function
    build:
     # set the context to the microservice root
     context: ./accounts
     # point to the dockerfile from the root
     dockerfile: ./Docker/Dockerfile
    # this is the image name
    image: django_backend_service_1
    restart: always
    # start the dev server
    command: python ./src/manage.py runserver 0.0.0.0:8000
    # This maps the container to the directory for hot reloading
    volumes:
      - ./accounts/:/usr/src/app/

    # Exposing and mapping the ports
    ports:
      - "8011:8000"

    # points to a environment file
    env_file:
      - ./accounts/environments/.development.env
    # states a dependant container
    depends_on:
      - postgres_database
```


### postgres database
The database service, in development a postgres instance is pulled from a docker image using dummy credentials stored
in environment files within each service. 

This is what the compose file would look like to spin up a database in docker. The data is stored in docker volumes 
on the system where docker runs.
```yaml
# Credentials
  postgres_database:
    image: postgres:12.0-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin
      - POSTGRES_DB=postgres_db_dev

# volume
postgres_data:/var/lib/postgresql/data/
```

Databases are shared between microservices here. This means that each instance of django will use a environment file
to map to the same database. To extra or different databases another database instance has to created in the compose
file and its values must be replaced in the environment file within the microservice. 

This is an example of the postgres variables within the environment file. 
```
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=postgres_db_dev
SQL_USER=admin
SQL_PASSWORD=admin
SQL_HOST=postgres_database
SQL_PORT=5432
```

These values should be adapted in prodcution. 

### postgres admin
This is a interface to the postgres database hosted in the docker container.
```
# environmental variables
PGADMIN_DEFAULT_EMAIL: admin@admin.com
PGADMIN_DEFAULT_PASSWORD: admin
PGADMIN_LISTEN_PORT: 80

```

### mailhog

Mailhog is a development smtp server that can catch outgoing mail. This is a development system and should not be used
in production. Mailhog will be configured as the SMTP backend in backend_service_1.

### Port registrations

I have shifted some ports around to expose web views from 8000 onward. Web views for additional things like mailhog
that are not part of the architecture will run from 8000:8009 and microservices will be exposed from 8010 onwards. It
is important to check files once ports are changed. 

Need to check how ports work and if we are interfering with internal port. Exposed port is the port exposed to the host

|Service| Exposed port | internal port |
|-------|---------------|--------------|
|postgres_database | 5432 | 5432 |
|pgadmin | 8010| 80 |
|mailhog smtp | 1025 | 1025 |
|mailhog web ui | 8011 | 8080 |
|Frontend | 8000 | 3000|
|backend_accounts| 8001 | 8000 |

files where ports are referenced
`src/accounts/`
# Credentials

These are the development credentials, do not save your actual credentials in version control

| service | email | password | url|
|---------|-------|----------|----|
|Django-admin|admin@admin.com|admin|localhost/8001/admin/|
|pgadmin|admin@admin.com|admin|localhost/8010/|

# Testing
Each microservice runs its own unit tests and details on the tests can be found in README of the individual service. 
Intergration tests are handled using selenium to mock web browsers. See selenium README for more details.

