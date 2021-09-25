import json

from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from service_backend.config import develop_configuration


class TestAdditionalAuthEndpoints(APITestCase):
    def setUp(self) -> None:
        self.test = "Hello"
        self.base_url = f"http://{develop_configuration.get('service_backend')}/api/v1/auth"
        self.login_url = f"{self.base_url}/token/login/"
        self.isActiveUser_url = f"{self.base_url}/isActiveUser/"
        self.client = APIClient()
        self.user_model = get_user_model()
        self.user_model.objects.create_user(
            first_name="regular_user_fn",
            last_name="regular_user_ln",
            email="regular_user@email.com",
            mobile_number='+31111111112',
            country='Netherlands',
            password='secret'
        )
        self.valid_login = {
            'email': "regular_user@email.com",
            'password': "secret",
        }

    def test_isActiveUser_not_authenticated(self) -> None:
        response = self.client.get(self.isActiveUser_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_isActiveUser_success(self) -> None:
        token_url = self.client.post(self.login_url,
                                     data=json.dumps(self.valid_login),
                                     content_type='application/json'
                                     )

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token_url.data.get('auth_token'))
        response = self.client.get(self.isActiveUser_url)
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_isActiveUser_malformedToken(self) -> None:
        token_url = self.client.post(self.login_url,
                                     data=json.dumps(self.valid_login),
                                     content_type='application/json'
                                     )

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + f"{token_url.data.get('auth_token')}-malformed")
        response = self.client.get(self.isActiveUser_url)
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get('detail'), 'Invalid token')

