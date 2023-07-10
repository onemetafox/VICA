# Generated by Django 4.0.5 on 2022-09-05 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0003_remove_btctransaction_order_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='ethereumwallet',
            name='usdt_balance',
            field=models.BigIntegerField(default=0, verbose_name='Wallet usdt balance'),
        ),
        migrations.AlterField(
            model_name='ethereumwallet',
            name='balance',
            field=models.BigIntegerField(default=0, verbose_name='Wallet ether balance in wei'),
        ),
    ]