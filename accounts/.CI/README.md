# Introduction

This is the docker-compose file used in CI/CD for github actions

## Example of a docker-compose for CI
```yaml
name: Test
on:
  pull_request:
  push: { branches: master }

jobs:
  test:
    name: Run test suite
    runs-on: ubuntu-latest
    env:
      COMPOSE_FILE: .ci/docker-compose.yml
      DOCKER_USER: ${{ secrets.DOCKER_USER }}
      DOCKER_PASS: ${{ secrets.DOCKER_PASS }}

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Create env file
            run: |
              touch .env
              echo API_ENDPOINT="https://xxx.execute-api.us-west-2.amazonaws.com" >> .env
              echo API_KEY=${{ secrets.API_KEY }} >> .env
              cat .env

    - name: Build docker images
      run: docker-compose build

    - name: Run tests
      run: docker-compose run test
```