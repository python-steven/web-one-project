//全局变量的设置，这里主要是方便联动的查询
var monitor_query_info={}
var monitor_visual_data={}

//NG率监控的页面的数据的分页显示效果函数
var page_ng = {'page':'1','num':'10'}
//选择一页显示数量
$(document).ready(function(){
     $("#setup_analysis_num").change(function(){
        var page_ng_number = $(this).children('option:selected').val()
        page_ng['num']=page_ng_number.toString()
        page_ng['page'] = '1'
        if(page_ng_number == 'All'){
            $("#previous_a").parent().addClass("disabled")
            $("#next_a").parent().addClass("disabled")
        }
        if(page_ng_number != 'All'){
            $("#previous_a").parent().removeClass("disabled")
            $("#next_a").parent().removeClass("disabled")
        }
        if(page_ng['page'] == '1'){
            $("#previous_a").parent().addClass("disabled")
        }
        if(JSON.stringify(query_analysis_post) == '{}' && JSON.stringify(monitor_visual_data) == '{}'){
            check_ng();
        }else if(JSON.stringify(query_analysis_post) != '{}' && JSON.stringify(monitor_visual_data) == '{}'){
            select_monitor();
        }else if(JSON.stringify(monitor_visual_data) != '{}' && JSON.stringify(ping_data) != '{}' ){
            visual_data(ping_data['part_name'],ping_data['status']);
        }
     })
})
//上一页页码的转换
function previous_analysis(){
    if(page_ng['page'] != '1' && page_ng['num'] != 'All'){
        page_ng['page']= (Number(page_ng['page'])-1).toString()
        $("#next_a").parent().removeClass("disabled")
        if(JSON.stringify(query_analysis_post) == '{}' && JSON.stringify(monitor_visual_data) == '{}'){
            check_ng();
        }else if(JSON.stringify(query_analysis_post) != '{}' && JSON.stringify(monitor_visual_data) == '{}'){
            select_monitor();
        }else if(JSON.stringify(monitor_visual_data) != '{}' && JSON.stringify(ping_data) != '{}' ){
            visual_data(ping_data['part_name'],ping_data['status']);
        }
    }
    if(page_ng['page'] == '1'){
        $("#previous_a").parent().addClass("disabled")
    }
}
//下一页的页面转换
function next_analysis(){
    if(page_ng['num'] != 'All'){
        page_ng['page']= (Number(page_ng['page'])+1).toString()
        $("#previous_a").parent().removeClass("disabled")
        if(JSON.stringify(query_analysis_post) == '{}' && JSON.stringify(monitor_visual_data) == '{}'){
            check_ng();
        }else if(JSON.stringify(query_analysis_post) != '{}' && JSON.stringify(monitor_visual_data) == '{}'){
            select_monitor();
        }else if(JSON.stringify(monitor_visual_data) != '{}' && JSON.stringify(ping_data) != '{}' ){
            visual_data(ping_data['part_name'],ping_data['status']);
        }
    }
}


