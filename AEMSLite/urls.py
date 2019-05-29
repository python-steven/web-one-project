"""AEMSLite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("index/",include("app.index.urls")),
    path("login/",include("app.login.urls")),
    path("management/",include("app.management.urls")),
    path("analysis/",include("app.analysis.urls")),
    path("maintain/",include("app.maintain.urls")),
    path("maintain_monitor/",include("app.maintain_monitor.urls")),
    path("NGrate/",include("app.NGrate.urls")),
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

urlpatterns = urlpatterns+static(settings.MEDIA_CHANGE_URL,document_root=settings.MEDIA_CHANGE_ROOT)
urlpatterns = urlpatterns+static(settings.MEDIA_MONITOR_URL,document_root=settings.MEDIA_MONITOR_ROOT)