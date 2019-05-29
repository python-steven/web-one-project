//获取数据的加载main_monitor
function maintain(){
    $(".maintain").removeClass("yc")
    $(".budget").addClass("yc")
    $(".user").addClass("yc")
    $(".budgetform").addClass("yc")
    $(".merge").addClass("yc")
    $(".detail").addClass("yc")
    $(".ng").addClass("yc")
    $(".statistic").addClass("yc")
    $(".modifypwd").addClass("yc")
    $(".main_monitor").addClass("yc")
    $.ajax({
    'type':'GET',
    'data':{},
    'url':'/maintain/maintain-equipment-info/',
    success:function(result){
        if(result['code'] === 200){
            $("#maintain_tr").empty();
            maintain_data = result['data'].data
            console.log(maintain_data)
            for(var i=0; i<maintain_data.length; i++){
                if(maintain_data[i].NextCheckDate == null){
                    maintain_data[i].NextCheckDate =""
                }else{
                    maintain_data[i].NextCheckDate = (maintain_data[i].NextCheckDate).split("T")[0]
                }
                if(maintain_data[i].Maintainer == null){maintain_data[i].Maintainer = ""}
                var maintain_add = "<tr>"
                +"<td class='yc'>"+maintain_data[i].Id+"</td>"
                +"<td><span data-toggle='modal' data-target='#maintain_sn' onclick='maintain_sn($(this))'>"
                +"<img alt='Add' src='/static/images/icon_modify.gif' style='padding-right:10px;'></span></td>"
                +"<td>"+maintain_data[i].SN+"</td>"
                +"<td>"+maintain_data[i].PartName+"</td>"
                +"<td>"+maintain_data[i].CheckCycleCount+"</td>"
                +"<td>"+maintain_data[i].UsedTimes+"</td>"
                +"<td>"+maintain_data[i].CheckCycle+"</td>"
                +"<td>"+maintain_data[i].NextCheckDate+"</td>"
                +"<td>"+maintain_data[i].Maintainer+"</td>"
                +"</tr>"
                $("#maintain_tr").append(maintain_add)
            }
        }else{
            alert(result['message'])
        }
    }
    })
}

