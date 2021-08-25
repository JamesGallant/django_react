
develop_configuration = {
    # Misc
    "debug": 1,
    "site_name": "test site",
    "protocol": "http://",
    "frontend_url": f"localhost:8000",
    "service_backend": f"localhost:8001",

    # Database
    "sql_engine": "django.db.backends.postgresql",
    "sql_test_database": "test_database",

    # Email
    "email_backend": "django.core.mail.backends.smtp.EmailBackend",
    "email_host": "mailhog",
    "email_port": 1025,

    # Djoser
    "djoser_send_mail": True,
    "djoser_send_confirmation_email": True,
    "djoser_hide_users": True,
    "djoser_login_field": "email",
    "djoser_password_reset": True,
    "djoser_username_reset": True,

    # these are configured on service_frontend
    "djoser_email_activation_url": "auth/activate/{uid}/{token}",
    "djoser_username_reset_url": "reset/username/{uid}/{token}",
    "djoser_password_reset_url": "reset/password/{uid}/{token}",

}
