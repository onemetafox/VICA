from django.apps import AppConfig


class ArbitrageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'arbitrage'

    def ready(self):
        import arbitrage.signals  # noqa