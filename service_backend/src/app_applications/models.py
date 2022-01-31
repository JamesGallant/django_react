from django.db import models
from django.conf import settings
from djmoney.models.fields import MoneyField
from django.template.defaultfilters import truncatechars
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from datetime import date

# Create your models here.
class MarketplaceApplications(models.Model):
    class Subscription(models.TextChoices):
        DEMO = "DEMO", _("Demo")
        BASIC = "BASIC", _("Basic")
        PREMIUM = "PREMIUM", _("Premium")
        ALL = "DEMO|BASIC|PREMIUM", _("Demo, Basic and Premium")
        DEMOBASIC = "DEMO|BASIC", _("Demo and Basic")
        BASICPREMIUM = "BASIC|PREMIUM", _("Basic and Premium")

    name = models.CharField(
        null=False, blank=False, max_length=20, help_text="no longer than 20 characters"
    )
    card_description = models.CharField(
        null=False,
        blank=False,
        max_length=100,
        help_text="Description displayed on the card. No longer than 100 characters",
    )
    full_description = models.TextField(
        null=False, blank=False, help_text="Description used in the learn more section"
    )
    demo_app_description = models.CharField(
        null=True,
        blank=True,
        max_length=100,
        help_text="List of highlighted features for the demo app, pipe separated. e.g One|Two",
    )

    basic_app_description = models.CharField(
        null=True,
        blank=True,
        max_length=100,
        help_text="List of highlighted features for the base app, pipe separated. e.g One|Two",
    )
    premium_app_description = models.CharField(
        null=True,
        blank=True,
        max_length=100,
        help_text="List of highlighted features for the premium app, pipe separated. e.g. One|Two",
    )
    basic_cost = MoneyField(
        null=True,
        blank=True,
        max_digits=14,
        decimal_places=2,
        default=0.00,
        default_currency="EUR",
        help_text="Cost of the application per month, leaving it blank will make it free. Discounts are applied on bulk purchase with a max of 20%",
    )
    premium_cost = MoneyField(
        null=True,
        blank=True,
        max_digits=14,
        decimal_places=2,
        default_currency="EUR",
        default=0.00,
        help_text="Cost of a premium version of the application per month, depends on field has_premium_serivce.  Discounts are applied on bulk purchase with a max of 20%",
    )
    subscription_type = models.CharField(
        choices=Subscription.choices,
        max_length=20,
        default=Subscription.DEMO,
        null=False,
        blank=False,
        help_text="The different version of your app, options (DEMO, BASIC, PREM, DEMO|BASIC|PREM, DEMO|BASIC, BASIC|PREM)",
    )
    url = models.CharField(
        blank=True,
        null=True,
        max_length=50,
        help_text="The url used to reference apps loaded in the front end.",
    )

    disabled = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Registered Application")

    def __str__(self):
        return self.name

    @property
    def full_description_shortened(self):
        return truncatechars(self.full_description, 100)

    @property
    def get_subscription(self):
        return self.Subscription[self.subscription_type]


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
