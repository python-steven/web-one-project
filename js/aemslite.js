$(function() {
    $("#datepicker1" ).datepicker({
        minDate: new Date()
    });
    $("#datepicker2").datepicker({
        minDate: new Date()
    });
    $("#datepicker3").datepicker({
    });
    $("#datepicker4").datepicker({
    });
    $("#setup_main_date").datepicker({
    });
    $("#main_date").datepicker({
    });
    $("#query_main_next_time").datepicker({
    });
    $("#min").datepicker({
    });
    $("#max").datepicker({
    });
    $("#start_time").datepicker({
    });
    $("#end_time").datepicker({
    });
    $("#tab_min").datepicker({
    });
    $("#tab_max").datepicker({
    });
    $("#main_start_time").datepicker({
    });
    $("#main_end_time").datepicker({
    });
    $("#maintain_setup_date").datepicker({ });
    $("#maintain_start_time").datepicker({ });
    $("#maintain_end_time").datepicker({ });

});
$(document).ready(function() {
    $("li").each(function(index) {
        $("li").eq(index).click(function() {
            var a = $(this).siblings()
            var c = a.children()
            c.removeClass("active")
            var b = $(this).children()
            b.addClass("active")
            
        });
    });
});

function modifypwd(){
    $(".modifypwd").removeClass("yc")
    $(".maintain").addClass("yc")
    $(".budget").addClass("yc")
    $(".user").addClass("yc")
    $(".budgetform").addClass("yc")
    $(".merge").addClass("yc")
    $(".detail").addClass("yc")
    $(".ng").addClass("yc")
    $(".statistic").addClass("yc")
    $(".main_monitor").addClass("yc")
} 
//预算编码页面的内部控制
function apply(){
    $(".apply").removeClass("yc")
    $(".signing").addClass("yc")
    $(".signed").addClass("yc")
    $(".statement").addClass("yc")
    budget();
}

