# Generated by Django 4.0.5 on 2022-09-06 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('p2p', '0006_alter_order_amount_received_alter_order_amount_sent_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offer',
            name='amount',
            field=models.DecimalField(decimal_places=18, max_digits=30, verbose_name='Amount to reach'),
        ),
        migrations.AlterField(
            model_name='offer',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=30, null=True, verbose_name='Fixed price for one currency. Default market price'),
        ),
        migrations.AlterField(
            model_name='offer',
            name='time_limit',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Offer time limit before get cancelled'),
        ),
        migrations.AlterField(
            model_name='offer',
            name='trade_limit_max',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=30, null=True, verbose_name='Offer trade maximum limit'),
        ),
        migrations.AlterField(
            model_name='offer',
            name='trade_limit_min',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=30, null=True, verbose_name='Offer trade minimum limit'),
        ),
    ]