//NG监控的视图显示+ 获取前三个月的数据
function check_ng(){
    $(".ng").removeClass("yc")
    $(".budget").addClass("yc")
    $(".user").addClass("yc")
    $(".budgetform").addClass("yc")
    $(".merge").addClass("yc")
    $(".detail").addClass("yc")
    $(".maintain").addClass("yc")
    $(".statistic").addClass("yc")
    $(".modifypwd").addClass("yc")
    $(".main_monitor").addClass("yc")
    $.ajax({
    'type':'GET',
    'data':page_ng,
    'url':'/NGrate/monitor-equipment-info/',
        success:function(result){
            if(result['code'] === 200){
                $("#monitor_detail").empty();
                monitor_data = result['data']
                console.log(monitor_data)
				visua(monitor_data.normal,monitor_data.warning,monitor_data.danger);
                limit_data = monitor_data.limit_value
                monitor_data =monitor_data.data
                for(var i=0; i<monitor_data.length; i++){
                    var status
                    var status_class
                    if(limit_data[0].Max == "" && limit_data[0].Min == ""){
                        status =""
                        status_class= ""
                        var monitor_add = '<tr>'
                            +'<td class="yc">'+monitor_data[i].Id+'</td>'
                            +'<td>'+monitor_data[i].SN+'</td>'
                            +'<td>'+monitor_data[i].PartName+'</td>'
                            +'<td>'+limit_data[0].Min+'~'+limit_data[0].Max+'</td>'
                            +'<td>'+monitor_data[i].NGRate+'</td>'
                            +'<td>'+monitor_data[i].ErrorCounts+'</td>'
                            +'<td>'+monitor_data[i].UsedTimes+'</td>'
                            +'<td><span class='+status_class+'>'+status+'</span></td>'
                        +'</tr>'
                        $("#monitor_detail").append(monitor_add)
                    }else{
                        if(monitor_data[i].NGRate < limit_data[0].Min){
                            status = "正常"
                            status_class ="success"
                        }
                        if(limit_data[0].Min <= monitor_data[i].NGRate && monitor_data[i].NGRate<= limit_data[0].Max){
                            status = "预警"
                            status_class = "warning"
                        }
                        if(monitor_data[i].NGRate > limit_data[0].Max){
                            status = "超标"
                            status_class ="danger"
                        }
                        var monitor_add = '<tr>'
                            +'<td class="yc">'+monitor_data[i].Id+'</td>'
                            +'<td>'+monitor_data[i].SN+'</td>'
                            +'<td>'+monitor_data[i].PartName+'</td>'
                            +'<td>'+limit_data[0].Min+'~'+limit_data[0].Max+'</td>'
                            +'<td>'+monitor_data[i].NGRate+'</td>'
                            +'<td>'+monitor_data[i].ErrorCounts+'</td>'
                            +'<td>'+monitor_data[i].UsedTimes+'</td>'
                            +'<td><span class="badge badge-'+status_class+'">'+status+'</span></td>'
                        +'</tr>'
                        $("#monitor_detail").append(monitor_add)
                    }
                }

                data_count = result['data'].page_count
                if(page_ng['page'] == '1'){
                    $("#previous_a").parent().addClass("disabled")
                }
                if(Number(page_ng['page']) >= data_count){
                    $("#next_a").parent().addClass("disabled")
                }

            }else{
               $("#next_a").parent().addClass("disabled")
            }
        }
    })
}

//装瓶状态的图片显示的传过来的数据
var ping_data ={}
//提供给index.js需要的函数 ajax请求
var via=1
function visual_data(part_name,color){
    if(via == 1){
        page_ng={'page':'1','num':'10'};
        $("#setup_analysis_num").val(10);
        via=via+1;
    }
    ping_data['part_name']=part_name
    ping_data['status']=color
    monitor_visual_data =monitor_query_info
    monitor_visual_data['part_name']=part_name
    monitor_visual_data['status']=color
    monitor_visual_data['page']=page_ng['page']
    monitor_visual_data['num']=page_ng['num']
    console.log(monitor_visual_data)
    $.ajax({
        'type':'POST',
        'data':monitor_visual_data,
        'url':'/NGrate/visual-data/',
        success:function(result){
            if(result['code'] === 200){
                $("#monitor_detail").empty();
                visual_data_info = result['data']
                console.log(visual_data_info)
                visual_limit_data = visual_data_info.limit_value
                visual_monitor_data =visual_data_info.data
                for(var i=0; i<visual_monitor_data.length; i++){
                    var status
                    var status_class
                    if(visual_monitor_data[i][15] < visual_limit_data[0]){
                        status = "正常"
                        status_class = "badge badge-success";
                    }
                    if(visual_limit_data[0] <= visual_monitor_data[i][15] && visual_monitor_data[i][15]<= visual_limit_data[1]){
                        status = "预警"
                        status_class = "badge badge-warning";
                    }
                    if(visual_monitor_data[i][15] > visual_limit_data[1]){
                        status = "超标"
                        status_class = "badge badge-danger";
                    }
                    var visual_monitor_add = '<tr>'
                        +'<td class="yc">'+visual_monitor_data[i][0]+'</td>'
                        +'<td>'+visual_monitor_data[i][1]+'</td>'
                        +'<td>'+visual_monitor_data[i][4]+'</td>'
                        +'<td>'+visual_limit_data[0]+'~'+visual_limit_data[1]+'</td>'
                        +'<td>'+visual_monitor_data[i][15]+'</td>'
                        +'<td>'+visual_monitor_data[i][13]+'</td>'
                        +'<td>'+visual_monitor_data[i][6]+'</td>'
                        +'<td><span class="'+status_class+'">'+status+'</span></td>'
                    +'</tr>'
                    $("#monitor_detail").append(visual_monitor_add)
                }

                data_count = result['data'].page_count
                if(page_ng['page'] == '1'){
                    $("#previous_a").parent().addClass("disabled")
                }
                if(Number(page_ng['page']) >= data_count){
                    $("#next_a").parent().addClass("disabled")
                }
            }else{
//                $("#next_a").parent().addClass("disabled")
                   alert(result['message'])
            }
        }
    })
}


