from djoser import email


class UsernameChangedConfirmationEmail(email.UsernameChangedConfirmationEmail):
    template_name = "reset_username_confirm.html"
