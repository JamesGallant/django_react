from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth import get_user_model
from .serialzers import UserIsAuthenticated


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_is_authenticated_and_active(request):
    userModel = get_user_model()
    user = userModel.objects.filter(id=request.user.id).order_by("id")
    serializer = UserIsAuthenticated(user)
    return Response({"message": serializer.data}, status=status.HTTP_200_OK)
