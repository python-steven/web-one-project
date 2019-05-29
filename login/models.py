from django.db import models
# Create your models here.

#Department information Form
class Department(models.Model):
    Id = models.AutoField(primary_key=True)
    Department = models.CharField(max_length=50,null=False)               #部门
    IsActivated = models.BooleanField(default=True,null=False)            #激活状态
    UpdatedTime = models.DateTimeField(null=False)     #更新时间
    class Meta:
        db_table = 'Department'

    def __str__(self):
        return 'Id%s: Department(%s)' % (self.Id,self.Department)


#User information Form
class User(models.Model):
    Id = models.AutoField(primary_key=True)
    EmployeeId = models.CharField(max_length=20,null=False)                #员工工号
    Name = models.CharField(max_length=20,null=False)                      #员工名称
    DepartmentId = models.IntegerField(null=False,default=1)               #部门Id
    Password = models.CharField(max_length=50,null=False)                  #登入密码
    Email = models.CharField(max_length=50,null=False)                     #邮箱
    Role = models.CharField(max_length=20,null=False)                      #角色（管理员，设备管理员，。。。）
    IsActivated = models.BooleanField(default=True,null=False)             #激活状态
    CreatedTime = models.DateTimeField(auto_now_add=True,null=False)       #创建时间
    UpdatedTime = models.DateTimeField(null=False)                         #更新时间
    class Meta:
        db_table = 'User'

    def __str__(self):
        return 'Id%s: EmployeeId(%s),Name(%s),Email(%s),Role(%s)' % \
               (self.Id,self.EmployeeId,self.Name,self.Email,self.Role)


# Customer information From
class Customer(models.Model):
    Id = models.AutoField(primary_key=True)
    Customer = models.CharField(max_length=50,null=False)                  #客户名称
    IsActivated = models.BooleanField(default=True,null=False)             #激活状态
    UpdatedTime = models.DateTimeField(null=False)                         #更新时间
    class Meta:
        db_table = 'Customer'

    def __str__(self):
        return 'Id%s:Customer(%s)' % (self.Id,self.Customer)


# #Budgetcode information From
class BudgetCodeForm(models.Model):
    Id = models.BigAutoField(primary_key=True)

    DepartmentId = models.IntegerField(null=False)                         #部门ID(FK: Department Id)
    Department = models.CharField(max_length=10,null=False)                #申请部门
    Remark = models.CharField(max_length=10,null=False)                    #备注/新增或损耗
    Attachment =models.CharField(max_length=100,null=True)                 #评估报告附件(文件名字)
    BillingType = models.CharField(max_length=1,default=0)                 #开单状况(合并开单为设为1，单独开单为0，default:0)
    BudgetCode = models.CharField(max_length=30,null=True)                 #预算编码

    ApplyDate =models.DateTimeField(null=False)                            #申请日期
    ExternalNumberType = models.CharField(max_length=1,null=False)         #外部单号类型，pmcs单号:1; 201单号:2
    ExternalNumber = models.CharField(max_length=40,null=True)             #外部单号，如201单号，pmcs单号
    ExternalNumberEffectiveDate = models.DateTimeField(null=True)          #外部单号生效日期，如201单号，pmcs单号生效日期
    PicId = models.IntegerField(null=True)                                 #负责人的ID

    Pic = models.CharField(max_length=20,null=True)                        #负责人（FK: user id）
    ProductName = models.CharField(max_length=100, null=False)             #设备名称/治具类型
    Model = models.CharField(max_length=100, null=False)                   #规格/型号/版本
    PurchaseType = models.CharField(max_length=10, null=False)             #类别（杂购，折旧摊提）
    UnitPrice = models.FloatField(null=False)                              #单价
    Quantity = models.IntegerField(null=False)                             #申请数量
    Unit = models.CharField(max_length=10, null=False)                     #单位
    Currency = models.CharField(max_length=10, null=False)                 #币种

    CustomerId = models.IntegerField(null=False)                           #客户ID(FK: Customer Id)
    Customer = models.CharField(max_length=50, null=False)                 #客户
    TypeOfMachine = models.CharField(max_length=50, null=False)            #机种
    ProjectCode = models.CharField(max_length=50, null=False)
    ApplyReason = models.CharField(max_length=200,null=False)              #申请原因/用途

    SignerId = models.IntegerField(null=False)                             #签核人id(FK: User Id)
    Signer = models.CharField(max_length=20, null=False)                   #签核人
    Status = models.CharField(max_length=20,null=False)                    #表单状态
    CreatedTime = models.DateTimeField(auto_now_add=True,null=False)       #创建时间
    UpdatedTime = models.DateTimeField(null=False)                         #更新时间

    OwnerId = models.IntegerField(null=True)                               #创建人FK：User Id
    MergeId = models.BigIntegerField(null=True)                           #合并开单时产生的ID，使这几个表单相关联
    SignRemarks = models.CharField(max_length=200,null=True)               #签核人的备注
    AttachmentPath = models.CharField(max_length=200,null=True)            #评估报告存放路径
    class Meta:
        db_table = 'BudgetCodeForm'

    def __str__(self):
        return 'Id%s:BillingType(%s),Department(%s),ApplyDate(%s),Pic(%s),ProductName(%s),Signer(%s),Status(%s),' \
               'BudgetCode(%s)' % \
               (self.Id,self.BillingType,self.Department,self.ApplyDate,self.Pic,self.ProductName,self.Signer,
                self.Status,self.BudgetCode)


