import importlib
import logging
from datetime import date

# from celery.schedules import crontab
from celery import shared_task
from django.conf import settings

from p2p.models import Order

logger = logging.getLogger("celery")


@shared_task(name="p2p.cancel_orders_after_time_limit", max_retries=3, bind=True)
def cancel_orders_after_time_limit(self, order_pk):
    order = Order.objects.get(pk=order_pk)
    if not order.confirmed_by_owner and not order.confirmed_by_user:
        order.status = Order.Status.EXPIRED
        order.save()
