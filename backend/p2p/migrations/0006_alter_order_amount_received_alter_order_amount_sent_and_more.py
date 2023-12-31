# Generated by Django 4.0.5 on 2022-09-06 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('p2p', '0005_alter_offer_currency_alter_offer_instructions_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='amount_received',
            field=models.DecimalField(blank=True, decimal_places=18, max_digits=40, null=True, verbose_name='Amount received to the user'),
        ),
        migrations.AlterField(
            model_name='order',
            name='amount_sent',
            field=models.DecimalField(blank=True, decimal_places=18, max_digits=40, null=True, verbose_name='Amount sent to the Offer owner'),
        ),
        migrations.AlterField(
            model_name='order',
            name='fees',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='VICA Foundation fees in USD'),
        ),
        migrations.AlterField(
            model_name='order',
            name='price',
            field=models.DecimalField(decimal_places=18, max_digits=40, verbose_name='Price for one currency'),
        ),
    ]
