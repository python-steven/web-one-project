function user(){
    $(".useres").removeClass("yc")
    $(".customer").addClass("yc")
    $(".partment").addClass("yc")
}

//自动触发事件报表页面
//$(function(){   
////    $("#previous_statement").parent().addClass("disabled")
//})
var page_user = {'page':'1','num':'10'}
//选择一页显示数量
$(document).ready(function(){
     $("#user_setup").change(function(){
        var page_user_number = $(this).children('option:selected').val()
        page_user['num']=page_user_number.toString()
        page_user['page'] = '1'
        if(page_user_number == 'All'){
            $("#previous_u").parent().addClass("disabled")
            $("#next_u").parent().addClass("disabled")
        }
        if(page_user_number != 'All'){
            $("#previous_u").parent().removeClass("disabled")
            $("#next_u").parent().removeClass("disabled")
        }
        if(page_user['page'] == '1'){
            $("#previous_u").parent().addClass("disabled")
        }
        manage();
     })
})
//上一页页码的转换
function previous_user(){
    if(page_user['page'] != '1' && page_user['num'] != 'All'){
        page_user['page']= (Number(page_user['page'])-1).toString()
        $("#next_u").parent().removeClass("disabled")
        manage();
    }
    if(page_user['page'] == '1'){
        $("#previous_u").parent().addClass("disabled")
    }
}
//下一页的页面转换
function next_user(){
    if(page_user['num'] != 'All'){
        page_user['page']= (Number(page_user['page'])+1).toString()
        $("#previous_u").parent().removeClass("disabled")
        manage();
    }
}

//侧边栏的click就加载获取的数据
function manage(){
    $(".user").removeClass("yc")
    $(".budget").addClass("yc")
    $(".ng").addClass("yc")
    $(".budgetform").addClass("yc")
    $(".merge").addClass("yc")
    $(".detail").addClass("yc")
    $(".maintain").addClass("yc")
    $(".statistic").addClass("yc")
    $(".modifypwd").addClass("yc")
    $(".main_monitor").addClass("yc")
    $.ajax({
        type:'GET',
        url:'/management/user-data/',
        data:page_user,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                $('#users-in-add').empty();
                data = result['data'].data
                console.log(data)
                for(var a=0; a<data.length; a++){
                  var users ="<tr>"
                        +"<td>"
                          +"<span data-toggle='modal' onclick='modify_User();' data-target='#modify-user'><img alt='Add' src='/static/images/icon_modify.gif'></span>"
                          +"<span data-toggle='modal' onclick='delete_User();' data-target='#delete-user'><img alt='Delete' src='/static/images/icon_del.gif'></span>"
                        +"</td>"
                        +"<td class='yc'>"+data[a][0]+"</td>"
                        +"<td>"+data[a][1]+"</td>"
                        +"<td>"+data[a][2]+"</td>"
                        +"<td>"+data[a][3]+"</td>"
                        +"<td>"+data[a][4]+"</td>"
                        +"<td>"+data[a][5]+"</td>"
                      +"</tr>"
                   $('#users-in-add').append(users)
                }

                data_count = result['data'].page_count
                if(page_user['page'] == '1'){
                    $("#previous_u").parent().addClass("disabled")
                }
                if(Number(page_user['page']) == data_count){
                    $("#next_u").parent().addClass("disabled")
                }
            }else{
                alert(result['message'])
                $("#next_u").parent().addClass("disabled")
            }
        }
    })
}
//IE机制问题的解决 清除之前的缓冲 代码如下
//beforeSend :function(xmlHttp){
//            xmlHttp.setRequestHeader("If-Modified-Since","0");
//            xmlHttp.setRequestHeader("Cache-Control","no-cache");
//},

//添加用户的功能
function approval(){
    var usernumber = $("#userNum").val();
    var username = $("#username").val();
    var department = $("#department").val();
    var mail = $("#email").val();
    var role = $("#Role").val();
    usernumber = usernumber.replace(/\s+/g,"");
    username = username.replace(/^\s+|\s+$/g,"");
    department = department.replace(/\s+/g,"");
    mail = mail.replace(/^\s+|\s+$/g,"");
    role = role.replace(/\s+/g,"");
    if(usernumber == ""){
        window.message.showError("employee number can not empty")
        return false;
    }
    if(username == ""){
        window.message.showError("user name can not empty")
        return false;
    }
    if(department == ""){
        window.message.showError("department can not empty")
        return false;
    }
    if(mail ==""){
        window.message.showError("mail can not empty")
        return false;
    }
    if(role ==""){
        window.message.showError("role can not empty")
        return false;
    }
    var data={
        'userid':usernumber,
        'username':username,
        'department':department,
        'mail':mail,
        'role':role,
    }
    $.ajax({
        type:'POST',
        url:'/management/user-data/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                manage();
            }else{
            window.message.showError(result['message'])
            }
        }
    })
}

