"""
Resources:
views:
https://www.django-rest-framework.org/tutorial/3-class-based-views/
https://www.django-rest-framework.org/api-guide/views/

Requests and responses:
https://docs.djangoproject.com/en/3.1/ref/request-response/

"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework import status

from .serialzers import UserSerializer
from ..models import UserModel


class ListUsers(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None) -> Response:
        """
        Allows admin users to see all accounts via API
        :param request: http request
        :param format:
        :return:
        """
        model = UserModel.objects.all()
        serializer = UserSerializer(model, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateUsers(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request) -> Response:
        """
        Allows users to create an account, permission set to any thus an unrestricted api.
        :param request: http request
        :return: None
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ControlUsers(APIView):

    def get(self, request, pk, format=None):
        return Response({f"Was a targeted get request for pk: {pk}"}, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        return Response({f"Was a targeted put request for pk: {pk}"}, status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        return Response({f"Was a targeted delete request for pk: {pk}"}, status=status.HTTP_200_OK)
