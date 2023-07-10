import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthService from 'src/services/AuthService';
import CryptoImage from 'src/components/common/CryptoImage';
import { CoinsTypes } from 'src/types/coins';
import { coinFullName } from 'src/utils/coins-full-name';
import { Modal, Label, TextInput, Button } from 'flowbite-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/router';

import {
  useArbitrageTransaction,
  useWithdrawBtc,
  useWithdrawEth,
} from 'src/queries/transactions';

type Props = {
  coin: CoinsTypes;
  balance: number;
  walletAddress: string;
  isArbitrage: boolean;
  isSubscribed: boolean;
};

const MODAL = {
  WITHDRAW: 'withdraw',
  TRANSFER: 'transfer',
  DEPOSIT: 'deposit',
};
const COIN = {
  USDT: 'usdt',
  ETH: 'ether',
  VICA: 'vica',
  BTC: 'btc',
};

const Card = ({
  coin,
  balance,
  walletAddress,
  isArbitrage,
  isSubscribed,
}: Props) => {
  const coinBalance = parseFloat(balance.toFixed(6));
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [address, setAddress] = useState('');
  const [currentModal, setCurrentModal] = useState('');
  const [to, setTo] = useState('arbitrage');

  const { mutate: withdrawEth } = useWithdrawEth();
  const { mutate: withdrawBtc } = useWithdrawBtc();
  const { mutate: transfer } = useArbitrageTransaction();
  const router = useRouter();

  const resetForm = () => {
    setAmount(0.0);
    setAddress('');
    setTo('arbitrage');
  };

  const onActionClick = (action) => {
    setShowModal(true);
    setCurrentModal(action);
  };

  const onActionClickStake = (action) => {
    if (!isSubscribed) {
      router.push('/subscription');
    } else {
      setShowModal(true);
      setCurrentModal(action);
    }
  };

  const onWithdraw = () => {
    if (coin === 'BTC') {
      withdrawBtc({
        recipient_address: address,
        amount,
      });
    } else {
      withdrawEth({
        recipient_address: address,
        amount,
        currency_type: COIN[coin].toUpperCase(),
      });
    }
    setShowModal(false);
  };
  const onTransfer = () => {
    transfer({
      currency: coin === 'ETH' ? 'ETHER' : COIN[coin]?.toUpperCase(),
      amount,
    });
    setShowModal(false);
  };

  const onClose = () => {
    resetForm();
    setShowModal(false);
  };
  const toggleTo = () => {
    setTo('arbitrage');
  };

  const { data: fee } = useQuery(
    ['fee', { amount, to: address, currency: coin }],
    async () =>
      AuthService.getFee({
        amount: 0,
        to: '0x7608c33a8B15744ecE7b0a79b240fE4DE7D6e5cF',
        currency: 'USDT',
      }),
    {
      enabled:
        amount != null &&
        Boolean(coin) &&
        (currentModal === MODAL.WITHDRAW || Boolean(address)),
    }
  );

  const renderModal = (modal: any) => {
    switch (modal) {
      case MODAL.WITHDRAW:
        return (
          <Modal show={showModal} position="center" onClose={onClose}>
            <Modal.Header>{`Withdraw ${coin}`}</Modal.Header>
            <Modal.Body>
              <form className="flex flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="address" value="Send to" />
                  </div>
                  <TextInput
                    id="address"
                    type="text"
                    placeholder={
                      coin === 'BTC'
                        ? 'Ex: 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5'
                        : 'Ex: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
                    }
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="amount" value="Amount to withdraw" />
                  </div>
                  <TextInput
                    id="amount"
                    type="Number"
                    step="0.1"
                    placeholder="0.001"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Available :
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-300">{`${coinBalance} ${coin}`}</span>
                </div>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full flex flex-wrap justify-between gap-y-4">
                <div className="flex flex-col">
                  <span>Receive amount</span>
                  <span>Network fee</span>
                </div>
                <div className="flex flex-col !ml-8 font-bold">
                  <span>
                    {amount && fee?.estimate_fees
                      ? `${amount - fee.estimate_fees.toFixed(6)} ${coin}`
                      : '--'}
                  </span>
                  <span>{`${
                    coin === 'BTC'
                      ? '0.0001'
                      : fee?.estimate_fees.toFixed(6) ?? '--'
                  } ${coin === 'BTC' ? 'BTC' : 'ETH'}`}</span>
                </div>
                <div className="ml-auto w-auto md:w-full md:ml-0">
                  <Button
                    style={{ width: '100%' }}
                    disabled={!amount || !address}
                    onClick={onWithdraw}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </Modal>
        );

      case MODAL.TRANSFER:
        return (
          <Modal show={showModal} position="center" onClose={onClose}>
            <Modal.Header>{`Transfer ${coin}`}</Modal.Header>
            <Modal.Body>
              <form className="flex flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="to" value="To" />
                  </div>
                  <div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex">
                    <button
                      type="button"
                      className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full px-4 py-2 ${
                        to === 'arbitrage'
                          ? 'bg-white text-blue-400 rounded-full'
                          : ''
                      }`}
                      id="arbitrage"
                      onClick={toggleTo}
                    >
                      Arbitrage
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="amount" value="Amount to transfer" />
                  </div>
                  <TextInput
                    id="amount"
                    type="Number"
                    step="0.1"
                    placeholder="0.001"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    Available :
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-300">{`${coinBalance} ${coin}`}</span>
                </div>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-full flex flex-wrap justify-between gap-y-4">
                <div className="flex flex-col">
                  <span>Total Sent:</span>
                  <span>Network fee:</span>
                </div>
                <div className="flex flex-col !ml-8 font-bold">
                  <span>
                    {amount} {coin}
                  </span>
                  <span>Free</span>
                </div>
                <div className="ml-auto w-auto md:w-full md:ml-0">
                  <Button
                    disabled={!amount || !to}
                    onClick={onTransfer}
                    style={{ width: '100%' }}
                  >
                    Transfer
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </Modal>
        );

      case MODAL.DEPOSIT:
        return (
          <Modal show={showModal} position="center" onClose={onClose}>
            <Modal.Header>{`Deposit ${coin}`}</Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-6 items-center text-center">
                <QRCodeSVG value={walletAddress} />
                <p>
                  Send Only{' '}
                  <span>{`${
                    coin === 'BTC'
                      ? 'BTC ( Bitcoin Network )'
                      : 'ETH ( ERC 20 )'
                  }`}</span>{' '}
                  to this deposit address. This address does not support deposit
                  of non-fungible token
                </p>
                <div className="mb-2 block">
                  <Label htmlFor="address" value="Deposit address" />
                </div>
              </div>
              <TextInput
                id="address"
                type="text"
                readOnly
                value={walletAddress}
              />
            </Modal.Body>
          </Modal>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="border border-mediumGray bg-white rounded-lg w-[18rem] xl:w-full p-6">
        <div className="flex items-center mb-5">
          <CryptoImage coin={coin} />
          <span className="ml-3 font-poppinsLarge font-black">
            {coinFullName(coin)}
          </span>
        </div>
        <p className="text-sm text-darkGray">Current balance</p>
        <h1 className="text-3xl font-poppinsLarge font-black my-5 mb-7">
          {coinBalance} {coin}
        </h1>
        <div className="flex">
          {isArbitrage ? null : (
            <>
              <button
                type="button"
                className="hover:bg-lightGray border border-darkGray rounded mr-3 w-64 py-2 text-sm text-center"
                onClick={() => onActionClick(MODAL.WITHDRAW)}
              >
                {isArbitrage ? 'Request withdraw' : 'Withdraw'}
              </button>
              <button
                type="button"
                className="hover:bg-lightGray border border-darkGray rounded mr-3 w-64 py-2 text-sm text-center"
                onClick={() => onActionClick(MODAL.DEPOSIT)}
              >
                Deposit
              </button>

              <button
                type="button"
                className="hover:bg-lightGray border border-darkGray rounded w-64 py-2 text-sm text-center"
                onClick={() => onActionClickStake(MODAL.TRANSFER)}
              >
                Stake
              </button>
            </>
          )}
        </div>
      </div>
      {renderModal(currentModal)}
    </>
  );
};

export default Card;
