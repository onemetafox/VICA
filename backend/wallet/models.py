from decimal import Decimal
import json
from locale import currency

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from bit.network import NetworkAPI
from web3 import Web3
from eth_keys import keys

from p2p.utils import validate_amount

from .utils import get_btc_private_key_model, get_ether_provider, create_ether_transaction, create_vica_transaction, create_usdt_transaction
from .services import NetworkCustomAPI
from p2p.models import Order, Offer, PaymentMethod


w3 = Web3(get_ether_provider())

class BitcoinWallet(models.Model):

    user = models.OneToOneField("users.User", verbose_name=_("User"), on_delete=models.CASCADE, related_name="bitcoin_wallet", editable=False)
    name = models.CharField(_("Wallet name"), max_length=100, blank=True, null=True)
    address = models.CharField(_("Wallet Address"), max_length=250, editable=False)
    public_key = models.CharField(_("Wallet public key"), max_length=250, editable=False)
    private_key = models.CharField(_("Wallet private key"), max_length=250, editable=False)
    balance = models.DecimalField("Wallet btc balance", max_digits=12, decimal_places=8, default=0)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    def __str__(self) -> str:
        return self.address

    def generate_wallet_info(self):
        pk = get_btc_private_key_model()()
        self.private_key = pk.to_wif()
        self.public_key = pk.pub_to_hex()
        self.address = pk.address

    
    def address_balance(self):
        pending_transaction = BTCTransaction.objects.filter(recipient_address=settings.BITCOIN_WALLET_ADDRESS, status=BTCTransaction.Status.PENDING).last()
        pending_transaction_amount = 0
        if pending_transaction:
            pending_transaction_amount = Decimal(pending_transaction.amount)

        return (NetworkAPI.get_balance(self.address) if settings.DJANGO_ENV == 'production' else NetworkAPI.get_balance_testnet(self.address)) / 100000000 + pending_transaction_amount

    def all_balance(self):
        return self.balance + Decimal(self.address_balance())

    def active_balance(self):
        return self.all_balance() - self.withheld_balance()

    def withheld_balance(self):
        withheld_balance = 0
        pending_orders = self.user.orders.filter(status=Order.Status.PENDING)
        active_offers = self.user.offers.filter(status=Offer.Status.ACTIVE)
        if pending_orders.exists():
            orders_withheld_balance_for_buy_offers = 0
            qs = pending_orders.filter(models.Q(offer__type=Offer.Type.BUY) & models.Q(offer__currency=Offer.Currency.BITCOIN))

            for order in qs:
                orders_withheld_balance_for_buy_offers += order.amount_sent / order.offer.price

            withheld_balance += orders_withheld_balance_for_buy_offers

            orders_withheld_balance_for_sell_offers = 0

            qs = pending_orders.filter(models.Q(offer__type=Offer.Type.SELL) & models.Q(offer__payment_method__name__iexact="bitcoin"))

            for order in qs:
                orders_withheld_balance_for_sell_offers += order.amount_sent / order.offer.price

            withheld_balance += orders_withheld_balance_for_sell_offers

        if active_offers.exists():
            buy_offers_withheld_balance = 0
            qs = active_offers.filter(models.Q(type=Offer.Type.BUY) & models.Q(payment_method__name=Offer.Currency.BITCOIN))
            if qs:
                for offer in qs:
                    buy_offers_withheld_balance += offer.available_amount()

            if buy_offers_withheld_balance:
                withheld_balance += buy_offers_withheld_balance

            sell_offers_withheld_balance = 0
            qs = active_offers.filter(models.Q(type=Offer.Type.SELL) & models.Q(currency=Offer.Currency.BITCOIN))
            if qs:
                for offer in qs:
                    sell_offers_withheld_balance += offer.available_amount()

            if sell_offers_withheld_balance:
                withheld_balance += sell_offers_withheld_balance

        return withheld_balance
    

    def save(self, *args, **kwargs):
        if not self.id:
            self.generate_wallet_info()
        return super(BitcoinWallet, self).save(*args, **kwargs)


