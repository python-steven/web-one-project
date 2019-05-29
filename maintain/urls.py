from django.urls import path

from .views import maintain_equipment_info,maintain_setup_info,maintain_setup_by_pn\
	,maintain_query_part_name_data,maintain_record,maintain_query_operation\
	,maintain_query_maintain

app_name ="maintain"

urlpatterns = [
	path("maintain-equipment-info/",maintain_equipment_info.as_view(),name="maintain_equipment_info"),
	path("maintain-setup-info/",maintain_setup_info,name="maintain_setup_info"),
	path("maintain-setup-by-pn/",maintain_setup_by_pn,name="maintain_setup_by_pn"),
	path("maintain-query-partname-data/",maintain_query_part_name_data,name="maintain_query_part_name_data"),
	path("maintain-record/",maintain_record,name="maintain_record"),
	path("maintain-query-operation/",maintain_query_operation,name="maintain_query_operation"),
	path("maintain-query-maintain/",maintain_query_maintain,name="maintain_query_maintain"),
]
