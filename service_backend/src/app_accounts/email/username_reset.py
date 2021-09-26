from djoser import email


class UsernameResetEmail(email.UsernameResetEmail):
    template_name = "email_reset_username.html"
