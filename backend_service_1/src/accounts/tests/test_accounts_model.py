from django.test import TestCase
from django.contrib.auth import get_user_model

class UserManagerTestCase(TestCase):
    def setUp(self) -> None:
        self.user = get_user_model()

    def test_user_creation(self):
        pass

    def test_superuser_creation(self):
        pass
