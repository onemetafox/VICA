from rest_framework import serializers

from ..models import BitcoinWallet, EthereumWallet, BTCTransaction, ETHTransaction
from ..utils import create_btc_transaction


class BitcoinWalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = BitcoinWallet
        fields = [
            'name',
            'address',
            'active_balance',
            'withheld_balance',
        ]
        read_only_fields = ('address',)

    def validate(self, attrs):
        # ..
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        obj = BitcoinWallet.objects.create(**validated_data)
        return obj


class EthereumWalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = EthereumWallet
        fields = [
            'name',
            'address',
            'active_balance',
            'withheld_balance',
            'active_vica_balance',
            'withheld_vica_balance',
            'active_usdt_balance',
            'withheld_usdt_balance',
        ]
        read_only_fields = ('address',)

    def validate(self, attrs):
        # ..
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        obj = EthereumWallet.objects.create(**validated_data)
        return obj


class BTCTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = BTCTransaction
        fields = [
            'recipient_address',
            'amount',
            'hash',
            'confirmed',
            'fees',
        ]
        read_only_fields = ('hash', 'confirmed', 'fees',)

    def validate(self, attrs):
        # ..
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['wallet'] = BitcoinWallet.objects.get(user=user)
        validated_data['hash'] = create_btc_transaction(validated_data['recipient_address'], validated_data['amount'], user.bitcoin_wallet.private_key)
        validated_data['amount'] = validated_data['amount'] / 100000000
        transaction = BTCTransaction.objects.create(**validated_data)
        return transaction


class ETHTransactionSerializer(serializers.ModelSerializer):
    currency_type = serializers.CharField(write_only=True)
    class Meta:
        model = ETHTransaction
        fields = [
            'recipient_address',
            'from_address',
            'amount',
            'hash',
            'confirmed',
            'fees',
            'currency_type',
            'timestamp'
        ]
        read_only_fields = ('hash', 'confirmed', 'fees',)

    def validate(self, attrs):
        # ..
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        currency_type = validated_data.pop('currency_type')
        if currency_type not in ['ETHER', 'VICA', 'USDT']:
            raise serializers.ValidationError('Invalid currency! choices are (ETHER, VICA, USDT)')
        validated_data['wallet'] = EthereumWallet.objects.get(user=user)
        hash = validated_data['wallet'].create_transaction(validated_data['recipient_address'], validated_data['amount'], currency_type)
        if not hash:
            raise serializers.ValidationError('Something went wrong! please try again or contact the administrator')
        validated_data['hash'] = hash
        transaction = ETHTransaction.objects.create(**validated_data)
        return transaction