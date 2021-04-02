from django.urls import path

from .api.views import ListPostUsers, ControlUsers

urlpatterns = [
    path(r'users/', view=ListPostUsers.as_view(), name='list_post_users'),
    path(r'users/<int:pk>/', view=ControlUsers.as_view(), name='detail_users')
]
