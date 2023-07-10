import requests
import logging
from datetime import date

# from celery.schedules import crontab
from celery import shared_task
from django.conf import settings
from constance import config
from web3 import Web3

from crypto_project.celery import app
from .models import BitcoinWallet, EthereumWallet, ETHTransaction, BTCTransaction
from .utils import send_all_btc, create_ether_transaction, create_vica_transaction, create_usdt_transaction, get_ether_provider, convert_currencies
from .services import NetworkCustomAPI

logger = logging.getLogger("celery")

w3 = Web3(get_ether_provider())

@app.task
def transfer_to_main_wallet_task():
    for btc_wallet in BitcoinWallet.objects.all():
        btc_in_usd = convert_currencies('BTC', 'USD', btc_wallet.address_balance())
        if btc_in_usd > config.MIN_FOR_TRANSFER_TO_MAIN_WALLET:
            hash = send_all_btc(settings.BITCOIN_WALLET_ADDRESS, btc_wallet.private_key)
            BTCTransaction.objects.create(wallet=btc_wallet ,hash=hash, from_address=btc_wallet.address, recipient_address=settings.BITCOIN_WALLET_ADDRESS, amount=btc_wallet.address_balance())

    for ether_wallet in EthereumWallet.objects.all():
        ether_in_usd = convert_currencies('ETH', 'USD', ether_wallet.address_balance())
        vica_in_usd = convert_currencies('VICA', 'USD', ether_wallet.address_vica_balance())
        _0_02_eth_in_usd = convert_currencies('ETH', 'USD', 0.02)

        if ether_in_usd - _0_02_eth_in_usd > config.MIN_FOR_TRANSFER_TO_MAIN_WALLET:
            amount_in_wei = w3.toWei(ether_wallet.address_balance() - 0.02, 'ether')
            hash = create_ether_transaction(ether_wallet.address, settings.ETHEREUM_WALLET_ADDRESS, amount_in_wei, ether_wallet.private_key)
            ETHTransaction.objects.create(wallet=ether_wallet ,hash=hash, from_address=ether_wallet.address, recipient_address=settings.ETHEREUM_WALLET_ADDRESS, amount=w3.fromWei(amount_in_wei, 'ether'), currency=ETHTransaction.Currency.ETHEREUM)

        if ether_wallet.address_usdt_balance() > config.MIN_FOR_TRANSFER_TO_MAIN_WALLET:
            hash = create_usdt_transaction(ether_wallet.address, settings.ETHEREUM_WALLET_ADDRESS, ether_wallet.address_usdt_balance(), ether_wallet.private_key)
            ETHTransaction.objects.create(wallet=ether_wallet ,hash=hash, from_address=ether_wallet.address, recipient_address=settings.ETHEREUM_WALLET_ADDRESS, amount=ether_wallet.address_usdt_balance(), currency=ETHTransaction.Currency.USDT)
        
        if vica_in_usd > config.MIN_FOR_TRANSFER_TO_MAIN_WALLET:
            hash = create_vica_transaction(ether_wallet.address, settings.ETHEREUM_WALLET_ADDRESS, ether_wallet.address_vica_balance(), ether_wallet.private_key)
            ETHTransaction.objects.create(wallet=ether_wallet ,hash=hash, from_address=ether_wallet.address, recipient_address=settings.ETHEREUM_WALLET_ADDRESS, amount=ether_wallet.address_vica_balance(), currency=ETHTransaction.Currency.VICA_TOKEN)

@app.task
def check_unconfirmed_internal_transactions():
    """ Check unconfirmed transactions to the main wallet then transfer the amount if they are confirmed
    
    """

    unconfirmed_eth_transactions = ETHTransaction.objects.filter(recipient_address=settings.ETHEREUM_WALLET_ADDRESS, status=ETHTransaction.Status.PENDING)

    for transaction in unconfirmed_eth_transactions:
        transaction.update_info()
        # transaction.refresh_from_db()
        # if transaction.status == ETHTransaction.Status.CONFIRMED:
        #     wallet = transaction.wallet
        #     if transaction.currency == ETHTransaction.Currency.ETHEREUM:
        #         wallet.balance = transaction.amount
        #         wallet.save()

        #     elif transaction.currency == ETHTransaction.Currency.USDT:
        #         wallet.usdt_balance = transaction.amount
        #         wallet.save()

        #     elif transaction.currency == ETHTransaction.Currency.VICA_TOKEN:
        #         wallet.vica_balance = transaction.amount
        #         wallet.save()

    unconfirmed_btc_transactions = BTCTransaction.objects.filter(recipient_address=settings.BITCOIN_WALLET_ADDRESS, status=BTCTransaction.Status.PENDING)

    for transaction in unconfirmed_btc_transactions:
        transaction.update_info()
        transaction.refresh_from_db()
        if transaction.status == BTCTransaction.Status.CONFIRMED:
            wallet = transaction.wallet
            wallet.balance = transaction.amount
            wallet.save()

@shared_task(name="wallet.send_0_02_eth_to_a_wallet", max_retries=3, bind=True)
def send_0_02_eth_to_a_wallet(self, address):
    amount_in_wei = w3.toWei(0.02, 'ether')
    create_ether_transaction(settings.ETHEREUM_WALLET_ADDRESS, address, amount_in_wei, settings.ETHEREUM_WALLET_KEY)

