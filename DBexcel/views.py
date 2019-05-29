

from django.shortcuts import render
from app.login.models import PartItemResult,PartItem
from app.DBexcel.mod_excel import Excel_operation
from AEMSLite.settings import BASE_DIR
from django.db import connection
from app.index.views import check_NGRate
# from AEMSLite.app.index.views import check_NGRate
import time,datetime
import os

# Create your views here.

def crontab_test():
    check_NGRate()
    print(datetime.datetime.now())

def insert_many_to_partItemRestul():
    pathname = os.path.join(BASE_DIR, 'app/DBexcel')
    excel_operation = Excel_operation(pathname)
    file_paths = excel_operation.get_xlsx_list()
    for file_path in file_paths:
        datas = excel_operation.read_by_row(file_path,0)
        insert_list = []
        for data in datas[1:]:
            timearry = datetime.datetime.strptime(data[12], "%m/%d/%Y %I:%M:%S %p")
            data[12] = timearry.strftime('%Y-%m-%d %I:%M:%S')
            case = PartItemResult(
                USN=data[0],SN=data[1],OSN=data[2],Asset=data[3],
                PN=data[4],PartName=data[5],Spec=data[6],
                UsedTimes=data[7],Stage=data[8],FixtureId=data[9],
                Result=data[10],ErrorCode=data[11],TrnDate=data[12],
            )
            insert_list.append(case)

        PartItemResult.objects.bulk_create(insert_list)
        excel_operation.solved_backup(file_path)
    print('insert_to_PartItemResult at %s successfully' %datetime.datetime.now())

def update_for_partItem():
    sql = 'select max("USN"),"SN",max("OSN"),max("PN"),max("PartName"),max("Spec"),max("UsedTimes") as "UsedTimes",' \
          'count(case when "Result"=\'FAIL\' then "Result" else null end) as "ErrorCounts",max("TrnDate") as TrnDate ' \
          'from "PartItemResult" group by "SN";'
    insert_list = []

    with connection.cursor() as cursor:
        start_time = time.time()
        cursor.execute(sql)
        datas = cursor.fetchall()

    for data in datas:
        SN_foo = PartItem.objects.filter(SN=data[1])
        NG_rate = round(data[7] / data[6], 2) if data[6] > 0 else 0
        if SN_foo:
            SN_foo[0].UsedTimes = data[6]
            SN_foo[0].ErrorCounts = data[7]
            SN_foo[0].TruDate = data[8]
            SN_foo[0].NGRate = NG_rate
            SN_foo[0].save()
        else:
            case = PartItem(
                SN=data[1], OSN=data[2],PN=data[3],
                PartName=data[4], Spec=data[5],
                UsedTimes=data[6], NextCheckDate=None,
                ErrorCounts=data[7],TrnDate=data[8],
                NGRate=NG_rate,
            )
            insert_list.append(case)

    if insert_list:
        PartItem.objects.bulk_create(insert_list)
    print('update_for_PartItem at %s successfully'%datetime.datetime.now())

