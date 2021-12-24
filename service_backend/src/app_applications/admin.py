from django.contrib import admin
from .models import UserOwnedApplications, MarketplaceApplications

# Register your models here.


@admin.register(MarketplaceApplications)
class MarketplaceAppsAdmin(admin.ModelAdmin):
    list_display = ("pk", "name", "description", "url", "image_path")


@admin.register(UserOwnedApplications)
class UserOwnedApplicationsAdmin(admin.ModelAdmin):
    list_display = ("pk", "app", "user", "activation_date", "expiration_date")
