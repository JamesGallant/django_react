from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "mobile_number",
            "country",
            "is_active",
            "last_login"
        )

    def create(self, validated_data):
        """
        Overiding the create method to hash users passwords
        :param validated_data: data from post request, see views.py
        :return:
        """
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        """
        Overiding the update method to hash users passwords. We have to assign all data from validated_data
        :param instance: user model
        :param validated_data: data from put request see views.py
        :return:
        """
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)
        instance.mobile_number = validated_data.get("mobile_number", instance.mobile_number)
        instance.country = validated_data.get("country", instance.country)
        instance.set_password(validated_data.get("password", instance.password))
        instance.save()
        return instance
