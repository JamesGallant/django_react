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
        self.invalid_pk = 100

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

        self.user3 = self.user_model.objects.create_user(
            first_name="testuser3_firstname",
            last_name="testuser3_lastname",
            email="testuser3@testuser.com",
            mobile_number='+31111111113',
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
        response_user_invalid = self.client.get(reverse('detail_users', kwargs={'pk': self.user2.pk}))
        self.client.logout()

        self.client.login(username='testuser1@testuser.com', password='password')
        response_user_valid = self.client.get(reverse('detail_users', kwargs={'pk': self.user1.pk}))
        self.client.logout()

        self.assertEqual(response_anon.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_user_invalid.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_superuser.status_code, status.HTTP_200_OK)
        self.assertEqual(response_user_valid.status_code, status.HTTP_200_OK)

    def test_put_request(self) -> None:
        """
        testing put request on user accounts
        Users and admin can update their data, outside users cannot.
        Validate the following:
            - cannot access unauthorised data: check
            - No user available: check
            - valid mobile number: check
            - valid password: check
            - valid hash: check:
            - unique email
            - can login after changing email and password
        :return:
        """
        # data
        valid_edit_names = {
            "first_name": "user1_newfirsname",
            "last_name": "user1_newlastname",
            "email": "testuser1@testuser.com",
            "mobile_number": "+31111111111",
            "password": "password"
        }

        valid_edit_logins = {
            "first_name": "user2_firsname",
            "last_name": "user2_lastname",
            "email": "testuser2_newemail@testuser.com",
            "mobile_number": "+31111111112",
            "password": "newpassword"
        }

        invalid_edit_bademail = {
            "first_name": "user1_newfirsname",
            "last_name": "user1_newfirsname",
            "email": "testuser1testuser.",
            "mobile_number": "+31111111111",
            "password": "password"
        }

        invalid_edit_badmobile = {
            "first_name": "user1_newfirsname",
            "last_name": "user1_newfirsname",
            "email": "testuser1testuser.",
            "mobile_number": "+311",
            "password": "password"
        }

        invalid_edit_nodata = {
            "first_name": "",
            "last_name": "",
            "email": "",
            "mobile_number": "",
            "password": ""
        }

        # logins
        ## Anonymous
        response_anon = self.client.put(reverse('detail_users', kwargs={'pk': self.user1.pk}),
                                        json.dumps(valid_edit_names),
                                        content_type='application/json')

        # Normal user
        self.client.login(username='testuser1@testuser.com', password='password')
        response_user_validEdit_names = self.client.put(reverse('detail_users', kwargs={'pk': self.user1.pk}),
                                                        json.dumps(valid_edit_names),
                                                        content_type='application/json')

        response_user_otheruser = self.client.put(reverse('detail_users', kwargs={'pk': self.user2.pk}),
                                                  json.dumps(valid_edit_names),
                                                  content_type='application/json')
        self.client.logout()

        # normal user changing login details
        self.client.login(username='testuser2@testuser.com', password='password')

        response_user_validEdit_login = self.client.put(reverse('detail_users', kwargs={'pk': self.user2.pk}),
                                                        json.dumps(valid_edit_logins),
                                                        content_type='application/json')
        self.client.logout()

        # Superuser
        self.client.login(username='superuser@testuser.com', password='superuser@testuser.com')
        response_superuser_nouser = self.client.put(reverse('detail_users', kwargs={'pk': self.invalid_pk}),
                                                    json.dumps(valid_edit_names),
                                                    content_type='application/json')

        response_superuser_valid_user1 = self.client.put(reverse('detail_users', kwargs={'pk': self.user1.pk}),
                                                         json.dumps(valid_edit_names),
                                                         content_type='application/json')

        response_superuser_invalid1_user1 = self.client.put(reverse('detail_users', kwargs={'pk': self.user1.pk}),
                                                            json.dumps(invalid_edit_nodata),
                                                            content_type='application/json')

        response_superuser_invalid2_user1 = self.client.put(reverse('detail_users', kwargs={'pk': self.user1.pk}),
                                                            json.dumps(invalid_edit_bademail),
                                                            content_type='application/json')

        response_superuser_invalid3_user1 = self.client.put(reverse('detail_users', kwargs={'pk': self.user1.pk}),
                                                            json.dumps(invalid_edit_badmobile),
                                                            content_type='application/json')

        self.client.logout()

        # tests
        ## valid
        ### data can be edited
        self.assertEqual(response_superuser_valid_user1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_user_validEdit_names.status_code, status.HTTP_201_CREATED)

        ### new account details: user can login

        self.assertEqual(response_user_validEdit_login.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.client.login(username="testuser2_newemail@testuser.com", password="newpassword"))

        ## invalid
        ### non logged in user
        self.assertEqual(response_anon.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_user_otheruser.status_code, status.HTTP_403_FORBIDDEN)

        ### bad edits by superuser or validated user
        self.assertEqual(response_superuser_nouser.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_superuser_invalid1_user1.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_superuser_invalid2_user1.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_superuser_invalid3_user1.status_code, status.HTTP_400_BAD_REQUEST)

        ### Old account details cannot be accessed
        self.assertFalse(self.client.login(username='testuser2@testuser.com', password='password'))

    def test_delete_request(self) -> None:
        """
        Tests deleting users. Admin and user should be able to delete their account. Frontend must handle validating
        the handling of this request.

        tests:
            - admin can delete: check
            - user can delete his own data
            - anon cannot delete
            - user cannot delete others data
            - unable to login to the account after deletion
            - cannot delete nonexistant account
        :param request:
        :param pk:
        :return:
        """
        # anon
        response_anon = self.client.delete(reverse('detail_users', kwargs={'pk': self.user1.pk}))

        # superuser
        self.client.login(username='superuser@testuser.com', password='superuser@testuser.com')
        response_superuser = self.client.delete(reverse('detail_users', kwargs={'pk': self.user1.pk}))
        self.client.logout()

        # user
        self.client.login(username='testuser2@testuser.com', password='password')
        response_user_invalid = self.client.delete(reverse('detail_users', kwargs={'pk': self.user3.pk}))
        response_user_valid = self.client.delete(reverse('detail_users', kwargs={'pk': self.user2.pk}))
        self.client.logout()

        # tests
        ## fail
        ### anon cannot delete accounts
        self.assertEqual(response_anon.status_code, status.HTTP_403_FORBIDDEN)
        ### user cannot delete another users account
        self.assertEqual(response_user_invalid.status_code, status.HTTP_403_FORBIDDEN)

        ## pass
        ### admin can delete account
        self.assertEqual(response_superuser.status_code, status.HTTP_204_NO_CONTENT)
        ### account one no longer accessible
        self.assertFalse(self.client.login(username='testuser1@testuser.com', password='password'))
        ### attacked user can enter account
        self.assertTrue(self.client.delete(reverse('detail_users', kwargs={'pk': self.user3.pk})))
        ### user can delete own account
        self.assertEqual(response_user_valid.status_code, status.HTTP_204_NO_CONTENT)
        ### user cannot access the account that was deleted
        self.assertFalse(self.client.login(username='testuser2@testuser.com', password='password'))
