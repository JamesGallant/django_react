# Documentation for CookieCutter SaaS
<!-- badges: start -->
[![continous integration tests](https://github.com/JamesGallant/django_react/actions/workflows/CI.yml/badge.svg)](https://github.com/JamesGallant/django_react/actions/workflows/CI.yml)
<!-- badges: stop -->
## Todo
Add a split between development and production. Right now in django this can be handled using the environ file
Auto documentation builder. 

check badges
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
This is the entrypoint to the application, from the top directory the entire application is handled. Here we define the devops

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
## Linting
To keep code and git consistent we have linting for python and typescript which is handled by [black](https://black.readthedocs.io/en/stable/usage_and_configuration/) 
and [eslint](https://eslint.org/docs/user-guide/getting-started) respectively.

### black
```
# scan all files
black . 

# show diff
black --diff path/to/file

# check and don't format
black --check path/to/file
```

### eslint
```
# run linting
npm run eslint

# fix
npm run eslintfix
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
     # the service_frontend working directory on the local system
     context: ./service_frontend
     # points to the dockerfile
     dockerfile: ./Docker/Dockerfile
    # image name
    image: react_frontend_service
    restart: always
    # start the dev server
    command: npm start
    # mapping the working directory to the container dir for hot reloading
    volumes:
      - ./service_frontend/:/usr/src/app/
      - usr/src/app/node_modules
    # exposed ports
    ports:
      - "8010:3000"
    # points to the environment file
    env_file:
      - ./service_frontend/environments/.development.env
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

# Github actions
This project uses github actions for continuous integration. Everytime a backend service is made it should have an entry
in `./github/workflows/service_name_tests.yaml`. On the first push a badge can be created which should be added to the readme 
in order to track the testing effectively. Below is an example yaml. 

```yaml
name: service_xxxx_test

on:
  push:
  pull_request:
    branches:
      - main
      - dev

jobs:
  service_accounts_testing:
    runs-on: ubuntu-latest
    name: Unit tests for the service_accounts
    environment: develop

    services:
      postgres:
        # Docker Hub image
        image: postgres
        # Provide the password for
        env:
          POSTGRES_PASSWORD: admin
          POSTGRES_USER:  admin
          POSTGRES_DB: db
        # Set health checks to wait until postgres has started
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - '5432:5432'

    steps:
      - name: Checkout code base
        uses: actions/checkout@v2

      - name: Setup Python 3.8
        uses: actions/setup-python@v1
        with:
          python-version: 3.8

      - name: Setup cache
        uses: actions/cache@v1
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/develop.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          python -m pip install -r service_accounts/requirements/requirements.txt
        if: steps.cache.outputs.cache-hit != 'true'

      - name: Create migrations and run tests
        env:
          DJANGO_ALLOWED_HOSTS:  ${{ secrets.DJANGO_ALLOWED_HOSTS }}
          SECRET_KEY: ${{ secrets.SECRET_KEY }}
          SQL_PASSWORD: admin
          SQL_USER: admin
          SQL_DATABASE: db
          SERVICE_ACCOUNTS_URL: 'localhost:8001'
          DATABASE_URL: 'postgres://postgres:postgres@localhost:${{ job.services.postgres.ports[5432] }}/postgres'
        # make changes here
        run: |
          python service_accounts/src/manage.py makemigrations users
          python service_accounts/src/manage.py migrate
          python service_accounts/src/manage.py test users.tests
```
# Testing
Each microservice runs its own unit tests and details on the tests can be found in README of the individual service. 
Intergration tests are handled using selenium to mock web browsers. See selenium README for more details.

# Production 

The application will be deployed to google cloud platform starting by using the cloud run serverless feature. Here we
will provide a brief summary on how to have deploy the application. The current architecture needs to be extended with
more specific service accounts and the use of CI/CD and secret manager for deployment. However the setup here will work 
for a initial deployment system and can be upgraded later. 

## starting a project and authorisation on the command line
First the [gcloud cli](https://cloud.google.com/sdk/docs/install) is needed. This is used to interface with gcp from
the command line.
See which project is active:
```
gcloud config get-value project
```
Activate a project
```
gcloud config set project myProject
```
Login to gcp
```
gcloud auth login
```
Main components required:
- Service account: The service account is responsible for the roles within the project. There can be more service accounts
but in this instance I only used one. The service needs to be able to access different services such as cloud SQL. Add roles
for cloud SQL edit, view, admin as well as storage. More roles may be needed. 
```
roles: run.invoker, storage.objectAdmin, secretmanager.secretAccessor, cloudsql.client, cloudsql.editor, cloudsql.admin
```

- artifact registry: This is where the production containers are pushed to.
```
docker build -f path/to/Dockerfile -t <region>-docker.pkg.dev/<registry-name>/<folder>/<cotnainer>
docker push <region>-docker.pkg.dev/<registry-name>/<folder>/<cotnainer>
```
- cloud SQL: The cloud SQL is made of an instance and one or more databases. After the instance is made, a user and a database
should be created as well. To connect to the database via django in the staging phase a windows environment is needed in order
to connect to [cloud SQL proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy). This will allow changes like migrations
to be made on the production database. This should be done automatically in a CI pipeline later. Connecting to the production
database in the container uses the following variables and connections:

```
SQL_USER=<db-username>
SQL_PASSWORD=<db_password>
SQL_HOST=postgres:/cloudsql/<projectID>:<region-name>:<instance-name>
SQL_PORT=5432
SQL_DATABASE=<database-name>
SQL_ENGINE=django.db.backends.postgresql
```
- Cloud storage: Cloud storage is used to serve the static assets to django as well as save other content. Currently
it does not support setting a subfolder, we will need to rewrite the storages backend in the future to do so. The storage
needs to have public access in order to serve content to django, but it should be read only. We need to think about these 
permissions when serving content that should not be public. The folders *inside static* need to be uploaded not the static 
folder its self to function correctly. The following permissions are needed to serve the static django content.
```
allUsers: Storage Object Viewer
<service-account>: Cloud Run Service Agent, Storage Object Admin, Storage Object Creator, Storage Object Viewer
```
To connect to the bucket the following variables are needed in production and should be ommited in develop environment
variables.
```
GS_BUCKET_NAME=<bucket-name>
STATIC_ROOT="."
DEFAULT_FILE_STORAGE=storages.backends.gcloud.GoogleCloudStorage
STATICFILES_STORAGE=storages.backends.gcloud.GoogleCloudStorage
GS_DEFAULT_ACL=publicRead
```

-Services: The services are the content exposed to the internet and requires a service account that is able to connect to
the relevant google cloud products. Thus it is possible to have different service accounts for different services with unique
privaleges. However here we only used one service account which has all the required roles. We should use the secret manager
and CI/CD to build and deploy services however it can be done manually as well. If all docker files are correctly configured
simply assigning them and choosing the service account and connection should be enough to make it function properly. Exposing
ports should be done with the $port variable. 
