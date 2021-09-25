from django.urls import path, include
from django.conf.urls import url
from rest_framework import routers

from .api.views import user_is_authenticated_and_active

# router = routers.DefaultRouter()
#
# router.register(r'isAuthenticated', user_is_authenticated_and_active)

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/isActiveUser/', user_is_authenticated_and_active)
]
