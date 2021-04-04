"""
Resources:
https://realpython.com/test-driven-development-of-a-django-restful-api/
"""
import json

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from ..api.serialzers import UserSerializer


class TestListUsers(TestCase):
    """
    Things to test:
    Admin users are allowed to see this end point
    Regular users cannot access this end point
    Only accepts get requests

    """
    def setUp(self) -> None:
        self.client = APIClient()
        self.user_model = get_user_model()
        self.view_name = 'list_users'

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
        response = self.client.get(reverse(self.view_name))
        self.client.logout()
        # data
        users = self.user_model.objects.all()
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
        response = self.client.get(reverse(self.view_name))
        self.client.logout()

        # validate
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_get_request(self) -> None:
        """
        Only get methods are allowed in this view
        :return: None
        """
        self.client.login(username='superuser@testuser.com', password='superuser@testuser.com')
        response_superuser_post = self.client.post(reverse(self.view_name),
                                         data=json.dumps({"data": "some_data"}),
                                         content_type='application/json')

        response_superuser_delete = self.client.delete(reverse(self.view_name),
                                                       data=json.dumps({"data": "some_data"}),
                                                       content_type="application/json")
        self.client.logout()

        self.client.login(username='testuser1_lastname', password='testpassword1')
        response_user_post = self.client.post(reverse(self.view_name),
                                         data=json.dumps({"data": "some_data"}),
                                         content_type='application/json')

        response_user_delete = self.client.delete(reverse(self.view_name),
                                                       data=json.dumps({"data": "some_data"}),
                                                       content_type="application/json")
        self.client.logout()

        self.assertEqual(response_superuser_post.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response_superuser_delete.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(response_user_post.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_user_delete.status_code, status.HTTP_403_FORBIDDEN)

class TestCreateUser(TestCase):
    """
    Creating a new user should meet the following tests.
    1. Anyone should be able to create a user
    2. Passwords in the db must be hashed
    3. There cannot be duplicate users by email or mobile
    4. Users need to verify by mobile before account is made
    """
    def setUp(self) -> None:
        """
        Set up for testing user creation
        :return: None
        """
        self.client = APIClient()
        self.user_model = get_user_model()
        self.viewname = 'create_users'

        self.valid_payload = {
            "first_name": "testuser3_firstname",
            "last_name": "testuser3_lastname",
            "email": "testuser1@testuser.com",
            "mobile_number": '+31111111112',
            "password": 'testpassword1'
        }
        self.invalid_payload = {
            "first_name": "testuser4_firstname",
            "last_name": "testuser4_lastname",
            "email": "testuser1@testuser.com",
            "mobile_number": '+31111111112',
            "password": 'testpassword1'
        }

    def test_valid_post_request(self):
        """
        Tests the creation of a valid user with a hashed password
        :return: None
        """

        Response = self.client.post(reverse(self.viewname),
                                    data=json.dumps(self.valid_payload),
                                    content_type='application/json')

        # If password is hashed by the backend the payload should not equal the response
        self.assertNotEqual(Response.data["password"], self.valid_payload["password"])
        self.assertEqual(Response.status_code, status.HTTP_201_CREATED)

    def test_invalid_post_request(self):
        """
        It should not be possible to create an account with the same email and mobile number
        :return:
        """
        self.client.post(reverse(self.viewname),
                                    data=json.dumps(self.valid_payload),
                                    content_type='application/json')

        Response_invalid = self.client.post(reverse(self.viewname),
                                    data=json.dumps(self.invalid_payload),
                                    content_type='application/json')

        self.assertEqual(Response_invalid.status_code, status.HTTP_400_BAD_REQUEST)

class TestControlUser(APITestCase):
    """
    Users should be able access update or delete their accounts
    tests
    1. Get account information from user or admin but not from other user
    2. Update account information from user or admin but not from other user
    3. Delete account information by user or admin but not from other user
    4. Should return 404 if primary key is not available
    """

    def setUp(self) -> None:
        """
        Setup testing environment
        :return:
        """
        self.client = APIClient()
        self.user_model = get_user_model()

        self.user1 = self.user_model.objects.create_user(
            first_name="testuser1_firstname",
            last_name="testuser1_lastname",
            email="testuser1@testuser.com",
            mobile_number='+31111111111',
            password='password'
        )

        self.user2 = self.user_model.objects.create_user(
            first_name="testuser2_firstname",
            last_name="testuser2_lastname",
            email="testuser2@testuser.com",
            mobile_number='+31111111112',
            password='password'
        )

        self.user_model.objects.create_superuser(
            first_name="superuser_firstname",
            last_name="superuser_lastname",
            email="superuser@testuser.com",
            mobile_number='+33111111111',
            password='superuser@testuser.com'
        )

    def test_get_request(self):
        response_anon = self.client.get(reverse('detail_users', kwargs={'pk': self.user1.pk}))

        self.client.login(username='superuser@testuser.com', password='superuser@testuser.com')
        response_superuser = self.client.get(reverse('detail_users', kwargs={'pk': self.user1.pk}))
        self.client.logout()

        self.client.login(username='testuser1@testuser.com', password='password')
        response_user = self.client.get(reverse('detail_users', kwargs={'pk': self.user2.pk}))
        self.client.logout()

        print(f"anon: {response_anon.status_code}")
        print(f"superuser: {response_superuser.status_code}")
        print(f"user: {response_user.status_code}")






