import math

from decimal import Decimal
from django.conf import settings
from bit.network import get_fee
from bit.transaction import address_to_scriptpubkey
from bit.constants import MESSAGE_LIMIT
from bit.utils import int_to_unknown_bytes, chunk_data
from web3 import Web3
from .services import *


def calculate_transaction_size(private_key_obj, outputs, leftover=None, message=None, message_is_hex=False):
    """Returns the number of bytes of the transaction.
    :param outputs: A sequence of outputs you wish to send in the form
                    ``(destination, amount, currency)``. The amount can
                    be either an int, float, or string as long as it is
                    a valid input to ``decimal.Decimal``. The currency
                    must be :ref:`supported <supported currencies>`.
    :type outputs: ``list`` of ``tuple``
    :param leftover: The destination that will receive any change from the
                        transaction. By default Bit will send any change to
                        the same address you sent from.
    :type leftover: ``str``
    :param message: A message to include in the transaction. This will be
                    stored in the blockchain forever. Due to size limits,
                    each message will be stored in chunks of 40 bytes.
    :type message: ``str``
    :returns: The number of bytes of the transaction.
    :rtype: ``int``
    """
    messages = []
    if message:
        if message_is_hex:
            message_chunks = chunk_data(message, MESSAGE_LIMIT)
        else:
            message_chunks = chunk_data(message.encode('utf-8'), MESSAGE_LIMIT)

        for message in message_chunks:
            messages.append((message, 0))

    unspents = private_key_obj.unspents or private_key_obj.get_unspents()

    return_address = private_key_obj.segwit_address if any(
        [u.segwit for u in unspents]) else private_key_obj.address

    # Include return address in output count.
    # Calculate output size as a list (including return address).
    output_size = [len(address_to_scriptpubkey(o[0])) + 9 for o in outputs]
    output_size.append(len(messages) * (MESSAGE_LIMIT + 9))
    output_size.append(len(address_to_scriptpubkey(leftover or return_address)) + 9)
    sum_outputs = sum(out[1] for out in outputs)

    bytes_num = (
            sum(u.vsize for u in unspents)
            + len(int_to_unknown_bytes(len(unspents), byteorder='little'))
            + sum(output_size)
            + len(int_to_unknown_bytes(len(output_size), byteorder='little'))
            + 8
    )
    return bytes_num

def estimate_btc_fees(wif_key, recipient, amount, currency='satoshi', fast=False):
    private_key_obj = get_btc_private_key_model()(wif_key)
    outputs = [(recipient, amount, currency)]
    return calculate_transaction_size(private_key_obj, outputs) * get_fee(fast=fast)

def get_btc_private_key_model():
    if settings.DJANGO_ENV == 'production':
        from bit import PrivateKey
        return PrivateKey
    else:
        from bit import PrivateKeyTestnet
        return  PrivateKeyTestnet

def create_btc_transaction(recipient_address, amount, wif_key, currency='satoshi', fast=False):
    private_key = get_btc_private_key_model()(wif_key)
    outputs = [(recipient_address, amount, currency)]
    hash = private_key.send(outputs, fee=get_fee(fast=fast))
    return hash

def send_all_btc(recipient_address, wif_key):
    private_key = get_btc_private_key_model()(wif_key)
    hash = private_key.create_transaction([], leftover=recipient_address)
    return hash


def get_ether_provider():
    if settings.DJANGO_ENV == 'production':
        return Web3.HTTPProvider("https://mainnet.infura.io/v3/21a164c9ae2f4496ab2b7c9983d2a1b7")
    else:
        return Web3.HTTPProvider("https://goerli.infura.io/v3/21a164c9ae2f4496ab2b7c9983d2a1b7")


