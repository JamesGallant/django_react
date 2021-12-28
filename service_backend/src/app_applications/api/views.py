from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    UserOwnedApplicationSerializer,
    MarketplaceApplicationSerializer,
)
from django.utils import timezone

from modules.permissions import IsAdminOrReadOnly, IsAdminOrNoPuts
from ..models import UserOwnedApplications, MarketplaceApplications


# Create your views here.


class UserOwnedApplicationView(ModelViewSet):
    """
    API view for that displays the user's connected applications. User accounts should be able to view the apps but
    no other unsafe mt
    """

    serializer_class = UserOwnedApplicationSerializer
    permission_classes = [IsAdminOrNoPuts]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return UserOwnedApplications.objects.all().order_by("id")

        return UserOwnedApplications.objects.filter(user=user.id).order_by("id")

    def create(self, request, *args, **kwargs) -> Response:
        # payment logic
        has_payed = True

        if has_payed:
            date_today = timezone.datetime.today()
            expiration_date = (
                date_today
                if request.data["expiration_date"] == ""
                else timezone.datetime.strptime(
                    request.data["expiration_date"], "%Y-%m-%d"
                )
            )
            if expiration_date < date_today:
                return Response(
                    {"message": "Expiration date cannot be in the past"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if (
                int(request.data["user"]) != request.user.id
                and not request.user.is_staff
            ):
                return Response(
                    {"message": "You cannot assign apps to an unauthorized user"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            app_data = {
                "expiration_date": expiration_date.date(),
                "app": int(request.data["app"]),
                "user": int(request.data["user"]),
            }

            serializer = UserOwnedApplicationSerializer(data=app_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"message": "Payment failed"},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def partial_update(self, request, *args, **kwargs) -> Response:
        """
        We want to be able to update the expiration_date and activation_date but not any other fields
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        # payment logic
        has_payed = True

        if has_payed:
            keys = [keys for keys, _ in request.data.items()]
            if len(keys) > 1 or keys[0] != "expiration_date":
                return Response(
                    {"message": "only expiration_date can be altered"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            test = self.get_object()
            patch_data = {
                "id": self.kwargs.get("pk"),
                "expiration_date": request.data["expiration_date"],
                "acitivation_date": timezone.datetime.today().date(),
            }

            serializer = UserOwnedApplicationSerializer(
                test, data=patch_data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"message": "not owned"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )


class MarketplaceApplicationsView(ModelViewSet):
    """
    API view to display marketplace apps, it should only be editable by admin and read by authenticated users
    We aim to support developers publishing apps in the future, in which case new permissions are required
    """

    queryset = MarketplaceApplications.objects.all().order_by("id")
    serializer_class = MarketplaceApplicationSerializer
    permission_classes = [IsAdminOrReadOnly]