//定义全局的查询变量
var query_information={}
//筛选功能的实现运用
function maintain_query(){
    var main_start_time = $("#maintain_start_time").val()
    var main_end_time = $("#maintain_end_time").val()
    var main_sn = $("#maintain_q_sn").val()
    var main_partname = $("#maintain_q_partname").val()
    var main_status = $("#main_query_status").val()
    var main_status = $("#maintain_q_user").val()
    if(main_start_time=="" && main_end_time=="" && main_sn=="" && main_partname =="" && main_status ==""){
        window.message.showError("more than one")
        return false;
    }
    if(main_start_time == main_end_time && main_start_time !="" && main_end_time !=""){
        main_end_time = main_end_time+" 23:59:59";
    }
    main_partname= main_partname.toUpperCase();
    data = {
        'main_start_time':main_start_time,
        'main_end_time':main_end_time,
        'main_sn':main_sn,
        'main_partname':main_partname,
        'main_status':main_status,
    }
    console.log(data)
    query_information=data //这里是把筛选的条件变成全局条件给视图查询做准备
    $.ajax({
    'type':'POST',
    'data':data,
    'url':'/maintain/maintain-query-partname-data/',
        success:function(result){
            if(result['code'] === 200){
                console.log(result['data'])
                $("#maintain_tr").empty();
                maintain_data = result['data']
                limit_data_count = maintain_data.limit_value1[0]
                limit_data_date = maintain_data.limit_value2[0]
                maintain_data =maintain_data.data

                for(var i=0; i<maintain_data.length; i++){
                    if(maintain_data[i][6] == null){maintain_data[i][6] ="0T"}
                    maintain_data[i][6] = (maintain_data[i][6]).split("T")[0]
                    var status
                    var status_class
                    if(limit_data_count.length == 0 && limit_data_date.length == 0){
                        status = "正常"
                        status_class = "badge badge-success";}
                    if(limit_data_count.length != 0 && limit_data_date.length != 0){

                        if(maintain_data[i][8] > limit_data_count.Max && maintain_data[i][9] > limit_data_date.Max ){
                            status = "正常"
                            status_class = "badge badge-success";}
                        if((0 < maintain_data[i][8] && maintain_data[i][8] <= limit_data_count.Max) ||
                           (0 < maintain_data[i][9] && maintain_data[i][9]<= limit_data_date.Max)){
                            status = "预警"
                            status_class = "badge badge-warning";}
                        if(maintain_data[i][8] < 0 && maintain_data[i][9] < 0 ){
                            status = "超标"
                            status_class = "badge badge-danger";}
                    }
                    var maintain_add = "<tr>"
                    +"<td class='yc'>"+maintain_data[i][0]+"</td>"
                    +"<td><span data-toggle='modal' data-target='#maintain_sn' onclick='maintain_sn("+maintain_data[i][1]+")'>"
                    +"<img alt='Add' src='/static/images/icon_modify.gif' style='padding-right:10px;'></span></td>"
                    +"<td>"+maintain_data[i][1]+"</td>"
                    +"<td>"+maintain_data[i][2]+"</td>"
                    +"<td>"+maintain_data[i][3]+"</td>"
                    +"<td>"+maintain_data[i][4]+"</td>"
                    +"<td>"+maintain_data[i][5]+"</td>"
                    +"<td>"+maintain_data[i][6]+"</td>"
                    +"<td><span class='"+status_class+"'>"+status+"</span></td>"
                    +"</tr>"
                    $("#maintain_tr").append(maintain_add)
                }

            }else{
                window.message.showError(result['message'])
            }
        }
    })


}
////针对某一个BY_PN进行修改动作的设定参数
function setup_by_PN(){
    var main_partname = $("#setup_main_partname").val()
    var main_count =    $("#setup_main_count").val()
    var main_day =      $("#setup_main_day").val()
    var main_date =     $("#setup_main_date").val()
    var Regx =  /^[0-9]*$/;
    if(main_count =="" || main_day =="" || main_date =="" || main_partname ==""){
        window.message.showError("can't be empty")
        return false;
    }
    if(Regx.test(main_count) && Regx.test(main_day)){
        data={
        'main_partname':main_partname,
        'main_count':main_count,
        'main_day':main_day,
        'main_date':main_date,
        }
        console.log(data)
        $.ajax({
        'type':'POST',
        'data':data,
        'url':'/maintain/maintain-setup-by-pn/',
            success:function(result){
                if(result['code'] === 200){
                    main_monitor();
                    window.message.showSuccess(result['message'])
                }else{
                    window.message.showError(result['message'])
                }
            }
        })

    }else{
        window.message.showError("main_count is digital")
        return false;
    }
}
//针对一个SN的进行设置修改保养的次数和周期 下次保养的时间设定 第一个函数执行之后的设置作用。。
function setup_restart(){
    var main_count = $("#main_count").val()
    var main_cycle = $("#main_cycle").val()
    var main_date = $("#main_date").val()
    var main_sn = $("#item_sn").text()
    var Regx =  /^[0-9]*$/;
    var Regx =  /^[0-9]*$/;
    if(main_count =="" && main_cycle =="" && main_date ==""){
        window.message.showError("can't be empty")
        return false;
    }
    if(Regx.test(main_count) && Regx.test(main_cycle)){
        data={
        'main_count':main_count,
        'main_cycle':main_cycle,
        'main_date':main_date,
        'main_sn':main_sn,
        }
        console.log(data)
        $.ajax({
        'type':'POST',
        'data':data,
        'url':'/maintain/maintain-setup-info/',
            success:function(result){
                if(result['code'] === 200){
                    main_monitor();
                    window.message.showSuccess(result['message'])
                }else{
                   alert(result['message'])
                }
            }
        })

    }else{
        window.message.showError("main_count is digital")
    }

}




