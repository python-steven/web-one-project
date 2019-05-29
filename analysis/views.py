from django.shortcuts import render
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from app.login.models import User,Department,Customer,BudgetCodeForm,PartItem,PartItemResult,MaintenanceLog,Configuration
# from app.login.views import Update_User_IsActivated
from django.views.generic.base import View
from django.db import connection
from django.http import HttpResponseRedirect,HttpResponse
from app import restful,mail
# from datetime import datetime,timedelta,date
# from django.conf import settings
# import random
# import string
# import os
# import time
# from openpyxl import load_workbook,Workbook
import json

#统计分析的数据的 拉出一周的数据， 这里先拉出来前面10条的数据
class analysis_equipment_info(View):
    def get(self,request):

        visua_data = {}
        #柱状图需要的数据
        sql1 = 'SELECT "ErrorCode", COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\' GROUP BY "ErrorCode"'
        cur = connection.cursor()
        cur.execute(sql1)
        visua_data['errorcode'] = cur.fetchall()

        sql2 = 'SELECT "PartName", COUNT("SN") FROM "PartItemResult" GROUP BY "PartName"'
        cur = connection.cursor()
        cur.execute(sql2)
        visua_data['Partname'] = cur.fetchall()
        #查用户设定的次数
        range_area = Configuration.objects.filter(Type="at_count").order_by("Min")
        li=[]
        if len(range_area) !=0:
            range_sql = 'SELECT COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\''
            for i in range(len(range_area)):
                range_data=range_sql+' AND "UsedTimes">=\''+str(int(range_area[i].Min))+'\' AND "UsedTimes"<=\''+str(int(range_area[i].Max))+'\''
                cur = connection.cursor()
                cur.execute(range_data)
                rank=cur.fetchall()
                new =[str(int(range_area[i].Min))+'~'+str(int(range_area[i].Max)),rank[0][0]]
                li.append(new)
            visua_data['user'] =li
        else:
            sql3 = 'SELECT COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\' and "UsedTimes">0'
            cur = connection.cursor()
            cur.execute(sql3)
            rankelse = cur.fetchall()
            visua_data['user'] = ['0~0',rankelse[0][0]]

        sql4 = 'SELECT COUNT("SN"),"PartName" FROM (select distinct "SN","PartName","Result" from "PartItemResult") as foo where "Result"= \'FAIL\' GROUP BY "PartName"'
        cur = connection.cursor()
        cur.execute(sql4)
        visua_data['filterSN'] = cur.fetchall()
        try:
            return restful.ok(data=visua_data)
        except:
            return restful.params_error(message='data error')
    def post(self,request):
        pass


#数据显示部分
def analysis_data(request):
    if request.method == "GET":
        #数据显示部分的data
        try:
            data = PartItemResult.objects.order_by().all().values()
            data =list(data)
            return restful.ok(data=data)
        except:
            return restful.params_error(message="data got fail")

#设置区间的获取的数据
def analysis_setup_data(request):
    if request.method == "GET":
        try:
            limit_data = Configuration.objects.filter(Type="at_count").order_by("Id").values("Id","Min","Max")
            limit_data = list(limit_data)
            return restful.ok(data=limit_data)
        except:
            return restful.params_error(message="data error")
#设置区间删除的函数
def analysis_delete_data(request):
    if request.method == "POST":
        range_id = request.POST['div_id']
        range_id = range_id.split('_')[0]
        Configuration.objects.filter(Id=int(range_id)).delete()
        try:
            return restful.ok(message="")
        except:
            return restful.params_error(message='data error')
#设置区间提交的数据摄入表里面
@csrf_exempt
def analysis_setup_value(request):
    if request.method == "POST":
        form_data = request.POST.get('data')
        form_data = eval(form_data)
        try:
            dict_analysis = {}
            for i, j in form_data.items():
                dict_analysis[i.split('[')[0][8] + i.split('[')[1].split(']')[0]] = int(j)
            dict_an = {}
            distinct_li = []
            for i in dict_analysis.keys():
                distinct_li.append(i[1:])
            distinct_li = list(set(distinct_li))

            for k in distinct_li:
                val = []
                for i, j in dict_analysis.items():
                    if i[1:] == k:
                        val.append(j)
                    val.sort()
                dict_an[k] = val
            for key, v in dict_an.items():
                try:
                    analysis_obj = Configuration.objects.get(Id=eval(key))
                    analysis_obj.Min=v[0]
                    analysis_obj.Max=v[1]
                    analysis_obj.save()
                except:
                    Configuration.objects.create(Type="at_count",Min=v[0],Max=v[1])
            return restful.ok(data=form_data,message="setup success")  #("/index/")
        except:
            return restful.params_error(data=form_data)


