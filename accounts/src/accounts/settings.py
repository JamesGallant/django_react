"""
Django settings for accounts project.

Generated by 'django-admin startproject' using Django 3.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import os
from pathlib import Path
from .config import develop_configuration


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = develop_configuration.get("debug", 0)

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")

# comapany name
SITE_NAME = develop_configuration.get("site_name", "test site")
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # third party
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'phonenumber_field',

    # ours
    'users.apps.AccountsConfig',


]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'accounts.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # ours
                'accounts.context_processors.frontend_url'
            ],
        },
    },
]

WSGI_APPLICATION = 'accounts.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": develop_configuration.get("sql_engine", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("SQL_USER", None),
        "PASSWORD": os.environ.get("SQL_PASSWORD", None),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": develop_configuration.get("sql_port", "5432"),
        "TEST": {
            "NAME": develop_configuration.get("sql_test_database", "test_db")
        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'


# Email support
EMAIL_BACKEND = develop_configuration.get("email_backend", None)
EMAIL_HOST = develop_configuration.get("email_host", None)
EMAIL_PORT = develop_configuration.get("email_port", None)
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", None)
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", None)

# users model
AUTH_USER_MODEL = 'users.UserModel'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Rest framework options

# CORS
CORS_ORIGIN_WHITELIST = ['http://localhost:8000']
# restrict to api only
CORS_ORIGIN_ALLOW_ALL = False

REST_FRAMEWORK = {
     "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
     "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
     ),
 }

# djoser
DJOSER = {
    'SEND_ACTIVATION_EMAIL': develop_configuration.get("djoser_send_mail", False),
    'SEND_CONFIRMATION_EMAIL': develop_configuration.get("djoser_send_confirmation_email", False),
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': develop_configuration.get("djoser_password_reset", False),
    'USERNAME_RESET_SHOW_EMAIL_NOT_FOUND': develop_configuration.get("djoser_username_reset", False),
    "LOGIN_FIELD":  develop_configuration.get('djoser_login_field', "username"),
    'HIDE_USERS': develop_configuration.get('djoser_hide_users', True),
    'ACTIVATION_URL': develop_configuration.get("djoser_email_activation_url", None),
    'USERNAME_RESET_CONFIRM_URL': develop_configuration.get("djoser_username_reset_url", None),
    'PASSWORD_RESET_CONFIRM_URL':develop_configuration.get("djoser_password_reset_url", None),
    'SERIALIZERS': {},
    'EMAIL': {
        'activation': 'users.email.activation_email.ActivationEmail',
        'username_changed_confirmation': 'users.email.username_reset_confirmation.UsernameChangedConfirmationEmail',
        'username_reset': 'users.email.username_reset.UsernameResetEmail',
    }
}