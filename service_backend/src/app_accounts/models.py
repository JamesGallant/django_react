from django.db import models
from django.contrib.auth.models import AbstractUser

from phonenumber_field.modelfields import PhoneNumberField
from .managers import AccountsManager

# Create your models here.
class UserModel(AbstractUser):
    username = None
    email = models.EmailField("email address", unique=True)
    first_name = models.CharField(null=False, blank=False, max_length=100)
    last_name = models.CharField(null=False, blank=False, max_length=100)
    mobile_number = PhoneNumberField(null=False, blank=False, unique=True)
    country = models.CharField(null=False, blank=False, max_length=100)

    # sets email to be the unique field, usernames cause issues and is annoying to users
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "mobile_number", "country"]
    objects = AccountsManager()

    def __str__(self):
        return self.email
