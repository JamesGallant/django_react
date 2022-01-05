from django.urls import path, include

# router = routers.DefaultRouter()
#
# router.register(r'isAuthenticated', user_is_authenticated_and_active)

urlpatterns = [
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
]
