from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from faker import Faker
import json
from datetime import date, timedelta
from service_backend.config import develop_configuration
from ..models import UserOwnedApplications, MarketplaceApplications


class TestUserOwnedApplication(APITestCase):
    def setUp(self) -> None:
        self.base_url = (
            f"http://{develop_configuration.get('service_backend')}/api/v1"
        )
        self.user_apps_url = f"{self.base_url}/apps/user/"

        self.client = APIClient()
        self.fake = Faker()

        self.apps_marketplace_model = MarketplaceApplications
        self.owned_apps_model = UserOwnedApplications
        self.user_model = get_user_model()

        self.superuser = self.user_model.objects.create_superuser(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            email=self.fake.ascii_free_email(),
            mobile_number="+31111111111",
            country="Netherlands",
            password="secret",
        )

        self.user = self.user_model.objects.create_user(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            email=self.fake.ascii_free_email(),
            mobile_number="+31111111112",
            country="Netherlands",
            password="secret",
        )

        self.user2 = self.user_model.objects.create_user(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            email=self.fake.ascii_free_email(),
            mobile_number="+31111111113",
            country="Netherlands",
            password="secret",
        )

        self.marketplace_app = self.apps_marketplace_model.objects.create(
            name=self.fake.name(),
            description=self.fake.sentence(),
            url=self.fake.url(),
            image_path=self.fake.file_path(),
        )

        self.owned_app_user = self.owned_apps_model.objects.create(
            app=self.marketplace_app,
            user=self.user,
            activation_date=date.today(),
            expiration_date=date.today() + timedelta(days=1)
        )

        self.owned_app_user2 = self.owned_apps_model.objects.create(
            app=self.marketplace_app,
            user=self.user2,
            activation_date=date.today(),
            expiration_date=date.today() + timedelta(days=1)
        )

        self.user_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({
                "email": self.user.email,
                "password": "secret"
            }),
            content_type="application/json",
        )

        self.user2_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({
                "email": self.user2.email,
                "password": "secret"
            }),
            content_type="application/json",
        )

        self.superuser_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({
                "email": self.superuser.email,
                "password": "secret"
            }),
            content_type="application/json",
        )

    # get
    def test_user_can_get_owned_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.get(self.user_apps_url)
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)  # only owns one app

    def test_user_can_get_specific_app(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.get(f"{self.user_apps_url}{self.owned_app_user.id}/")

        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_get_other_user_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.get(f"{self.user_apps_url}{self.owned_app_user2.id}/")
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unknown_user_cannot_get_apps(self):
        response = self.client.get(self.user_apps_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unknown_user_cannot_get_specific_apps(self):
        response = self.client.get(f"{self.user_apps_url}{self.owned_app_user.id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_get_all_user_owned_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.get(self.user_apps_url)
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], len(self.owned_apps_model.objects.all()))

    def test_admin_can_get_other_user_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.get(f"{self.user_apps_url}{self.owned_app_user.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # post
    def test_user_cannot_create_new_owned_apps(self):
        data = {
            "expiration_date": "2000-01-01",
            "app": self.marketplace_app.id,
            "user": self.user.email
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.post(self.user_apps_url, data=json.dumps(data), content_type="application/json")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unknown_cannot_create_new_owned_apps(self):
        data = {
            "expiration_date": "2000-01-01",
            "app": self.marketplace_app.id,
            "user": self.user.email
        }
        response = self.client.post(self.user_apps_url, data=json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_create_new_owned_apps(self):
        data = {
            "expiration_date": "2000-01-01",
            "app": self.marketplace_app.id,
            "user": self.user.id
        }

        self.client.credentials( HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}")
        response = self.client.post(self.user_apps_url, data=json.dumps(data), content_type="application/json")
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # put
    def test_user_cannot_patch_current_owned_apps(self):
        data = {
            "expiration_date": "2000-01-01",
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.patch(f"{self.user_apps_url}{self.owned_app_user.id}/", data=json.dumps(data),
                                   content_type="application/json")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unknown_cannot_patch_current_owned_apps(self):
        data = {
            "expiration_date": "2000-01-01",
        }
        response = self.client.patch(f"{self.user_apps_url}{self.owned_app_user.id}/", data=json.dumps(data),
                                   content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_patch_current_owned_apps(self):
        data = {
            "expiration_date": "2000-01-01",
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.patch(f"{self.user_apps_url}{self.owned_app_user.id}/", data=json.dumps(data),
                                   content_type="application/json")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # delete
    def test_user_can_delete_current_owned_apps(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}")
        response = self.client.delete(f"{self.user_apps_url}{self.owned_app_user.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cannot_delete_other_user_apps(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}")
        response = self.client.delete(f"{self.user_apps_url}{self.owned_app_user2.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unknown_cannot_delete_user_owned_apps(self):
        response = self.client.delete(f"{self.user_apps_url}{self.owned_app_user.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_delete_user_owned_apps(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}")
        response = self.client.delete(f"{self.user_apps_url}{self.owned_app_user.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
