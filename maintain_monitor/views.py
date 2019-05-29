from django.shortcuts import render
from django.shortcuts import render, redirect
# from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from app.login.models import User,Department,Customer,BudgetCodeForm,PartItem,PartItemResult,MaintenanceLog,Configuration
from app.login.views import Update_User_IsActivated
from django.views.generic.base import View
from django.db import connection
from django.http import HttpResponseRedirect,HttpResponse
from app import restful,mail
from datetime import datetime,timedelta
from django.conf import settings
import random
import string
import os
import pytz
import time
from openpyxl import load_workbook,Workbook
import json
class maintain_monitor_info(View):
    @csrf_exempt
    def get(self,request):
        #这里是获取近一周的数据，但是由于数据没有更新，所以捞取全部当前的数据
        end_time = datetime.now()
        delta = timedelta(days=300)
        start_time = end_time-delta
        dict_data={}
        data = PartItem.objects.order_by("Id").filter(TrnDate__range=(start_time, end_time))
        limit_value_1 = Configuration.objects.filter(Type="mt_count").values("Max","Id")
        limit_value_2 = Configuration.objects.filter(Type="mt_date").values("Max","Id")
        limit_value1 = list(limit_value_1)
        limit_value2 = list(limit_value_2)
        data = list(data.values())
        start_time = str(datetime.now()).split(' ')[0]
        start_time = datetime.strptime(start_time, "%Y-%m-%d")
        #计算保养次数和保养日期达不达标
        for i in range(0,len(data)):
            if data[i]['NextCheckDate'] == None and data[i]['NextCheckCount'] ==0:
                data[i]['stand_date'] = 0
                data[i]['stand_count'] = 0
            else:
                time_u = datetime.strptime(str(data[i]['NextCheckDate']).split(' ')[0], "%Y-%m-%d")
                days = time_u - start_time
                data[i]['stand_date'] = days.days
                data[i]['stand_count'] = data[i]['NextCheckCount'] - data[i]['UsedTimes']
        dict_data['data'] = data
        dict_data['limit_value1'] = limit_value1
        dict_data['limit_value2'] = limit_value2
        sql = 'SELECT "PartName", COUNT("PartName") FROM "PartItem" where 1=1 '
        # 饼状图需要的数据
        end_time = datetime.now()
        current_time =end_time.strftime('%Y-%m-%d')
        count= Configuration.objects.get(Type="mt_count")
        date = Configuration.objects.get(Type="mt_date")
        date = int(date.Max)
        delta = timedelta(date)
        check_time = end_time + delta
        count = str(int(count.Max))
        # 正常
        sql1 = sql + 'AND "NextCheckCount"-"UsedTimes" > '+count+' AND "NextCheckDate" >\''+check_time.strftime("%Y-%m-%d")+'\' GROUP BY "PartName"'
        # 预警
        sql2 = sql + 'AND ("NextCheckCount"-"UsedTimes" <= ' +count+' AND "NextCheckCount"-"UsedTimes" >= 0'
        sql2 = sql2+ ' OR  "NextCheckDate">=\''+current_time+'\' AND "NextCheckDate" < \''+check_time.strftime("%Y-%m-%d")+'\') GROUP BY "PartName"'
        # 超标
        sql3 = sql + 'AND ("NextCheckCount"-"UsedTimes" < 0 OR "NextCheckDate" < \''+current_time+'\') GROUP BY "PartName"'
        cur = connection.cursor()
        cur.execute(sql1)
        normal = cur.fetchall()
        cur.execute(sql2)
        warning = cur.fetchall()
        cur.execute(sql3)
        danger = cur.fetchall()
        try:
            dict_data['normal'] = normal
            dict_data['warning'] = warning
            dict_data['danger'] = danger
            return restful.ok(data=dict_data)
        except:
            return restful.params_error(message="")

    #设置预警次数和预警天数
    # @csrf_exempt
    # def post(self,request):
    #     maintain_count = request.POST['maintain_count']
    #     maintain_date = request.POST['maintain_date']
    #     maintain_receiver = request.POST.getlist('maintain_receiver[]')
    #     maintain_receiver = list(maintain_receiver)
    #     try:
    #         parameter_count = Configuration.objects.filter(Type="mt_count")
    #         parameter_date = Configuration.objects.filter(Type="mt_date")
    #         mail_receiver_count = ",".join(maintain_receiver)
    #         if parameter_count and parameter_date:
    #             Configuration.objects.filter(Type="mt_count").update(Max=maintain_count,Min=0,Reminders=mail_receiver_count)
    #             Configuration.objects.filter(Type="mt_date").update(Max=maintain_date,Min=0,Reminders=mail_receiver_count)
    #             return restful.ok(message="setup parameter success")
    #         else:
    #             Configuration.objects.create(Type="mt_count", Max=maintain_count, Min=0, Reminders=mail_receiver_count)
    #             Configuration.objects.create(Type="mt_date", Max=maintain_date, Min=0, Reminders=mail_receiver_count)
    #             return restful.ok(message="setup parameter create success")
    #     except:
    #         return restful.params_error(message="setup information error")