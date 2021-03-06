from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

from .forms import UserChangeForm, UserCreationForm

# Register your models here.
UserModel = get_user_model()


class UserModelAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = UserModel
    list_display = [
        "email",
        "id",
        "first_name",
        "last_name",
        "mobile_number",
        "country",
        "date_joined",
        "last_login",
        "is_superuser",
        "is_staff",
        "is_active",
    ]
    list_filter = [
        "email",
        "id",
        "first_name",
        "last_name",
        "mobile_number",
        "country",
        "date_joined",
        "last_login",
        "is_superuser",
        "is_staff",
        "is_active",
    ]

    fieldsets = (
        (
            None,
            {
                "fields": [
                    "email",
                    "first_name",
                    "last_name",
                    "mobile_number",
                    "country",
                    "date_joined",
                    "last_login",
                    "password",
                ]
            },
        ),
        ("permissions", {"fields": ["is_superuser", "is_staff", "is_active"]}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ["wide"],
                "fields": [
                    "email",
                    "first_name",
                    "last_name",
                    "country",
                    "mobile_number",
                    "date_joined",
                    "last_login",
                    "password1",
                    "password2",
                    "is_superuser",
                    "is_staff",
                    "is_active",
                ],
            },
        ),
    )
    search_fields = ["email"]
    ordering = ["email"]


admin.site.register(UserModel, UserModelAdmin)
