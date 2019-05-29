from django.urls import path

from .views import MonitorEquipment,setup_parameter,monitor_query_info,visual_data


app_name ="NGrate"

urlpatterns = [
	path("monitor-equipment-info/",MonitorEquipment.as_view(),name="MonitorEquipment"),
	path("setup-parameter/",setup_parameter,name="setup_parameter"),
	path("monitor-query-info/",monitor_query_info,name="monitor_query_info"),
	path("visual-data/",visual_data,name="visual_data"),
]
