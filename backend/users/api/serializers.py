from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.utils import email_address_exists

from ..models import User
from wallet.api.serializers import BitcoinWalletSerializer, EthereumWalletSerializer


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)


    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _('A user is already registered with this e-mail address.'),
                )
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(_("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'phone_number': self.validated_data.get('phone_number', ''),
            'country': self.validated_data.get('country', ''),
            'city': self.validated_data.get('city', ''),
        }
    
    def save_user(self, user):
        user.email = self.cleaned_data.get("email")
        user.first_name = self.cleaned_data.get("first_name")
        user.last_name = self.cleaned_data.get("last_name")
        user.phone_number = self.cleaned_data.get("phone_number")
        user.country = self.cleaned_data.get("country")
        user.city = self.cleaned_data.get("city")
        user.set_password(self.cleaned_data["password1"])
        user.save()
        return user

    def save(self, request):
        cleaned_data = self.get_cleaned_data()
        password = cleaned_data.pop('password1')
        user = get_user_model().objects.create_user(**cleaned_data)
        user.set_password(password)
        user.save()
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    bitcoin_wallet = BitcoinWalletSerializer(read_only=True)
    ethereum_wallet = EthereumWalletSerializer(read_only=True)
    is_email_verified = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'bitcoin_wallet',
            'ethereum_wallet',
            'phone_number',
            'country',
            'city',
            'photo',
            'is_email_verified',
            'has_active_arbitrage_account',
            'reviews',
        ]
        extra_kwargs = {
            'username': {'required': False},
            'phone_number': {'required': False}
        } 

        read_only_fields = ('email',)

    def get_is_email_verified(self, instance):
        if instance.emailaddress_set.exists():
            return instance.emailaddress_set.last().verified

        return False

    def get_reviews(self, obj):
        positive = 0
        negative = 0
        for offer in obj.offers.all():
            positive += offer.orders.filter(review__feedback=True).count()
            negative += offer.orders.filter(review__feedback=False).count()

        return {
            "positive": positive,
            "negative": negative,
        }

    def save(self, **kwargs):
        return super().save(**kwargs)