#数据的获取的数据
def analysis_query_data(request):
    if request.method == "GET":
        try:
            data = {}
            stage =list(PartItemResult.objects.all().values("Stage").distinct("Stage"))
            fixtureId = list(PartItemResult.objects.all().values("FixtureId").distinct("FixtureId"))
            USN = list(PartItemResult.objects.all().values("USN").distinct("USN"))
            data['stage']=stage
            data['fixtureId']=fixtureId
            data['USN']=USN
            return restful.ok(data=data)
        except Exception as e:
            return restful.params_error(message=repr(e))

#根据提交的数据进行查询函数的定义
def analysis_query_info(request):
    if request.method =="POST":
        startTime = request.POST['begin']
        endTime = request.POST['end']
        stage = request.POST['stage']
        fixture = request.POST['fixture']
        usn = request.POST['usn']
        visua_data = {}
        sql = 'SELECT "ErrorCode", COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\' '
        sql2 = 'SELECT "PartName", COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\' '
        sql3 = 'SELECT COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\''
        sql4 = 'SELECT COUNT("SN"),"PartName" FROM (select distinct "SN","PartName","Result"' \
               ',"Stage","FixtureId","USN","TrnDate" from "PartItemResult") as foo where "Result"= \'FAIL\''
        if stage !="":
            sql = sql+' AND "Stage"= \'' + stage + '\''
            sql2 = sql2+' AND "Stage"= \'' + stage + '\''
            sql3 = sql3+' AND "Stage"= \'' + stage + '\''
            sql4 = sql4+' AND "Stage"= \'' + stage + '\''
        if fixture != "":
            sql = sql + ' AND "FixtureId"=\'' + fixture + '\''
            sql2 = sql2 + ' AND "FixtureId"=\'' + fixture + '\''
            sql3 = sql3 + ' AND "FixtureId"=\'' + fixture + '\''
            sql4 = sql4 + ' AND "FixtureId"=\'' + fixture + '\''
        if usn != "":
            sql = sql + ' AND "USN"=\'' + usn + '\''
            sql2 = sql2 + ' AND "USN"=\'' + usn + '\''
            sql3 = sql3 + ' AND "USN"=\'' + usn + '\''
            sql4 = sql4 + ' AND "USN"=\'' + usn + '\''
        if startTime !="":
            sql = sql+ ' AND "TrnDate" >=\'' + startTime + '\''
            sql2 = sql2+ ' AND "TrnDate" >=\'' + startTime + '\''
            sql3 = sql3+ ' AND "TrnDate" >=\'' + startTime + '\''
            sql4 = sql4+ ' AND "TrnDate" >=\'' + startTime + '\''
        if endTime !="":
            sql = sql+ ' AND "TrnDate" <=\'' + endTime + '\''
            sql2 = sql2+ ' AND "TrnDate" <=\'' + endTime + '\''
            sql3 = sql3+ ' AND "TrnDate" <=\'' + endTime + '\''
            sql4 = sql4+ ' AND "TrnDate" <=\'' + endTime + '\''
        # 查用户设定的次数
        range_area = Configuration.objects.filter(Type="at_count").order_by("Min")
        li = []
        if len(range_area) != 0:
            for i in range(len(range_area)):
                range_data = sql3 + ' AND "UsedTimes">=\'' + str(int(range_area[i].Min)) + '\' AND "UsedTimes"<=\'' + str(int(range_area[i].Max)) + '\''
                cur = connection.cursor()
                cur.execute(range_data)
                rank = cur.fetchall()
                new = [str(int(range_area[i].Min)) + '~' + str(int(range_area[i].Max)), rank[0][0]]
                li.append(new)
            visua_data['user'] = li
        else:
            range_data =sql3 + ' UsedTimes">0'
            cur = connection.cursor()
            cur.execute(range_data)
            rankelse = cur.fetchall()
            visua_data['user'] = ['0~0', rankelse[0][0]]
        #按errorcode的分类
        errorcode = sql+ ' GROUP BY "ErrorCode"'
        #按partname的分类
        partname = sql2+ ' GROUP BY "PartName"'
        #NG数量的按照partname分类
        SN = sql4+ ' GROUP BY "PartName"'
        #fail区间的数量的查询-----
        cur = connection.cursor()
        cur.execute(errorcode)
        visua_data['errorcode']= cur.fetchall()
        cur.execute(partname)
        visua_data['Partname'] = cur.fetchall()
        cur.execute(SN)
        visua_data['filterSN'] = cur.fetchall()
        try:
            return restful.ok(data=visua_data)
        except:
            return restful.params_error(message="query data is null")

