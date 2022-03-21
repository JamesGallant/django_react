import os
import yaml
from django.core.management.utils import get_random_secret_key


class FileGenerator:
    def __init__(self, service_filepath):
        self.root_path = service_filepath

        self.site_name = "site_name"
        self.sql_port = 5433
        self.service_port = 8002

    def _read_yml_file(self, filepath: str) -> {}:
        with open(filepath, "r+") as config:
            try:
                data = yaml.safe_load(config)
            except yaml.YAMLError as e:
                raise AssertionError(e)

        config.close()
        return data

    @staticmethod
    def _filemanager(filepath: str, content: str = None) -> None:
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

        docker_file = (
            "# pull official base image \nFROM python:3.9-slim \n\n# set work directory \n"
            "WORKDIR /usr/src/app \n\n# set environment variables \nARG DEBIAN_FRONTEND=noninteractive \n"
            "ENV PYTHONDONTWRITEBYTECODE 1 \nENV PYTHONUNBUFFERED 1 \n\n# install psycopg2 dependencies \n"
            "RUN apt-get -qqy update \nRUN apt-get -qqy install postgresql gcc python3-dev libpq-dev \n\n"
            "# cryptography dependencies\nRUN apt-get -qqy install build-essential libssl-dev libffi-dev python3-dev cargo \n\n"
            "# install dependencies \nRUN pip install --upgrade pip \n\n# copy project \nCOPY . . \n\n"
            "# install dependencies \nRUN pip install -r requirements/develop.txt"
        )

        filepath_dockerfile = f"{self.root_path}/docker/Dockerfile"
        filepath_dockerignore = f"{self.root_path}/docker/.dockerignore"

        self._filemanager(content=docker_file, filepath=filepath_dockerfile)
        self._filemanager(content=docker_ignore, filepath=filepath_dockerignore)

    def create_python_requirement(self) -> None:
        """
        Creates a develop.txt file that bootstraps the basic dependencies needed to build a django app
        :return: None
        """
        requirements = (
            "# -- postgresql \npsycopg2==2.8.6 \n\n# -- django \nasgiref==3.3.4 \nDjango==3.2 \n"
            "pytz==2021.1 \nsqlparse==0.4.1 \n\n# -- django rest framework \ndjangorestframework==3.12.4 \n"
            "Markdown==3.3.4 \ndjango-cors-headers==3.7.0"
        )

        filepath = f"{self.root_path}/requirements/develop.txt"
        self._filemanager(content=requirements, filepath=filepath)

    def create_dev_environment(self, service_name) -> None:
        """
        Creates a dev environment file that will be laoded in the docker container as an environmental variable.
        :param service_name: Name of the microservice
        :return: None
        """
        # TO DO: django allowed hosts for cross service communication?
        env_readme = (
            "# Environment file \n\n ## Introduction \n Environmental variables are globally used protected "
            f"variables that are not saved in git. \n\n ## {service_name} develop vars \n"
            "|name|value|\n|---|---|\n|SECRET_KEY|value|\n|DJANGO_ALLOWED_HOSTS|localhost 127.0.0.1 https://localhost:8000/ 127.0.0.1:8000 0.0.0.0 https://localhost:8001/| \n"
            f"|SQL_USER|admin|\n|SQL_PASSWORD|admin|\n|SQL_HOST|{service_name}_database|\n|SQL_DATABASE|{service_name}_database|"
        )

        dotenv_file = (
            f"# django settings \nSECRET_KEY={get_random_secret_key()} \n"
            "DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 https://localhost:8000/ 127.0.0.1:8000 0.0.0.0 https://localhost:8001/"
            f"\n\n# Databse settings \nSQL_USER=admin \nSQL_PASSWORD=admin \nSQL_HOST={service_name}_database \n"
            f"SQL_DATABASE={service_name}_database"
        )

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
        self._filemanager(
            content=f"# {service_name} documentation \n ", filepath=filepath
        )

    def create_config_file(
        self, service_name: str, database: str, project_config_yaml: str
    ) -> None:
        """
        Creates a base configuration file, user needs to fill in some parameters
        :param service_name:
        :param database: The backend database to use
        :param filepath: Path to directory including filename
        :param project_config_yaml: Path to the project configuration file
        :return:
        """
        data = self._read_yml_file(filepath=project_config_yaml)

        # get config
        site_name = data.get("site_name")
        ports = data.get("port_registry")
        service_port = ports.get(service_name)
        database_port = ports.get(f"{service_name}_database")

        config = (
            "develop_configuration = {"
            f'\n\t# Misc\n\t"debug": 1,\n\t"site_name": "{site_name}", \n\t"protocol": "http://",\n\t"frontend_url": "localhost:8000",\n\t'
            f'"{service_name}_url": "localhost:{service_port}",\n\n\t# Database\n\t"sql_engine": "django.db.backends.{database}",\n\t'
            f'"sql_database": "{service_name}_db",\n\t"sql_port": {database_port},\n\t"sql_test_database": "{service_name}_db", \n\n\t'
            '# Email\n\t"email_backend": "django.core.mail.backends.smtp.EmailBackend",\n\t"email_host": "mailhog",\n\t'
            '"email_port": 1025,\n}'
        )

        filepath = f"{self.root_path}/src/{service_name}/config.py"
        self._filemanager(content=config, filepath=filepath)


