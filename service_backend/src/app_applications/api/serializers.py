from rest_framework import serializers
from ..models import UserOwnedApplications, MarketplaceApplications


class UserOwnedApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOwnedApplications
        fields = [
            "id",
            "app",
            "user",
            "activation_date",
            "expiration_date",
            "is_expired",
        ]


class MarketplaceApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketplaceApplications
        fields = "__all__"
