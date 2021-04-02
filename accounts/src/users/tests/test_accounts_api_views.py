"""
Resources:
https://realpython.com/test-driven-development-of-a-django-restful-api/
"""
import base64

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient


from ..api.serialzers import UserSerializer

UserModel = get_user_model()
class TestListPostUsers(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user_model = get_user_model()

        self.user_model.objects.create_user(
            first_name="testuser1_firstname",
            last_name="testuser1_lastname",
            email="testuser1@testuser.com",
            mobile_number='+31111111111',
            password='testpassword1'
        )

        self.user_model.objects.create_user(
            first_name="testuser2_firstname",
            last_name="testuser2_lastname",
            email="testuser2@testuser.com",
            mobile_number='+32111111111',
            password='testpassword2'
        )

        self.user_model.objects.create_superuser(
            first_name="superuser_firstname",
            last_name="superuser_lastname",
            email="superuser@testuser.com",
            mobile_number='+33111111111',
            password='superuser@testuser.com'
        )

    def test_get_request_superuser(self) -> None:
        """
        Superuser should have all the access
        :return:
        """
        # request
        self.client.login(username='superuser@testuser.com', password='superuser@testuser.com')
        response = self.client.get(reverse('list_post_users'))
        self.client.logout()
        # data
        users = UserModel.objects.all()
        serializer = UserSerializer(users, many=True)

        # validations
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_request_normaluser(self) -> None:
        """
        Normal user should not have access to all the data, only that does not belong to them
        :return:
        """
        self.client.login(username='testuser1_lastname', password='testpassword1')
        response = self.client.get(reverse('list_post_users'))
        self.client.logout()

        # validate
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