@app.task
def check_for_0_02_eth_in_all_wallets(self):
    for wallet in EthereumWallet.objects.all():
        balance = w3.fromWei(w3.eth.get_balance(Web3.toChecksumAddress(wallet.address)), 'ether')
        vica_in_usd = convert_currencies('VICA', 'USD', wallet.vica_balance)
        if balance < 0.01 and wallet.usdt_balance > config.MIN_FOR_TRANSFER_TO_MAIN_WALLET or vica_in_usd > config.MIN_FOR_TRANSFER_TO_MAIN_WALLET:
            send_0_02_eth_to_a_wallet.apply_async((wallet.address,))

@shared_task(name="wallet.check_for_new_eth_transactions", max_retries=3, bind=True)         
def check_for_new_eth_transactions(self, address):
    eth_wallet = EthereumWallet.objects.get(address=address)

    # Get a list of 'Normal' Transactions By Address
    result = requests.get(f"https://api.etherscan.io/api?module=account&action=txlist&address={eth_wallet.address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey={settings.ETHERSCAN_API_KEY}")

    if result.ok:
        eth_in_transactions = [item for item in result.json()['result'] if item['functionName'] == "" and item['to'] == eth_wallet.address and item['from'] != settings.ETHEREUM_WALLET_ADDRESS]
        for tx in eth_in_transactions:
            if ETHTransaction.objects.filter(hash=tx['hash']).exists():
                return
            
            transaction = ETHTransaction.objects.create(wallet=eth_wallet, hash=tx['hash'], recipient_address=eth_wallet.address, from_address=tx['from'], currency=ETHTransaction.Currency.ETHEREUM, status=ETHTransaction.Status.CONFIRMED, amount=w3.fromWei(tx['value'], 'ether'), timestamp=tx['timeStamp'])
            eth_wallet.balance += transaction.amount
            eth_wallet.save()


    # Get a list of 'USDT - Token Transfer Events' by Address
    result = requests.get(f"https://api.etherscan.io/api?module=account&action=tokentx&contractaddress={settings.USDT_CONTRACT_ADDRESS}&address={eth_wallet.address}&page=1&offset=100&startblock=0&endblock=27025780&sort=desc&apikey={settings.ETHERSCAN_API_KEY}")

    if result.ok:
        usdt_in_transactions = [item for item in result.json()['result'] if item['to'] == eth_wallet.address]
        for tx in usdt_in_transactions:
            if ETHTransaction.objects.filter(hash=tx['hash']).exists():
                return
            
            amount = tx['value'] / 1000000
            transaction = ETHTransaction.objects.create(wallet=eth_wallet, hash=tx['hash'], recipient_address=eth_wallet.address, from_address=tx['from'], currency=ETHTransaction.Currency.USDT, status=ETHTransaction.Status.CONFIRMED, amount=amount, timestamp=tx['timeStamp'])
            eth_wallet.usdt_balance += transaction.amount
            eth_wallet.save()


    # Get a list of 'VICA - Token Transfer Events' by Address
    result = requests.get(f"https://api.etherscan.io/api?module=account&action=tokentx&contractaddress={settings.VICA_CONTRACT_ADDRESS}&address={eth_wallet.address}&page=1&offset=100&startblock=0&endblock=27025780&sort=desc&apikey={settings.ETHERSCAN_API_KEY}")

    if result.ok:
        usdt_in_transactions = [item for item in result.json()['result'] if item['to'] == eth_wallet.address]
        for tx in usdt_in_transactions:
            if ETHTransaction.objects.filter(hash=tx['hash']).exists():
                return
            
            amount = tx['value'] / 1000000000000000000
            transaction = ETHTransaction.objects.create(wallet=eth_wallet, hash=tx['hash'], recipient_address=eth_wallet.address, from_address=tx['from'], currency=ETHTransaction.Currency.VICA_TOKEN, status=ETHTransaction.Status.CONFIRMED, amount=amount, timestamp=tx['timeStamp'])
            eth_wallet.vica_balance += transaction.amount
            eth_wallet.save()

@shared_task(name="wallet.check_for_new_btc_transactions", max_retries=3, bind=True)
def check_for_new_btc_transactions(self, address):
    btc_wallet = BitcoinWallet.objects.get(address=address)
    hashes = NetworkCustomAPI.get_transactions(btc_wallet.address)
    for hash in hashes:
        if BTCTransaction.objects.filter(hash=hash).exists():
                return

        tx = NetworkCustomAPI.get_transaction_by_id(hash)

        BTCTransaction.objects.create(wallet=btc_wallet, hash=hash, inputs=tx['input'], outputs=tx['output'], status=BTCTransaction.Status.CONFIRMED, timestamp=tx['timestamp'], fees=tx['fee'])

@app.task
def check_for_new_transactions():
    for wallet in EthereumWallet.objects.all():
        check_for_new_eth_transactions.apply_async((wallet.address,))

    for wallet in BitcoinWallet.objects.all():
        check_for_new_btc_transactions.apply_async((wallet.address,))