//设定NG率的参数设置函数
function setup_monitor(){
    var min =$("#min_value").val()
    var max =$("#max_value").val()
    var mail_receiver =$("#mail_receive").val()
    if(min ==""){
        window.message.showError("min value can not empty!!!!")
        return false;
    }
    if(max ==""){
        window.message.showError("max value can not empty!!!!")
        return false;
    }
    if(max<min){
        window.message.showError("max and min value error")
        return false;
    }
    if(mail_receiver ==""){
        window.message.showError("mail receiver can not empty!!!!")
        return false;
    }
    data ={
        'min':min,
        'max':max,
        'mail_receiver':mail_receiver,
    }
    $.ajax({
    'type':'POST',
    'data':data,
    'url':'/NGrate/setup-parameter/',
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//生成报表的按钮
function statement_NG_detail(){
    var li = $("#monitor_detail tr").length
    var data_td = []
    for(var i=0; i<li; i++){
        value = $("#monitor_detail tr").eq(i).find("td:first").html();
        data_td.push(value)
    }
    data = {'NG_ids':data_td,}
    $.ajax({
    'type':'POST',
    'data':data,
    'url':'/NGrate/monitor-equipment-info/',
        success:function(result){
            if(result['code'] === 200){
                window.location.href = result['data'][0]
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}


var query_analysis_post = {}
var n =1
//查询函数
function select_monitor(){
    if(n==1){
        page_ng={'page':'1','num':'10'};
        $("#setup_analysis_num").val(10);
        n=n+1;
    }
    var sn = $("#NG_SN").val()
    var part_name = $("#part_name").val()
    var status = $("#status").val()
    var start_tim = $("#start_time").val()
    var end_tim = $("#end_time").val()
    if(sn=="" && part_name=="" && status=="" && start_tim =="" && end_tim ==""){
        query_analysis_post = {}
    }
    if(start_tim ==end_tim && start_tim !="" && end_tim !=""){end_tim = end_tim+" 23:59:59";}
    part_name= part_name.toUpperCase();
    data = {
        'sn':sn,
        'part_name':part_name,
        'status':status,
        'start_tim':start_tim,
        'end_tim':end_tim,
    }
    monitor_query_info = data
    query_analysis_post = data
    data['page'] = page_ng['page']
    data['num'] = page_ng['num']
    console.log(data)
    $.ajax({
    'type':'POST',
    'data':data,
    'url':'/NGrate/monitor-query-info/',
        success:function(result){
            if(result['code'] === 200){
                $("#monitor_detail").empty();
                monitor_data = result['data']
                visua(monitor_data.normal,monitor_data.warning,monitor_data.danger);
                limit_data = monitor_data.limit_value
                monitor_data =monitor_data.data
                console.log(monitor_data)
                for(var i=0; i<monitor_data.length; i++){
                    var status
                    var status_class
                    if(monitor_data[i][15] < limit_data[0]){
                        status = "正常"
                        status_class = "badge badge-success";
                    }
                    if(limit_data[0] <= monitor_data[i][15] && monitor_data[i][15]<= limit_data[1]){
                        status = "预警"
                        status_class = "badge badge-warning";
                    }
                    if(monitor_data[i][15] > limit_data[1]){
                        status = "超标"
                        status_class = "badge badge-danger";
                    }
                    var monitor_add = '<tr>'
                        +'<td class="yc">'+monitor_data[i][0]+'</td>'
                        +'<td>'+monitor_data[i][1]+'</td>'
                        +'<td>'+monitor_data[i][4]+'</td>'
                        +'<td>'+limit_data[0]+'~'+limit_data[1]+'</td>'
                        +'<td>'+monitor_data[i][15]+'</td>'
                        +'<td>'+monitor_data[i][13]+'</td>'
                        +'<td>'+monitor_data[i][6]+'</td>'
                        +'<td><span class="'+status_class+'">'+status+'</span></td>'
                    +'</tr>'
                    $("#monitor_detail").append(monitor_add)
                }
                data_count = result['data'].page_count
                if(page_ng['page'] == '1'){
                    $("#previous_a").parent().addClass("disabled")
                }
                if(Number(page_ng['page']) >= data_count){
                    $("#next_a").parent().addClass("disabled")
                }
            }else{
                $("#next_a").parent().addClass("disabled")
            }
        }
    })
}
