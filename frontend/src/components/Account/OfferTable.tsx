import React from 'react';
import { useFetchPaymentMethods } from 'src/queries/paymentMethods';
import EmptyOfferTable from './EmptyOfferTable';
import OfferTableRow from './OfferTableRow';

const BuyOfferTable = ({ data }: any) => {
  const { data: paymentMethods } = useFetchPaymentMethods();
  if (data?.length === 0) {
    return <EmptyOfferTable />;
  }
  return (
    <table className="bg-white border rounded-lg w-full ">
      <thead className="bg-gray-50">
        <tr>
          <td className="px-6 py-4 font-bold text-sm ed:hidden">Coin</td>
          <td className="px-6 py-4 font-bold text-sm text-center hidden ed:block">
            Trade
          </td>
          <td className="px-6 py-4 font-bold text-sm ed:hidden">Available</td>
          <td className="px-6 py-4 font-bold text-sm ed:hidden">Rate</td>
          <td className="px-6 py-4 font-bold text-sm ed:hidden">
            Min-Max amount
          </td>
          <td className="px-6 py-4 font-bold text-sm ed:hidden">
            Payment method
          </td>
          <td className="px-6 py-4 font-bold text-sm text-center ed:hidden">
            Active orders
          </td>
          <td className="px-6 py-4 font-bold text-sm text-center ed:hidden">
            Actions
          </td>
        </tr>
      </thead>
      <tbody>
        {data?.map((offer: any) => (
          <OfferTableRow
            key={offer?.id}
            offer={offer}
            paymentMethods={paymentMethods}
          />
        ))}
      </tbody>
    </table>
  );
};

export default BuyOfferTable;
