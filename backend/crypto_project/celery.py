import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crypto_project.settings')

app = Celery('crypto_project')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


app.conf.beat_schedule = {
    'transfer-to-main-wallet-task': {
        'task': 'wallet.tasks.transfer_to_main_wallet_task',
        'schedule': crontab(minute=0, hour=0),
    },
    'check_unconfirmed_internal_transactions': {
        'task': 'wallet.tasks.check_unconfirmed_internal_transactions',
        'schedule': crontab(minute=0, hour='*/1'),
    },
    'check_unconfirmed_external_transactions': {
        'task': 'wallet.tasks.check_unconfirmed_external_transactions',
        'schedule': crontab(minute='*/30'),
    },
    'check_for_0_02_eth_in_all_wallets': {
        'task': 'wallet.tasks.check_for_0_02_eth_in_all_wallets',
        'schedule': crontab(day_of_week=6),
    },
    'check_for_new_transactions': {
        'task': 'wallet.tasks.check_for_new_transactions',
        'schedule': crontab(minute='*/30'),
    },
}