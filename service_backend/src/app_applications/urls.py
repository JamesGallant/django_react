from django.urls import path, include
from .api import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"registered", views.MarketplaceApplicationsView)
router.register(r"user", views.UserOwnedApplicationView, "user-apps")

urlpatterns = [
    path("", include(router.urls)),
]
