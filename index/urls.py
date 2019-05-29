from django.urls import path
from .views import \
	IndexView,BudgetCodeApply,Budget_info_get,Budget_check_user,Budget_check_principal\
	,Budget_form_save,Budget_merge_order,budget_singing_info,merge_form_sub,merge_signed,merge_signed_finished\
	,merge_statement_detail,budget_modify_type,budget_delete_type,merge_rejected,budget_copy_type,statement_query\
	,budget_modify_unique,budget_code_detail,statement_bring_info,budget_detail_modify
app_name ="index"

urlpatterns = [
	path("",IndexView.as_view(),name="index"),
	path("Budget-code-apply/",BudgetCodeApply.as_view(),name="BudgetCodeApply"),#Budget-code-save/
	path("Budget-form-save/",Budget_form_save,name="Budget_form_save"),
	path("Budget-merge-order/",Budget_merge_order,name="Budget_merge_order"),
	path("maintain_monitor-modify-type/",budget_modify_type,name="budget_modify_type"),
	path("maintain_monitor-detail-modify/",budget_detail_modify,name="budget_detail_modify"),
	path("maintain_monitor-modify-unique/",budget_modify_unique,name="budget_modify_unique"),
	path("maintain_monitor-delete-type/",budget_delete_type,name="budget_delete_type"),
	path("maintain_monitor-copy-type/",budget_copy_type,name="budget_copy_type"),
	path("maintain_monitor-code-detail/",budget_code_detail,name="budget_code_detail"),

	path("merge-sub/",merge_form_sub,name="merge_form_sub"),
	path("merged-signed/",merge_signed,name="merge_signed"),
	path("merged-rejected/",merge_rejected,name="merge_rejected"),
	path("merged-signed-finished/",merge_signed_finished,name="merge_signed_finished"),
	path("merged-statement-detail/",merge_statement_detail,name="merge_statement_detail"),
	path("statement-query/",statement_query,name="statement_query"),
	path("statement-bring-info/",statement_bring_info,name="statement_bring_info"),

	path("Budget-info-get/",Budget_info_get,name="Budget_info_get"),
	path("Budget-check-user/",Budget_check_user,name="Budget_check_user"),
	path("Budget-check-principal/",Budget_check_principal,name="Budget_check_principal"),
	path("maintain_monitor-singing-info/",budget_singing_info,name="budget_singing_info"),
]
