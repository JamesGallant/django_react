from . import config

def frontend_url(request):
    return {'djoser_frontend_url': config.develop_configuration.get("frontend_url") }