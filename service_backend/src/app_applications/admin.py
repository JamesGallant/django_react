from django.contrib import admin
from .models import UserOwnedApplications, MarketplaceApplications

# Register your models here.


@admin.register(MarketplaceApplications)
class MarketplaceAppsAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "card_description",
        "full_description_shortened",
        "demo_app_description",
        "basic_app_description",
        "premium_app_description",
        "basic_cost",
        "premium_cost",
        "subscription_type",
        "url",
        "disabled",
    ]

    list_filter = ["id", "name"]
    search_fields = ["name", "url"]


@admin.register(UserOwnedApplications)
class UserOwnedApplicationsAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "app",
        "user",
        "activation_date",
        "expiration_date",
        "is_expired",
    )
