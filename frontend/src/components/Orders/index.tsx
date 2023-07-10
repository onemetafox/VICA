import React from 'react';
import Container from 'src/components/common/Container';
import { CoinsTypes, isCoinTypeOfCoinsList } from 'src/types/coins';
import { coinFullName } from 'src/utils/coins-full-name';
import { useFetchPaymentMethods } from 'src/queries/paymentMethods';
import Row from './Row';

const Orders = ({ user }: any) => {
  const { data: paymentMethods } = useFetchPaymentMethods();

  if (typeof window === 'undefined') {
    return <h1>Loading...</h1>;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const orders = urlParams.get('ordersList');
  const currency = urlParams.get('currency');
  const paymentMethodName = urlParams.get('paymentMethodName');
  const offerType = urlParams.get('offerType');
  const price = urlParams.get('price');
  const tradeMin = urlParams.get('tradeMin');
  const tradeMax = urlParams.get('tradeMax');
  const numberToMultiplyAmountWith = urlParams.get(
    'numberToMultiplyAmountWith'
  );
  const paymentMethodType = paymentMethods?.filter(
    (pay: any) => pay?.name === paymentMethodName
  )[0]?.type;
  let coinName: CoinsTypes = 'BTC';
  let ordersList;
  if (orders) {
    ordersList = [...JSON.parse(orders)];
  }
  if (isCoinTypeOfCoinsList(currency)) {
    coinName = currency;
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-5">Orders</h1>
      <p className="text-lg mb-3">
        Your Offer to {offerType}{' '}
        <span className="font-bold">{coinFullName(coinName)}</span> with{' '}
        <span className="font-bold">{paymentMethodName}</span>
      </p>
      <p className="mb-2">
        Price : <span className="font-bold">{price} USD</span>
      </p>
      <p className="mb-12">
        Trade limits :{' '}
        <span className="font-bold">
          {tradeMin} USD - {tradeMax} USD
        </span>
      </p>
      <table className="bg-white border rounded-lg w-full ed:hidden ">
        <thead className="bg-gray-50">
          <tr>
            <td className="px-6 py-4 font-bold text-sm">Order no</td>
            <td className="px-6 py-4 font-bold text-sm">User</td>
            <td className="px-6 py-4 font-bold text-sm">Created at</td>
            <td className="px-6 py-4 font-bold text-sm">Amount sent (USD)</td>
            <td className="px-6 py-4 font-bold text-sm">User confirmation</td>
            <td className="px-6 py-4 font-bold text-sm">Status</td>
            <td className="px-6 py-4 font-bold text-sm text-center">Actions</td>
          </tr>
        </thead>
        <tbody>
          {ordersList?.map((order: any) => (
            <Row
              key={order.order_no}
              offerType={offerType}
              order={order}
              price={price}
              paymentMethodName={paymentMethodName}
              numberToMultiplyAmountWith={numberToMultiplyAmountWith}
            />
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default Orders;
