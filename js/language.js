var configData={
    //登录页面
    "title":['登录','Login'],
    "nickName":['用户名','User Name'],
    "email":['邮箱','Email'],
    "password":['密码','Password'],
    "Remember":['记住密码','Remember me'],

    //侧栏
    "Budget":['预算编码','Budget coding'],
    "Statistics":['统计分析','Statistical analysis'],
    "Equipment":['设备保养','Equipment maintenance'],
    "System":['系统管理','System management'],

    //预算编码页面
    "Application":['预算表单申请','Form application'],
    "Sign-off":['预算表单签核','Sign-off'],
    "MySign-off":['我签核过的预算编码单','My Signed-off'],
    "Report":['报表','Report'],

    //通用
    "Operate":['操作','Operate'],
    "Detail":['开单状况','Detail'],
    "Department":['开单部门','Department'],
    "Date":['申请日期','Date'],
    "InCharge":['负责人','Charge by'],
    "Equipments":['设备名称','Equipments'],
    "SignedOne":['签核人','Signed by'],
    "Status":['表单状态','Status'],
    "Code":['预算编码','Code'],
    "CombinedForm":['合并开单','Combine Form'],
    "SingleForm":['单独开单','Single Form'],
    "AddForm":['填写预算编码单','Add'],

    //系统管理
    "UserManage":['用户管理','Users'],
    "CustomerManage":['客户管理','Customers'],
    "DepartmentManage":['部门管理','Departments'],
    "StaffNumber":['员工工号','Number'],
    "StaffName":['员工名称','Name'],
    "StaffDepartment":['员工部门','Department'],
    "StaffEmail":['邮箱','Email'],
    "Level":['角色','Level'],
    "AddUser":['添加用户','Add'],
    "AddCustomer":['添加客户','Add'],
    "AddDepartment":['添加部门','Add'],

};

function language(obj){
   var index=obj.value;
   $(".lng").each(function() {
       var _this=$(this);
       _this.html(configData[_this.data("name")][index]);
   })
}