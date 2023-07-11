# Generated by Django 4.0.5 on 2023-02-07 10:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('p2p', '0015_alter_offer_payment_method_alter_order_fees'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exchange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='p2p.order', verbose_name='Order related to an exchange')),
            ],
        ),
    ]