class EthereumWallet(models.Model):

    user = models.OneToOneField("users.User", verbose_name=_("User"), on_delete=models.CASCADE, related_name="ethereum_wallet", editable=False)
    name = models.CharField(_("Wallet name"), max_length=100, blank=True, null=True)
    address = models.CharField(_("Wallet Address"), max_length=250, editable=False)
    public_key = models.CharField(_("Wallet public key"), max_length=250, editable=False)
    private_key = models.CharField(_("Wallet private key"), max_length=250, editable=False)
    balance = models.DecimalField("Wallet ether balance", max_digits=23, decimal_places=18, default=0)
    usdt_balance = models.DecimalField("Wallet usdt balance", max_digits=20, decimal_places=6, default=0)
    vica_balance = models.DecimalField("Wallet vica balance", max_digits=33, decimal_places=18, default=0)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    def __str__(self) -> str:
        return self.address

    def generate_wallet_info(self):
        acct = w3.eth.account.create()
        self.private_key = acct.privateKey.hex()
        self.public_key = str(keys.private_key_to_public_key(keys.PrivateKey(acct.privateKey)))
        self.address = acct.address

    def address_balance(self):
        acct = w3.eth.account.from_key(self.private_key)
        return w3.fromWei(w3.eth.get_balance(Web3.toChecksumAddress(acct.address)), 'ether')

    def active_balance(self):
        return self.balance - Decimal(self.withheld_balance())
    
    def withheld_balance(self):
        withheld_balance = 0
        pending_orders = self.user.orders.filter(status=Order.Status.PENDING)
        active_offers = self.user.offers.filter(status=Offer.Status.ACTIVE)
        if pending_orders.exists():
            orders_withheld_balance_for_buy_offers = 0
            qs = pending_orders.filter(models.Q(offer__type=Offer.Type.BUY) & models.Q(offer__currency=Offer.Currency.ETHEREUM))

            for order in qs:
                orders_withheld_balance_for_buy_offers += order.amount_sent / order.offer.price

            withheld_balance += orders_withheld_balance_for_buy_offers

            orders_withheld_balance_for_sell_offers = 0

            qs = pending_orders.filter(models.Q(offer__type=Offer.Type.SELL) & models.Q(offer__payment_method__name__iexact="ethereum"))

            for order in qs:
                orders_withheld_balance_for_sell_offers += order.amount_sent / order.offer.price

            withheld_balance += orders_withheld_balance_for_sell_offers

        if active_offers.exists():
            buy_offers_withheld_balance = 0
            qs = active_offers.filter(models.Q(type=Offer.Type.BUY) & models.Q(payment_method__name=Offer.Currency.ETHEREUM))
            if qs:
                for offer in qs:
                    buy_offers_withheld_balance += offer.available_amount()

            withheld_balance += buy_offers_withheld_balance

            sell_offers_withheld_balance = 0
            qs = active_offers.filter(models.Q(type=Offer.Type.SELL) & models.Q(currency=Offer.Currency.ETHEREUM))
            if qs:
                for offer in qs:
                    sell_offers_withheld_balance += offer.available_amount()

            withheld_balance += sell_offers_withheld_balance

        return withheld_balance

    def address_usdt_balance(self):
        contract = w3.eth.contract(address=settings.USDT_CONTRACT_ADDRESS, abi=settings.USDT_CONTRACT_ABI)
        address_balance = contract.functions.balanceOf(Web3.toChecksumAddress(self.address)).call()
        return Decimal(address_balance / 1000000)

    def active_usdt_balance(self):
        return self.usdt_balance - Decimal(self.withheld_usdt_balance())

    def withheld_usdt_balance(self):
        withheld_balance = 0
        pending_orders = self.user.orders.filter(status=Order.Status.PENDING)
        active_offers = self.user.offers.filter(status=Offer.Status.ACTIVE)
        if pending_orders.exists():
            orders_withheld_balance_for_buy_offers = pending_orders.filter(models.Q(offer__type=Offer.Type.BUY) & models.Q(offer__currency=Offer.Currency.USDT)).aggregate(sum=models.Sum('amount_sent'))['sum']
            if orders_withheld_balance_for_buy_offers:
                withheld_balance += orders_withheld_balance_for_buy_offers
            orders_withheld_balance_for_sell_offers = pending_orders.filter(models.Q(offer__type=Offer.Type.SELL) & models.Q(offer__payment_method__name__iexact="usdt")).aggregate(sum=models.Sum('amount_sent'))['sum']
            if orders_withheld_balance_for_sell_offers:
                withheld_balance += orders_withheld_balance_for_sell_offers
        if active_offers.exists():
            buy_offers_withheld_balance = active_offers.filter(models.Q(type=Offer.Type.BUY) & models.Q(payment_method__type=PaymentMethod.Type.DIGITAL_CURRENCIES) & models.Q(currency=Offer.Currency.USDT)).aggregate(sum=models.Sum('amount'))['sum']
            if buy_offers_withheld_balance:
                withheld_balance += buy_offers_withheld_balance
            sell_offers_withheld_balance = active_offers.filter(models.Q(type=Offer.Type.SELL) & models.Q(currency=Offer.Currency.USDT)).aggregate(sum=models.Sum('amount'))['sum']
            if sell_offers_withheld_balance:
                withheld_balance += sell_offers_withheld_balance

        return withheld_balance

    def address_vica_balance(self):
        contract = w3.eth.contract(address=settings.VICA_CONTRACT_ADDRESS, abi=settings.VICA_CONTRACT_ABI)
        address_balance = contract.functions.balanceOf(Web3.toChecksumAddress(self.address)).call()
        return Decimal(address_balance / 1000000000000000000)

    def active_vica_balance(self):
        return self.vica_balance - Decimal(self.withheld_vica_balance())

    def withheld_vica_balance(self):
        withheld_balance = 0
        pending_orders = self.user.orders.filter(status=Order.Status.PENDING)
        active_offers = self.user.offers.filter(status=Offer.Status.ACTIVE)
        if pending_orders.exists():
            orders_withheld_balance_for_buy_offers = pending_orders.filter(models.Q(offer__type=Offer.Type.BUY) & models.Q(offer__currency=Offer.Currency.VICA_TOKEN)).aggregate(sum=models.Sum('amount_sent'))['sum']
            if orders_withheld_balance_for_buy_offers:
                withheld_balance += orders_withheld_balance_for_buy_offers
            orders_withheld_balance_for_sell_offers = pending_orders.filter(models.Q(offer__type=Offer.Type.SELL) & models.Q(offer__payment_method__name__iexact="vica")).aggregate(sum=models.Sum('amount_sent'))['sum']
            if orders_withheld_balance_for_sell_offers:
                withheld_balance += orders_withheld_balance_for_sell_offers
        if active_offers.exists():
            buy_offers_withheld_balance = 0
            qs = active_offers.filter(models.Q(type=Offer.Type.BUY) & models.Q(payment_method__type=PaymentMethod.Type.DIGITAL_CURRENCIES) & models.Q(currency=Offer.Currency.VICA_TOKEN))

            for offer in qs:
                buy_offers_withheld_balance += offer.available_amount()

            if buy_offers_withheld_balance:
                withheld_balance += buy_offers_withheld_balance

            sell_offers_withheld_balance = 0
            sell_offers_withheld_balance = active_offers.filter(models.Q(type=Offer.Type.SELL) & models.Q(currency=Offer.Currency.VICA_TOKEN))

            for offer in qs:
                sell_offers_withheld_balance += offer.available_amount()

            if sell_offers_withheld_balance:
                withheld_balance += sell_offers_withheld_balance

        return withheld_balance

    def create_transaction(self, recipient_address, amount, _type='ETHER'):
        if not validate_amount(amount, self.user, _type):
            raise ValidationError("You don't have enough balance!")
        if _type == 'ETHER':
            amount_in_wei = w3.toWei(amount, 'ether')
            return create_ether_transaction(settings.ETHEREUM_WALLET_ADDRESS, recipient_address, amount_in_wei, settings.ETHEREUM_WALLET_KEY)
        elif _type == 'VICA':
            return create_vica_transaction(settings.ETHEREUM_WALLET_ADDRESS, recipient_address, amount, settings.ETHEREUM_WALLET_KEY)
        elif _type == 'USDT':
            return create_usdt_transaction(settings.ETHEREUM_WALLET_ADDRESS, recipient_address, amount, settings.ETHEREUM_WALLET_KEY)
            
        return None 
        

    def save(self, *args, **kwargs):
        if not self.id:
            self.generate_wallet_info()
        return super(EthereumWallet, self).save(*args, **kwargs)



