"""
Resources:
views:
https://www.django-rest-framework.org/tutorial/3-class-based-views/
https://www.django-rest-framework.org/api-guide/views/

Requests and responses:
https://docs.djangoproject.com/en/3.1/ref/request-response/

"""
from django.core.exceptions import ObjectDoesNotExist

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
    """Control users allow users and admin to control their own account data by accessing, editing or deleting it"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, pk) -> Response:
        """
        Admin and validated user can access their data with a get request
        :param request: GET
        :param pk: user primary key
        :return: Response
        """
        try:
            user = UserModel.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({"message": "user does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        if request.user.is_superuser or request.user.is_staff:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            if request.user.pk == pk:
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Not authorised"}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk) -> Response:
        """
        Put requests will update the user model, the backend accepts only valid inputs and all fields must be entered.
        Dynamic interactions such as automatic retention of unaltered fields are handled in the front end.
        :param request: PUT
        :param pk: user primary key
        :return: Response
        """
        try:
            user = UserModel.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({"message": "user does not exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "details updated"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk) -> Response:
        """
        Delete requests will delete the users account. Only admin and the user can delete their account. The accounts
        are accessed by the primary key and the front end must do verifications before submitting a delete request
        :param request: Delete
        :param pk: primary key
        :return: Response
        """

        try:
            user = UserModel.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({"message": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.pk == pk or request.user.is_staff:
            user_email = user.email
            user.delete()
            return Response({f"message: User {user_email} was deleted"}, status=status.HTTP_204_NO_CONTENT)

        return Response({"message": "Not authorised"}, status=status.HTTP_403_FORBIDDEN)
