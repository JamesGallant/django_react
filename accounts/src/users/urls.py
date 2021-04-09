from django.urls import path

from .api.views import ListUsers, CreateUsers, ControlUsers, ConfirmEmailRegistrationView

urlpatterns = [
    path(r'users/', view=ListUsers.as_view(), name='list_users'),
    path(r'users/<int:pk>/', view=ControlUsers.as_view(), name='detail_users'),
    path(r'users/create_account/', view=CreateUsers.as_view(), name='create_users'),
    path(r'users/activate_account/', view=ConfirmEmailRegistrationView.as_view(), name='confirm_email'),
]
