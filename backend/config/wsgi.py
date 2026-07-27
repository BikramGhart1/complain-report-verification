"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import platform

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# Windows-only: add GTK runtime DLL directory
if platform.system() == "Windows":
    gtk_path = r"C:\Program Files\GTK3-Runtime Win64\bin"
    if os.path.isdir(gtk_path):
        os.add_dll_directory(gtk_path)

application = get_wsgi_application()
