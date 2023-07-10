# Generated by Django 4.0.5 on 2022-09-08 12:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('p2p', '0008_alter_order_offer'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPaymentMethod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.CharField(blank=True, max_length=100, null=True, verbose_name='Bank account / Gift number')),
                ('payment_method', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='p2p.paymentmethod', verbose_name='Payment method')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='user_payment_method',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='p2p.userpaymentmethod', verbose_name='User chosen payment method'),
        ),
    ]