class BTCTransaction(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"

    wallet = models.ForeignKey("wallet.BitcoinWallet", verbose_name=_("Transaction wallet"), on_delete=models.CASCADE)
    recipient_address = models.CharField(_("Transaction recipient address"), null=True, max_length=250)
    from_address = models.CharField(_("Transaction sender address"), null=True, max_length=250)
    inputs = models.JSONField(_("Transaction inputs"), null=True, default=dict)
    outputs = models.JSONField(_("Transaction outputs"), null=True, default=dict)
    hash = models.CharField(_("Transaction hash"), max_length=250, null=True, blank=True)
    status = models.CharField(_("Transaction confirmation status"), choices=Status.choices, default=Status.PENDING, max_length=20)
    amount = models.DecimalField("Transaction amount in btc", max_digits=12, decimal_places=8, default=0)
    fees = models.PositiveBigIntegerField(_("Transaction fees in Satoshi"), null=True, blank=True)
    timestamp = models.PositiveBigIntegerField(_("Transaction timestamp"), null=True, blank=True)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    def __str__(self) -> str:
        return self.hash

    def update_info(self):
        # TODO: Check if the transaction get cancelled by the network
        # TODO: Extract the sender and the receiver and amount
        if self.status == BTCTransaction.Status.PENDING:
            if settings.DJANGO_ENV == 'production':
                data = NetworkCustomAPI.get_transaction_by_id(self.hash)
            else:
                data = NetworkCustomAPI.get_transaction_by_id_testnet(self.hash)
            
            if data['confirmed']:
                self.fees = int(data['fee'])
                self.timestamp = int(data['timestamp'])
                self.status = BTCTransaction.Status.CONFIRMED
                self.inputs = data['input']
                self.outputs = data['output']
                self.save()



class ETHTransaction(models.Model):

    class Currency(models.TextChoices):
        ETHEREUM = "ETHER", "Ethereum"  
        VICA_TOKEN = "VICA", "Vica Token"  
        USDT = "USDT", "Tether (USDT)"


    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"


    wallet = models.ForeignKey("wallet.EthereumWallet", verbose_name=_("Transaction wallet"), null=True, on_delete=models.SET_NULL)
    from_address = models.CharField(_("Transaction recipient address"), null=True, max_length=250)
    recipient_address = models.CharField(_("Transaction recipient address"), max_length=250)
    hash = models.CharField(_("Transaction hash"), max_length=250, null=True, blank=True)
    status = models.CharField(_("Transaction confirmation status"), choices=Status.choices, default=Status.PENDING, max_length=20)
    amount = models.DecimalField("Transaction amount", max_digits=33, decimal_places=18, default=0)
    fees = models.PositiveBigIntegerField(_("Transaction fees in wei"), null=True, blank=True)
    currency = models.CharField(_("Transaction currency"), choices=Currency.choices, null=True, blank=True, max_length=50)
    timestamp = models.PositiveBigIntegerField(_("Transaction timestamp"), null=True, blank=True)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    def __str__(self) -> str:
        return self.hash

    def update_info(self):
        #TODO: Check if the transaction get cancelled by the network
        if self.status == BTCTransaction.Status.PENDING:
            try:
                data = w3.eth.get_transaction_receipt(self.hash)
                self.fees = data['gasUsed'] * data['effectiveGasPrice']
                self.timestamp =  w3.eth.get_block(data['blockNumber']).timestamp
                self.status = ETHTransaction.Status.CONFIRMED
                self.save()
            except:
                pass
