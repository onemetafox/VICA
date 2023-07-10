import requests
from dateutil import parser

from bit.exceptions import ExcessiveAddress

DEFAULT_TIMEOUT = 10


def set_service_timeout(seconds):
    global DEFAULT_TIMEOUT
    DEFAULT_TIMEOUT = seconds


class BlockchairCustomAPI:
    MAIN_ENDPOINT = 'https://api.blockchair.com/bitcoin/'
    MAIN_ADDRESS_API = MAIN_ENDPOINT + 'dashboards/address/{}'
    MAIN_TX_PUSH_API = MAIN_ENDPOINT + 'push/transaction'
    MAIN_TX_API = MAIN_ENDPOINT + 'raw/transaction/{}'
    TEST_ENDPOINT = 'https://api.blockchair.com/bitcoin/testnet/'
    TEST_ADDRESS_API = TEST_ENDPOINT + 'dashboards/address/{}'
    TEST_TX_PUSH_API = TEST_ENDPOINT + 'push/transaction'
    TEST_TX_API = TEST_ENDPOINT + 'raw/transaction/{}'
    TX_PUSH_PARAM = 'data'


    @classmethod
    def get_transactions(cls, address):
        endpoint = cls.MAIN_ADDRESS_API

        transactions = []
        offset = 0
        txs_per_page = 1000
        payload = {'offset': str(offset), 'limit': str(txs_per_page)}

        r = requests.get(endpoint.format(address), params=payload, timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return []
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response = r.json()
        response = response['data'][address]
        total_txs = response['address']['transaction_count']

        while total_txs > 0:
            transactions.extend(tx for tx in response['transactions'])

            total_txs -= txs_per_page
            offset += txs_per_page
            payload['offset'] = str(offset)
            r = requests.get(endpoint.format(address), params=payload, timeout=DEFAULT_TIMEOUT)
            if r.status_code != 200:  # pragma: no cover
                raise ConnectionError
            response = r.json()['data'][address]

        return transactions

    @classmethod
    def get_transactions_testnet(cls, address):
        endpoint = cls.TEST_ADDRESS_API

        transactions = []
        offset = 0
        txs_per_page = 1000
        payload = {'offset': str(offset), 'limit': str(txs_per_page)}

        r = requests.get(endpoint.format(address), params=payload, timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return []
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response = r.json()
        response = response['data'][address]
        total_txs = response['address']['transaction_count']

        while total_txs > 0:
            transactions.extend(tx for tx in response['transactions'])

            total_txs -= txs_per_page
            offset += txs_per_page
            payload['offset'] = str(offset)
            r = requests.get(endpoint.format(address), params=payload, timeout=DEFAULT_TIMEOUT)
            if r.status_code != 200:  # pragma: no cover
                raise ConnectionError
            response = r.json()['data'][address]

        return transactions

    @classmethod
    def get_transaction_by_id(cls, txid):
        r = requests.get(cls.MAIN_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError

        response = r.json()['data']
        if not response:  # pragma: no cover
            return None
        return response

    @classmethod
    def get_transaction_by_id_testnet(cls, txid):
        r = requests.get(cls.TEST_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError

        response = r.json()['data']
        if not response:  # pragma: no cover
            return None
        return response

   


class BlockstreamCustomAPI:
    MAIN_ENDPOINT = 'https://blockstream.info/api/'
    MAIN_ADDRESS_API = MAIN_ENDPOINT + 'address/{}'
    MAIN_UNSPENT_API = MAIN_ADDRESS_API + '/utxo'
    MAIN_TX_PUSH_API = MAIN_ENDPOINT + 'tx'
    MAIN_TX_API = MAIN_ENDPOINT + 'tx/{}'
    TEST_ENDPOINT = 'https://blockstream.info/testnet/api/'
    TEST_ADDRESS_API = TEST_ENDPOINT + 'address/{}'
    TEST_UNSPENT_API = TEST_ADDRESS_API + '/utxo'
    TEST_TX_PUSH_API = TEST_ENDPOINT + 'tx'
    TEST_TX_API = TEST_ENDPOINT + 'tx/{}'
    TX_PUSH_PARAM = 'data'

    @classmethod
    def get_transactions(
        cls, address,
    ):
        #! Blockstream returns at most 50 mempool (unconfirmed) transactions and ignores the rest
        mempool_endpoint = cls.MAIN_ADDRESS_API + '/txs/mempool'
        
        endpoint = cls.MAIN_ADDRESS_API + '/txs/chain/{}'

        transactions = []

        # Add mempool (unconfirmed) transactions
        r = requests.get(mempool_endpoint.format(address), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 400:  # pragma: no cover
            return []
        elif r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response = r.json()
        unconfirmed = [tx['txid'] for tx in response]

        # It is safer to raise exception if API returns exactly 50 unconfirmed
        # transactions, as there could be more that the API is unaware of.
        if len(unconfirmed) == 50:  # pragme: no cover
            raise ExcessiveAddress

        r = requests.get(endpoint.format(address, ''), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 400:  # pragma: no cover
            return []
        elif r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response = r.json()

        # The first 25 confirmed transactions are shown with no
        # indication of the number of total transactions.
        total_txs = len(response)

        while total_txs > 0:
            transactions.extend(tx['txid'] for tx in response)

            response = requests.get(endpoint.format(address, transactions[-1]), timeout=DEFAULT_TIMEOUT).json()
            total_txs = len(response)

        transactions.extend(unconfirmed)

        return transactions

    @classmethod
    def get_transactions_testnet(cls, address):
        endpoint = cls.TEST_ADDRESS_API + '/txs/chain/{}'

        transactions = []

        r = requests.get(endpoint.format(address, ''), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 400:  # pragma: no cover
            return []
        elif r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response = r.json()

        # The first 50 mempool and 25 confirmed transactions are shown with no
        # indication of the number of total transactions.
        total_txs = len(response)

        while total_txs > 0:
            transactions.extend(tx['txid'] for tx in response)

            response = requests.get(endpoint.format(address, transactions[-1]), timeout=DEFAULT_TIMEOUT).json()
            total_txs = len(response)

        return transactions

    @classmethod
    def get_transaction_by_id(cls, txid):
        r = requests.get(cls.MAIN_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response_dict = r.json()
        data = {}
        data['fee'] = response_dict['fee']
        data['confirmed'] = response_dict['status']['confirmed']
        data['timestamp'] = response_dict['status']['block_time']
        data['input'] = []
        data['output'] = []
        for input in response_dict['vin']:
            data['input'].append({
                'address': input['prevout']['scriptpubkey_address'],
                'value': input['prevout']['value']
            }) # append addresses

        for output in response_dict['vout']:
            data['output'].append({
                'address': output['scriptpubkey_address'],
                'value': output['value']
            }) # append addresses

        return data

    @classmethod
    def get_transaction_by_id_testnet(cls, txid):
        r = requests.get(cls.TEST_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response_dict = r.json()
        data = {}
        data['fee'] = response_dict['fee']
        data['confirmed'] = response_dict['status']['confirmed']
        data['timestamp'] = response_dict['status']['block_time']
        data['input'] = []
        data['output'] = []
        for input in response_dict['vin']:
            data['input'].append({
                'address': input['prevout']['scriptpubkey_address'],
                'value': input['prevout']['value']
            }) # append addresses

        for output in response_dict['vout']:
            data['output'].append({
                'address': output['scriptpubkey_address'],
                'value': output['value']
            }) # append addresses

        return data


class InsightCustomAPI:  # pragma: no cover
    MAIN_ENDPOINT = ''
    MAIN_ADDRESS_API = ''
    MAIN_BALANCE_API = ''
    MAIN_UNSPENT_API = ''
    MAIN_TX_PUSH_API = ''
    MAIN_TX_API = ''
    TX_PUSH_PARAM = ''

    @classmethod
    def get_transaction_by_id(cls, txid):
        r = requests.get(cls.MAIN_TX_API + txid, timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        return r.json()["rawtx"]


class BitcoreCustomAPI:
    """ Insight API v8 """

    MAIN_ENDPOINT = 'https://api.bitcore.io/api/BTC/mainnet/'
    MAIN_ADDRESS_API = MAIN_ENDPOINT + 'address/{}'
    MAIN_BALANCE_API = MAIN_ADDRESS_API + '/balance'
    MAIN_UNSPENT_API = MAIN_ADDRESS_API + '/?unspent=true'
    MAIN_TX_PUSH_API = MAIN_ENDPOINT + 'tx/send'
    MAIN_TX_API = MAIN_ENDPOINT + 'tx/{}'
    MAIN_TX_AMOUNT_API = MAIN_TX_API
    TEST_ENDPOINT = 'https://api.bitcore.io/api/BTC/testnet/'
    TEST_ADDRESS_API = TEST_ENDPOINT + 'address/{}'
    TEST_BALANCE_API = TEST_ADDRESS_API + '/balance'
    TEST_UNSPENT_API = TEST_ADDRESS_API + '/?unspent=true'
    TEST_TX_PUSH_API = TEST_ENDPOINT + 'tx/send'
    TEST_TX_API = TEST_ENDPOINT + 'tx/{}'
    TEST_TX_AMOUNT_API = TEST_TX_API
    TX_PUSH_PARAM = 'rawTx'


    @classmethod
    def get_transaction_by_id(cls, txid):
        r = requests.get(cls.MAIN_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response_dict = r.json()
        data = {}
        data['fee'] = response_dict['fee']
        data['confirmed'] = response_dict['confirmations'] > 0
        block_time = parser.parse(response_dict['blockTime'])
        data['timestamp'] = int(block_time.timestamp())
        return response_dict

    @classmethod
    def get_transaction_by_id_testnet(cls, txid):
        r = requests.get(cls.TEST_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 404:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response_dict = r.json()
        data = {}
        data['fee'] = response_dict['fee']
        data['confirmed'] = response_dict['confirmations'] > 0
        block_time = parser.parse(response_dict['blockTime'])
        data['timestamp'] = int(block_time.timestamp())
        return data


class BlockchainCustomAPI:
    ENDPOINT = 'https://blockchain.info/'
    ADDRESS_API = ENDPOINT + 'address/{}?format=json'
    UNSPENT_API = ENDPOINT + 'unspent'
    TX_PUSH_API = ENDPOINT + 'pushtx'
    TX_API = ENDPOINT + 'rawtx/'
    TX_PUSH_PARAM = 'tx'

    @classmethod
    def get_transactions(cls, address):
        endpoint = cls.ADDRESS_API

        transactions = []
        offset = 0
        txs_per_page = 50
        payload = {'offset': str(offset)}

        r = requests.get(endpoint.format(address), params=payload, timeout=DEFAULT_TIMEOUT)
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response = r.json()
        total_txs = response['n_tx']

        while total_txs > 0:
            transactions.extend(tx['hash'] for tx in response['txs'])

            total_txs -= txs_per_page
            offset += txs_per_page
            payload['offset'] = str(offset)
            response = requests.get(endpoint.format(address), params=payload, timeout=DEFAULT_TIMEOUT).json()

        return transactions

    @classmethod
    def get_transaction_by_id(cls, txid):
        r = requests.get(cls.TX_API + txid, timeout=DEFAULT_TIMEOUT)
        if r.status_code == 500 and r.text == 'Transaction not found':  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError

        response_dict = r.json()
        data = {}
        data['fee'] = response_dict['fee']
        data['confirmed'] = response_dict['block_index'] is not None and response_dict['block_height'] is not None
        data['timestamp'] = response_dict['time']
        data['input'] = []
        data['output'] = []
        for input in response_dict['inputs']:
            data['input'].append({
                'address': input['prev_out']['addr'],
                'value': input['prev_out']['value']
            }) # append addresses

        for output in response_dict['out']:
            data['output'].append({
                'address': output['addr'],
                'value': output['value']
            }) # append addresses
        return data


class BlockcypherCustomAPI:
    MAIN_ENDPOINT = 'https://api.blockcypher.com/v1/btc/main/'
    MAIN_TX_API = MAIN_ENDPOINT + 'txs/{}'
    TEST_ENDPOINT = 'https://api.blockcypher.com/v1/btc/test3/'
    TEST_TX_API = TEST_ENDPOINT + 'txs/{}'


    @classmethod
    def get_transaction_by_id(cls, txid):
        r = requests.get(cls.MAIN_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 400:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response_dict = r.json()
        data = {}
        data['fee'] = response_dict['fees']
        data['confirmed'] = 'confirmed' in response_dict
        _time = parser.parse(response_dict['confirmed'])
        data['timestamp'] = int(_time.timestamp())
        data['input'] = []
        data['output'] = []
        for input in response_dict['inputs']:
            data['input'].append({
                'address': input['addresses'][0],
                'value': input['output_value']
            }) # append addresses

        for output in response_dict['outputs']:
            data['output'].append({
                'address': output['addresses'][0],
                'value': output['value']
            }) # append addresses

        return data

    @classmethod
    def get_transaction_by_id_testnet(cls, txid):
        r = requests.get(cls.TEST_TX_API.format(txid), timeout=DEFAULT_TIMEOUT)
        if r.status_code == 400:  # pragma: no cover
            return None
        if r.status_code != 200:  # pragma: no cover
            raise ConnectionError
        response_dict = r.json()
        data = {}
        data['fee'] = response_dict['fees']
        data['confirmed'] = 'confirmed' in response_dict
        _time = parser.parse(response_dict['confirmed'])
        data['timestamp'] = int(_time.timestamp())
        data['input'] = []
        data['output'] = []
        for input in response_dict['inputs']:
            data['input'].append({
                'address': input['addresses'][0],
                'value': input['output_value']
            }) # append addresses

        for output in response_dict['outputs']:
            data['output'].append({
                'address': output['addresses'][0],
                'value': output['value']
            }) # append addresses

        return data


class NetworkCustomAPI:
    IGNORED_ERRORS = (
        ConnectionError,
        requests.exceptions.ConnectionError,
        requests.exceptions.Timeout,
        requests.exceptions.ReadTimeout,
        ExcessiveAddress,
    )
    GET_TRANSACTIONS_MAIN = [
        BlockchairCustomAPI.get_transactions,  # Limit 1000
        BlockstreamCustomAPI.get_transactions,  # Limit 1000
        BlockchainCustomAPI.get_transactions,  # No limit, requires multiple requests
    ]
    
    GET_TRANSACTIONS_TEST = [
        BlockchairCustomAPI.get_transactions_testnet,  # Limit 1000
        BlockstreamCustomAPI.get_transactions_testnet,
    ]

    GET_TRANSACTION_BY_ID_MAIN = [
        # BlockchairCustomAPI.get_transaction_by_id,
        BlockstreamCustomAPI.get_transaction_by_id,
        BlockcypherCustomAPI.get_transaction_by_id,
        # BitcoreCustomAPI.get_transaction_by_id,
        BlockchainCustomAPI.get_transaction_by_id,
    ]

    GET_TRANSACTION_BY_ID_TEST = [
        # BlockchairCustomAPI.get_transaction_by_id_testnet,
        BlockstreamCustomAPI.get_transaction_by_id_testnet,
        BlockcypherCustomAPI.get_transaction_by_id_testnet,
        # BitcoreCustomAPI.get_transaction_by_id_testnet,
    ]

    @classmethod
    def get_transactions(cls, address):
        """Gets the ID of all transactions related to an address.

        :param address: The address in question.
        :type address: ``str``
        :raises ConnectionError: If all API services fail.
        :rtype: ``list`` of ``str``
        """

        for api_call in cls.GET_TRANSACTIONS_MAIN:
            try:
                return api_call(address)
            except cls.IGNORED_ERRORS:
                pass

        raise ConnectionError('All APIs are unreachable.')

    @classmethod
    def get_transactions_testnet(cls, address):
        """Gets the ID of all transactions related to an address on the test
        network.

        :param address: The address in question.
        :type address: ``str``
        :raises ConnectionError: If all API services fail.
        :rtype: ``list`` of ``str``
        """

        for api_call in cls.GET_TRANSACTIONS_TEST:
            try:
                return api_call(address)
            except cls.IGNORED_ERRORS:
                pass

        raise ConnectionError('All APIs are unreachable.')

    @classmethod
    def get_transaction_by_id(cls, txid):
        """Gets a transaction info by its id (txid).

        :param txid: The id of the transaction
        :type txid: ``str``
        :raises ConnectionError: If all API services fail.
        :rtype: ``string``
        """

        for api_call in cls.GET_TRANSACTION_BY_ID_MAIN:
            try:
                return api_call(txid)
            except cls.IGNORED_ERRORS:
                pass

        raise ConnectionError('All APIs are unreachable.')

    @classmethod
    def get_transaction_by_id_testnet(cls, txid):
        """Gets a transaction info by its id (txid) on the test.

        :param txid: The id of the transaction
        :type txid: ``str``
        :raises ConnectionError: If all API services fail.
        :rtype: ``string``
        """

        for api_call in cls.GET_TRANSACTION_BY_ID_TEST:
            try:
                return api_call(txid)
            except cls.IGNORED_ERRORS:
                pass

        raise ConnectionError('All APIs are unreachable.')