//修改用户信息
function modify_user(){
    var id = $("#modifyId").val()
    var username = $("#modifyName").val()
    var department = $("#modifyPart").val()
    var role = $("#modifyRole").val()
    username = username.replace(/^\s+|\s+$/g,"")
    department = department.replace(/\s+/g,"")
    data ={
        'id':id,
        'username':username,
        'department':department,
        'role':role,
    }
    $.ajax({
        type:'POST',
        url:'/management/user-modify/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                manage();
                window.message.showSuccess(result['message'])
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//删除用户
function del_user(){
    var name = $("#deluser").text()
    data = {'name':name,}
    $.ajax({
        type:'POST',
        url:'/management/user-delete/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                manage();
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//客户管理的页面的数据的分页显示效果函数
var page_customer = {'page':'1','num':'10'}
//选择一页显示数量
$(document).ready(function(){
     $("#customer_setup").change(function(){
        var page_customer_number = $(this).children('option:selected').val()
        page_customer['num']=page_customer_number.toString()
        page_customer['page'] = '1'
        if(page_customer_number == 'All'){
            $("#previous_cu").parent().addClass("disabled")
            $("#next_cu").parent().addClass("disabled")
        }
        if(page_customer_number != 'All'){
            $("#previous_cu").parent().removeClass("disabled")
            $("#next_cu").parent().removeClass("disabled")
        }
        if(page_customer['page'] == '1'){
            $("#previous_cu").parent().addClass("disabled")
        }
        customer();
     })
})
//上一页页码的转换
function previous_customer(){
    if(page_customer['page'] != '1' && page_customer['num'] != 'All'){
        page_customer['page']= (Number(page_customer['page'])-1).toString()
        $("#next_cu").parent().removeClass("disabled")
        customer();
    }
    if(page_customer['page'] == '1'){
        $("#previous_cu").parent().addClass("disabled")
    }
}
//下一页的页面转换
function next_customer(){
    if(page_customer['num'] != 'All'){
        page_customer['page']= (Number(page_customer['page'])+1).toString()
        $("#previous_cu").parent().removeClass("disabled")
        customer();
    }
}


//客户的管理获取数据
function customer(){
    $(".customer").removeClass("yc")
    $(".useres").addClass("yc")
    $(".partment").addClass("yc")
    $.ajax({
        type:'GET',
        url:'/management/Customer-Info/',
        data:page_customer,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                $('#customer-in-add').empty();
                data = result['data'].data
                for(var a=0; a<data.length; a++){
                    var customer ='<tr>'
                      +'<td>'
                        +'<span data-toggle="modal" onclick="modify_customer();" data-target="#modify-customer"><img alt="Add" src="/static/images/icon_modify.gif"></span>'
                        +'<span data-toggle="modal" onclick="delete_customer();" data-target="#delete-customer"><img alt="Delete" src="/static/images/icon_del.gif "></span>'
                      +'</td>'
                      +'<td class="yc">'+data[a].Id+'</td>'
                      +'<td>'+data[a].Customer+'</td>'
                    +'</tr>'
                    $('#customer-in-add').append(customer)
                }

                data_count = result['data'].page_count
                if(page_customer['page'] == '1'){
                    $("#previous_cu").parent().addClass("disabled")
                }
                if(Number(page_customer['page']) >= data_count){
                    $("#next_cu").parent().addClass("disabled")
                }
            }else{
                alert(result['message'])
                $("#next_cu").parent().addClass("disabled")
            }
        }
    })
}

//客户的数据添加
function Customer_add_button(){
    var customer_val = $("#Customer_info_Add").val()
    customer_val = customer_val.replace(/\s+/g,"");
    if(customer_val == ""){
        window.message.showError("customer can not empty")
        return false;
    }
    var data ={'customer_val':customer_val,}
    $.ajax({
        type:'POST',
        url:'/management/Customer-Info/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                customer();
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//客户数据修改
function modify_cus(){
    var customer_name = $("#modifyCusName").val()
    var customer_id = $("#modifyCusId").val()
    customer_name = customer_name.replace(/\s+/g,"");
    customer_id = customer_id.replace(/\s+/g,"");
    data = {
        'customer_name':customer_name,
        'customer_id':customer_id,
    }
    $.ajax({
        type:'POST',
        url:'/management/Customer-modify/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                customer();
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//客户删除
function del_cus(){
    var del_nm = $("#delCusName").text()
    data = {'del_nm':del_nm,}
    $.ajax({
        type:'POST',
        url:'/management/Customer-delete/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                customer();
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//部门管理的页面的数据的分页显示效果函数
var page_partname = {'page':'1','num':'10'}
//选择一页显示数量
$(document).ready(function(){
     $("#setup_partname").change(function(){
        var page_partname_number = $(this).children('option:selected').val()
        page_partname['num']=page_partname_number.toString()
        page_partname['page'] = '1'
        if(page_partname_number == 'All'){
            $("#previous_p").parent().addClass("disabled")
            $("#next_p").parent().addClass("disabled")
        }
        if(page_partname_number != 'All'){
            $("#previous_p").parent().removeClass("disabled")
            $("#next_p").parent().removeClass("disabled")
        }
        if(page_partname['page'] == '1'){
            $("#previous_p").parent().addClass("disabled")
        }
        partment();
     })
})
//上一页页码的转换
function previous_partname(){
    if(page_partname['page'] != '1' && page_partname['num'] != 'All'){
        page_partname['page']= (Number(page_partname['page'])-1).toString()
        $("#next_p").parent().removeClass("disabled")
        partment();
    }
    if(page_partname['page'] == '1'){
        $("#previous_p").parent().addClass("disabled")
    }
}
//下一页的页面转换
function next_partname(){
    if(page_partname['num'] != 'All'){
        page_partname['page']= (Number(page_partname['page'])+1).toString()
        $("#previous_p").parent().removeClass("disabled")
        partment();
    }
}


//部门管理的获取数据
function partment(){
    $(".partment").removeClass("yc")
    $(".useres").addClass("yc")
    $(".customer").addClass("yc")
    $.ajax({
        type:'GET',
        url:'/management/Department-Info/',
        data:page_partname,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
    },
    success:function(result){
        if(result['code'] === 200){
            $('#department-in-add').empty();
            data = result['data'].data
            for(var a=0; a<data.length; a++){
                var department ='<tr>'
                  +'<td>'
                    +'<span data-toggle="modal" onclick="modify_department();" data-target="#modify-department"><img alt="Add" src="/static/images/icon_modify.gif"></span>'
                    +'<span data-toggle="modal" onclick="delete_department();" data-target="#delete-department"><img alt="Delete" src="/static/images/icon_del.gif "></span>'
                  +'</td>'
                  +'<td class="yc">'+data[a].Id+'</td>'
                  +'<td>'+data[a].Department+'</td>'
                +'</tr>'
                $('#department-in-add').append(department)
            }

            data_count = result['data'].page_count
            if(page_partname['page'] == '1'){
                $("#previous_p").parent().addClass("disabled")
            }
            if(Number(page_partname['page']) >= data_count){
                $("#next_p").parent().addClass("disabled")
            }
        }else{
            alert(result['message'])
            $("#next_p").parent().addClass("disabled")
        }
    }
    })
}

//部门管理添加数据
function more_department(){
    var department = $("#add_department").val();
    department = department.replace(/\s+/g,"");
    if(department == ""){
        window.message.showError("department can not empty")
        return false;
    }
    var data = {'department':department,}
    $.ajax({
        type:'POST',
        url:'/management/Department-Info/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                partment();
            }else{
            window.message.showError(result['message'])
            }
        }
    })
}

//修改部门数据
function modify_dep(){
    var modifyPartName = $("#modifyPartName").val()
    var modifyPartId = $("#modifyPartId").val()
    var data = {
        'modifyPartName':modifyPartName,
        'modifyPartId':modifyPartId,
    }
    $.ajax({
        type:'POST',
        url:'/management/Department-modify/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                partment();
            }else{
            window.message.showError(result['message'])
            }
        }
    })
}

//删除部门信息
function del_depart(){
    var delPart = $("#delPart").text()
    var data = {'delPart':delPart,}
    $.ajax({
        type:'POST',
        url:'/management/Department-delete/',
        data:data,
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
                partment();
            }else{
            window.message.showError(result['message'])
            }
        }
    })
}