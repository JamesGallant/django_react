"""
Django settings for service_backend project.

Generated by 'django-admin startproject' using Django 3.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG")

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")

ADMINS = os.environ.get("ADMINS")
# comapany name
SITE_NAME = os.environ.get("SITE_NAME")

# Application definition

INSTALLED_APPS = [
    # ours
    "app_accounts.apps.AccountsConfig",
    "app_applications.apps.ApplicationsConfig",
    # third party
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "djoser",
    "phonenumber_field",
    "djmoney",
    # django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "service_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # ours
                "service_backend.context_processors.frontend_url",
            ],
        },
    },
]

WSGI_APPLICATION = "service_backend.wsgi.application"


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

CONN_MAX_AGE = os.environ.get("CONN_MAX_AGE")
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("SQL_USER", None),
        "PASSWORD": os.environ.get("SQL_PASSWORD", None),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
        "TEST": {"NAME": os.environ.get("SQL_TEST_DATABASE", "test_db")},
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

# STATIC_URL = "/static/"

# HTTPS settings
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE")
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE")

# Email support
EMAIL_BACKEND = os.environ.get("EMAIL_BACKEND", None)
EMAIL_HOST = os.environ.get("EMAIL_HOST", None)
EMAIL_PORT = os.environ.get("EMAIL_PORT", None)
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", None)
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", None)

# app_accounts model
AUTH_USER_MODEL = "app_accounts.UserModel"
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

# Rest framework settings
# CORS
CORS_ORIGIN_WHITELIST = [
    f"{os.environ.get('PROTOCOL')}{os.environ.get('FRONTEND_URL')}"
]

# restrict to api only
CORS_ORIGIN_ALLOW_ALL = False

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 5,
}

# djoser
DJOSER = {
    "SEND_ACTIVATION_EMAIL": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "USER_CREATE_PASSWORD_RETYPE": True,
    "SET_USERNAME_RETYPE": False,
    "PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND": True,
    "USERNAME_RESET_SHOW_EMAIL_NOT_FOUND": True,
    "LOGIN_FIELD": "email",
    "HIDE_USERS": True,
    # --- change these on the frontend as well
    "ACTIVATION_URL": "auth/activate/{uid}/{token}",
    "USERNAME_RESET_CONFIRM_URL": "auth/reset/username/{uid}/{token}",
    "PASSWORD_RESET_CONFIRM_URL": "auth/reset/password/{uid}/{token}",
    # ---
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "SERIALIZERS": {"current_user": "app_accounts.api.serializers.UserSerializer"},
    # https://github.com/sunscrapers/djoser/tree/master/djoser/templates/email
    "EMAIL": {
        "activation": "app_accounts.email.activation_email.ActivationEmail",
        "username_changed_confirmation": "app_accounts.email.username_reset_confirmation.UsernameChangedConfirmationEmail",
        "username_reset": "app_accounts.email.username_reset.UsernameResetEmail",
        "password_reset": "app_accounts.email.password_reset.PasswordResetEmail",
    },
}
