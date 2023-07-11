import React from 'react';
import Popup from 'reactjs-popup';
import { coinFullName } from 'src/utils/coins-full-name2';
import { useFetchPaymentMethods } from 'src/queries/paymentMethods';
import { CoinsTypes, isCoinTypeOfCoinsList } from 'src/types/coins';
import { APIPAYMENTMETHOD, APILISTMETHODS } from 'src/types/paymentMethods';

type Props = {
  isOpen: boolean;
  close:
    | ((
        event?:
          | KeyboardEvent
          | TouchEvent
          | MouseEvent
          | React.SyntheticEvent<Element, Event>
          | undefined
      ) => void)
    | undefined;
  onSelect: (value: string) => void;
  firstCoin: CoinsTypes;
};

const PaymentMethods = ({ isOpen, close, onSelect, firstCoin }: Props) => {
  const { data } = useFetchPaymentMethods();
  console.log('this is data', data);

  if (!data) {
    return <h1> </h1>;
  }
  const digitalCurrencies: APILISTMETHODS = data?.filter(
    (paymentMethod: APIPAYMENTMETHOD) =>
      paymentMethod.type === 'DC' && paymentMethod.name !== firstCoin
  );
  const bankTransfers: APILISTMETHODS = data?.filter(
    (paymentMethod: APIPAYMENTMETHOD) => paymentMethod.type === 'BT'
  );
  const cashPayments: APILISTMETHODS = data?.filter(
    (paymentMethod: APIPAYMENTMETHOD) => paymentMethod.type === 'CP'
  );
  const giftCards: APILISTMETHODS = data?.filter(
    (paymentMethod: APIPAYMENTMETHOD) => paymentMethod.type === 'GC'
  );

  const handleSelectPaymentMethod = (currency: string) => {
    onSelect(currency);
    if (close) {
      close();
    }
  };
  return (
    <Popup className="w-full" open={isOpen} onClose={close}>
      <div className="p-4 pb-6">
        <h1 className="font-bold mb-3 text-lg">Digital Currencies</h1>
        <div className="grid grid-cols-3 lg:grid-cols-2 axs:grid-cols-1 gap-4">
          {digitalCurrencies.map((currency) => (
            <PaymentMethod
              key={currency.name}
              onSelect={() => handleSelectPaymentMethod(currency.name)}
            >
              {isCoinTypeOfCoinsList(currency.name) &&
                coinFullName(currency.name)}
            </PaymentMethod>
          ))}
        </div>
        <h1 className="font-bold mb-3 mt-5 text-lg">Bank Transfers</h1>
        <div className="grid grid-cols-3 lg:grid-cols-2 axs:grid-cols-1 gap-4">
          {bankTransfers.map((currency) => (
            <PaymentMethod
              key={currency.name}
              onSelect={() => handleSelectPaymentMethod(currency.name)}
            >
              {currency.name.toLowerCase()}
            </PaymentMethod>
          ))}
        </div>
        <h1 className="font-bold mb-3 mt-5 text-lg">Cash Payments</h1>
        <div className="grid grid-cols-3 lg:grid-cols-2 axs:grid-cols-1 gap-4">
          {cashPayments.map((currency) => (
            <PaymentMethod
              key={currency.name}
              onSelect={() => handleSelectPaymentMethod(currency.name)}
            >
              {currency.name.toLowerCase()}
            </PaymentMethod>
          ))}
        </div>
        <h1 className="font-bold mb-3 mt-5 text-lg">Gift Cards</h1>
        <div className="grid grid-cols-3 lg:grid-cols-2 axs:grid-cols-1 gap-4">
          {giftCards.map((currency) => (
            <PaymentMethod
              key={currency.name}
              onSelect={() => handleSelectPaymentMethod(currency.name)}
            >
              {currency.name.toLowerCase()}
            </PaymentMethod>
          ))}
        </div>
      </div>
    </Popup>
  );
};

const PaymentMethod: React.FC<
  React.PropsWithChildren<{
    onSelect: React.MouseEventHandler<HTMLDivElement>;
  }>
> = ({ children, onSelect }) => (
  <div
    className="cursor-pointer capitalize p-2 px-2 border-[1px] rounded border-blue-700 hover:bg-gray-50 transition-all duration-200 w-full"
    onClick={onSelect}
  >
    {children}
  </div>
);
export default PaymentMethods;
