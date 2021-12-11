from djoser import email


class UsernameChangedConfirmationEmail(email.UsernameChangedConfirmationEmail):
    template_name = "email_reset_username_confirm.html"
