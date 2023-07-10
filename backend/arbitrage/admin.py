from django import forms
from django.contrib import admin
from django.urls import re_path, reverse
from django.utils.html import format_html

from arbitrage.utils import withdraw_to_main_wallet
from .models import ArbitrageTransaction, ArbitrageSubscription
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils import timezone


class WithdrawForm(forms.Form):

    def save(self, transaction, user):
        # Transfer staked amount + revenue to main wallet
        amount_to_withdraw = transaction.amount + transaction.current_revenue
        withdraw_to_main_wallet(amount_to_withdraw, user, transaction.currency)
        transaction.status = ArbitrageTransaction.Status.WITHDRAW_COMPLETED
        transaction.save()
        return transaction

    

class ArbitrageTransactionAdmin(admin.ModelAdmin):
            
    list_display = (
        'id',
        'currency',
        'amount',
        'revenue_percent',
        'estimate_revenue',
        'current_revenue',
        'staking_period',
        'status',
        'transaction_actions',
        'created_at'
    )
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            re_path(
                r'^(?P<transaction_id>.+)/withdraw/$',
                self.admin_site.admin_view(self.process_withdraw),
                name='transaction-withdraw',
            ),
        ]
        return custom_urls + urls
    def transaction_actions(self, obj):
        if obj.status == ArbitrageTransaction.Status.WITHDRAW_PENDING:
            return format_html(
                '<a class="button" href="{}">Withdraw</a>',
                reverse('admin:transaction-withdraw', args=[obj.pk]),
            )
        else:
            return format_html(
                '',
            )

    transaction_actions.short_description = 'Transaction Actions'
    # transaction_actions.allow_tags = True


    def process_withdraw(self, request, transaction_id, *args, **kwargs):
        return self.process_action(
            request=request,
            transaction_id=transaction_id,
            action_form=WithdrawForm,
            action_title='Withdraw',
        )

    def process_action(
        self,
        request,
        transaction_id,
        action_form,
        action_title
   ):
        transaction = self.get_object(request, transaction_id)
        if transaction.status != ArbitrageTransaction.Status.WITHDRAW_PENDING:
            info = (transaction._meta.app_label, transaction._meta.model_name)
            url = reverse(
                'admin:%s_%s_changelist' % info,
            )
            return HttpResponseRedirect(url)
        if request.method != 'POST':
            form = action_form()
        else:
            form = action_form(request.POST)
            if form.is_valid():
                try:
                    form.save(transaction, transaction.user)
                except:
                    # If save() raised, the form will a have a non
                    # field error containing an informative message.
                    pass
                else:
                    self.message_user(request, 'Success')
                    info = (transaction._meta.app_label, transaction._meta.model_name)
                    url = reverse(
                        'admin:%s_%s_changelist' % info,
                    )
                    return HttpResponseRedirect(url)
        context = self.admin_site.each_context(request)
        context['opts'] = self.model._meta
        context['form'] = form
        context['transaction'] = transaction
        context['title'] = action_title
        return TemplateResponse(
            request,
            'admin/arbitrage/transaction_action.html',
            context,
        )
     

admin.site.register(ArbitrageTransaction, ArbitrageTransactionAdmin)
admin.site.register(ArbitrageSubscription)