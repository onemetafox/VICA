# Generated by Django 4.0.5 on 2022-11-21 19:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('arbitrage', '0002_alter_arbitragetransaction_amount_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ArbitrageSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=18, default=0, max_digits=33, verbose_name='Subscription amount')),
                ('status', models.CharField(choices=[('ACTIVE', 'Active'), ('INACTIVE', 'Inactive')], default='ACTIVE', max_length=20, verbose_name='Status of the subscription')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='arbitrage_subscription', to=settings.AUTH_USER_MODEL, verbose_name='Subscription User')),
            ],
        ),
    ]