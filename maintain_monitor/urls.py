from django.urls import path

from .views import maintain_monitor_info

app_name ="maintain_monitor"

urlpatterns = [
	path("maintain-monitor-info/",maintain_monitor_info.as_view(),name="maintain_monitor_info"),

]