from django.db import models
from django.conf import settings

class PaymentMethod(models.Model):
    class Type(models.TextChoices):
        BANK_TRANSFERS = "BT", "Bank Transfers"
        CASH_PAYMENT = "CP", "Cash Payment"
        DIGITAL_CURRENCIES = "DC", "Digital Currencies"
        GIFT_CARDS = "GC", "Gift Cards"

    type = models.CharField("Payment method type ", choices=Type.choices, max_length=100)
    name = models.CharField("Payment method name (BTC, Western union, ABC bank..)", max_length=100, unique=True)
    # Audit fields
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)

    def __str__(self) -> str:
        return self.name
    

class UserPaymentMethod(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="User", on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethod, verbose_name="Payment method", on_delete=models.CASCADE)
    number = models.CharField("Bank account / Gift number", max_length=100, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user}-{self.payment_method}"



class Offer(models.Model):
    class Type(models.TextChoices):
        BUY = "BUY", "buy"
        SELL = "SELL", "Sell"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        CANCELLED = "CANCELLED", "Cancelled"
        COMPLETED = "COMPLETED", "Completed"
        SUSPENDED = "SUSPENDED", "Suspended"

    class Currency(models.TextChoices):
        BITCOIN = "BTC", "Bitcoin"
        ETHEREUM = "ETHER", "Ethereum"  
        VICA_TOKEN = "VICA", "Vica Token"  
        USDT = "USDT", "Tether (USDT)"

    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="Offer Owner", related_name="offers", on_delete=models.CASCADE)
    type = models.CharField(("What you would like to do? (Buy or Sell)"),choices=Type.choices, max_length=20)
    currency = models.CharField(("Currency to buy/sell (BTC, ETHER, USDT, VICA)"), choices=Currency.choices, max_length=20)
    amount = models.DecimalField("Amount to reach", max_digits=30, decimal_places=18)
    price = models.DecimalField("Fixed price for one currency. Default market price", max_digits=30, decimal_places=6, null=True, blank=True)
    trade_limit_min = models.DecimalField("Offer trade minimum limit", max_digits=30, decimal_places=6, null=True, blank=True)
    trade_limit_max = models.DecimalField("Offer trade maximum limit", max_digits=30, decimal_places=6, null=True, blank=True)
    time_limit = models.PositiveIntegerField("Offer time limit before get cancelled", null=True, blank=True)
    payment_method = models.ForeignKey(PaymentMethod, verbose_name="Payment method to pay with if offer is buy or be paid with if offer is sell", on_delete=models.CASCADE)
    label = models.CharField("Offer label", max_length=200, null=True, blank=True)
    terms = models.TextField("Offer terms", null=True, blank=True)
    instructions = models.TextField("Offer instructions", null=True, blank=True)
    status = models.CharField(("Offer Status"), choices=Status.choices, default=Status.DRAFT, max_length=20)
    # Audit fields
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)

    def reached_amount(self):
        if self.payment_method.type == PaymentMethod.Type.DIGITAL_CURRENCIES:
            raw_amount = self.orders.aggregate(sum=models.Sum('amount_sent'))['sum']
        else:
            if self.type == Offer.Type.SELL:
                raw_amount = self.orders.aggregate(sum=models.Sum('amount_sent') + models.Sum('fees'))['sum']
            else:
                raw_amount = self.orders.aggregate(sum=models.Sum('amount_sent'))['sum']
        if raw_amount and raw_amount > 0:
            return raw_amount / self.price

        return 0

    def available_amount(self):
        return self.amount - self.reached_amount()

    def current_trade_limit_max(self):
        if self.available_amount() * self.price < self.trade_limit_max:
            return self.available_amount() * self.price

        return self.trade_limit_max

    def current_trade_limit_min(self):
        if self.available_amount() * self.price < self.trade_limit_min:
            return self.available_amount() * self.price

        return self.trade_limit_min

    def __str__(self) -> str:
        return f"{self.type} {self.currency} by {self.payment_method}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CANCELLED = "CANCELLED", "Cancelled"
        COMPLETED = "COMPLETED", "Completed"
        EXPIRED = "EXPIRED", "Expired"
        FAILED = "FAILED", "Failed"

    user =  models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="User who make this order", related_name="orders", on_delete=models.CASCADE)
    offer =  models.ForeignKey(Offer, verbose_name="Offer", related_name="orders", on_delete=models.CASCADE)
    order_no = models.CharField(
        "Order Number",
        max_length=250,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text="Unique order number",
    )
    price = models.DecimalField("Price for one currency", max_digits=40, decimal_places=18)
    amount_sent = models.DecimalField("Amount sent to the Offer owner", max_digits=40, decimal_places=18, null=True, blank=True)
    amount_received = models.DecimalField("Amount received to the user", max_digits=40, decimal_places=18, null=True, blank=True)
    fees = models.DecimalField("VICA Foundation fees", max_digits=10, decimal_places=2, null=True, blank=True)
    user_payment_method = models.ForeignKey(UserPaymentMethod, verbose_name="User chosen payment method", on_delete=models.SET_NULL, null=True, blank=True)
    confirmed_by_user = models.BooleanField("User confirmation", default=False)
    confirmed_by_owner = models.BooleanField("Offer owner confirmation", default=False)
    status = models.CharField(("Order Status"), choices=Status.choices, default=Status.PENDING, max_length=20)
    # Audit fields
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)

    def __str__(self) -> str:
        return self.order_no

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.order_no = f"{Order.objects.count()}{self.user.pk}{self.offer.pk}{self.offer.user.pk}"
        super().save(*args, **kwargs)



class Review(models.Model):

    order = models.OneToOneField(Order, verbose_name="Order reviewed", on_delete=models.CASCADE)
    feedback = models.BooleanField('User review', default=True)
    comment =  models.TextField("User comment", null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.order.order_no}-{self.feedback}'



class OrderChat(models.Model):
    order = models.ForeignKey(Order, verbose_name="Order of the message", related_name="messages", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", verbose_name="Message sender", on_delete=models.CASCADE)
    message = models.TextField("Message content")
    # Audit fields
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)



class Dispute(models.Model):
    order = models.ForeignKey(Order, verbose_name="Order of the dispute", related_name="disputes", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", verbose_name="Dispute sender", on_delete=models.CASCADE)
    message = models.TextField("Dispute message content")
    is_resolved = models.BooleanField("Dispute resolving status", default=False)
    # Audit fields
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)


    @property
    def user_name(self):
        return self.user.username

    def __str__(self) -> str:
        return f"dispute-{self.order}-{self.user}"