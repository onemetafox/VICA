from decimal import Decimal
from django.utils import timezone
from django.db import models
from dateutil.relativedelta import relativedelta
from constance import config


class ArbitrageSubscription(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    user = models.OneToOneField("users.User", verbose_name="Subscription User", related_name="arbitrage_subscription", on_delete=models.CASCADE)
    amount = models.DecimalField("Subscription amount", max_digits=33, decimal_places=18, default=0)
    status = models.CharField(("Status of the subscription"), choices=Status.choices, max_length=20, default=Status.ACTIVE)
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)

    def __str__(self) -> str:
        return f"{self.user}-{self.status}"

class ArbitrageTransaction(models.Model):

    class Currency(models.TextChoices):
        BITCOIN = "BTC", "Bitcoin"
        ETHEREUM = "ETHER", "Ethereum"  
        VICA_TOKEN = "VICA", "Vica Token"  
        USDT = "USDT", "Tether (USDT)"  

    class Status(models.TextChoices):
        CREATED = "CREATED", "Created"
        ACTIVE = "ACTIVE", "Active"
        WITHDRAW_PENDING = "PENDING", "Withdraw Pending" # When the User requests a withdrawal
        WITHDRAW_COMPLETED = "COMPLETED", "Withdraw Completed" # When the Admin accept a withdrawal request

    user = models.ForeignKey("users.User", verbose_name="Transaction user", on_delete=models.CASCADE, related_name="arbitrage_transactions")
    currency = models.CharField(("Currency to be buy/sell (BTC, ETHER, USDT, VICA)"), choices=Currency.choices, max_length=20)
    amount = models.DecimalField("Staked amount", max_digits=33, decimal_places=18, default=0)
    status = models.CharField(("Status of the staking transaction"), choices=Status.choices, max_length=20, default=Status.CREATED)
    request_withdraw_at = models.DateTimeField("User request withdraw at", null=True, blank=True)
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)

    def __str__(self) -> str:
        return f"{self.user}-{self.currency}-{self.amount}"

    @property
    def staking_period(self):
        period = relativedelta()
        if self.status == ArbitrageTransaction.Status.ACTIVE:
            period = relativedelta(timezone.now(), self.created_at)
        else:
            if self.request_withdraw_at:
                period = relativedelta(timezone.now(), self.request_withdraw_at)

        # return f"{period.years} years, {period.months} months, {period.days} days"
        return {
            "years": period.years,
            "months": period.months,
            "days": period.days,
        }

    @property
    def revenue_percent(self):
        period_percent = 0
        day_percent = 0
        if self.staking_period['years'] >= 1:
            period_percent += config.ARBITRAGE_YEAR_PERCENT
            day_percent += config.ARBITRAGE_YEAR_PERCENT / 365
        if self.staking_period['months'] >= 9:
            period_percent += config.ARBITRAGE_9_MONTHS_PERCENT
            day_percent += config.ARBITRAGE_9_MONTHS_PERCENT / 360
        elif self.staking_period['months'] >= 6:
            period_percent += config.ARBITRAGE_6_MONTHS_PERCENT
            day_percent += config.ARBITRAGE_6_MONTHS_PERCENT / 270
        elif self.staking_period['months'] >= 3:
            period_percent += config.ARBITRAGE_3_MONTHS_PERCENT
            day_percent += config.ARBITRAGE_3_MONTHS_PERCENT / 180
        else:
            period_percent += config.ARBITRAGE_BELLOW_3_MONTHS_PERCENT
            day_percent += config.ARBITRAGE_BELLOW_3_MONTHS_PERCENT / 90

        return {
            "period_percent": period_percent,
            "day_percent": day_percent,
        }

    @property
    def estimate_revenue(self):
        return self.amount * self.revenue_percent["period_percent"] / 100

    @property
    def current_revenue(self):
        if self.status == ArbitrageTransaction.Status.ACTIVE:
            days = (timezone.now() - self.created_at).days
        else:
            days = (self.request_withdraw_at - self.created_at).days

        return self.amount * Decimal(self.revenue_percent["day_percent"] * days / 100)