//预算编码的申请页面的控制
function rebudget(){
    $(".budgetform").addClass("yc")
    $(".budget").removeClass("yc")
}
//合并开单的页面控制
function remerge(){
    $(".merge").addClass("yc")
    $(".budget").removeClass("yc")
}
function delete_budget(){
     $("tr").each(function(index) {
        $("tr").eq(index).click(function() {
            var b = $(this).find("td")
            $("#delete_id_form").val(b[1].innerHTML)
        });
    });
}
function copy_budget(){
    $("table tr").click(function() {
        var td = $(this).find("td");// 找到td元素
        $("#budget_form_id_copy").val(td[1].innerHTML)
        });
}
//全编辑
function modify_form(obj){
        var modify_unique_id = obj.parent().parent().find("td").eq(1).text()
         data ={
            'modify_unique_id':modify_unique_id,
        } 
        $.ajax({
            type:'POST',
            url:'/index/budget-modify-unique/',
            data:data,
            success:function(result){
                if(result['code'] === 200){
                    var a = result['data'][0]
                    var c = a['Department']//部门
                    var d = a['Customer']//客户
                    budgetform([c,d])
                    var e = a['PurchaseType']//类别
                    var f = a['UnitPrice']//price
                    var g = a ['Quantity']//num
                    var sum = f*g
                    if(e == "杂购"){
                        $("#count_fee").val(sum)
                        $("#month_fee").val((sum/1000).toFixed(2))
                    }else{
                        $("#count_fee").val(sum)
                        if(sum > 600000){
                            $("#month_fee").val((sum/36000).toFixed(2))
                        }else{
                            $("#month_fee").val((sum/12000).toFixed(2))
                        }
                    }
                    $("#budgetId").val(a['Id'])//Id 不可见
                    $("#Remark").val(a['Remark'])//耗损
                    $("#bud_num_type").val(a['ExternalNumberType'])//单号类型
                    $("#bud_principal").val(a['Pic'])// PIC
                    $("#bud_machine_name").val(a['ProductName'])//设备名称
                    $("#bud_machine_type").val(a['Model'])//规格
                    $("#budget_type").val(e)//类别
                    $("#p_price").val(f)//单价
                    $("#p_qty").val(g)//数量
                    $("#bud_qty_type").val(a ['Unit'])//单位
                    $("#moneys").val(a['Currency'])//币种
                    $("#bud_mach_type").val(a['TypeOfMachine'])//机种
                    $("#bud_project_code").val(a['ProjectCode'])//projectcode
                    $("#bud_user").val(a['Signer'])//签核人
                    $("#bud_reason").val(a['ApplyReason'])//理由
                    return false;
                }else{
                    window.message.showError(result['message'])
                    return false;
                }
            }
        })
}
function to_html(num){
    if(num == 1){
        $(".detail").addClass("yc")
        $(".budget").removeClass("yc")
        $(".apply").addClass("yc")
        $(".signing").removeClass("yc")
    }
    if (num == 2){
        $(".detail").addClass("yc")
        $(".budget").removeClass("yc")
        $(".apply").addClass("yc")
        $(".signed").removeClass("yc")
    }
    if(num == 3){
        $(".detail").addClass("yc")
        $(".budget").removeClass("yc")
        $(".apply").addClass("yc")
        $(".statement").removeClass("yc")
    }
    if(num == 4){
        $(".detail").addClass("yc")
        $(".budget").removeClass("yc")
        $(".apply").removeClass("yc")
    }
} 
//设备保养操作界面切换
function operation(){
    $(".operation").removeClass("yc")
    $(".maintain_index").addClass("yc")
    $(".add_main").addClass("yc")
}
function maintion_index(){
    $(".maintain_index").removeClass("yc")
    $(".add_main").addClass("yc")
    $(".operation").addClass("yc")
}
function add_maintoin(){
    $(".add_main").removeClass("yc")
    $(".maintain_index").addClass("yc")
    $(".operation").addClass("yc")
}
//统计分析的图表切换
function picture(){
    $(".chart_pic").removeClass("yc")
    $(".data_tab").addClass("yc")
}
//checkbox全选
$(function () {
    //全选,设置chheckbox name='all' tbody id=tb
    $("input[name=all]").click(function () {
        if (this.checked) {
            $("#statement_detail :checkbox").prop("checked", true);
        } else {
            $("#statement_detail :checkbox").prop("checked", false);
        }
    });
});
//修改密码
function old_new_pwd(){
    var oldpwd = $("#oldpwd").val()
    var newpwd = $("#newpwd").val()
    var againpwd = $("#again").val()
    console.log(oldpwd)
    if(oldpwd == ""|| newpwd == ""|| againpwd == ""){
        window.message.showError("Don't leave a blank field")
    }else{
        if(oldpwd == newpwd){
            window.message.showError("Can't be the same as the old password!")
        }else if(newpwd != againpwd){
            window.message.showError("Two new passwords are different")
        }else{
            $.ajax({
                type:'POST',
                url:'/management/password-modify/',
                data:{"OldPwd":oldpwd,"NewPwd":newpwd},
                success:function (result){
                    if(result['code'] === 200){
                        window.message.showSuccess(result['message'])
                        window.location.href="/login/"
                    }else{
                        window.message.showError(result['message'])
                    }
                }
            })
        }
    }
}
//可视化
function visua(number1,number2,number3){
    var datas = new Array()
    for(var i = 0;i < number1.length;i ++){
        var map = {"value":number1[i][1], "name":number1[i][0],"itemStyle":{color: '#28a745'}}
        datas.push(map)
    }
    datas.push({"value":null, "name":"正常","itemStyle":{color: '#28a745'}})
    for(var i = 0;i < number2.length;i ++){
        var map = {"value":number2[i][1], "name":number2[i][0],"itemStyle":{color: '#ffc107'}}
        datas.push(map)
    }
    datas.push({"value":null, "name":"预警","itemStyle":{color: '#ffc107'}})
    for(var i = 0;i < number3.length;i ++){
        var map = {"value":number3[i][1], "name":number3[i][0],"itemStyle":{color: '#dc3545'}}
        datas.push(map)
    }
    datas.push({"value":null, "name":"超标","itemStyle":{color: '#dc3545'}})
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    var option = {
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['正常','预警','超标']
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}:{c}({d}%)"
        },
        series: [
            {
                name:'数值样本',
                type:'pie',
                radius: ['30%', '60%'],
                center: ['50%', '50%'],
                label: {
                    normal: {
                        formatter: "{b|{b}:}{per|{d}%}",
                        rich: {
                            c: {
                                fontSize: 10,
                                lineHeight:25
                            },
                            per: {
                                padding:[2,4],
                                borderRadius:2
                            }
                        }
                    }
                },
                data:datas,
            }
        ] 
    }; 
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.on('click', function (params) {
//        page_ng = {'page':'1','num':'10'}
        // 控制台打印数据的名称
        visual_data(params.name,params.color);
        $("html, body").animate({
            scrollTop: $("#box").offset().top });
    });
}
//统计分析可视化
function visua_pic(num1,num2){
    //SN数据解析
    var data1 = new Array()
    for(var i = 0;i < num2.length;i ++){
        var map = {"value":num2[i][0], "name":num2[i][1]}
        data1.push(map)
    }
    //FAll次数数据解析
    var data2 = new Array()
    for(var i = 0;i < num1.length;i ++){
        var map = {"value":num1[i][1], "name":num1[i][0]}
        data2.push(map)
    } 
    // 基于准备好的dom，初始化echarts实例
    var myChart3 = echarts.init(document.getElementById('threemain'));
    var myChart4 = echarts.init(document.getElementById('fourmain'));

    // 指定图表的配置项和数据
    var option2 = {
        title: {
            text: 'FAll次数 依据已使用次数范围',
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a}<br/>{b}:{c}({d}%)"
        },
        series : [
            {
                name: '数值样本',
                type: 'pie',
                radius : ['30%','60%'],
                center: ['50%', '50%'],
                label: {
                    normal: {
                        formatter: '{b|{b}:}{per|{d}%}',
                        rich: {
                            c: {
                                fontSize: 10,
                                lineHeight:25
                            },
                            per: {
                                padding:[2,4],
                                borderRadius:2
                            }
                        }
                    }
                },
                data:data2,
            }
        ]
    };
    var option3 = {
        title: {
            text: 'NG数量(按设备名称)',
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a}<br/>{b}:{c}({d}%)"
        },
        series : [
            {
                name: '数值样本',
                type: 'pie',
                radius : ['30%','60%'],
                center: ['50%', '50%'],
                label: {
                    normal: {
                        formatter: '{b|{b}:}{per|{d}%}',
                        rich: {
                            c: {
                                fontSize: 10,
                                lineHeight:25
                            },
                            per: {
                                padding:[2,4],
                                borderRadius:2
                            }
                        }
                    }
                },
                data:data1,
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart3.setOption(option2);
    myChart4.setOption(option3);
}
function ErrorCode(num){
    var dataValue = new Array()
    var dataName = new Array()
    var datas = new Array()
    var sum = 0;
    for(var i = 0;i < num.length;i ++){
        dataName.push(num[i][0])
        dataValue.push(num[i][1])
        datas.push(sum)
        sum = sum + num[i][1]
        }
    dataValue.push(sum)
    dataName.push("总计")
    datas.push(0)
    var myChart1 = echarts.init(document.getElementById('onemain'));
     var option = {
         title: {
            text: '问题分布图',
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var tar = params[1];
                return tar.name+'<br/>'+tar.seriesName+':'+tar.value;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type : 'category',
            splitLine: {show:false},
            data :dataName
        },
        yAxis: {
            type : 'value'
        },
        series: [
            {
                name: '辅助',
                type: 'bar',
                stack:  '总量',
                itemStyle: {
                    normal: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    },
                    emphasis: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data:datas
            },
            {
                name: '样本数据',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data:dataValue
            }
        ]
    }; 
    myChart1.setOption(option);
    myChart1.on('click', function (params) {
        query_errcode(params.name)
    });
}
function pic_partname(num){
    var datas = new Array()
    for(var i = 0;i < num.length;i ++){
        var map = {"value":num[i][1], "name":num[i][0]}
        datas.push(map)
    }
    var myChart2 = echarts.init(document.getElementById('twomain'));
    var option1 = {
        title: {
            text: '问题设备分布图',
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a}<br/>{b}:{c}({d}%)"
        },
        series : [
            {
                name: '数值样本',
                type: 'pie',
                radius : ['30%','60%'],
                center: ['50%', '50%'],
                label: {
                    normal: {
                        formatter: '{b|{b}:}{per|{d}%}',
                        rich: {
                            c: {
                                fontSize: 10,
                                lineHeight:25
                            },
                            per: {
                                padding:[2,4],
                                borderRadius:2
                            }
                        }
                    }
                },
                data:datas,
            }
        ]
    };
    myChart2.setOption(option1);
    myChart2.on('click', function (params) {
        console.log(params.name)
    });
}
$(document).ready(function(){
    $("#budget_type").change(function(){
        var name = $(this).children('option:selected').val();
        var price = $("#p_price").val()
        var qty = $("#p_qty").val()
        var sum = (price*qty).toFixed(2)
        if(name == "杂购"){
            $("#count_fee").val(sum)
            $("#month_fee").val((sum/1000).toFixed(2))
        }else{
            $("#count_fee").val(sum)
            if(sum > 600000){
                 $("#month_fee").val((sum/36000).toFixed(2))
             }else{
                 $("#month_fee").val((sum/12000).toFixed(2))
             }
        }
    });
})
function maintain_sn(obj){
     var id = obj.parent().parent().find("td").eq(2).text()
     console.log(id)
     $("#item_sn").html(id)
}
//设备保养监控
function monitor(){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('maintain'));
    var myChart1 = echarts.init(document.getElementById('maintain_name'));
    // 指定图表的配置项和数据
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
/*         legend: {
            orient: 'vertical',
            x: 'left',
            data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        }, */
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius : ['30%','60%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        formatter: "{b|{b}:}{per|{d}%}",
                        rich: {
                            c: {
                                fontSize: 10,
                                lineHeight:25
                            },
                            per: {
                                padding:[2,4],
                                borderRadius:2
                            }
                        }
                    }
                },
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ]
            }
        ]
    };
   var option1 = {
        tooltip:{
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['正常', '预警','超标']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis:  {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: ['Name1','Name1','Name1','Name1','Name1','Name1','Name1']
        },
        color: ['#28a745','#ffc107','#dc3545'],
        series: [
            {
                name: '正常',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [320, 302, 301, 334, 390, 330, 320]
            },
            {
                name: '预警',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [120, null, 101, 134, 90, 230, 210]
            },
            {
                name: '超标',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [220, 182, 191, 234, 290, 330, 310]
            },
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart1.setOption(option1);
    myChart.on('click', function (params) {
        // 控制台打印数据的名称
        console.log(params.name);
    });
}