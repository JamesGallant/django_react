import os
import json

from django.contrib.auth import get_user_model
from django.core import mail

from rest_framework import status
from rest_framework.test import APIClient, APITestCase


"""
Internal testing for the djoser authentications. https://djoser.readthedocs.io/en/latest/introduction.html
Since security is essential we will test these even if djoser has internal testing, if something fails we can fix
internally. 

Tests to implement
 - test account creation : included
 - test login/logout : included
 - deleting account : included
 - updating account : 
 - authorisations : included
 - email verification: included
"""


class TestDjoserAccountCreation(APITestCase):
    """
    Testing djoser implementation for account creation

    Tests:
     - create account
     - delete account

    """

    def setUp(self) -> None:
        """
        Set up testing environment
        :return: None
        """
        # administrative
        self.client = APIClient()
        self.base_url = f"http://localhost:{os.environ.get('BACKEND_ACCOUNTS_EXPOSED', None)}/api/v1/auth"

        # dummy accounts
        self.valid_payload = {
            "first_name": "testuser3_firstname",
            "last_name": "testuser3_lastname",
            "email": "testuser3@testuser.com",
            "mobile_number": '+31111111114',
            "password": '@VeryHardPassword123'
        }
        # same email and mobile, both these fields should error out
        self.invalid_payload_samedetails = {
            "first_name": "testuser4_firstname",
            "last_name": "testuser4_lastname",
            "email": "testuser3@testuser.com",
            "mobile_number": '+31111111114',
            "password": '@VeryHardPassword123'
        }

        self.invalid_payload_easypw = {
            "first_name": "testuser5_firstname",
            "last_name": "testuser5_lastname",
            "email": "testuser5@testuser.com",
            "mobile_number": '+31111111115',
            "password": 'secret'
        }

        self.invalid_payload_noRequiredData = {
            "first_name": "testuser5_firstname",
            "last_name": "testuser5_lastname",
            "email": "",
            "mobile_number": '',
            "password": 'secret'
        }

    def test_create_account(self) -> None:
        """
        Tests post request for creating new users at url: /api/vx/auth/users.
        To see details of errors: run this in the test print(response.data)

        tests:
         - valid account: included
         - no duplicate accounts with mobile or email: included
         - no easy passwords: included
         - no required data: included
         - email verification -> not implemented, is_active needs to be False : not included
        :return:
        """

        url = f"{self.base_url}/users/"

        # clients
        response_valid = self.client.post(url,
                                          data=json.dumps(self.valid_payload),
                                          content_type='application/json')

        response_same_details = self.client.post(url,
                                                 data=json.dumps(self.invalid_payload_samedetails),
                                                 content_type='application/json')

        response_easy_pw = self.client.post(url,
                                            data=json.dumps(self.invalid_payload_samedetails),
                                            content_type='application/json')

        response_no_data = self.client.post(url,
                                            data=json.dumps(self.invalid_payload_noRequiredData),
                                            content_type='application/json')

        # tests
        ## valid user
        self.assertEqual(response_valid.status_code, status.HTTP_201_CREATED)

        ## same account
        self.assertEqual(response_same_details.status_code, status.HTTP_400_BAD_REQUEST)

        ## easy password
        self.assertEqual(response_easy_pw.status_code, status.HTTP_400_BAD_REQUEST)

        ## missing data
        self.assertEqual(response_no_data.status_code, status.HTTP_400_BAD_REQUEST)