#查询之前获取后端的数据
def analysis_tab_data(request):
    if request.method == "GET":
        data={}
        Stage = list(PartItemResult.objects.all().values("Stage").distinct("Stage"))
        FixtureId = list(PartItemResult.objects.all().values("FixtureId").distinct("FixtureId"))
        USN = list(PartItemResult.objects.all().values("USN").distinct("USN"))
        Result = list(PartItemResult.objects.all().values("Result").distinct("Result"))
        data['Stage'] = Stage
        data['FixtureId'] = FixtureId
        data['USN'] = USN
        data['Result'] = Result
        try:
            return restful.ok(data=data)
        except:
            return restful.params_error(message="data error")

#点击视图需要的条件的查询数据
def analysis_visul_data(request):
    if request.method == "POST":
        try:
            errorcode = request.POST.get('errorcode')
            startTime = request.POST.get('begin')
            endTime = request.POST.get('end')
            stage = request.POST.get('stage')
            fixture = request.POST.get('fixture')
            usn = request.POST.get('usn')
            visua_data = {}
            sql = 'SELECT "ErrorCode", COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\' '
            sql2 = 'SELECT "PartName", COUNT("SN") FROM "PartItemResult" where "Result"= \'FAIL\' '
            if errorcode != "":
                sql = sql + ' AND "ErrorCode"= \'' + errorcode + '\''
                sql2 = sql2 + ' AND "ErrorCode"= \'' + errorcode + '\''
            if stage != "":
                sql = sql + ' AND "Stage"= \'' + stage + '\''
                sql2 = sql2 + ' AND "Stage"= \'' + stage + '\''
            if fixture != "":
                sql = sql + ' AND "FixtureId"=\'' + fixture + '\''
                sql2 = sql2 + ' AND "FixtureId"=\'' + fixture + '\''
            if usn != "":
                sql = sql + ' AND "USN"=\'' + usn + '\''
                sql2 = sql2 + ' AND "USN"=\'' + usn + '\''
            if startTime != "":
                sql = sql + ' AND "TrnDate" >=\'' + startTime + '\''
                sql2 = sql2 + ' AND "TrnDate" >=\'' + startTime + '\''
            if endTime != "":
                sql = sql + ' AND "TrnDate" <=\'' + endTime + '\''
                sql2 = sql2 + ' AND "TrnDate" <=\'' + endTime + '\''
            # 按errorcode的分类
            errorcode = sql + ' GROUP BY "ErrorCode"'
            # 按partname的分类
            partname = sql2 + ' GROUP BY "PartName"'
            cur = connection.cursor()
            cur.execute(errorcode)
            visua_data['errorcode'] = cur.fetchall()
            cur.execute(partname)
            visua_data['Partname'] = cur.fetchall()
            return restful.ok(data=visua_data,)
        except Exception as e:
            return restful.params_error(message=repr(e))



#数据表的数据查询数据
def analysis_query_tab_info(request):
    if request.method == "POST":
        try:
            startTime = request.POST['begin']
            endTime = request.POST['end']
            stage = request.POST['stage']
            fixture = request.POST['fixture']
            usn = request.POST['usn']
            result = request.POST['result']
            sql = 'SELECT * FROM "PartItemResult" where 1=1 '
            if stage != "":
                sql = sql + 'AND "Stage"= \'' + stage + '\''
            if fixture != "":
                sql = sql + 'AND "FixtureId"=\'' + fixture + '\''
            if usn != "":
                sql = sql + 'AND "USN"=\'' + usn + '\''
            if result != "":
                sql = sql + 'AND "USN"=\'' + result + '\''
            if startTime != "":
                sql = sql + 'AND "TrnDate" >=\'' + startTime + '\''
            if endTime != "":
                sql = sql + 'AND "TrnDate" <=\'' + endTime + '\''
            cur = connection.cursor()
            cur.execute(sql)
            data = cur.fetchall()
            return restful.ok(data=data)
        except:
            return restful.params_error(message="query data is null")