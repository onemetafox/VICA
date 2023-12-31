# Generated by Django 4.0.5 on 2022-09-25 07:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ArbitrageTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('currency', models.CharField(choices=[('BTC', 'Bitcoin'), ('ETHER', 'Ethereum'), ('VICA', 'Vica Token'), ('USDT', 'Tether (USDT)')], max_length=20, verbose_name='Currency to be buy/sell (BTC, ETHER, USDT, VICA)')),
                ('amount', models.DecimalField(decimal_places=18, default=0, max_digits=33, verbose_name='Stacked amount')),
                ('status', models.CharField(choices=[('CREATED', 'Created'), ('ACTIVE', 'Active'), ('PENDING', 'Withdraw Pending'), ('COMPLETED', 'Withdraw Completed')], default='CREATED', max_length=20, verbose_name='Status of the stacking transaction')),
                ('request_withdraw_at', models.DateTimeField(blank=True, null=True, verbose_name='User request withdraw at')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='arbitrage_transactions', to=settings.AUTH_USER_MODEL, verbose_name='Transaction user')),
            ],
        ),
    ]
