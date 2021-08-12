import os
import yaml
from django.core.management.utils import get_random_secret_key


class FileGenerator:
    def __init__(self, service_filepath):
        self.root_path = service_filepath

        self.site_name = "site_name"
        self.sql_port = 5433
        self.service_port = 8002

    @staticmethod
    def _filemanager(filepath: str,  content: str = None) -> None:
        """
        creates files in a directory
        :param filepath: Path to directory including filename
        :param content: content to write to the file
        :return: None
        """

        if not os.path.exists(os.path.split(filepath)[0]):
            raise ValueError("filepath does not exist")

        file = open(filepath, "w+")
        if content:
            file.write(content)
        file.close()

    def create_init(self) -> None:
        self._filemanager(content="", filepath=f"{self.root_path}/src/__init__.py")
        self._filemanager(content="", filepath=f"{self.root_path}/__init__.py")

    def create_docker_file(self) -> None:
        """
        Creates a docker file in a given directory that will build a django microservice from the parent file. This file
        needs to be referenced in the top level directory and a context must be set in the service root directory
        :return:
        """
        docker_ignore = "Docker/\n../venv/\nvenv/"

        docker_file = "# pull official base image \nFROM python:3.9-slim \n\n# set work directory \n" \
                      "WORKDIR /usr/src/app \n\n# set environment variables \nARG DEBIAN_FRONTEND=noninteractive \n" \
                      "ENV PYTHONDONTWRITEBYTECODE 1 \nENV PYTHONUNBUFFERED 1 \n\n# install psycopg2 dependencies \n" \
                      "RUN apt-get -qqy update \nRUN apt-get -qqy install postgresql gcc python3-dev libpq-dev \n\n" \
                      "# cryptography dependencies\nRUN apt-get -qqy install build-essential libssl-dev libffi-dev python3-dev cargo \n\n" \
                      "# install dependencies \nRUN pip install --upgrade pip \n\n# copy project \nCOPY . . \n\n" \
                      "# install dependencies \nRUN pip install -r requirements/requirements.txt"

        filepath_dockerfile = f"{self.root_path}/docker/Dockerfile"
        filepath_dockerignore = f"{self.root_path}/docker/.dockerignore"

        self._filemanager(content=docker_file, filepath=filepath_dockerfile)
        self._filemanager(content=docker_ignore, filepath=filepath_dockerignore)

    def create_python_requirement(self) -> None:
        """
        Creates a requirements.txt file that bootstraps the basic dependencies needed to build a django app
        :return: None
        """

        requirements = "# -- postgresql \npsycopg2==2.8.6 \n\n# -- django \nasgiref==3.3.4 \nDjango==3.2 \n" \
                       "pytz==2021.1 \nsqlparse==0.4.1 \n\n# -- django rest framework \ndjangorestframework==3.12.4 \n" \
                       "Markdown==3.3.4 \ndjango-cors-headers==3.7.0"

        filepath = f"{self.root_path}/requirements/requirements.txt"
        self._filemanager(content=requirements, filepath=filepath)

    def create_dev_environment(self, service_name) -> None:
        """
        Creates a dev environment file that will be laoded in the docker container as an environmental variable.
        :param service_name: Name of the microservice
        :return: None
        """
        # TO DO: django allowed hosts for cross service communication?
        env_readme = "# Environment file \n\n ## Introduction \n Environmental variables are globally used protected " \
                     f"variables that are not saved in git. \n\n ## {service_name} develop vars \n" \
                     "|name|value|\n|---|---|\n|SECRET_KEY|value|\n|DJANGO_ALLOWED_HOSTS|localhost 127.0.0.1 https://localhost:8000/ 127.0.0.1:8000 0.0.0.0 https://localhost:8001/| \n" \
                     f"|SQL_USER|admin|\n|SQL_PASSWORD|admin|\n|SQL_HOST|{service_name}_database|\n|SQL_DATABASE|{service_name}_database|"


        dotenv_file = f"# django settings \nSECRET_KEY={get_random_secret_key()} \n" \
                      "DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 https://localhost:8000/ 127.0.0.1:8000 0.0.0.0 https://localhost:8001/" \
                      f"\n\n# Databse settings \nSQL_USER=admin \nSQL_PASSWORD=admin \nSQL_HOST={service_name}_database \n" \
                      f"SQL_DATABASE={service_name}_database"

        filepath_env = f"{self.root_path}/environments/.development.env"
        filepath_readme = f"{self.root_path}/environments/README.md"

        self._filemanager(content=dotenv_file, filepath=filepath_env)
        self._filemanager(filepath=filepath_readme, content=env_readme)

    def create_service_readme(self, service_name: str) -> None:
        """
        Creates the read
        :param service_name:
        :return:
        """
        filepath = f"{self.root_path}/README.md"
        self._filemanager(content=f"# {service_name} documentation \n ", filepath=filepath)

    def create_config_file(self, service_name: str, database: str) -> None:
        """
        Creates a base configuration file, user needs to fill in some parameters
        :param service_name:
        :param database: The backend database to use
        :param filepath: Path to directory including filename
        :return:
        """

        config = "develop_configuration = {" \
                 f"\n\t# Misc\n\t\"debug\": 1,\n\t\"site_name\": \"{self.site_name}\", \n\t\"frontend_url\": \"localhost:8000\",\n\t" \
                f"\"{service_name}_url\": \"localhost:{self.service_port}\",\n\n\t# Database\n\t\"sql_engine\": \"django.db.backends.{database}\",\n\t" \
                f"\"sql_database\": \"{service_name}_db\",\n\t\"sql_port\": {self.sql_port},\n\t\"sql_test_database\": \"{service_name}_db\", \n\n\t" \
                 "# Email\n\t\"email_backend\": \"django.core.mail.backends.smtp.EmailBackend\",\n\t\"email_host\": \"mailhog\",\n\t" \
                 "\"email_port\": 1025,\n}"

        filepath = f"{self.root_path}/src/service_test/config.py"
        self._filemanager(content=config, filepath=filepath)

    def create_github_actions_workflow(self, service_name: str) -> None:
        """
        Creates a CI pipeline to create and migrate the django db, users have to provide their own tests later.
        :param service_name Name of the microservice
        :return None
        """
        actions = {
            "name": service_name,
            "on": {"push": None,
                   "pull_request": {"branches": ["push", "pull_request"]}},
            "jobs": {"service_accounts_testing": {
                "runs-on": "ubuntu-latest",
                "name": f"Unit tests for {service_name}",
                "environment": "develop",
                "steps": {
                    ("run","ls")
                },
                }
            }
        }

        os.chdir(".")
        project_root = os.getcwd()
        filepath_actions = f"{project_root}/.github/workflows/{service_name}_tests.yml"

        with open(filepath_actions, "w") as yaml_file:
            yaml.dump(actions, yaml_file, default_flow_style=False)

class FileEditor:
    """
    A runner used to edit files
    """
    def __init__(self, filepath):
        self.filepath = filepath

    def edit_django_settings(self) -> None:
        """
        This function edits the django settings to make use of the config.py file.
        :return: None
        """
        pass

    def edit_docker_compose_file(self) -> None:
        """
        Edits the docker-compose file by adding the user DB (if needed) and the new service
        :return: None
        """
        pass
