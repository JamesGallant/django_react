from django.contrib import admin
from .models import UserOwnedApplications, MarketplaceApplications

# Register your models here.


@admin.register(MarketplaceApplications)
class MarketplaceAppsAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "card_description",
        "full_description",
        "base_app_description",
        "premium_app_description",
        "base_cost",
        "premium_cost",
        "has_premium_service",
        "url",
        "image_path",
        "disabled",
    ]

    list_filter = ["id", "name"]


@admin.register(UserOwnedApplications)
class UserOwnedApplicationsAdmin(admin.ModelAdmin):
    list_display = ("pk", "app", "user", "activation_date", "expiration_date")
