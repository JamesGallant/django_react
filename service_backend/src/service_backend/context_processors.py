import os


def frontend_url(request):
    return {"djoser_frontend_url": os.environ.get("FRONTEND_URL")}
