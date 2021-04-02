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
from rest_framework import status


from .serialzers import UserSerializer
from ..models import UserModel

class ListPostUsers(APIView):
    def get(self, request, format=None):
        model = UserModel.objects.all()
        serializer = UserSerializer(model, many=True)
        if request.user.is_superuser:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"Not authenticated"}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request, format=None):
        print(request.method)
        return Response({"Was a post request"}, status=status.HTTP_200_OK)

class ControlUsers(APIView):

    def get(self, request, pk, format=None):
        return Response({f"Was a targeted get request for pk: {pk}"}, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        return Response({f"Was a targeted put request for pk: {pk}"}, status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        return Response({f"Was a targeted delete request for pk: {pk}"}, status=status.HTTP_200_OK)