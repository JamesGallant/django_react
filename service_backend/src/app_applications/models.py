from django.db import models
from django.conf import settings
from djmoney.models.fields import MoneyField
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from datetime import date

# Create your models here.
class MarketplaceApplications(models.Model):
    name = models.CharField(
        null=False, blank=False, max_length=20, help_text="no longer than 20 characters"
    )
    card_description = models.CharField(
        null=False,
        blank=False,
        max_length=100,
        help_text="Description displayed on the card. No longer than " "100 characters",
    )
    full_description = models.TextField(
        null=True, blank=True, help_text="Description used in the learn more section"
    )
    base_app_description = models.CharField(
        null=True,
        blank=True,
        max_length=100,
        help_text="List of highlighted features for the base app, comma separated.",
    )
    premium_app_description = models.CharField(
        null=True,
        blank=True,
        max_length=100,
        help_text="List of highlighted features for the premium app, comma separated.",
    )
    base_cost = MoneyField(
        max_digits=14,
        decimal_places=2,
        default=0.00,
        default_currency="EUR",
        help_text="Cost of the application, leaving it blank will make it free",
    )
    premium_cost = MoneyField(
        null=True,
        blank=True,
        max_digits=14,
        decimal_places=2,
        default_currency="EUR",
        default=0.00,
        help_text="Cost of a premium version of the application, depends on field has_premium_serivce",
    )
    has_premium_service = models.BooleanField(
        default=False,
        blank=False,
        null=False,
        help_text="whether or not the app has a premium version",
    )
    url = models.URLField(
        unique=True, blank=True, max_length=100, help_text="internal url registry"
    )
    image_path = models.CharField(
        max_length=100, blank=True
    )  # need to think about this one
    disabled = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Registered Application")

    def __str__(self):
        return self.name


class UserOwnedApplications(models.Model):
    app = models.ForeignKey(MarketplaceApplications, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=False, blank=False, on_delete=models.CASCADE
    )
    activation_date = models.DateField(auto_now=True, null=False, blank=False)
    expiration_date = models.DateField(null=False, blank=False, default=timezone.now)

    class Meta:
        verbose_name = _("User owned application")
        unique_together = (("app", "user"),)

    @property
    def is_expired(self):
        return date.today() > self.expiration_date
