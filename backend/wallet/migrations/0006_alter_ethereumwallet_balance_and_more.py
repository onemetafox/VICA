# Generated by Django 4.0.5 on 2022-09-06 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0005_ethereumwallet_vica_balance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethereumwallet',
            name='balance',
            field=models.DecimalField(decimal_places=18, default=0, max_digits=23, verbose_name='Wallet ether balance in wei'),
        ),
        migrations.AlterField(
            model_name='ethereumwallet',
            name='usdt_balance',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=20, verbose_name='Wallet usdt balance'),
        ),
        migrations.AlterField(
            model_name='ethereumwallet',
            name='vica_balance',
            field=models.DecimalField(decimal_places=18, default=0, max_digits=33, verbose_name='Wallet vica balance'),
        ),
    ]
