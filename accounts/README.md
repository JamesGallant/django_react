# Accounts documentation

## Testing
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
|users/create_user/|POST        | CREATE      | Create new user    | Any              |