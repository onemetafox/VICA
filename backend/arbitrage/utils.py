
def debit_main_wallet(amount_to_stake, user, currency):
    wallet = None
    if currency in ['ETHER', 'USDT', 'VICA']:
        wallet = user.ethereum_wallet
        if currency == 'ETHER':
            wallet.balance -= amount_to_stake
        if currency == 'USDT':
            wallet.usdt_balance -= amount_to_stake
        if currency == 'VICA':
            wallet.vica_balance -= amount_to_stake
    elif currency == 'BTC':
        wallet = user.bitcoin_wallet
        wallet.balance -= amount_to_stake

    if wallet:
        wallet.save()

def withdraw_to_main_wallet(amount_to_withdraw, user, currency):
    wallet = None
    if currency in ['ETHER', 'USDT', 'VICA']:
        wallet = user.ethereum_wallet
        if currency == 'ETHER':
            wallet.balance += amount_to_withdraw
        if currency == 'USDT':
            wallet.usdt_balance += amount_to_withdraw
        if currency == 'VICA':
            wallet.vica_balance += amount_to_withdraw
    elif currency == 'BTC':
        wallet = user.bitcoin_wallet
        wallet.balance += amount_to_withdraw

    if wallet:
        wallet.save()
        