class TestDjoserLoginLogout(APITestCase):
    """
    Testing djoser implementation for login and logout of accounts
    djoser: https://djoser.readthedocs.io/en/latest/introduction.html

    Token url /api/v1/auth/token/login
    Tests:
     - cannot access data if not logged in: included
     - Create token and login : included
     - logout of account: Included
     - cannot access data if logged out: Included
    """

    def setUp(self) -> None:
        """
        sets up the testing environment with user accounts
        :return None:
        """
        self.client = APIClient()
        self.user_model = get_user_model()
        self.base_url = f"http://localhost:{os.environ.get('BACKEND_ACCOUNTS_EXPOSED', None)}/api/v1/auth"
        self.user_data_url = f"{self.base_url}/users/me/"
        self.login_url = f"{self.base_url}/token/login/"
        self.logout_url = f"{self.base_url}/token/logout/"

        # user accounts
        self.user_model.objects.create_user(
            first_name="regular_user_fn",
            last_name="regular_user_ln",
            email="regular_user@email.com",
            mobile_number='+31111111112',
            password='secret'
        )
        self.valid_login = {
            'email': "regular_user@email.com",
            'password': "secret",
        }

    def test_login(self) -> None:
        """
        Users should be able to login with a token. Tokens are generated by visiting a url and providing username and
        password. To login the token must be in the header.
        :return None:
        """
        # no token
        response_not_logged_in = self.client.get(self.user_data_url)

        token_url = self.client.post(self.login_url,
                                     data=json.dumps(self.valid_login),
                                     content_type='application/json'
                                     )

        # login with token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token_url.data.get('auth_token'))
        response_logged_in = self.client.get(self.user_data_url)
        response_logged_out = self.client.post(self.logout_url)
        self.client.credentials()

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token_url.data.get('auth_token'))
        response_logged_out_nocred = self.client.get(self.user_data_url)
        self.client.credentials()

        # tests
        ## not logged in
        self.assertEqual(response_not_logged_in.status_code, status.HTTP_401_UNAUTHORIZED)

        ## logged in
        self.assertEqual(response_logged_in.status_code, status.HTTP_200_OK)

        ## logged out
        self.assertEqual(response_logged_out.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response_logged_out_nocred.status_code, status.HTTP_401_UNAUTHORIZED)


class TestDjoserAccountDelete(APITestCase):
    """
    Testing deletion of created accounts. Users should login with a token and be able to delete the account

    tests:
     - authorised delete : included
     - unauthorised delete : included
     - account is inaccessible : included
    """

    def setUp(self) -> None:
        self.user_model = get_user_model()
        self.client = APIClient()
        self.base_url = f"http://localhost:{os.environ.get('BACKEND_ACCOUNTS_EXPOSED', None)}/api/v1/auth"
        self.user_data_url = f"{self.base_url}/users/me/"
        self.login_url = f"{self.base_url}/token/login/"

        self.user_model.objects.create_user(
            first_name="regular_user_fn",
            last_name="regular_user_ln",
            email="regular_user@email.com",
            mobile_number='+31111111112',
            password='secret'
        )

        self.hostile = self.user_model.objects.create_user(
            first_name="hostile_user_fn",
            last_name="hostile_user_fn",
            email="hostile_user@email.com",
            mobile_number='+31111111113',
            password='secret'
        )

        self.user_model.objects.create_superuser(
            first_name="superuser_fn",
            last_name="superuser_ln",
            email="superuser@testuser.com",
            mobile_number='+31111111111',
            password='secret'
        )

        self.reguser_login = {
            'email': "regular_user@email.com",
            'password': "secret",
        }

        self.admin_login = {
            'email': "superuser@testuser.com",
            'password': "secret",
        }

    def test_delete_accout(self) -> None:
        """
        delete account by user or admin, must be logged in
        :return: None
        """
        response_notloggedin_delete = self.client.delete(self.user_data_url)

        token_user = self.client.post(self.login_url,
                                      data=json.dumps(self.reguser_login),
                                      content_type='application/json'
                                      )

        token_admin = self.client.post(self.login_url,
                                       data=json.dumps(self.admin_login),
                                       content_type='application/json'
                                       )

        # login and delete accounts
        ## user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token_user.data.get('auth_token'))
        response_user_delete_badpwd = self.client.delete(self.user_data_url,
                                                         data=json.dumps({"current_password": "bad"}),
                                                         content_type="application/json")
        response_user_delete = self.client.delete(self.user_data_url,
                                                  data=json.dumps({"current_password": "secret"}),
                                                  content_type="application/json")
        self.client.credentials()

        ## admin deleting a user by :id
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token_admin.data.get('auth_token'))
        response_admin_delete = self.client.delete(f"{self.base_url}/users/{self.hostile.id}/",
                                                   data=json.dumps({"current_password": "secret"}),
                                                   content_type="application/json")

        self.client.credentials()

        # tests
        ## unauthorised delete
        self.assertEqual(response_notloggedin_delete.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response_user_delete_badpwd.status_code, status.HTTP_400_BAD_REQUEST)

        ## user delete
        self.assertEqual(response_user_delete.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response_admin_delete.status_code, status.HTTP_204_NO_CONTENT)


