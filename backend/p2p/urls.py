from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api.views import OfferCreateListRetrieveViewSet, OrderCreateListRetrieveViewSet, PaymentMethodListViewSet, UserPaymentMethodCreateListViewSet, ReviewCreateAPIView, OrderChatCreateAPIView, DisputeCreateAPIView

router = DefaultRouter()

app_name = 'p2p'

router.register(r'offers', OfferCreateListRetrieveViewSet)
router.register(r'orders', OrderCreateListRetrieveViewSet)
router.register(r'payment-methods', PaymentMethodListViewSet)
router.register(r'my-payment-methods', UserPaymentMethodCreateListViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('review-order/<order_no>', ReviewCreateAPIView.as_view()),
    path('create-message/<order_no>', OrderChatCreateAPIView.as_view()),
    path('create-dispute/<order_no>', DisputeCreateAPIView.as_view()),
]
