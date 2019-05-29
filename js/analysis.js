//数据显示部分的data
function chart_tab(){
    $(".statistic").removeClass("yc")
    $(".budget").addClass("yc")
    $(".user").addClass("yc")
    $(".budgetform").addClass("yc")
    $(".merge").addClass("yc")
    $(".detail").addClass("yc")
    $(".ng").addClass("yc")
    $(".maintain").addClass("yc")
//    $(".operation").addClass("yc")
    $(".modifypwd").addClass("yc")
    $.ajax({
    'type':'GET',
    'data':{},
    'url':'/analysis/analysis-equipment-info/',
        success:function(result){
            if(result['code'] === 200){
                num1=result['data'].user
                num2=result['data'].filterSN
                visua_pic(num1,num2)
                num=result['data'].errorcode
                ErrorCode(num)
                num3=result['data'].Partname
                pic_partname (num3)
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//后台获取我的设置的数据的函数
function add_modal_sa(){
    $.ajax({
        'type':'GET',
        'data':{},
        'url':'/analysis/analysis-setup-data/',
        success:function(result){
            if(result['code'] === 200){
                $("#input_analysis_data").empty()
                $("#item_index").val(result['data'][result['data'].length-1].Id+1)
                data = result['data']
                $("#pic_set").modal("show")
                if(data.length >0){
                   for(var i=0; i<data.length; i++){
                       add_html = '<div class="form-group col-md-12 row " id="'+data[i].Id +'_div">'
                       add_html += "<span class=\"col-md-2 col-form-label\" onclick=\"delete_input('" + data[i].Id + "_div');\">"
                       add_html += '<img alt="Delete" src="/static/images/icon_del.gif">'
                       add_html += '</span>'
                       add_html += '<label class="col-md-1 col-form-label" style="padding-right:0px">Min</label>'
                       add_html += '<div class="col-md-4 has-feedback">'
                       add_html += '<input type="text" class="form-control input_class" name="range_min['+data[i].Id+']" value="'+data[i].Min+'">'
                       add_html += '</div>'
                       add_html += '<label class="col-md-1 col-form-label" style="padding-right:0px">Max</label>'
                       add_html += '<div class="col-md-4 has-feedback">'
                       add_html += '<input type="text" class="form-control input_class" name="range_max['+data[i].Id+']" value="'+data[i].Max+'">'
                       add_html += '</div>'
                       add_html += '</div>'
                       $("#input_analysis_data").append(add_html)
                   }
                }
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//增加输入框的动作
function add_input(){
    var range_id = $("#item_index").val();
    var range_div = range_id + '_div';
    var div_name;
    temp_range = "<div class=\"form-group col-md-12 row \" id=\""+ range_div +"\">";
    temp_range += "<span class=\"col-md-2 col-form-label\" onclick=\"delete_input('" + range_div + "');\"><img alt=\"Delete\" src=\"/static/images/icon_del.gif\"></span>";
    temp_range += "<label class=\"col-md-1 col-form-label\" style=\"padding-right:0px\">Min</label>";
    temp_range += "<div class=\"col-md-4 has-feedback\">";
    temp_range += "<input type=\"text\" class=\"form-control input_class\" name=\"range_min[" + range_id + "]\"></div>";
    temp_range += "<label class=\"col-md-1 col-form-label\" style=\"padding-right:0px\">Max</label>";
    temp_range += "<div class=\"col-md-4 has-feedback\">";
    temp_range += "<input type=\"text\" class=\"form-control input_class\" name=\"range_max[" + range_id + "]\"></div>";
    $('#input_analysis_data').append(temp_range);
    $("#item_index").val(parseInt($("#item_index").val(),10)+1);
}

//删除输入框的动作
function delete_input(div_id){
    if(confirm('Are you sure to delete?')){
		$('#' + div_id).remove();
		data={'div_id':div_id}
		$.ajax({
            'type':'POST',
            'data':data,
            'url':'/analysis/analysis-delete-data/',
            success:function(result){
                if(result['code'] === 200){
                }else{
                    window.message.showError(result['message'])
                }
            }
        })
    }
}

//设置fail区间的值得提交
function add_sa(){
    data={}
    //$('#fail_range_form').attr("action", "/analysis/analysis-setup-value/").submit();
    var value = $("#fail_range_form")[0]
    var i = 1
    for(i;;i++){
        if(value[i].name.length == 0){break;}
        data[String(value[i].name)]=value[i].value
    }
    range_data={'data':JSON.stringify(data)}
    $.ajax({
        'type':'POST',
        'data':range_data,
        'url':'/analysis/analysis-setup-value/',
        success:function(result){
            if(result['code'] === 200){
                window.message.showSuccess(result['message'])
            }else{
                console.log(result['data'])
            }
        }
    })
}

var analysis_q_data = {
    'begin':"",
    'end':"",
    'stage':"",
    'fixture':"",
    'usn':"",
}
//获取查询数据的get的数据
function query_data(){
    $.ajax({
        'type':'GET',
        'data':{},
        'url':'/analysis/analysis-query-data/',
        success:function(result){
            if(result['code'] === 200){
                data =result['data']
                stage_data =data.stage
                $("#statistics_query_stage").empty()
                $("#statistics_query_stage").append('<option>All</option>')
                $("#statistics_query_fixture").empty()
                $("#statistics_query_fixture").append('<option>All</option>')
                $("#statistics_query_usn").empty()
                $("#statistics_query_usn").append('<option>All</option>')
                for(var i=0; i<stage_data.length; i++){
                    if(analysis_q_data.stage == stage_data[i].Stage){
                    var html_query='<option selected>'+stage_data[i].Stage+'</option>'
                    }else{var html_query='<option>'+stage_data[i].Stage+'</option>'}
                    $("#statistics_query_stage").append(html_query)
                }
                USN_data = data.USN
                for(var j=0; j<USN_data.length; j++){
                    if(analysis_q_data.usn == USN_data[j].USN){
                        var html_query_usn='<option selected>'+USN_data[j].USN+'</option>'
                    }else{var html_query_usn='<option>'+USN_data[j].USN+'</option>'}
                    $("#statistics_query_usn").append(html_query_usn)
                }
                fixture_data =data.fixtureId
                for(var k=0; k<fixture_data.length; k++){
                    if(analysis_q_data.fixture == fixture_data[k].FixtureId){
                        var html_query_fixture='<option selected>'+fixture_data[k].FixtureId+'</option>'
                    }else{var html_query_fixture='<option>'+fixture_data[k].FixtureId+'</option>'}
                    $("#statistics_query_fixture").append(html_query_fixture)}
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//查询数据的post 提交数据的查询
function query_info_data(){
    var stage = $("#statistics_query_stage").val()
    var fixture = $("#statistics_query_fixture").val()
    var usn = $("#statistics_query_usn").val()
    var begin = $("#min").val()
    var end = $("#max").val()
    var startTime = new Date(Date.parse(begin));
    var endTime = new Date(Date.parse(end));
    if(startTime>endTime){
       window.message.showError("startTime can't > endTime")
       return false;
    }
    if(begin == end && begin !="" && end !=""){end=end+' 23:59:59';}
    if(stage == "All"){stage =""}
    if(fixture == "All"){fixture =""}
    if(usn == "All"){usn =""}
    data ={
        'begin':begin,
        'end':end,
        'stage':stage,
        'fixture':fixture,
        'usn':usn,
    }
    analysis_q_data =data
    $.ajax({
        'type':'POST',
        'data':data,
        'url':'/analysis/analysis-query-info/',
        success:function(result){
            if(result['code'] === 200){
                num1=result['data'].user
                num2=result['data'].filterSN
                visua_pic(num1,num2)
                num=result['data'].errorcode
                ErrorCode(num)
                num3=result['data'].Partname
                pic_partname (num3)
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//视图点击事件需要提交的数据进行查询出来
function query_errcode(obj){
    var visual_query_in = analysis_q_data
    visual_query_in['errorcode']=obj
    console.log(visual_query_in)
    $.ajax({
        type:'POST',
        data:visual_query_in,
        url:'/analysis/analysis-visual-data/',
        success:function(result){
            if(result['code'] === 200){
                console.log(result['data'])
                num=result['data'].errorcode
                ErrorCode(num)
//                num3=result['data'].Partname
//                pic_partname (num3)
            }else{
//                window.message.showError(result['message'])
                alert(result['message'])
            }
        }
    })
}
//视图partname的点击事件需要提交的数据进行查询
function query_partname(obj){
    var visual_q_part = analysis_q_data
    visual_q_part['partname']=obj
    $.ajax({
        type:'POST',
        data:visual_query_in,
        url:'/analysis/analysis-vi-part/',
        success:function(result){
            if(result['code'] === 200){
                console.log(result['data'])
//                    num=result['data'].errorcode
//                    ErrorCode(num)
//                    num3=result['data'].Partname
//                    pic_partname (num3)
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}

//视图显示需要的设备分析数据
function query_pic_partname(obj){

}



var page_statistic = {'page':'1','num':'10'}
//选择一页显示数量
$(document).ready(function(){
     $("#statistic_setup").change(function(){
        var page_statistic_number = $(this).children('option:selected').val()
        page_statistic['num']=page_statistic_number.toString()
        page_statistic['page'] = '1'
        if(page_statistic_number == 'All'){
            $("#previous_statistic").parent().addClass("disabled")
            $("#next_statistic").parent().addClass("disabled")
        }
        if(page_statistic_number != 'All'){
            $("#previous_statistic").parent().removeClass("disabled")
            $("#next_statistic").parent().removeClass("disabled")
        }
        if(page_statement_obj['page'] == '1'){
            $("#previous_statistic").parent().addClass("disabled")
        }
        if(JSON.stringify(table_data) == '{}'){
            number_tab();
        }else{
            tab_query_select();
        }
     })
})
//上一页页码的转换
function previous_stat(){
    if(page_statistic['page'] != '1' && page_statistic['num'] != 'All'){
        page_statistic['page']= (Number(page_statistic['page'])-1).toString()
        $("#next_statistic").parent().removeClass("disabled")
        if(JSON.stringify(table_data) == '{}'){
            number_tab();
        }else{
            tab_query_select();
        }
    }
    if(page_statistic['page'] == '1'){
        $("#previous_statistic").parent().addClass("disabled")
    }
}
//下一页的页面转换
function next_stat(){
    if(page_statistic['num'] != 'All'){
        page_statistic['page']= (Number(page_statistic['page'])+1).toString()
        $("#previous_statistic").parent().removeClass("disabled")
        if(JSON.stringify(table_data) == '{}'){
            number_tab();
        }else{
            tab_query_select();
        }
    }
}

//数据显示部分
function number_tab(){
    $(".data_tab").removeClass("yc")
    $(".chart_pic").addClass("yc")
    $.ajax({
    'type':'GET',
    'data':page_statistic,
    'url':'/analysis/analysis-data/',
        success:function(result){
            if(result['code'] === 200){
                statistics_data = result['data'].data
                $("#statistics_data").empty()
                for(var i=0; i<statistics_data.length; i++){
                    statistics_data[i].TrnDate = (statistics_data[i].TrnDate).split("T")[0]
                    if(statistics_data[i].Asset == null){statistics_data[i].Asset = '';}
                    var statistics_data_add = '<tr>'
                        +'<td class="yc">'+statistics_data[i].Id+'</td>'
                        +'<td>'+statistics_data[i].USN+'</td>'
                        +'<td>'+statistics_data[i].SN+'</td>'
                        +'<td>'+statistics_data[i].OSN+'</td>'
                        +'<td>'+statistics_data[i].Asset+'</td>'
                        +'<td>'+statistics_data[i].PN+'</td>'
                        +'<td>'+statistics_data[i].PartName+'</td>'
                        +'<td>'+statistics_data[i].Spec+'</td>'
                        +'<td>'+statistics_data[i].UsedTimes+'</td>'
                        +'<td>'+statistics_data[i].Stage+'</td>'
                        +'<td>'+statistics_data[i].FixtureId+'</td>'
                        +'<td>'+statistics_data[i].Result+'</td>'
                        +'<td>'+statistics_data[i].ErrorCode+'</td>'
                        +'<td>'+statistics_data[i].TrnDate+'</td>'
                    +'</tr>'
                    $("#statistics_data").append(statistics_data_add)
                }

                data_count = result['data'].page_count
                if(page_statistic['page'] == '1'){
                    $("#previous_statistic").parent().addClass("disabled")
                }
                if(Number(page_statistic['page']) == data_count){
                    $("#next_statistic").parent().addClass("disabled")
                }
            }else{
                $("#next_statistic").parent().addClass("disabled")
            }
        }
    })
}

//数据后台获取的数据函数
function query_table(){
    $.ajax({
        'type':'GET',
        'data':{},
        'url':'/analysis/analysis-tab-data/',
        success:function(result){
            if(result['code'] === 200){
                data =result['data']
                stage_data =data.Stage
                $("#tab_stage").empty()
                $("#tab_stage").append('<option>All</option>')
                $("#tab_fixture").empty()
                $("#tab_fixture").append('<option>All</option>')
                $("#tab_usn").empty()
                $("#tab_usn").append('<option>All</option>')
                $("#tab_result").empty()
                $("#tab_result").append('<option>All</option>')
                for(var i=0; i<stage_data.length; i++){
                    var html_query='<option>'+stage_data[i].Stage+'</option>'
                    $("#tab_stage").append(html_query)}
                USN_data = data.USN
                for(var j=0; j<USN_data.length; j++){
                    var html_query_usn='<option>'+USN_data[j].USN+'</option>'
                    $("#tab_usn").append(html_query_usn)}
                fixture_data =data.FixtureId
                for(var k=0; k<fixture_data.length; k++){
                    var html_query_fixture='<option>'+fixture_data[k].FixtureId+'</option>'
                    $("#tab_fixture").append(html_query_fixture)}
                result_data = data.Result
                for(var l=0; l<result_data.length; l++){
                    var html_query_result='<option>'+result_data[l].Result+'</option>'
                    $("#tab_result").append(html_query_result)}
            }else{
                window.message.showError(result['message'])
            }
        }
    })
}





var statistic_n=1
//判断有无查询数据
var table_data ={}
//查询数据的post提交的数据的查询
function tab_query_select(){
    if(statistic_n == 1){
        page_statistic = {'page':'1','num':'10'};
        statistic_n =statistic_n+1;
        $("#statistic_setup").val(10);
    }
    var stage = $("#tab_stage").val()
    var fixture = $("#tab_fixture").val()
    var usn = $("#tab_usn").val()
    var result = $("#tab_result").val()
    var begin = $("#tab_min").val()
    var end = $("#tab_max").val()
    var startTime = new Date(Date.parse(begin));
    var endTime = new Date(Date.parse(end));
    if(startTime>endTime){
       window.message.showError("startTime can't > endTime")
       return false;
    }
    if(begin == end && begin !="" && end !=""){end=end+' 23:59:59';}
    if(stage == "All" ){stage ="";}
    if(fixture == "All" ){fixture ="";}
    if(usn == "All" ){usn ="";}
    if(result == "All" ){result ="";}
    data ={
        'begin':begin,
        'end':end,
        'stage':stage,
        'fixture':fixture,
        'usn':usn,
        'result':result,
    }
    data['page'] = page_statistic['page']
    data['num'] = page_statistic['num']
    table_data=data
    $.ajax({
        'type':'POST',
        'data':data,
        'url':'/analysis/analysis-query-tab-info/',
        success:function(result){
            if(result['code'] === 200){
                statistics_data = result['data'].data
                $("#statistics_data").empty()
                for(var i=0; i<statistics_data.length; i++){
                    statistics_data[i][14] = (statistics_data[i][14]).split("T")[0]
                    if(statistics_data[i][4] == null){statistics_data[i][4] = '';}
                    var statistics_data_add = '<tr>'
                        +'<td class="yc">'+statistics_data[i][0]+'</td>'
                        +'<td>'+statistics_data[i][1]+'</td>'
                        +'<td>'+statistics_data[i][2]+'</td>'
                        +'<td>'+statistics_data[i][3]+'</td>'
                        +'<td>'+statistics_data[i][4]+'</td>'
                        +'<td>'+statistics_data[i][5]+'</td>'
                        +'<td>'+statistics_data[i][6]+'</td>'
                        +'<td>'+statistics_data[i][7]+'</td>'
                        +'<td>'+statistics_data[i][8]+'</td>'
                        +'<td>'+statistics_data[i][9]+'</td>'
                        +'<td>'+statistics_data[i][10]+'</td>'
                        +'<td>'+statistics_data[i][11]+'</td>'
                        +'<td>'+statistics_data[i][12]+'</td>'
                        +'<td>'+statistics_data[i][13]+'</td>'
                    +'</tr>'
                    $("#statistics_data").append(statistics_data_add)
                }

                data_count = result['data'].page_count
                if(page_statistic['page'] == '1'){
                    $("#previous_statistic").parent().addClass("disabled")
                }
                if(Number(page_statistic['page']) == data_count){
                    $("#next_statistic").parent().addClass("disabled")
                }
            }else{
                $("#next_statistic").parent().addClass("disabled")
            }
        }
    })
}