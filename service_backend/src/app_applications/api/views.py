from rest_framework import viewsets, permissions
from .serializers import (
    UserOwnedApplicationSerializer,
    MarketplaceApplicationSerializer,
)
from modules.permissions import IsAdminOrReadOnly, IsAdminOrReadAndDelete
from ..models import UserOwnedApplications, MarketplaceApplications

# Create your views here.


class UserOwnedApplicationView(viewsets.ModelViewSet):
    """
    API view for that displays the user's connected applications. User accounts should be able to view the apps but
    no other unsafe mt
    """

    serializer_class = UserOwnedApplicationSerializer
    permission_classes = [IsAdminOrReadAndDelete]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return UserOwnedApplications.objects.all().order_by("id")

        return UserOwnedApplications.objects.filter(user=user.id).order_by("id")


class MarketplaceApplicationsView(viewsets.ModelViewSet):
    """
    API view to display marketplace apps, it should only be editable by admin and read by authenticated users
    We aim to support developers publishing apps in the future, in which case new permissions are required
    """

    queryset = MarketplaceApplications.objects.all().order_by("id")
    serializer_class = MarketplaceApplicationSerializer
    permission_classes = [IsAdminOrReadOnly]
