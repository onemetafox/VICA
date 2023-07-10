from rest_framework import serializers

from p2p.utils import validate_amount
from ..models import ArbitrageTransaction, ArbitrageSubscription

class ArbitrageTransactionSerializer(serializers.ModelSerializer):
    staking_period = serializers.JSONField(read_only=True)
    revenue_percent = serializers.JSONField(read_only=True)
    class Meta:
        model = ArbitrageTransaction
        fields = (
            'id',
            'currency',
            'amount',
            'revenue_percent',
            'estimate_revenue',
            'current_revenue',
            'staking_period',
            'created_at',
            'status',
            'request_withdraw_at',
        )
        read_only_fields = (
            'created_at',
            'status',
            'request_withdraw_at',
        )
        extra_kwargs = {'amount': {'required': True}} 

    def validate(self, attrs):
        user = self.context['request'].user
        if not validate_amount(attrs['amount'], user, attrs['currency']):
            raise serializers.ValidationError('You don\'t have enough balance!')

        if not user.has_active_arbitrage_account:
            raise serializers.ValidationError('You should subscribe on the Arbitrage service !')

        return attrs

    # def validate_amount(self, amount):
    #     if amount > 0
    #     return amount

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class ArbitrageSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArbitrageSubscription
        fields = (
            'id',
            'status',
            'amount',
            'created_at',
        )
        read_only_fields = (
            'created_at',
            'status',
            'amount',
        )

    def validate(self, attrs):
        user = self.context['request'].user
        if hasattr(user, 'arbitrage_subscription'):
            raise serializers.ValidationError('You have already an active subscription!')
    
        if not validate_amount(10000, user, 'VICA'):
            raise serializers.ValidationError('You don\'t have enough balance!')

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['amount'] = 10000
        return super().create(validated_data)