from rest_framework import serializers
from ..models import UserOwnedApplications, MarketplaceApplications


class UserOwnedApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOwnedApplications
        fields = "__all__"


class MarketplaceApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketplaceApplications
        fields = "__all__"