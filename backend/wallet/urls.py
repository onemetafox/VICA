from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api.views import BTCTransactionCreateListRetrieveViewSet, ETHTransactionCreateListRetrieveViewSet, currency_converter, estimate_fees

router = DefaultRouter()

app_name = 'wallet'

router.register(r'btc_transactions', BTCTransactionCreateListRetrieveViewSet)
router.register(r'ether_transactions', ETHTransactionCreateListRetrieveViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('currency-converter/', currency_converter, name='currency-converter'),
    path('estimate-transaction-fees/', estimate_fees, name='estimate-fees')
]
