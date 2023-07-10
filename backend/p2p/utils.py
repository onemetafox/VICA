
def validate_amount(amount, user, currency):
    if currency in ['ETHER', 'USDT', 'VICA']:
        wallet = user.ethereum_wallet
        if currency == 'ETHER':
            return amount <= wallet.active_balance()
        if currency == 'USDT':
            return amount <= wallet.active_usdt_balance()
        if currency == 'VICA':
            return amount <= wallet.active_vica_balance()
    elif currency == 'BTC':
        return amount <= user.bitcoin_wallet.active_balance()
        


def calculate_amount_received(price, amount_sent):
    return amount_sent / price

def make_crypto_2_crypto_payment(order, offer):
    from p2p.models import Offer

    user = order.user
    owner = offer.user
    owner_btc_wallet = owner.bitcoin_wallet
    owner_ether_wallet = owner.ethereum_wallet
    user_btc_wallet = user.bitcoin_wallet
    user_ether_wallet = user.ethereum_wallet
    offer_type = offer.type
    offer_currency = offer.currency
    payment_method_currency = offer.payment_method.name
    amount_sent_to_owner = order.amount_sent
    amount_received_by_user = order.amount_received
    fees = amount_sent_to_owner * 0.75 / 100
    order.fees = fees
    order.save()
    if offer_type == Offer.Type.BUY:
        if offer_currency == Offer.Currency.BITCOIN:
            owner_btc_wallet.balance += (amount_sent_to_owner - fees)
            user_btc_wallet.balance -= amount_sent_to_owner
        elif offer_currency == Offer.Currency.ETHEREUM:
            owner_ether_wallet.balance += (amount_sent_to_owner - fees)
            user_ether_wallet.balance -= amount_sent_to_owner
        elif offer_currency == Offer.Currency.USDT:
            owner_ether_wallet.usdt_balance += (amount_sent_to_owner - fees)
            user_ether_wallet.usdt_balance -= amount_sent_to_owner
        elif offer_currency == Offer.Currency.VICA_TOKEN:
            owner_ether_wallet.vica_balance += (amount_sent_to_owner - fees)
            user_ether_wallet.vica_balance -= amount_sent_to_owner

        if payment_method_currency == Offer.Currency.BITCOIN:
            owner_btc_wallet.balance -= amount_received_by_user
            user_btc_wallet.balance += amount_received_by_user
        elif payment_method_currency == Offer.Currency.ETHEREUM:
            owner_ether_wallet.balance -= amount_received_by_user
            user_ether_wallet.balance += amount_received_by_user
        elif payment_method_currency == Offer.Currency.USDT:
            owner_ether_wallet.usdt_balance -= amount_received_by_user
            user_ether_wallet.usdt_balance += amount_received_by_user
        elif payment_method_currency == Offer.Currency.VICA_TOKEN:
            owner_ether_wallet.vica_balance -= amount_received_by_user
            user_ether_wallet.vica_balance += amount_received_by_user

    elif offer_type == Offer.Type.SELL:
        if payment_method_currency == Offer.Currency.BITCOIN:
            owner_btc_wallet.balance += (amount_sent_to_owner - fees)
            user_btc_wallet.balance -= amount_sent_to_owner
        elif payment_method_currency == Offer.Currency.ETHEREUM:
            owner_ether_wallet.balance += (amount_sent_to_owner - fees)
            user_ether_wallet.balance -= amount_sent_to_owner
        elif payment_method_currency == Offer.Currency.USDT:
            owner_ether_wallet.usdt_balance += (amount_sent_to_owner - fees)
            user_ether_wallet.usdt_balance -= amount_sent_to_owner
        elif payment_method_currency == Offer.Currency.VICA_TOKEN:
            owner_ether_wallet.vica_balance += (amount_sent_to_owner - fees)
            user_ether_wallet.vica_balance -= amount_sent_to_owner

        if offer_currency == Offer.Currency.BITCOIN:
            owner_btc_wallet.balance -= amount_received_by_user
            user_btc_wallet.balance += amount_received_by_user
        elif offer_currency == Offer.Currency.ETHEREUM:
            owner_ether_wallet.balance -= amount_received_by_user
            user_ether_wallet.balance += amount_received_by_user
        elif offer_currency == Offer.Currency.USDT:
            owner_ether_wallet.usdt_balance -= amount_received_by_user
            user_ether_wallet.usdt_balance += amount_received_by_user
        elif offer_currency == Offer.Currency.VICA_TOKEN:
            owner_ether_wallet.vica_balance -= amount_received_by_user
            user_ether_wallet.vica_balance += amount_received_by_user

    owner_btc_wallet.save()
    owner_ether_wallet.save()
    user_btc_wallet.save()
    user_ether_wallet.save()

def make_service_crypto_payment(order, offer):
    from p2p.models import Offer, PaymentMethod

    user = order.user
    owner = offer.user
    owner_btc_wallet = owner.bitcoin_wallet
    owner_ether_wallet = owner.ethereum_wallet
    user_btc_wallet = user.bitcoin_wallet
    user_ether_wallet = user.ethereum_wallet
    offer_type = offer.type
    offer_currency = offer.currency

    if offer_type == Offer.Type.BUY:
        amount_sent_to_owner_raw = order.amount_sent / order.price
        if offer.payment_method == PaymentMethod.Type.GIFT_CARDS:
            fees = amount_sent_to_owner_raw * 2 / 100
        else:
            fees = amount_sent_to_owner_raw * 0.75 / 100
        order.fees = fees
        order.save()
        amount_sent_to_owner = amount_sent_to_owner_raw - fees
        if offer_currency == Offer.Currency.BITCOIN:
            owner_btc_wallet.balance += amount_sent_to_owner
            user_btc_wallet.balance -= amount_sent_to_owner_raw
        elif offer_currency == Offer.Currency.ETHEREUM:
            owner_ether_wallet.balance += amount_sent_to_owner
            user_ether_wallet.balance -= amount_sent_to_owner_raw
        elif offer_currency == Offer.Currency.USDT:
            owner_ether_wallet.usdt_balance += amount_sent_to_owner
            user_ether_wallet.usdt_balance -= amount_sent_to_owner_raw
        elif offer_currency == Offer.Currency.VICA_TOKEN:
            owner_ether_wallet.vica_balance += amount_sent_to_owner
            user_ether_wallet.vica_balance -= amount_sent_to_owner_raw

    elif offer_type == Offer.Type.SELL:
        amount_received_by_user = order.amount_received / order.price
        fees = order.amount_received * 0.75 / 100
        order.fees = fees
        order.save()
        fees_in_crypto = fees / order.price
        if offer_currency == Offer.Currency.BITCOIN:
            owner_btc_wallet.balance -= (amount_received_by_user + fees_in_crypto)
            user_btc_wallet.balance += amount_received_by_user
        elif offer_currency == Offer.Currency.ETHEREUM:
            owner_ether_wallet.balance -= (amount_received_by_user + fees_in_crypto)
            user_ether_wallet.balance += amount_received_by_user
        elif offer_currency == Offer.Currency.USDT:
            owner_ether_wallet.usdt_balance -= (amount_received_by_user + fees_in_crypto)
            user_ether_wallet.usdt_balance += amount_received_by_user
        elif offer_currency == Offer.Currency.VICA_TOKEN:
            owner_ether_wallet.vica_balance -= (amount_received_by_user + fees_in_crypto)
            user_ether_wallet.vica_balance += amount_received_by_user

    owner_btc_wallet.save()
    owner_ether_wallet.save()
    user_btc_wallet.save()
    user_ether_wallet.save()