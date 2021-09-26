from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class UserModelCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = UserModel
        fields = ["email", "first_name", "last_name", "country", "mobile_number"]


class UserModelChangeForm(UserChangeForm):
    class Meta:
        model = UserModel
        fields = ["email", "first_name", "last_name", "country", "mobile_number"]
