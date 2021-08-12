develop_configuration = {
	# Misc
	"debug": 1,
	"site_name": "site_name", 
	"frontend_url": "localhost:8000",
	"service_test_url": "localhost:8002",

	# Database
	"sql_engine": "django.db.backends.mysql",
	"sql_database": "service_test_db",
	"sql_port": 5433,
	"sql_test_database": "service_test_db", 

	# Email
	"email_backend": "django.core.mail.backends.smtp.EmailBackend",
	"email_host": "mailhog",
	"email_port": 1025,
}