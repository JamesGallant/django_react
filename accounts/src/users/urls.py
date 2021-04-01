from django.urls import path

from .api.views import ListUsers, ControlUsers

urlpatterns = [
    path(r'users/', view=ListUsers.as_view()),
    path(r'users/<int:pk>/', ControlUsers.as_view())
]
