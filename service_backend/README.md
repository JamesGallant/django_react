# Accounts documentation
<!-- badges: start -->
[![.github/workflows/service_backend_test.yml](https://github.com/JamesGallant/django_react/actions/workflows/service_backend_test.yml/badge.svg)](https://github.com/JamesGallant/django_react/actions/workflows/service_backend_test.yml)
<!-- badges: stop -->
# To Do
 - Email no longer available
 - phone verification
 - phone verification
 - production enviornment
 - further documentation

# Introduction
The accounts service handles authentication mediated by the [djoser](https://djoser.readthedocs.io/en/latest/introduction.html)
package. At this time the infrastructure to do both JSON Web token, token based and social OAUTH is present but only token
based is currently implemented.  

On first launch

make migrations
```
docker compose run --rm service_backend python src/manage.py makemigrations app_accounts
```

migrate
```
docker compose run --rm service_backend python src/manage.py migrate
```

create super user
```
docker compose run --rm service_backend python src/manage.py createsuperuser
```

test
```
docker compose run --rm service_backend python src/manage.py test
```
## Testing
Testing is done on custom implementations of models and views. However, since this is the security layer of the application
tests will be written for djoser views as well to be sure that access is granted or rejected as required by the authenitcation
needs. In this case its better to be safe than sorry.

To run tests start the containers and run the following:
```
docker-compose run --rm backend_accounts python src/manage.py test app_accounts/tests
```

## Custom User Model
Djoser allows to easily switch the default model to an email login. However I find implementing this manually 
gives more control over how this model behaves and requires little effort and allows for additional fields. The 
custom user model abstracts from the [default](https://docs.djangoproject.com/en/3.1/ref/contrib/auth/) user model. 

    
## API endpoints
The API endpoints for authorisation is derived from djoser under a base API route. Users should be able to create
accounts and delete their own data while admin has access over all data. As more features are added expand on the
table

Base URL: `api/v1/auth/`

|Endpoint                                   | HTTP Method | CRUD Method  | Result               | Permission      | Service |
|-------------------------------------------|------------|--------------|----------------------|-----------------|----------|
|users/                                     | GET        | READ         | Get all users        | Admin           | Accounts |
|users/                                     | POST       | CREATE       | Create new user      | Any             | Accounts |
|users/:id/                                 | GET        | READ         | Get user by id       | User & Admin    | Accounts |
|users/me/                                  | GET        | READ         | Get user instance    | User            | Accounts |
|users/me/                                  | PUT        | UPDATE       | Change user instance | User            | Accounts |
|users/me/                                  | DELETE     | UPDATE       | Delete user instance | User            | Accounts |
|users/reset_password/                      | POST       | READ         | Resets password      | User            | Accounts |
|users/reset_email/                         | POST       | READ         | Resets username      | User            | Accounts |
|reset/username/:uid/:token/           | POST       | READ         | changes username     | User            | Email    |
|reset/password/:uid/:token/           | POST       | READ         | changes password     | User            | Email    |
|activate/:uid/:token/                 | POST       | READ         | Activates user       | User            | Email    |
|users/activation/:uid/:token/              | POST       | UPDATE       | Activates user       | User            | Frontend |
|users/reset_email_confirm/                 | POST       | READ         | changes email        | User            | Frontend |
|users/reset_password_confirm/              | POST       | READ         | changes password     | User            | Frontend |
|token/login/                               | POST       | CREATE       | User login           | User            | Accounts |
|token/logout/                              | POST       | READ         | User logout          | User            | Accounts |

## Account Creation
Users can create accounts with post requests containing the required data in json format to `ACCOUNTS/users/`. This triggers an 
email to be sent to the users inbox with a activation link. The users email must be verified before it will be entered 
into the database. Email verification is useful for securing the authenticity of an email address. The data is parsed 
using [djoser](https://djoser.readthedocs.io/en/latest/settings.html#send-activation-email). The link redirects to the 
frontend which is configured by the environmental variable `DJOSER_FRONTEND_URL` along with a token and a user identifier
which is passed as  `FRONTEND/users/activation/:uid/:token/`. The frontend service must extract the uid and token use a post request
to the backend `ACCOUNTS/users/activation/:uid/:token/` with the uid and token as payloads from the frontend. This will set
the users account to active `user.is_active=True` 

Developer mode uses mailhog as the development server. For more info on mailhog have a look [here](https://github.com/mailhog/MailHog). 

### Workflow
 - users sign into account
 - user id and token is generated and in a url to their email
 - user clicks this url and is directed to a front end
 - front end extracts user id and token from url
 - front end sends a post request to backend `/api/v1/auth/users/activation/` with the uid and token
 - account is activated
 
 Email templates can be customised using JINJA and is found in the directory `accounts/src/templates/activation_email.py`
 
 The email link is directed using the `DJOSER_FRONTEND_URL` in the environment file. To change it, see the 
 context_processors.py file in `src/accounts/context_processors.py`. 
 
 Frontend needs to handle the following cases
 - email verification page
 - link clicked twice
 - check if is_active is True

## Login/Logout

Users can login or logout to their accounts with tokens. The frontend posts a request to `BACKEND/token/login/` with
the users email and password as a json payload. This will return a token that should be stored as a cookie. Logouts will
stop the token from being valid and a new token is required. The frontend can access the logout logic with 
`BACKEND/token/logout/`

## Account data

User data can be altered using get, put, delete requests to the backend api endpoint `BACKEND/users/me/`. Get requests
returns data associated with the user, put requests can alter unprotected user data such as first name, last name and mobile.
A user can delete their account using a delete request to the same API endpoint.

## Reset username

Users can reset their email, which acts as their username but their current email must be active. A post request is sent 
to the backend API endpoint `BACKEND/users/reset_email/`. This will send an email to the users registered email adress or 
return an error if the email is not in the database. Any email can be entered but the user will need to have access to the inbox. 
The email contains a link that redirects to the frontend, defined by the environmental variable `DJOSER_FRONTEND_URL` with
a token and a user id with the following API endpoint `FRONTEND/auth/reset/username/:uid/:token/`. The frontend must
extract this user id and the token and send this data as a post request back to the backend `BACKEND/users/reset_email_confirm/`
as a json payload. This will reset the users email adress and the frontend should log the user out. 

## Reset password

Similiar to email, users can reset their password using confirmation links. A post request is sent to the backend API 
endpoint `BACKEND/users/reset_password/` This will send an email to the users registered email adress or 
return an error if the email is not in the database. Any email can be entered but the user will need to have access to 
the inbox. The email contains a link that redirects to the frontend, defined by the environmental variable 
`DJOSER_FRONTEND_URL` with a token and a user id with the following API endpoint 
`FRONTEND/auth/reset/password/:uid/:token/`. The frontend must extract this user id and the token and send this data as
a post request back to the backend `BACKEND/users/reset_email_confirm/` as a json payload. This will reset the users 
password and the frontend should log the user out. 
