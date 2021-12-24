from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadAndDelete(BasePermission):
    """
    Allow get and delete requests if user is not admin, else all methods are allowed
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS and request.user.is_authenticated:
            return True
        else:
            if request.user.is_staff or request.method == "DELETE":
                return True
        return False


class IsAdminOrReadOnly(BasePermission):
    """
    Allow only get requests if user is not admin
    """

    def has_permission(self, request, view):
        # safe methods are GET | OPTIONS | HEAD
        if request.method in SAFE_METHODS and request.user.is_authenticated:
            return True
        else:
            if request.user.is_staff:
                return True
        return False
