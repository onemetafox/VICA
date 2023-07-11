# Generated by Django 4.0.5 on 2023-02-25 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0012_btctransaction_from_address_btctransaction_inputs_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethtransaction',
            name='status',
            field=models.CharField(choices=[('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed'), ('CANCELLED', 'Cancelled'), ('FAILED', 'Failed')], default='PENDING', max_length=20, verbose_name='Transaction confirmation status'),
        ),
    ]
