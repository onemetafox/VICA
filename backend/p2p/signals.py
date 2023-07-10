from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Offer, Order
from users.utils import disable_for_loaddata
from .utils import make_crypto_2_crypto_payment, make_service_crypto_payment
from .tasks import cancel_orders_after_time_limit

@receiver(post_save, sender=Order)
@disable_for_loaddata
def make_payment(sender, instance, created, *args, **kwargs):
    offer = instance.offer
    if created:
        # There is no withholding for crypto_2_crypto
        if instance.status == Order.Status.COMPLETED:
            make_crypto_2_crypto_payment(instance, offer)
        else:
            cancel_orders_after_time_limit.apply_async((instance.pk,), countdown=instance.offer.time_limit*60)

    # Process the order if the both parties confirmed the order
    elif instance.status == Order.Status.PENDING and instance.confirmed_by_user and instance.confirmed_by_owner:
        make_service_crypto_payment(instance, offer)
        instance.status = Offer.Status.COMPLETED
        instance.save()
    
    if offer.available_amount() == offer.amount:
        offer.status = Offer.Status.COMPLETED
        offer.save()