#PartItemResult From
class PartItemResult(models.Model):
    Id = models.BigAutoField(primary_key=True)
    USN = models.CharField(max_length=50,null=False)
    SN = models.CharField(max_length=20,null=False)
    OSN = models.CharField(max_length=50,null=False)
    Asset = models.CharField(max_length=50,null=True)
    PN = models.CharField(max_length=20,null=False)                       #料号
    PartName = models.CharField(max_length=50,null=False)                 #料号名
    Spec = models.CharField(max_length=150,null=False)                    #品名
    UsedTimes = models.IntegerField(null=False)                           #使用次数
    Stage = models.CharField(max_length=2,null=False)                     #站别
    FixtureId = models.CharField(max_length=10,null=False)
    Result = models.CharField(max_length=4,null=False)                    #测试结果
    ErrorCode = models.CharField(max_length=30,null=False)                #错误类型
    TrnDate = models.DateTimeField(null=False)
    UpdatedTime = models.DateTimeField(auto_now=True)                     #更新时间
    class Meta:
        db_table = 'PartItemResult'

    def __str__(self):
        return 'Id%s:USN(%s),SN(%s),OSN(%s),Asset(%s),PN(%s),PartName(%s),Spec(%s),UsedTimes(%s),Stage(%s),' \
               'FixtureId(%s),Result(%s),ErrorCode(%s),TrnDate(%s),UpdatedTime(%s)' % \
               (self.Id,self.USN,self.SN,self.OSN,self.Asset,self.PN,self.PartName,self.Spec,self.UsedTimes,
                self.Stage,self.FixtureId,self.Result,self.ErrorCode,self.TrnDate,self.UpdatedTime)


#PartItem Form
class PartItem(models.Model):
    Id = models.BigAutoField(primary_key=True)
    # USN = models.CharField(max_length=50,null=False)
    SN = models.CharField(max_length=20,unique=True)                     #唯一键
    OSN = models.CharField(max_length=50,null=False)
    PN = models.CharField(max_length=20, null=False)                     #料号
    PartName = models.CharField(max_length=50, null=False)               #料号名
    Spec = models.CharField(max_length=150, null=False)                  #品名
    UsedTimes = models.IntegerField(null=False)                          #使用次数
    CreatedTime = models.DateTimeField(auto_now_add=True,null=False)     #创建时间
    UpdatedTime = models.DateTimeField(auto_now=True,null=False)         #更新时间

    CheckCycle = models.IntegerField(null=False,default=0)               #保养周期
    CheckCycleCount = models.IntegerField(null=False,default=0)          #保养次数
    NextCheckCount = models.IntegerField(null=False,default=0)           #下次保养次数
    NextCheckDate = models.DateTimeField(null=True)                      #下次保养时间
    ErrorCounts = models.IntegerField(null=False)                        #累积错误次数
    TrnDate = models.DateTimeField(null=False,default='2019-03-03 11:00:00')
    NGRate = models.FloatField(null=True)                                # 产品率
    Maintainer = models.CharField(max_length=50, null=True)              #保养人
    Asset = models.CharField(max_length=50,null=True)                    #采编
    class Meta:
        db_table = 'PartItem'

    def __str__(self):
        return 'Id%s:SN(%s),OSN(%s),PN(%s),PartName(%s),Spec(%s),UsedTimes(%s),CheckCycle(%s),' \
               'CheckCycleCount(%s),NextCheckCount(%s),NextCheckDate(%s),ErrorCounts(%s)' % \
               (self.Id,self.SN,self.OSN,self.PN,self.PartName,self.Spec,self.UsedTimes,self.CheckCycle,
                self.CheckCycleCount,self.NextCheckCount,self.NextCheckDate,self.ErrorCounts)


#Maintenance Form
class MaintenanceLog(models.Model):
    Id = models.BigAutoField(primary_key=True)
    PartItemId = models.CharField(max_length=50, null=False)             #设备USN
    PartName = models.CharField(max_length=50, null=False)               #料号名
    UpdatedTime = models.DateTimeField(auto_now=True,null=False)         #更新时间
    Status = models.CharField(max_length=10, null=False)                 #状态NG or Pass
    Content = models.CharField(max_length=300, null=False)               #保养内容
    OperatorId = models.IntegerField(null=False)                         #操作员
    CheckDueDate = models.DateTimeField(null=True)                       #既定检查日期
    CheckCount = models.IntegerField(null=True)                          #既定检查次数
    UsedTimes = models.IntegerField(null=True)                           #已使用次数
    Remark = models.CharField(max_length=200,null=True)                  #备注
    class Meta:
        db_table = 'MaintenanceLog'

    def __str__(self):
        return 'Id%s:PartItemId(%s),PartName(%s),Status(%s),Content(%s),OperatorId(%s),CheckDueDate(%s),' \
               'CheckCount(%s),UsedTimes(%s),Remark(%s)'  % \
               (self.Id,self.PartItemId,self.PartName,self.Status,self.Content,self.OperatorId,self.CheckDueDate,
                self.CheckCount,self.UsedTimes,self.Remark)



#Configuration Form model
class Configuration(models.Model):
    Id = models.BigAutoField(primary_key=True)
    Type = models.CharField(max_length=10, null=False)                   #设定类型
    Max = models.FloatField(null=False)                                  #设定区间最大值
    Min = models.FloatField(null=False)                                  #设定区间最小值
    Reminders = models.TextField(null=False)                             #设定邮件提醒人员名单
    class Meta:
        db_table = 'Configuration'

    def __str__(self):
        return 'Id%s:Type(%s),Min(%s),Max(%s),Reminders(%s)' %(self.Id,self.Type,self.Min,self.Max,self.Reminders)









