from decimal import Decimal
from bit import PrivateKeyTestnet, PrivateKey

PrivateKey().get_transactions
# cNVVvjDqNVdTg3Ro4H65SoyrUKHyW8M8UxQnSVgYxXVtz6M1nyuv
# # address : n21fdx4BgYAXsAoXuxdaYGDY5Gp2PCkYJZ

# from bitcoin import random_key, privtopub, pubtoaddr
from bitcoin.main import get_privkey_format, get_pubkey_format,compress 

# from bit.network.services import NetworkAPI
# from bit.network import get_fee
# from bit.wallet import net
# from bit.transaction import estimate_tx_fee



# PrivateKey.prepare_transaction()
# tx_btctest= create_tx(coin,account,recipient,amount)
# sign_tx_btctest = account.sign_transaction(tx_btctest)
# from bit.network import NetworkAPI
# NetworkAPI.broadcast_tx_testnet(sign_tx_btctest)    









from bit.transaction import address_to_scriptpubkey

from bit.constants import MESSAGE_LIMIT

from bit.utils import int_to_unknown_bytes, chunk_data



def calculate_transaction_size(self, outputs, leftover=None, message=None, message_is_hex=False):
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

    unspents = self.unspents or self.get_unspents()

    return_address = self.segwit_address if any(
        [u.segwit for u in unspents]) else self.address

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

#----------------__----------_--------_--_--_---------------------

from web3 import Web3

Web3.fromWei() # from wei to a specific currency like ether, gwei..
from forex_python.bitcoin import BtcConverter