def create_ether_transaction(sender_address, recipient_address, amount, private_key, gas_limit=None, currency='wei'):
    w3 = Web3(get_ether_provider())
    acct = w3.eth.account.from_key(private_key)
    nonce = w3.eth.getTransactionCount(sender_address)

    transaction = {
        'from': sender_address,
        'to': recipient_address,
        'gasPrice': w3.eth.gas_price,
    }
    if not gas_limit:
        gas_limit = w3.eth.estimate_gas(transaction)
    transaction_fees = estimate_ether_fees(transaction['from'], transaction['to'], transaction['gasPrice'])

    transaction['gas'] = gas_limit
    transaction['value'] = amount - transaction_fees
    transaction['nonce'] = nonce
    transaction['chainId'] = w3.eth.chain_id
    signed = w3.eth.account.sign_transaction(transaction, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    return tx_hash.hex()


def create_usdt_transaction(sender_address, recipient_address, amount, private_key, gas_limit=None):
    w3 = Web3(get_ether_provider())
    contract = w3.eth.contract(address=settings.USDT_CONTRACT_ADDRESS, abi=settings.USDT_CONTRACT_ABI)
    _from = w3.toChecksumAddress(sender_address)
    _to = w3.toChecksumAddress(recipient_address)
    nonce = w3.eth.getTransactionCount(_from, 'pending')
    amount *= 1000000
    if not gas_limit:
        gas_limit = contract.functions.transfer(
            _to,
            int(amount), 
            ).estimateGas({'from': _from})

    transaction_fees = w3.fromWei(estimate_usdt_fees(sender_address, recipient_address, amount, w3.eth.gas_price), 'ether')
    transaction_fees_in_usd = convert_currencies('ETH', 'USD', transaction_fees)

    amount_to_send = int(amount) - math.ceil(transaction_fees_in_usd * 1000000)
    txn = contract.functions.transfer(
        _to,
        amount_to_send,
    ).buildTransaction({
        'chainId': 1,
        'gas': gas_limit,
        'maxFeePerGas': w3.toWei('24', 'gwei'),
        'maxPriorityFeePerGas': w3.toWei('1', 'gwei'),
        'nonce': nonce,
    })
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
    w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    return signed_txn.hash.hex()


def create_vica_transaction(sender_address, recipient_address, amount, private_key, gas_limit=None):
    w3 = Web3(get_ether_provider())
    contract = w3.eth.contract(address=settings.VICA_CONTRACT_ADDRESS, abi=settings.VICA_CONTRACT_ABI)
    _from = w3.toChecksumAddress(sender_address)
    _to = w3.toChecksumAddress(recipient_address)
    nonce = w3.eth.getTransactionCount(_from, 'pending')
    amount *= 1000000000000000000
    if not gas_limit:
        gas_limit = contract.functions.transfer(
            _to,
            int(amount), 
            ).estimateGas({'from': _from})

    transaction_fees = estimate_vica_fees(sender_address, recipient_address, amount, w3.eth.gas_price)
    transaction_fees_in_vica = convert_currencies('ETH', 'VICA', transaction_fees)
    amount_to_send = int(amount) - math.ceil(transaction_fees_in_vica * 1000000000000000000)
    txn = contract.functions.transfer(
        _to,
        int(amount_to_send),
    ).buildTransaction({
        'chainId': 1,
        'gas': gas_limit,
        'maxFeePerGas': w3.toWei('24', 'gwei'),
        'maxPriorityFeePerGas': w3.toWei('1.5', 'gwei'),
        'nonce': nonce,
    })
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
    w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    return signed_txn.hash.hex()

def convert_currencies(_from, to, amount=0):
    """ Convert between 'ETH', 'BTC', 'VICA', 'USD' and 'EUR'
    
    """
    import requests
    # from bit.network import currency_to_satoshi
    if _from == to:
        return 1
    elif _from in ['ETH', 'BTC', 'USD', 'EUR']:
        if to == "VICA":
            one_vica_in_usd = convert_currencies(_from=to, to='USD', amount=1)
            if _from == 'USD':
                return Decimal(amount) * one_vica_in_usd
            else:
                _from_in_usd = convert_currencies(_from, 'USD', amount)
                return _from_in_usd / one_vica_in_usd

        response = requests.get(f'https://min-api.cryptocompare.com/data/price?fsym={_from}&tsyms={to}')
        return Decimal(response.json()[to]) * Decimal(amount)
    elif _from == 'VICA':
        from lxml import html
        xpath = '//*[@id="__next"]/div/div[1]/div[2]/div/div[1]/div[2]/div/div[2]/div[1]/div/span/text()'
        response = requests.get('https://coinmarketcap.com/currencies/vica-token/')
        tree = html.fromstring(response.content)
        value = tree.xpath(xpath)[0].replace("$", '')
        amount_in_usd = Decimal(value) * Decimal(amount)
        if to == 'USD':
            return amount_in_usd
        elif to == 'EUR':
            return convert_currencies('USD', 'EUR', amount_in_usd)
        elif to == 'BTC':
            return convert_currencies('USD', 'BTC', amount_in_usd)
        elif to == 'ETH':
            return convert_currencies('USD', 'ETH', amount_in_usd)

def estimate_ether_fees(sender, recipient, gas_price):
    w3 = Web3(get_ether_provider())
    sender = w3.toChecksumAddress(sender)
    recipient = w3.toChecksumAddress(recipient)
    transaction_obj = {
        'from': sender,
        'to': recipient,
        'gasPrice': gas_price,
    }
    gas_limit = w3.eth.estimate_gas(transaction_obj)
    return gas_limit * gas_price

def estimate_usdt_fees(sender, recipient, amount, gas_price):
    w3 = Web3(get_ether_provider())
    sender = w3.toChecksumAddress(sender)
    recipient = w3.toChecksumAddress(recipient)
    contract = w3.eth.contract(address=settings.USDT_CONTRACT_ADDRESS, abi=settings.USDT_CONTRACT_ABI)
    gas_limit = contract.functions.transfer(
        recipient,
        int(amount), 
        ).estimateGas({'from': sender})

    return gas_limit * gas_price

def estimate_vica_fees(sender, recipient, amount, gas_price):
    w3 = Web3(get_ether_provider())
    sender = w3.toChecksumAddress(sender)
    recipient = w3.toChecksumAddress(recipient)
    contract = w3.eth.contract(address=settings.VICA_CONTRACT_ADDRESS, abi=settings.VICA_CONTRACT_ABI)
    gas_limit = contract.functions.transfer(
        recipient,
        int(amount), 
        ).estimateGas({'from': sender})

    return gas_limit * gas_price