//设置保养次数和保养周期时间
function setup_maintain(){
    var maintain_count = $("#maintain_count").val()
    var maintain_date = $("#maintain_date").val()
    var maintain_receiver = $("#maintain_receiver").val()
    var Regx =  /^[A-Za-z]*$/;
    if(maintain_count == ""){
        window.message.showError("maintain count can't be empty")
        return false;}
    if(Regx.test(maintain_count)){
        window.message.showError("maintain count is digital")
        return false;}
    if(maintain_date == ""){
        window.message.showError("maintain date can't be empty")
        return false;}
    if(Regx.test(maintain_date)){
        window.message.showError("maintain date is digital")
        return false;}

    if(maintain_receiver == ""){
        window.message.showError("maintain mail receive can't be empty")
        return false;}
    data = {
        'maintain_count':maintain_count,
        'maintain_date':maintain_date,
        'maintain_receiver':maintain_receiver,
    }
    console.log(data)
    $.ajax({
    'type':'POST',
    'data':data,
    'url':'/maintain/maintain-equipment-info/',
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}
//生成保养报表的数据函数
function maintain_file(){
    var maintain_li = $("#maintain_tr tr").length
    var maintain_data = []
    for(var j=0; j<maintain_li; j++){
        value = $("#maintain_tr tr").eq(j).find("td:first").html();
        maintain_data.push(value)
    }
    console.log(maintain_data)
    data ={'maintain_id':maintain_data,}
    $.ajax({
    'type':'POST',
    'data':data,
    'url':'/maintain/maintain-record/',
        success:function(result){
            if(result['code'] === 200){
//                window.location.href = result['data'][0]
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}


//保养页面进入之后的查询功能实现查询
function query_main(){
    var sn =     $("#query_main_sn").val()
    var pn =     $("#query_main_pn").val()
    var status = $("#query_main_status").val()
    var next_time =$("#query_main_next_time").val()
    var next_time_1 =next_time+" 23:59:59"
    data={
        'sn':sn,
        'pn':pn,
        'status':status,
        'next_time':next_time,
        'next_time_1':next_time_1,
    }
    console.log(data)
    $.ajax({
    'type':'POST',
    'data':data,
    'url':'/maintain/maintain-query-operation/',
        success:function(result){
            if(result['code'] === 200){
                console.log(result['data'])
                mt_data=result['data']
                mt_qu_data = mt_data.data
                console.log(mt_qu_data)
                limit_data_count = mt_data.limit_value1[0]
                limit_data_date = mt_data.limit_value2[0]
                $("#mt_query_detail").empty()
                for(var i=0; i<mt_qu_data.length; i++){
                    if(mt_qu_data[i][6] == null){mt_qu_data[i][6] ="0T"}
                        mt_qu_data[i][6] = (mt_qu_data[i][6]).split("T")[0]
                        var status
                        var status_class
                    if(limit_data_count.length == 0 && limit_data_date.length == 0){
                        status = "正常"
                        status_class = "badge badge-success";}
                    if(limit_data_count.length != 0 && limit_data_date.length != 0){
                        if(mt_qu_data[i][9] > limit_data_count.Max && mt_qu_data[i][10] > limit_data_date.Max ){
                            status = "正常"
                            status_class = "badge badge-success";}
                        if((0 < mt_qu_data[i][9] && mt_qu_data[i][9] <= limit_data_count.Max) ||
                           (0 < mt_qu_data[i][10] && mt_qu_data[i][10]<= limit_data_date.Max)){
                            status = "预警"
                            status_class = "badge badge-warning";}
                        if(mt_qu_data[i][9] < 0 && mt_qu_data[i][10] < 0 ){
                            status = "超标"
                            status_class = "badge badge-danger";}
                    }
                    var mt_detail_add = "<tr>"
                    +"<td><input type=\"checkbox\" name=\"mt_all\" value=\"true\"><label class='yc'>"+mt_qu_data[i][0]+"</label></td>"
                    +"<td>"+mt_qu_data[i][1]+"</td>"
                    +"<td>"+mt_qu_data[i][2]+"</td>"
                    +"<td>"+mt_qu_data[i][3]+"</td>"
                    +"<td>"+mt_qu_data[i][4]+"</td>"
                    +"<td>"+mt_qu_data[i][5]+"</td>"
                    +"<td>"+mt_qu_data[i][6]+"</td>"
                    +"<td><span class='"+status_class+"'>"+status+"</span></td>"
                    +"</tr>"
                    $("#mt_query_detail").append(mt_detail_add)
                }
//                window.location.href = result['data'][0]
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}
//全选函数check盒子
//checkbox全选
$(function () {
    //全选,设置chheckbox name='all' tbody id=tb
    $("input[name=mt_all]").click(function () {
        if (this.checked) {
            $("#mt_query_detail :checkbox").prop("checked", true);
        } else {
            $("#mt_query_detail :checkbox").prop("checked", false);
        }
    });
});

//对筛选的数据进行保养
function maintain_query_data(){
    var select_box = $("table input[type=checkbox]:checked")
    var maintain_date = $("#maintain_setup_date").val()
    var maintain_operator = $("#maintain_operator").val()
    var maintain_status = $("#maintain_status").val()
    var maintain_text = $("#maintain_text_era").val()
    var statement_mt = []
    select_box.each(function(){statement_mt.push($(this).next().html());})
    if(statement_mt[0] == "全选"){statement_mt.splice(0,1)}
    if(statement_mt.length == 0){
        alert("need select more than one");
        return false;
    }
    if(maintain_date == ""){
        alert("maintain time can't empty");
        return false;
    }
    if(maintain_operator == ""){
        alert("maintain_operator can't empty");
        return false;
    }
    if(maintain_text == ""){
        alert("maintain_text can't empty");
        return false;
    }
    data = {
        'statement_mt':statement_mt,
        'maintain_date':maintain_date,
        'maintain_operator':maintain_operator,
        'maintain_status':maintain_status,
        'maintain_text':maintain_text,
    }
    console.log(data)
//    $.ajax({
//        'type':'POST',
//        'url':'/maintain/maintain-query-maintain/',
//        'data':data,
//        success:function(result){
//            if(result['code'] === 200){
//                console.log(result['data'])
////                var url=result['data'][0]
////                window.location.href=url
//            }else{
//                window.message.showError(result['message'])
//            }
//        }
//
//    })
}



