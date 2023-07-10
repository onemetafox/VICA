from django.contrib import admin

from .models import BitcoinWallet, EthereumWallet

class BitcoinWalletAdmin(admin.ModelAdmin):
    readonly_fields = ['user']
    list_display = ('address', 'user')
    search_fields = ('address', 'user__email')



class EthereumWalletAdmin(admin.ModelAdmin):
    readonly_fields = ['user']
    list_display = ('address', 'user')
    search_fields = ('address', 'user__email')


admin.site.register(BitcoinWallet, BitcoinWalletAdmin)
admin.site.register(EthereumWallet, BitcoinWalletAdmin)
