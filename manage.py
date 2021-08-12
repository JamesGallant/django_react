# from django.core.management.utils import get_random_secret_key
from saas_utilities.files.filemanager import FileGenerator
import sys
import os
import pathlib
import subprocess


class AppManager:
    """
    The main class for managing global app state
    """

    def __init__(self):
        pass

    def microservice(self) -> None:
        name = input("Service name: ")
        db = input("Database: ")

        db = db.lower()
        db_options = ["mysql", "postgresql", "sqlite3", "oracle"]
        if db not in db_options:
            raise ValueError(f"Database {db} is not supported. Options are (mysql, postgresql, oracle)")

        root_dir = pathlib.Path(__file__).parent.resolve()
        current_dirs = os.listdir(root_dir)
        service_name = f"service_{name.lower()}"

        if service_name in current_dirs:
            raise ValueError(f"microservice {name} already exists")

        subprocess.call(["django-admin", "startproject", f"{service_name}"])

        target_folders = ["docker", "environments", "requirements", "src"]

        service_dir = os.path.join(root_dir, service_name)

        for folder in target_folders:
            os.mkdir(os.path.join(service_dir, folder))

        os.rename(f"{service_dir}/{service_name}", f"{service_dir}/src/{service_name}")
        os.rename(f"{service_dir}/manage.py", f"{service_dir}/src/manage.py")

        files = FileGenerator(service_filepath=service_dir)

        files.create_init()
        files.create_service_readme(service_name=service_name)
        files.create_docker_file()
        files.create_python_requirement()
        files.create_service_readme(service_name=service_name)
        files.create_dev_environment(service_name=service_name)
        files.create_config_file(service_name=service_name, database=db)
        files.create_github_actions_workflow(service_name=service_name)

    def main(self, engine: str = None) -> None:
        if not engine:
            raise ValueError("engine must be a value")

        switch = {
            "create_microservice": self.microservice
        }

        switch_keys = [key for key, _ in switch.items()]

        if engine not in switch_keys:
            raise ValueError("invalid parameter to engine, options are (create_microservice)")

        switch[engine]()


if __name__ == '__main__':
    manager = AppManager()
    args = sys.argv
    ENGINE = args[1]
    manager.main(ENGINE)
