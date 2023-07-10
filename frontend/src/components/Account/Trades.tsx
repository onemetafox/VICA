import React from 'react';
import { useRouter } from 'next/router';
import { useFetchPaymentMethods } from 'src/queries/paymentMethods';
import Container from 'src/components/Account/Container';
import Row from './TradeRow';

const Trades = ({ trades }: any) => {
  const { data: paymentMethods } = useFetchPaymentMethods();
  const TODAY = new Date().toDateString();
  const PASTDAY = new Date(
    Date.now() - 14 * 24 * 60 * 60 * 1000
  ).toDateString();

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-5">Trades</h1>

      {trades?.length === 0 ? (
        <h1>You have no active trades for the past 14 days</h1>
      ) : (
        <>
          <p className="text-sm mb-12">
            You are viewing all trades for the last 14 days
          </p>
          <table className="bg-white border rounded-lg w-full ">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-9 px-5 text-left">
                  <h1 className="text-lg mb-1">My Past Trades</h1>
                  <p className="text-xs text-gray-500">
                    {PASTDAY} - {TODAY}
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {trades?.map((trade: any) => (
                <Row
                  key={trade?.order_no}
                  order={trade}
                  offerId={trade?.offer}
                  paymentMethods={paymentMethods}
                />
              ))}
            </tbody>
          </table>
        </>
      )}
    </Container>
  );
};

export default Trades;
