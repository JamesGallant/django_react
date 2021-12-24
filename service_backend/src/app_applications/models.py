from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from datetime import date

# Create your models here.
class MarketplaceApplications(models.Model):
    name = models.CharField(null=False, blank=False, max_length=100)
    description = models.TextField(null=True, blank=True)
    url = models.URLField(null=False, blank=False, unique=True, max_length=100)
    image_path = models.CharField(max_length=100)

    class Meta:
        verbose_name = _("Registered Application")

    def __str__(self):
        return self.name


class UserOwnedApplications(models.Model):
    app = models.ForeignKey(
        "app_applications.MarketplaceApplications", on_delete=models.CASCADE
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False, on_delete=models.CASCADE)
    activation_date = models.DateField(auto_now=True, null=False, blank=False)
    expiration_date = models.DateField(null=True)

    class Meta:
        verbose_name = _("User owned application")

    @property
    def is_expired(self):
        return date.today() > self.expiration_date
