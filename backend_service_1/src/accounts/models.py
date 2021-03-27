from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import AccountsManager

# Create your models here.
class UserModel(AbstractUser):
    username = None
    email = models.EmailField("email adress", unique=True)
    first_name = models.CharField(null=False, blank=False, max_length=100)
    last_name = models.CharField(null=False, blank=False, max_length=100)

    # sets email to be the unique field, usernames cause issues and is annoying to users
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = AccountsManager()

    def __str__(self):
        return self.email
