# https://testdriven.io/blog/django-custom-user-model/
from django.contrib.auth.base_user import BaseUserManager


class AccountsManager(BaseUserManager):
    """
    Manages auth user model where email is the unique id and not usernames
    """

    def create_user(self, email, password, **fields):
        """
        creates normal site users
        :param email: users email
        :param mobile: users mobile
        :param password: users password
        :param fields: additional fileds
        :return: User object
        """

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, first_name, last_name, password, **fields):
        """
        Creates a superuser
        :param email: super user email
        :param password: super user password
        :param fields: addidiotnal fileds
        :return: create_user function from AbstractUser class
        """
        fields.setdefault('is_staff', True)
        fields.setdefault('is_superuser', True)
        fields.setdefault('is_active', True)
        fields.setdefault('first_name', first_name)
        fields.setdefault('last_name', last_name)

        if not fields.get('is_staff'):
            raise ValueError("Superuser must have is_staff=True")

        if not fields.get('is_superuser'):
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email, password, **fields)