class FileEditor:
    """
    A runner used to edit files
    """

    def __init__(self, service_filepath):
        self.service_root_path = service_filepath

    def _read_yml_file(self, filepath: str) -> {}:
        with open(filepath, "r+") as config:
            try:
                data = yaml.safe_load(config)
            except yaml.YAMLError as e:
                raise AssertionError(e)

        config.close()
        return data

    def _write_yml_file(self, filepath: str, data: dict) -> None:
        with open(filepath, "w+", encoding="utf8") as outfile:
            try:
                yaml.dump(data, outfile, default_flow_style=False, allow_unicode=True)
            except yaml.YAMLError as e:
                raise AssertionError(e)

        outfile.close()

    #  config.py deprecated
    # def edit_django_settings(self, service_name: str) -> None:
    #     """
    #     Edits the django settings.py file to use the config file
    #     :param service_name name of the microservice
    #     :return:
    #     """
    #     filepath = f"{self.service_root_path}\\src\\{service_name}\\settings.py"
    #
    #     new_settings = []
    #     with open(filepath, "r") as settings:
    #         for line in settings:
    #             if "pathlib" in line:
    #                 line = "import os\nfrom pathlib import Path\nfrom .config import develop_configuration\n"
    #
    #             if "SECRET_KEY" in line:
    #                 line = 'SECRET_KEY = os.environ.get("SECRET_KEY")'
    #
    #             if "DEBUG" in line:
    #                 line = 'DEBUG = develop_configuration.get("debug", 0)\n'
    #
    #             if "ALLOWED_HOSTS" in line:
    #                 line = (
    #                     'ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split('
    #                     ")"
    #                 )
    #
    #             if "SITE_NAME" in line:
    #                 line = 'SITE_NAME = develop_configuration.get("site_name", "test site")'
    #
    #             if "INSTALLED_APPS" in line:
    #                 line = "INSTALLED_APPS = [\n\t# Your apps here\n\n\t# third party\n\t'corsheaders',\n\t'rest_framework',\n\t"
    #
    #             if "MIDDLEWARE" in line:
    #                 line = (
    #                     "MIDDLEWARE = [\n\t'corsheaders.middleware.CorsMiddleware',\n"
    #                 )
    #
    #             if "ENGINE" in line:
    #                 line = '\t\t"ENGINE": develop_configuration.get("sql_engine", "django.db.backends.sqlite3"),\n'
    #
    #             # need this keyword for the rest of DB
    #             if "'NAME': BASE_DIR / 'db.sqlite3'," in line:
    #                 line = (
    #                     '\t\t"NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR, "db.sqlite3")),'
    #                     '\n\t\t"USER": os.environ.get("SQL_USER", None),\n\t\t"PASSWORD": os.environ.get('
    #                     '"SQL_PASSWORD", None),\n\t\t"HOST": os.environ.get("SQL_HOST", "localhost"),\n'
    #                     '\t\t"PORT": develop_configuration.get("sql_port", 5432),\n\t\t"TEST": {'
    #                     '\n\t\t\t"NAME": develop_configuration.get("sql_test_database", "test_db"),\n\t\t}\n\t'
    #                 )
    #
    #             new_settings.append(line)
    #
    #     # need to abstract these ports away
    #     new_settings_data = (
    #         f"# Rest framework settings\n\n# CORS\nCORS_ORIGIN_WHITELIST = ['http://localhost:8000']\n"
    #         "# Restrict unknown urls\nCORS_ORIGIN_ALLOW_ALL = False\n\n"
    #         'REST_FRAMEWORK = {\n\t"DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),\n'
    #         '\t"DEFAULT_AUTHENTICATION_CLASSES": (\n\t\t"rest_framework.authentication.TokenAuthentication",\n'
    #         "\t),\n}"
    #     )
    #
    #     new_settings.append(new_settings_data)
    #     settings.close()
    #
    #     file = open(filepath, "w+")
    #     file.writelines(new_settings)
    #     file.close()

    def edit_project_config(self, project_config_yaml: str, service_name: str) -> None:
        """
        Edits the project file. This maintains the current state of the project
        :param project_config_yaml: the project.config.yaml file location
        :param service_name: Name of the microservice
        :return: void
        """

        data = self._read_yml_file(filepath=project_config_yaml)

        # get config
        services = data.get("services")
        site_name = data.get("site_name")
        protocol = data.get("protocol")
        ports = data.get("port_registry")

        # edit config
        services.append(service_name)

        last_service_port = max(ports.get("services"))
        last_db_port = max(ports.get("databases"))

        new_service_port = last_service_port + 1
        new_db_port = last_db_port + 1
        ports["services"].append(new_service_port)
        ports["databases"].append(new_db_port)
        ports[f"{service_name}"] = new_service_port
        ports[f"{service_name}_database"] = new_db_port

        new_data = {
            "port_registry": ports,
            "services": services,
            "site_name": site_name,
            "protocol": protocol,
        }

        self._write_yml_file(filepath=project_config_yaml, data=new_data)

    def edit_gitignore(self, service_name: str) -> None:
        """
        appends gitignore paths to existing file
        :param service_name: Name of the microservice
        :return: None
        """
        os.chdir(".")

        gitignore = (
            f"\n\n# {service_name}\n{service_name}/venv/\n"
            f"{service_name}/environments/.development.env\n{service_name}.log\n"
            f"{service_name}/local_settings.py\n{service_name}/db.sqlite3\n"
            f"{service_name}/db.sqlite3-journal\n{service_name}/coverage/\n"
            f"{service_name}/src/**/migrations.py"
        )

        f = open(".gitignore", "a+")
        f.write(gitignore)
        f.close()

    def edit_dockerignore(self, service_name) -> None:
        """
        Appends new service to the dockerignore file in the root directory
        :param service_name: name of the microservice
        :return: None
        """
        os.chdir(".")
        dockerignore = (
            f"\n\n# {service_name}\n{service_name}/docker\n{service_name}/venv"
        )

        f = open(".dockerignore", "a+")
        f.write(dockerignore)
        f.close()

    def edit_docker_compose(
        self, service_name: str, project_config_yaml: str, database: str
    ) -> None:
        """
        Edits the docker-compose file to add a new microservice This file must run after updating project.config.yml
        :param service_name: name of the microservice
        :param path to project.config.yml
        :param database The database to be used
        :return: None
        """
        os.chdir(".")

        project_config_data = self._read_yml_file(filepath=project_config_yaml)
        docker_compose_data = self._read_yml_file(filepath="docker-compose.yml")
        database_name = f"{service_name}_database"
        # this works for now but we will need better implementation later
        database_img_name = database if database != "postgresql" else "postgres"

        current_services = docker_compose_data.get("services", None)
        current_volumes = docker_compose_data.get("volumes", None)

        port_registry = project_config_data.get("port_registry")
        service_port_exposed = port_registry.get(service_name, None)
        database_port_exposed = port_registry.get(database_name)

        if not current_services:
            raise AssertionError(
                "No services found in docker-file, first create a service"
            )

        if database_port_exposed is None:
            raise ValueError(
                f"Expected a database port to be available however None were detected for {database_name},"
                "check project.config.yml"
            )

        if not service_port_exposed:
            raise ValueError(
                f"expected {service_name} to have a registered port but found none, check that it has a "
                f"entry in project.config.yml"
            )

        if not current_volumes:
            raise ValueError(
                f"Expected to have declared volumes but none are found in the docker-compose file"
            )

        new_service_compose_entry = {
            "build": {
                "context": f"./{service_name}",
                "dockerfile": "./docker/Dockerfile",
            },
            "image": service_name,
            "container_name": service_name,
            "restart": "always",
            "command": "python ./src/manage.py runserver 0.0.0.0:8000",
            "volumes": [f"./{service_name}/:/usr/src/app/"],
            "ports": [f"{service_port_exposed}:8000"],
            "env_file": [f"{service_name}/environments/.development.env"],
            "depends_on": [database_name],
        }

        new_database_compose_entry = {
            # TODO this will change when we introduce more databases
            "image": f"{database_img_name}:12.0-alpine",
            "restart": "always",
            "volumes": [f"{database_name}_data:/var/lib/postgresql/data/"],
            "ports": [f"{database_port_exposed}:5432"],
            "environment": [
                "POSTGRES_USER=admin",
                "POSTGRES_PASSWORD=admin",
                f"POSTGRES_DB={database_name}",
            ],
        }
        current_volumes[f"{database_name}_data"] = None

        current_services[service_name] = new_service_compose_entry
        current_services[database_name] = new_database_compose_entry

        new_docker_compose = {
            "volumes": current_volumes,
            "services": current_services,
            "version": docker_compose_data.get("version"),
        }

        self._write_yml_file(filepath="docker-compose.yml", data=new_docker_compose)
