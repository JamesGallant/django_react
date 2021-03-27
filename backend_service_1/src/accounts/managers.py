# https://testdriven.io/blog/django-custom-user-model/
from django.contrib.auth.base_user import BaseUserManager

class AccountsManager(BaseUserManager):
    """
    Manages auth user model where email is the unique id and not usernames
    """

    def create_user(self, fields):
        pass

    def create_superuser(self, fields):
        pass