# Generated by Django 2.1.7 on 2019-04-19 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='UpdatedTime',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='department',
            name='UpdatedTime',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='maintenancelog',
            name='UpdatedTime',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='partitem',
            name='CreatedTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='partitem',
            name='UpdatedTime',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='partitemresult',
            name='UpdatedTime',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='CreatedTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='UpdatedTime',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
