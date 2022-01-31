from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from faker import Faker
import json

from service_backend.config import develop_configuration
from ..models import MarketplaceApplications


class TestMarketPlaceApplications(APITestCase):
    def setUp(self) -> None:
        self.base_url = f"http://{develop_configuration.get('service_backend')}/api/v1"
        self.user_registered_apps_url = f"{self.base_url}/apps/registered/"

        self.client = APIClient()
        self.fake = Faker()

        self.apps_marketplace_model = MarketplaceApplications
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

        self.marketplace_app = self.apps_marketplace_model.objects.create(
            name=self.fake.name(),
            card_description=self.fake.sentence(nb_words=5),
            full_description=self.fake.sentence(),
            demo_app_description=self.fake.sentence(nb_words=5),
            basic_app_description=self.fake.sentence(nb_words=5),
            premium_app_description=self.fake.sentence(nb_words=5),
            basic_cost=10.00,
            premium_cost=100.00,
            subscription_type="BASIC",
            url="/",
            disabled=False,
        )

        self.user_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({"email": self.user.email, "password": "secret"}),
            content_type="application/json",
        )

        self.superuser_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({"email": self.superuser.email, "password": "secret"}),
            content_type="application/json",
        )

        # get

    def test_user_can_get_registered_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.get(self.user_registered_apps_url)
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_get_registered_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.get(self.user_registered_apps_url)
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unknown_cannot_get_registered_apps(self):
        response = self.client.get(self.user_registered_apps_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # post
    def test_user_cannot_register_apps(self):
        data = {
            "name": self.fake.name(),
            "card_description": self.fake.sentence(nb_words=5),
            "full_description": self.fake.paragraph(nb_sentences=3),
            "demo_app_description": self.fake.sentence(nb_words=5),
            "basic_app_description": self.fake.sentence(nb_words=5),
            "premium_app_description": self.fake.sentence(nb_words=5),
            "base_cost": 0.00,
            "premium_cost": 100.00,
            "subscription_type": "BASIC",
            "url": "/",
            "disabled": False,
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_registered_apps_url,
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_register_apps(self):
        data = {
            "name": self.fake.name(),
            "card_description": self.fake.sentence(nb_words=5),
            "full_description": self.fake.paragraph(nb_sentences=3),
            "demo_app_description": self.fake.sentence(nb_words=5),
            "basic_app_description": self.fake.sentence(nb_words=5),
            "premium_app_description": self.fake.sentence(nb_words=5),
            "base_cost": 0.00,
            "premium_cost": 100.00,
            "subscription_type": "BASIC",
            "url": "/",
            "disabled": False,
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_registered_apps_url,
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_unknown_cannot_register_apps(self):
        data = {
            "name": self.fake.name(),
            "card_description": self.fake.sentence(nb_words=5),
            "full_description": self.fake.paragraph(nb_sentences=3),
            "demo_app_description": self.fake.sentence(nb_words=5),
            "basic_app_description": self.fake.sentence(nb_words=5),
            "premium_app_description": self.fake.sentence(nb_words=5),
            "base_cost": 0.00,
            "premium_cost": 100.00,
            "subscription_type": "BASIC",
            "url": "/",
            "disabled": False,
        }
        response = self.client.post(
            self.user_registered_apps_url,
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # patch
    def test_user_cannot_patch_registered_apps(self):
        data = {
            "name": "some app",
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.patch(
            f"{self.user_registered_apps_url}{self.marketplace_app.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unknown_cannot_patch_registered_apps(self):
        data = {
            "name": "some app",
        }
        response = self.client.patch(
            f"{self.user_registered_apps_url}{self.marketplace_app.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_patch_registered_apps(self):
        data = {
            "name": "some app",
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.patch(
            f"{self.user_registered_apps_url}{self.marketplace_app.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # delete
    def test_user_cannot_delete_registered_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.delete(
            f"{self.user_registered_apps_url}{self.marketplace_app.id}/"
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_registered_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.delete(
            f"{self.user_registered_apps_url}{self.marketplace_app.id}/"
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unknown_cannot_delete_registered_apps(self):
        response = self.client.delete(
            f"{self.user_registered_apps_url}{self.marketplace_app.id}/"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
