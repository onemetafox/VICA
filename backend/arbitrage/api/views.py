from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers
from rest_framework import viewsets, mixins, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ArbitrageTransactionSerializer, ArbitrageSubscriptionSerializer
from ..models import ArbitrageTransaction, ArbitrageSubscription


class ArbitrageTransactionCreateListViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = ArbitrageTransaction.objects.all()
    serializer_class = ArbitrageTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ArbitrageTransaction.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response

    @action(methods=["OPTIONS", "PUT"], url_path='request-withdraw', detail=True)
    def request_withdraw(self, request, pk=None):
        arbitrage_transaction = get_object_or_404(ArbitrageTransaction, pk=pk)

        if arbitrage_transaction.status != ArbitrageTransaction.Status.ACTIVE:
            raise serializers.ValidationError("Invalid request!")

        arbitrage_transaction.request_withdraw_at = timezone.now()
        arbitrage_transaction.status = ArbitrageTransaction.Status.WITHDRAW_PENDING
        arbitrage_transaction.save()

        return Response({"success": True})


class ArbitrageSubscriptionCreateViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ArbitrageSubscription.objects.all()
    serializer_class = ArbitrageSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ArbitrageTransaction.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        eth_wallet = self.request.user.ethereum_wallet
        eth_wallet.vica_balance -= 10000 
        eth_wallet.save()
        return response
