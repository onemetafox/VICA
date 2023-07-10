from rest_framework import serializers

from ..models import Offer, Order, PaymentMethod, Review, UserPaymentMethod, OrderChat, Dispute
from ..utils import validate_amount, calculate_amount_received



class ReviewSerializer(serializers.ModelSerializer):
    order_no = serializers.CharField(source='order.order_no', read_only=True)
    class Meta:
        model = Review
        fields = (
            'order_no',
            'feedback',
            'comment'
        )

    def create(self, validated_data):
        return super().create(validated_data)



class OrderChatSerializer(serializers.ModelSerializer):
    order_no = serializers.CharField(source='order.order_no', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    user_type = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = OrderChat
        fields = (
            'order_no',
            'user',
            'username',
            'user_type',
            'message',
            'created_at',
        )
        read_only_fields = (
            'user',
        )

    def get_user_type(self, instance):
        if instance.order.user == instance.user:
            return "normal"
        else:
            return "owner"

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)



class DisputeSerializer(serializers.ModelSerializer):
    order_no = serializers.CharField(source='order.order_no', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_type = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Dispute
        fields = (
            'order_no',
            'user',
            'username',
            'user_type',
            'user_email',
            'message',
            'created_at',
        )
        read_only_fields = (
            'user',
            'is_resolved',
        )

    def get_user_type(self, instance):
        if instance.order.user == instance.user:
            return "normal"
        else:
            return "owner"

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)



class OrderSerializer(serializers.ModelSerializer):
    review = ReviewSerializer(read_only=True)
    messages = serializers.SerializerMethodField(read_only=True)
    disputes = serializers.SerializerMethodField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Order
        fields = [
            'order_no',
            'username',
            'offer',
            'price',
            'amount_sent',
            'amount_received',
            'status',
            'fees',
            'confirmed_by_user',
            'confirmed_by_owner',
            'user_payment_method',
            'created_at',
            'updated_at',
            'review',
            'messages',
            'disputes',
        ]
        read_only_fields = [
            'order_no',
            'price',
            'status',
            'fees',
            'amount_received',
            'confirmed_by_user',
            'confirmed_by_owner',
            'created_at',
            'updated_at',
            'review',
        ]
        lookup_field = 'order_no'

    def get_messages(self, instance):
        messages = instance.messages.all().order_by('created_at')
        return OrderChatSerializer(messages, many=True).data

    def get_disputes(self, instance):
        disputes = instance.disputes.filter(user=self.context['request'].user).order_by('created_at')
        return DisputeSerializer(disputes, many=True).data

    def validate(self, attrs):
        offer = attrs['offer']
        if attrs['amount_sent'] < offer.current_trade_limit_min() or attrs['amount_sent'] > offer.current_trade_limit_max():
            raise serializers.ValidationError('Please enter a valid amount!')

        if offer.type == Offer.Type.BUY:
            if offer.payment_method.type == PaymentMethod.Type.DIGITAL_CURRENCIES:
                if not validate_amount(attrs['amount_sent'], self.context['request'].user, offer.currency):
                    raise serializers.ValidationError('You don\'t have enough balance!')
            else:
                if not attrs.get('user_payment_method', None):
                    raise serializers.ValidationError('user_payment_method is required!')

                if offer.payment_method.name != attrs['user_payment_method'].payment_method.name or (not UserPaymentMethod.objects.filter(user=self.context['request'].user, payment_method=offer.payment_method).exists()):
                    raise serializers.ValidationError('Invalid payment method!')
                if not validate_amount(attrs['amount_sent'] / attrs['offer'].price, self.context['request'].user, offer.currency):
                    raise serializers.ValidationError('You don\'t have enough balance!')
        else:
            if offer.payment_method.type == PaymentMethod.Type.DIGITAL_CURRENCIES:
                if not validate_amount(attrs['amount_sent'], self.context['request'].user, offer.payment_method.name):
                    raise serializers.ValidationError('You don\'t have enough balance!')
            
        return attrs

    def validate_offer(self, value):
        if value.user == self.context['request'].user:
            raise serializers.ValidationError('You can\'t order your offers!')

        if value.status != Offer.Status.ACTIVE:
            raise serializers.ValidationError('Invalid offer!')
            
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['price'] = validated_data['offer'].price
        validated_data['fees'] = 0
        if validated_data['offer'].payment_method.type == PaymentMethod.Type.DIGITAL_CURRENCIES:
            validated_data['amount_received'] = calculate_amount_received(validated_data['offer'].price, validated_data['amount_sent'])
        else:
            validated_data['amount_received'] = validated_data['amount_sent']

        if validated_data['offer'].payment_method.type == PaymentMethod.Type.DIGITAL_CURRENCIES:
            validated_data['status'] = Offer.Status.COMPLETED
            validated_data.pop('user_payment_method', None)

        
        obj = Order.objects.create(**validated_data)
        return obj



class OfferSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    user_country = serializers.CharField(source='user.country', read_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Offer
        fields = [
            'id',
            'username',
            'type',
            'currency',
            'amount',
            'available_amount',
            'reached_amount',
            'price',
            'trade_limit_min',
            'current_trade_limit_min',
            'trade_limit_max',
            'current_trade_limit_max',
            'time_limit',
            'payment_method',
            'label',
            'terms',
            'instructions',
            'status',
            'created_at',
            'updated_at',
            'user_country',
            'reviews',
        ]
        extra_kwargs = {
            'price': {'required': True},
            'trade_limit_min': {'required': True},
            'trade_limit_max': {'required': True},
            'time_limit': {'required': True},
            'label': {'required': True},
            'terms': {'required': True},
            'instructions': {'required': True},
            }


    def validate(self, attrs):
        if attrs['payment_method'].name.lower() == attrs['currency'].lower():
            raise serializers.ValidationError('You can\'t exchange the same currency!')

        if attrs['type'] == Offer.Type.BUY:
            if attrs['payment_method'].type == PaymentMethod.Type.DIGITAL_CURRENCIES:
                if not validate_amount(attrs['amount'], self.context['request'].user, attrs['payment_method'].name):
                    raise serializers.ValidationError('You don\'t have enough balance!')
        else:
            if not validate_amount(attrs['amount'], self.context['request'].user, attrs['currency']):
                raise serializers.ValidationError('You don\'t have enough balance!')

        if attrs['trade_limit_max'] > attrs['amount'] * attrs['price']:
            raise serializers.ValidationError('trade_limit_max must be less than amount!')
        return attrs

    def validate_status(self, value):
        if value != Offer.Status.ACTIVE:
            return Offer.Status.DRAFT

        return value

    def validate_trade_limit_min(self, value):
        if not value > 0:
            raise serializers.ValidationError('trade_limit_min must be greater than zero!')

        return value

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        obj = Offer.objects.create(**validated_data)
        return obj

    def get_username(self, obj):
        return obj.user.username

    def get_reviews(self, obj):
        return {
            "positive": obj.orders.filter(review__feedback=True).count(),
            "negative": obj.orders.filter(review__feedback=False).count(),
        }


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = (
            'id',
            'type',
            'name',
        )
        read_only_fields = ('__all__',)

        
        
class UserPaymentMethodSerializer(serializers.ModelSerializer):
    payment_method_type = serializers.SerializerMethodField(read_only=True)
    payment_method_name = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = UserPaymentMethod
        fields = (
            'id',
            'payment_method',
            'payment_method_type',
            'payment_method_name',
            'number'
        )
        read_only_fields = ('id', 'payment_method_type', 'payment_method_name',)

    def validate_payment_method(self, value):
        if value.type == PaymentMethod.Type.DIGITAL_CURRENCIES:
            raise serializers.ValidationError("Invalid payment_method type")

        if UserPaymentMethod.objects.filter(user=self.context['request'].user, payment_method=value).exists():
            raise serializers.ValidationError("You have already save this payment method")

        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def get_payment_method_type(self, obj):
        return obj.payment_method.type

    def get_payment_method_name(self, obj):
        return obj.payment_method.name
