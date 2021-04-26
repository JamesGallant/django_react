# Accounts documentation

# To Do
 - Test djoser endpoints
 - - login / logout token based
 - - change email
 - - change password
 - - forgot / reset password
 - remove current implementations
 - remove session based 
 - email and phone verification
 - testing for email and phone verification
 - production enviornment
 - further documentation

# Introduction
The accounts service handles authentication mediated by the [djoser](https://djoser.readthedocs.io/en/latest/introduction.html)
package. At this time the infrastructure to do both JSON Web token, token based and social OAUTH is present but only token
based and session based is currently implemented. For production we actually only want token based. 

## Testing
Testing is done on custom implementations of models and views. However, since this is the security layer of the application
tests will be written for djoser views as well to be sure that access is granted or rejected as required by the authenitcation
needs. In this case its better to be safe than sorry.

To run tests start the containers and run the following:
```
docker-compose run --rm backend_accounts python src/manage.py test users/tests
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

|Endpoint          |HTTP Method | CRUD Method  | Result               | Permission      |
|------------------|------------|--------------|----------------------|-----------------|
|users/            | GET        | READ         | Get all users        | Admin           |
|users/            | POST       | CREATE       | Create new user      | Any             |
|users/:id/        | GET        | READ         | Get user by id       | User & Admin    |
|users/me/         | GET        | READ         | Get user instance    | User            |
|users/me/         | PUT        | UPDATE       | Change user instance | User            |
|users/me/         | DELETE     | UPDATE       | Delete user instance | User            |
|users/activation/ | POST       | Update       | Activates user       | frontend        |   
|token/login/      | POST       | CREATE       | User login           | User            |
|token/logout/     | POST       | READ         | User logout          | User            |


## Email verification

A users email must be verified before it will be entered into the database. Email verification is useful for securing the
authenticity of an email address. The data is parsed using [djoser](https://djoser.readthedocs.io/en/latest/settings.html#send-activation-email). 

Developer mode uses mailhog as the development server. For more info on mailhog have a look [here](https://github.com/mailhog/MailHog). 

### Workflow
 - users sign into account
 - user id and token is generated and in a url to their email
 - user clicks this url and is directed to a front end
 - front end extracts user id and token from url
 - front end sends a post request to backend `/api/v1/auth/users/activation` with the uid and token
 - account is activated
 
 Email templates can be customised using JINJA and is found in the directory `accounts/src/templates/activation_email.py`
 
 The email link is directed using the `DJOSER_FRONTEND_URL` in the environment file. To change it, see the 
 context_processors.py file in `src/accounts/context_processors.py`. 


