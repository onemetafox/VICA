from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api.views import ArbitrageTransactionCreateListViewSet, ArbitrageSubscriptionCreateViewSet
router = DefaultRouter()

app_name = 'arbitrage'

router.register(r'arbitrage-transactions', ArbitrageTransactionCreateListViewSet)
router.register(r'create-arbitrage-subscription', ArbitrageSubscriptionCreateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
