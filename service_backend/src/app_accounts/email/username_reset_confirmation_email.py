from djoser import email


class UsernameChangedConfirmationEmail(email.UsernameChangedConfirmationEmail):
    template_name = "email_username_reset.html"
