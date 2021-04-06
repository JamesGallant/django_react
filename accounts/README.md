# Accounts documentation

## Testing

Testing is important for every code base. In this boilerplate tests should be written for models and views. Since Django
and DRF is well tested we don't need to test their internal processes. The exception is when internal functions are
changed for specific needs. In this case it is important to test the new implementation. How these are implemented is 
ultimately up to the user but I feel Django lends its self nicely to test-driven development. 

To run tests start the containers and run the following:
```
docker-compose run --rm backend_accounts python src/manage.py test src/users/tests
```

## API endpoints
Base URL: `/api/v1`

|Endpoint          |HTTP Method | CRUD Method  | Result             | Permission      |
|------------------|------------|--------------|--------------------|-----------------|
|users/            | GET        | READ         | Get all users      | Admin           |
|users/:id         | GET        | READ         | Get single user    | User & Admin    |
|users/:id         | PUT        | UPDATE       | Update single user | User & Admin    |
|users/:id         | DELETE     | DELETE       | Delete single user | User & Admin    |
|users/create_user/|POST        | CREATE       | Create new user    | Any             |