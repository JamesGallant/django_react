from django.test import TestCase
from django.contrib.auth import get_user_model


class UserManagerTestCase(TestCase):
    def setUp(self) -> None:
        self.user_model = get_user_model()

    def test_create_user(self):
        user = self.user_model.objects.create_user(
            email="user@user.com",
            first_name="user_first",
            last_name="user_last",
            mobile_number="+31111111111",
            country="Netherlands",
            password="",
        )

        # user data stored correctly from altered model
        self.assertEqual(user.email, "user@user.com")
        self.assertEqual(user.first_name, "user_first")
        self.assertEqual(user.last_name, "user_last")
        self.assertEqual(user.country, "Netherlands")
        self.assertEqual(user.mobile_number, "+31111111111")

        # cant be none, all are required fields
        self.assertIsNotNone(user.email)
        self.assertIsNotNone(user.first_name)
        self.assertIsNotNone(user.last_name)
        self.assertIsNotNone(user.country)
        self.assertIsNotNone(user.password)
        self.assertIsNotNone(user.mobile_number)

        # these are the correct permissions, users should not be staff or superuser
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        # No username field
        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass

    def test_superuser_creation(self):
        user = self.user_model.objects.create_superuser(
            email="admin@admin.com",
            first_name="admin_first",
            last_name="admin_last",
            country="Netherlands",
            mobile_number="+31111111111",
            password="admin_password",
        )

        # super user data stored correctly from altered model
        self.assertEqual(user.email, "admin@admin.com")
        self.assertEqual(user.first_name, "admin_first")
        self.assertEqual(user.last_name, "admin_last")
        self.assertEqual(user.country, "Netherlands")
        self.assertEqual(user.mobile_number, "+31111111111")

        # cant be none, all are required fields
        self.assertIsNotNone(user.email)
        self.assertIsNotNone(user.first_name)
        self.assertIsNotNone(user.last_name)
        self.assertIsNotNone(user.password)
        self.assertIsNotNone(user.country)
        self.assertIsNotNone(user.mobile_number)

        # super user must have all permissions
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

        # no username
        self.assertIsNone(user.username)

        # Superuser must be superuser
        with self.assertRaises(ValueError):
            self.user_model.objects.create_superuser(
                email="admin@admin.com",
                first_name="admin_first",
                last_name="admin_last",
                mobile_number="+31111111111",
                country="Netherlands",
                password="admin_password",
                is_superuser=False,
            )
