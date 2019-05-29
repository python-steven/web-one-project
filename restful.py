from django.http import JsonResponse,HttpResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
class Httpcode:
    ok=200
    params_error = 400
    un_auth_error = 403
    method_error = 405
    server_error = 500

def result(code=Httpcode.ok,message='',data='',kwargs=None):
    json_dict = {'code':code,'message':message,'data':data}
    if kwargs and isinstance(kwargs,dict) and kwargs.key():
        json_dict.update(kwargs)
    # if kwargs and isinstance(kwargs,Paginator):
        # json_dict[]=dict(json_dict,**kwargs)
    return JsonResponse(json_dict)

def ok(message=None,data=''):
    return result(code=Httpcode.ok,message=message,data=data)

def params_error(message='',data=''):
    """参数错误"""
    return result(Httpcode.params_error,message=message,data=data)

def un_auth_error(message='',data=None):
    """权限错误"""
    return result(code=Httpcode.un_auth_error,message=message,data=data)
def method_error(message="",data=None):
    """方法错误"""
    return result(code=Httpcode.method_error,message=message,data=data)
def server_error(message='',data=None):
    return result(code=Httpcode.server_error,message=message,data=data)
