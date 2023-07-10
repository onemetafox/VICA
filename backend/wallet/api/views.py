from decimal import Decimal
from django.conf import settings
from web3 import Web3
from rest_framework import status
from rest_framework import viewsets, mixins, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.serializers import ValidationError

from wallet.utils import convert_currencies, estimate_btc_fees, estimate_ether_fees, estimate_usdt_fees, estimate_vica_fees, get_ether_provider
from wallet.tasks import check_for_new_btc_transactions, check_for_new_eth_transactions
from .serializers import BTCTransactionSerializer, ETHTransactionSerializer
from ..models import BTCTransaction, ETHTransaction


class BTCTransactionCreateListRetrieveViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = BTCTransaction.objects.all()
    serializer_class = BTCTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'hash'

    def get_queryset(self):
        check_for_new_btc_transactions.apply_async((self.request.user.bitcoin_wallet.address,))
        return BTCTransaction.objects.filter(wallet=self.request.user.bitcoin_wallet)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {"message": "Transaction pushed to the network successfully", "hash": response.data.get('hash', '')}
        return response
    
    def list(self, request, *args, **kwargs):
        user = request.user
        response = super().list(request, *args, **kwargs)
        response.data = [{'hash': tx['hash'], 'from': user.bitcoin_wallet.address, 'to': tx['recipient_address'], 'amount': tx['amount']} for tx in response.data]
        return response

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {'hash': serializer.data['hash'], 'input': instance.input, 'output': instance.output, 'amount': serializer.data['amount'], 'fees': serializer.data['fees'], 'confirmed': serializer.data['confirmed']}
        return Response(data)


class ETHTransactionCreateListRetrieveViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = ETHTransaction.objects.all()
    serializer_class = ETHTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'hash'

    def get_queryset(self):
        check_for_new_eth_transactions.apply_async((self.request.user.ethereum_wallet.address,))
        return ETHTransaction.objects.filter(wallet=self.request.user.ethereum_wallet)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {"message": "Transaction pushed to the network successfully", "hash": response.data.get('hash', '')}
        return response
    
    def list(self, request, *args, **kwargs):
        user = request.user
        response = super().list(request, *args, **kwargs)
        response.data = [{'hash': tx['hash'], 'from': user.ethereum_wallet.address, 'to': tx['recipient_address'], 'amount': tx['amount']} for tx in response.data]
        return response

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.update_info()
        serializer = self.get_serializer(instance)
        data = {'hash': serializer.data['hash'], 'from': serializer.data['from_address'], 'to': serializer.data['recipient_address'], 'amount': serializer.data['amount'], 'fees': serializer.data['fees'], 'timestamp': serializer.data['timestamp'], 'confirmed': serializer.data['confirmed']}
        return Response(data)


@api_view(['GET'])
def currency_converter(request):

    _from = request.GET.get('from', None)
    to = request.GET.get('to', None)
    amount = float(request.GET.get('amount', None))

    if not (_from in ['ETH', 'BTC', 'USD', 'EUR', 'VICA'] and to in ['ETH', 'BTC', 'USD', 'EUR', 'VICA']):
        return Response({})
    else:
        return Response({"result": convert_currencies(_from, to, amount)})


@api_view(['GET'])
def estimate_fees(request):
    currency = request.GET.get('currency', None)
    to = request.GET.get('to', None)
    amount = request.GET.get('amount', None)
        
    if not currency:
        raise ValidationError("'currency' field is required")

    if not to:
        raise ValidationError("'to' field is required")

    if not amount:
        raise ValidationError("'amount' field is required")

    amount = float(amount)
    w3 = Web3(get_ether_provider())

    if currency == 'BTC':
        return Response({'estimate_fees': estimate_btc_fees(settings.BITCOIN_WALLET_KEY, to, amount)})
    
    elif currency == 'ETHER':
        return Response({'estimate_fees': w3.fromWei(estimate_ether_fees(settings.ETHEREUM_WALLET_ADDRESS, to, w3.eth.gas_price), 'ether')})
    
    elif currency == 'USDT':
        amount *= 1000000
        return Response({'estimate_fees': w3.fromWei(estimate_usdt_fees(settings.ETHEREUM_WALLET_ADDRESS, to, amount, w3.eth.gas_price), 'ether')})
    
    elif currency == 'VICA':
        amount *= 1000000000000000000
        return Response({'estimate_fees': w3.fromWei(estimate_vica_fees(settings.ETHEREUM_WALLET_ADDRESS, to, amount, w3.eth.gas_price), 'ether')})

    return Response({"Error": "Invalid currency"})