from django.urls import path

from .views import UserData,modify_user,CustomerInfo,DepartmentInfo,del_user,modify_password\
    ,modify_customer,del_customer,delete_department,modify_department

app_name ="management"

urlpatterns = [
	path("user-data/",UserData.as_view(),name="UserData"),
	path("user-modify/",modify_user,name="modify_user"),
	path("user-delete/",del_user,name="del_user"),
	path("password-modify/",modify_password,name="modify_password"),
	path("Customer-Info/",CustomerInfo.as_view(),name="CustomerInfo"),
	path("Customer-modify/",modify_customer,name="modify_customer"),
	path("Customer-delete/",del_customer,name="del_customer"),
	path("Department-Info/",DepartmentInfo.as_view(),name="DepartmentInfo"),
	path("Department-modify/",modify_department,name="modify_department"),
	path("Department-delete/",delete_department,name="delete_department"),
]
