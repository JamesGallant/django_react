from rest_framework import status
from rest_framework.test import APIClient, APITestCase, APITransactionTestCase
from django.contrib.auth import get_user_model
from faker import Faker
import json
from django.utils.timezone import datetime, timedelta
from service_backend.config import develop_configuration
from ..models import UserOwnedApplications, MarketplaceApplications


class TestUserOwnedApplication(APITestCase):
    @classmethod
    def setUp(self) -> None:
        self.base_url = f"http://{develop_configuration.get('service_backend')}/api/v1"
        self.user_apps_url = f"{self.base_url}/apps/user-owned/"

        self.client = APIClient()
        self.fake = Faker()

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

        self.marketplace_app = MarketplaceApplications.objects.create(
            name=self.fake.name(),
            card_description=self.fake.sentence(nb_words=2),
            full_description=self.fake.sentence(),
            demo_app_description=self.fake.sentence(nb_words=2),
            basic_app_description=self.fake.sentence(nb_words=2),
            premium_app_description=self.fake.sentence(nb_words=2),
            basic_cost=10.00,
            premium_cost=100.00,
            subscription_type="BASIC",
            url="/",
            disabled=False,
        )

        self.user_app1 = UserOwnedApplications.objects.create(
            app=self.marketplace_app,
            user=self.user,
            activation_date=datetime.today().date(),
            expiration_date=datetime.today().date() + timedelta(days=1),
        )

        self.user_app2 = UserOwnedApplications.objects.create(
            app=self.marketplace_app,
            user=self.user2,
            activation_date=datetime.today().date(),
            expiration_date=datetime.today().date() + timedelta(days=1),
        )

        self.user_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({"email": self.user.email, "password": "secret"}),
            content_type="application/json",
        )

        self.user2_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({"email": self.user2.email, "password": "secret"}),
            content_type="application/json",
        )

        self.superuser_token = self.client.post(
            f"{self.base_url}/auth/token/login/",
            data=json.dumps({"email": self.superuser.email, "password": "secret"}),
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
        response = self.client.get(f"{self.user_apps_url}{self.user_app1.id}/")

        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_get_other_user_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.get(f"{self.user_apps_url}{self.user_app2.id}/")
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unknown_user_cannot_get_apps(self):
        response = self.client.get(self.user_apps_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unknown_user_cannot_get_specific_apps(self):
        response = self.client.get(f"{self.user_apps_url}{self.user_app1.id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_get_all_user_owned_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.get(self.user_apps_url)
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_admin_can_get_other_user_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.get(f"{self.user_apps_url}{self.user_app1.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # post
    def test_user_can_create_owned_apps(self):
        test_app = MarketplaceApplications.objects.create(
            name=self.fake.name(),
            card_description=self.fake.sentence(nb_words=2),
            full_description=self.fake.sentence(),
            demo_app_description=self.fake.sentence(nb_words=2),
            basic_app_description=self.fake.sentence(nb_words=2),
            premium_app_description=self.fake.sentence(nb_words=2),
            basic_cost=10.00,
            premium_cost=100.00,
            subscription_type="BASIC",
            url="/",
            disabled=False,
        )

        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_apps_url, data=json.dumps(data), content_type="application/json"
        )
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_cannot_create_app_twice(self):
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": self.marketplace_app.id,
            "user": self.user.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_apps_url, data=json.dumps(data), content_type="application/json"
        )
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_create_app_for_other_user(self):
        test_app = MarketplaceApplications.objects.create(
            name=self.fake.name(),
            card_description=self.fake.sentence(nb_words=2),
            full_description=self.fake.sentence(),
            demo_app_description=self.fake.sentence(nb_words=2),
            basic_app_description=self.fake.sentence(nb_words=2),
            premium_app_description=self.fake.sentence(nb_words=2),
            basic_cost=10.00,
            premium_cost=100.00,
            subscription_type="BASIC",
            url="/",
            disabled=False,
        )
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user2.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_apps_url, data=json.dumps(data), content_type="application/json"
        )
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_create_app_for_other_user(self):
        test_app = MarketplaceApplications.objects.create(
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
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_apps_url, data=json.dumps(data), content_type="application/json"
        )

        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_unknown_cannot_create_new_owned_apps(self):
        data = {
            "name": self.fake.name(),
            "card_description": self.fake.sentence(nb_words=5),
            "full_description": self.fake.paragraph(nb_sentences=3),
            "base_app_description": self.fake.sentence(nb_words=5),
            "premium_app_description": self.fake.sentence(nb_words=5),
            "base_cost": 0.00,
            "premium_cost": 100.00,
            "url": "/",
            "disabled": False,
        }
        response = self.client.post(
            self.user_apps_url, data=json.dumps(data), content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_create_new_owned_apps_for_user(self):
        test_app = MarketplaceApplications.objects.create(
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
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_apps_url, data=json.dumps(data), content_type="application/json"
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invalid_expiration_date(self):
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=-1)),
            "app": self.marketplace_app.id,
            "user": self.user.id,
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.post(
            self.user_apps_url, data=json.dumps(data), content_type="application/json"
        )
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["message"], "Expiration date cannot be in the past"
        )

    # patch
    def test_user_can_patch_current_owned_apps_if_payed(self):
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.patch(
            f"{self.user_apps_url}{self.user_app1.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_patch_other_users_owned_apps(self):
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.patch(
            f"{self.user_apps_url}{self.user_app2.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unknown_cannot_patch_current_owned_apps(self):
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
        }
        response = self.client.patch(
            f"{self.user_apps_url}{self.user_app1.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_patch_current_owned_apps(self):
        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.patch(
            f"{self.user_apps_url}{self.user_app1.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cannot_patch_other_fields(self):
        test_app = MarketplaceApplications.objects.create(
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

        data = {
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "activation_date": str(datetime.today().date()),
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.patch(
            f"{self.user_apps_url}{self.user_app1.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )

        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # delete
    def test_user_can_delete_current_owned_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.delete(f"{self.user_apps_url}{self.user_app1.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cannot_delete_other_user_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.delete(f"{self.user_apps_url}{self.user_app2.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unknown_cannot_delete_user_owned_apps(self):
        response = self.client.delete(f"{self.user_apps_url}{self.user_app1.id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_delete_user_owned_apps(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.delete(f"{self.user_apps_url}{self.user_app1.id}/")
        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # puts
    def test_user_cannot_alter_app_with_puts(self):
        test_app = MarketplaceApplications.objects.create(
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

        data = {
            "id": 17,
            "activation_date": str(datetime.today().date()),
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.put(
            f"{self.user_apps_url}{self.user_app1.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unknown_cannot_alter_app_with_puts(self):
        test_app = MarketplaceApplications.objects.create(
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

        data = {
            "id": 17,
            "activation_date": str(datetime.today().date()),
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user.id,
        }
        response = self.client.put(
            f"{self.user_apps_url}{self.user_app1.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # puts
    def test_user_cannot_alter_others_app_with_puts(self):
        test_app = MarketplaceApplications.objects.create(
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

        data = {
            "id": 17,
            "activation_date": str(datetime.today().date()),
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.user_token.data.get('auth_token')}"
        )
        response = self.client.put(
            f"{self.user_apps_url}{self.user_app2.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_alter_others_app_with_puts(self):
        test_app = MarketplaceApplications.objects.create(
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

        data = {
            "id": 17,
            "activation_date": str(datetime.today().date()),
            "expiration_date": str(datetime.today().date() + timedelta(days=4)),
            "app": test_app.id,
            "user": self.user.id,
        }

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.superuser_token.data.get('auth_token')}"
        )
        response = self.client.put(
            f"{self.user_apps_url}{self.user_app1.id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.client.credentials()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