class TestEmailVerification(APITestCase):
    """
    Test email verification, users creating an account should recieve an email with a token and a ID. The email
    should contain a token and a user id.

    tests:
     - email sent: included
     - token can be retrieved via link: included
     - account is set as active when link is clicked: included
     - account exists:
    """

    def setUp(self) -> None:
        self.User_model = get_user_model()
        self.client = APIClient()
        self.base_url = f"http://localhost:{os.environ.get('BACKEND_ACCOUNTS_EXPOSED', None)}/api/v1/auth"
        self.valid_payload = {
            "first_name": "testuser3_firstname",
            "last_name": "testuser3_lastname",
            "email": "testuser3@testuser.com",
            "mobile_number": '+31111111114',
            "password": '@VeryHardPassword123'
        }

    def test_email(self):
        response_register_user = self.client.post(f"{self.base_url}/users/", data=json.dumps(self.valid_payload),
                                                  content_type='application/json')

        user_not_active = self.User_model.objects.get(pk=response_register_user.data.get('id'))

        uid, token = [str(lines) for lines in mail.outbox[0].body.splitlines() if "auth/activate/" in lines][0].split("/")[-2:] 

        data = {'uid': uid,
                'token': token}

        response_activate_user = self.client.post(f"{self.base_url}/users/activation/",
                                                  data=json.dumps(data),
                                                  content_type='application/json')

        user_active = self.User_model.objects.get(pk=response_register_user.data.get('id'))

        response_user_is_active = self.client.post(f"{self.base_url}/users/activation/",
                                                  data=json.dumps(data),
                                                  content_type='application/json')



        # tests
        ## new account pending
        self.assertEqual(response_register_user.status_code, status.HTTP_201_CREATED)
        self.assertFalse(user_not_active.is_active)

        ## single mail sent
        self.assertEqual(len(mail.outbox), 1)

        ## account created
        self.assertEqual(response_activate_user.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(user_active.is_active)

        ## user is active, clicked link twice
        self.assertEqual(response_user_is_active.status_code, status.HTTP_403_FORBIDDEN)



class TestDjoserAccountChange(APITestCase):
    """
    Tests changing the email address or the password. The rest of the data can be changed by put requests

    tests:
     - user can change username
     - user can change password
     - admin can change username
     - admin can change password
    """
    pass


class TestDjoserAuth(APITestCase):
    """
    Testing the authentication and security of endpoints with a administrative user, regular user and hostile user.
    Hostile user should not be able to alter, view or delete account data. Authentication tests should be added here
    as more features are tested internally.


    Tests:
        - anonymous cannot view users or me : included
        - superuser can view users, me, id : included
        - user cannot view users, only me : included
        - Hostile cannot view base users : included
        - Hostile cannot view account by primary key : included
        - Hostile cannot delete account by primary key : included
        - Hostile cannot alter account by primary key : included
        - Hostile cannot change username of another:
        - Hostile cannot change password of another:
    """

    def setUp(self) -> None:
        self.user_model = get_user_model()
        self.client = APIClient()
        self.base_url = f"http://localhost:{os.environ.get('BACKEND_ACCOUNTS_EXPOSED', None)}/api/v1/auth"
        self.users_url = f"{self.base_url}/users/"
        self.login_url = f"{self.base_url}/token/login/"

        self.user = self.user_model.objects.create_user(
            first_name="regular_user_fn",
            last_name="regular_user_ln",
            email="regular_user@email.com",
            mobile_number='+31111111112',
            password='secret'
        )

        self.hostile = self.user_model.objects.create_user(
            first_name="hostile_user_fn",
            last_name="hostile_user_fn",
            email="hostile_user@email.com",
            mobile_number='+31111111113',
            password='secret'
        )

        self.admin = self.user_model.objects.create_superuser(
            first_name="superuser_fn",
            last_name="superuser_ln",
            email="superuser@testuser.com",
            mobile_number='+31111111111',
            password='secret'
        )

        self.reguser_login = {
            'email': "regular_user@email.com",
            'password': "secret",
        }

        self.hostile_login = {
            'email': "hostile_user@email.com",
            'password': "secret",
        }

        self.admin_login = {
            'email': "superuser@testuser.com",
            'password': "secret",
        }

        self.token_user = self.client.post(self.login_url,
                                           data=json.dumps(self.reguser_login),
                                           content_type='application/json'
                                           )

        self.token_hostile = self.client.post(self.login_url,
                                              data=json.dumps(self.hostile_login),
                                              content_type='application/json'
                                              )

        self.token_admin = self.client.post(self.login_url,
                                            data=json.dumps(self.admin_login),
                                            content_type='application/json'
                                            )

        self.hostile_payload = {
            "first_name": "hostile",
            "last_name": "hostile",
            "mobile_number": '+31111111118',
        }

    def test_unauthorised_usersView(self) -> None:
        """
        Only admin can see all users, regular users and anonymous users cannot. A hostile user will try and access
        unauthorised end points. Only :id is available
        :return:
        """
        # anonymous
        response_anon_users = self.client.get(f"{self.users_url}")
        response_anon_me = self.client.get(f"{self.users_url}me/")
        response_anon_id = self.client.get(f"{self.users_url}{self.admin.id}/")

        # superuser
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_admin.data.get('auth_token'))
        response_admin_users = self.client.get(self.users_url)
        response_admin_me = self.client.get(f"{self.users_url}me/")
        response_admin_id = self.client.get(f"{self.users_url}{self.hostile.id}/")
        self.client.credentials()

        # regular user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_user.data.get('auth_token'))
        response_user_users = self.client.get(self.users_url)
        response_user_me = self.client.get(f"{self.users_url}me/")
        response_user_id = self.client.get(f"{self.users_url}{self.user.id}/")
        self.client.credentials()

        # hostile user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_hostile.data.get('auth_token'))
        response_hostile_id = self.client.get(f"{self.users_url}{self.user.id}/")
        self.client.credentials()

        # tests
        ## anon
        self.assertEqual(response_anon_users.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response_anon_me.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response_anon_id.status_code, status.HTTP_401_UNAUTHORIZED)

        ## superuser
        self.assertEqual(response_admin_users.status_code, status.HTTP_200_OK)
        self.assertEqual(response_admin_me.status_code, status.HTTP_200_OK)
        self.assertEqual(response_admin_id.status_code, status.HTTP_200_OK)

        ## regular user
        self.assertEqual(response_user_users.status_code, status.HTTP_200_OK)
        self.assertEqual(response_user_users.data[0].get('first_name'), self.user.first_name)

        self.assertEqual(response_user_me.status_code, status.HTTP_200_OK)
        self.assertEqual(response_user_me.data.get('first_name'), self.user.first_name)

        self.assertEqual(response_user_id.status_code, status.HTTP_200_OK)
        self.assertEqual(response_user_id.data.get('first_name'), self.user.first_name)

        ## hostile user
        self.assertEqual(response_hostile_id.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_put(self) -> None:
        """
        hostile user cannot delete other accounts
        :return:
        """
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_hostile.data.get('auth_token'))
        response_hostile_delete = self.client.delete(f"{self.users_url}{self.admin.id}/",
                                                     data=json.dumps({"current_password": "secret"}),
                                                     content_type="application/json")

        response_hostile_put = self.client.put(f"{self.users_url}{self.admin.id}/",
                                               data=json.dumps(self.hostile_payload),
                                               content_type="application/json")
        self.client.credentials()

        self.assertEqual(response_hostile_delete.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_hostile_put.status_code, status.HTTP_404_NOT_FOUND)
