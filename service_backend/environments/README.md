# Environment file 

 ## Introduction 
 Environmental variables are globally used protected variables that are not saved in git. 

 ## service_backend develop vars 
|name|value|
|---|---|
|SECRET_KEY|value|
|DJANGO_ALLOWED_HOSTS|localhost 127.0.0.1 https://localhost:8000/ 127.0.0.1:8000 0.0.0.0 https://localhost:8001/|
|DEBUG| True| 
|SITE_NAME| "test site"|
|PROTOCOL|http://|
|CSRF_COOKIE_SECURE|False|
|CSRF_COOKIE_SECURE|False|
|CONN_MAX_AGE|number of seconds to maintain connection, None for permanent connection, 0 to close after request|
|FRONTEND_URL|localhost:8000|
|BACKEND_URL|localhost:8000|
|SQL_USER|admin|
|SQL_PASSWORD|admin|
|SQL_HOST|service_backend_database|
|SQL_DATABASE|service_backend_database|
|SQL_PORT|5432|
|SQL_ENGINE|django.db.backends.postgresql|
|SQL_TEST_DATABASE|test_database|
|EMAIL_BACKEND|django.core.mail.backends.smtp.EmailBackend|
|EMAIL_HOST|mailhog|
|EMAIL_PORT|1025|
|EMAIL_HOST_USER|None|
|EMAIL_HOST_PASSWORD|None|

## service_backend production vars 
|MODE|production|
|SECRET_KEY|value|
|DJANGO_ALLOWED_HOSTS|tbd|
|DEBUG| False|
|PROTOCOL|https://|
|ADMIN|[('admin', 'admin@admin.com')]|
|CSRF_COOKIE_SECURE|True|
|CSRF_COOKIE_SECURE|True|
|CON_MAX_AGE|amount in seconds to maintain a persistent connection|
|SQL_USER|database username|
|SQL_PASSWORD| db password|
|SQL_HOST|the db host url or localhost if staging|
|SQL_DATABASE|the db name|
|SQL_PORT|the port|
|SQL_ENGINE|the db type, use postgress as default| 
|EMAIL_BACKEND|The email provider |
|EMAIL_HOST|email provider url|
|EMAIL_PORT|email provider port|
|EMAIL_HOST_USER|login cred username|
|EMAIL_HOST_PASSWORD|login cred password|
|GS_BUCKET_NAME|name of gcp bucket|
|STATIC_ROOT|"."|
|DEFAULT_FILE_STORAGE|storages.backends.gcloud.GoogleCloudStorage|
|STATICFILES_STORAGE|storages.backends.gcloud.GoogleCloudStorage|
|GS_DEFAULT_ACL|publicRead|

# staging
set MODE=staging
set SECRET_KEY=
set DJANGO_ALLOWED_HOSTS=localhost https://localhost:8000/ https://localhost:8001/
set DEBUG=False
set PROTOCOL=http://
set CONN_MAX_AGE=60
set SQL_USER=<db-user-name>
set SQL_PASSWORD=<db-user-pw>
set SQL_HOST=127.0.0.1
set SQL_PORT=5432
set SQL_DATABASE=<db-name>
set SQL_ENGINE=django.db.backends.postgresql
set EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
set EMAIL_HOST=mailhog
set EMAIL_PORT=1025
set EMAIL_HOST_USER=None
set EMAIL_HOST_PASSWORD=None
set STATIC_URL=/static/




