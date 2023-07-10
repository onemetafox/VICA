import os

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import User
from wallet.models import BitcoinWallet, EthereumWallet
from .utils import disable_for_loaddata

@receiver(post_save, sender=User)
@disable_for_loaddata
def create_saving_wallet(sender, instance, created, *args, **kwargs):
    if created:
        BitcoinWallet.objects.create(name='My Bitcoin wallet', user=instance)
        EthereumWallet.objects.create(name='My Ethereum wallet', user=instance)

@receiver(pre_save, sender=User)
@disable_for_loaddata
def delete_old_photo(sender, instance, *args, **kwargs):
    if instance._state.adding and not instance.pk:
        return False

    old_photo = User.objects.get(pk=instance.pk).photo
    if instance.photo != old_photo:
        if old_photo and os.path.isfile(old_photo.path):
            os.remove(old_photo.path)