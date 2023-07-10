from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.utils import disable_for_loaddata
from .models import ArbitrageTransaction
from .utils import debit_main_wallet

@receiver(post_save, sender=ArbitrageTransaction)
@disable_for_loaddata
def make_transfer(sender, instance, created, *args, **kwargs):
    if created:
        debit_main_wallet(instance.amount, instance.user, instance.currency)
        instance.status = ArbitrageTransaction.Status.ACTIVE
        instance.save()
