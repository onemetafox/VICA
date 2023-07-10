# Generated by Django 4.0.5 on 2022-08-25 16:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('p2p', '0003_alter_order_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='offer',
            name='time_limit',
            field=models.IntegerField(blank=True, null=True, verbose_name='Offer time limit before get cancelled'),
        ),
        migrations.AddField(
            model_name='offer',
            name='trade_limit_max',
            field=models.BigIntegerField(blank=True, null=True, verbose_name='Offer trade maximum limit'),
        ),
        migrations.AddField(
            model_name='offer',
            name='trade_limit_min',
            field=models.BigIntegerField(blank=True, null=True, verbose_name='Offer trade minimum limit'),
        ),
        migrations.AlterField(
            model_name='offer',
            name='currency',
            field=models.CharField(choices=[('BTC', 'Bitcoin'), ('ETHER', 'Ethereum'), ('VICA', 'Vica Token'), ('USDT', 'Tether (USDT)')], max_length=20, verbose_name='Currency to be buy/sell (BTC, ETHER, USDT, VICA)'),
        ),
        migrations.AlterField(
            model_name='offer',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True, verbose_name='Fixed price for one currency. Default market price'),
        ),
        migrations.AlterField(
            model_name='offer',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='offers', to=settings.AUTH_USER_MODEL, verbose_name='Offer Owner'),
        ),
        migrations.AlterField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to=settings.AUTH_USER_MODEL, verbose_name='User who make this order'),
        ),
    ]