from rest_framework import generics, mixins
from .serialzers import UserSerializer
from ..models import UserModel

class ListUsers(generics.ListAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get(self,request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        print(request.POST.get('email'))
        return self.create(request, *args, **kwargs)

class ControlUsers(generics.RetrieveUpdateDestroyAPIView,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
