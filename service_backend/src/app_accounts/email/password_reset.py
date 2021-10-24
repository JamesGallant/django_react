from djoser import email


class PasswordResetEmail(email.PasswordResetEmail):
    template_name = "email_reset_password.html"
