import { useRouter } from 'next/router';
import React from 'react';
import { useOwnerConfirmOrder } from 'src/queries/trades';

const Row = ({
  order,
  numberToMultiplyAmountWith,
  offerType,
  paymentMethodName,
  price,
}: any) => {
  const router = useRouter();
  const mutation = useOwnerConfirmOrder();
  const createdAt = new Date(order?.created_at).toLocaleDateString('fr');
  const at = new Date(order?.created_at).toLocaleTimeString();
  let amountSent = 0;
  if (numberToMultiplyAmountWith) {
    amountSent =
      parseFloat(order?.amount_sent) * parseFloat(numberToMultiplyAmountWith);
  }
  /*  const handleOrderConfirmation = () => {
    if (order?.order_no) {
      mutation.mutate(order?.order_no);
    }
  }; */

  return (
    <tr className="border-b-[1px]">
      <td className="px-6 py-4 text-sm">{order?.order_no}</td>
      <td className="px-6 py-4 text-sm">{order?.username}</td>
      <td className="px-6 py-4 text-sm">
        {createdAt} at {at}
      </td>
      <td className="px-6 py-4 text-sm">{amountSent.toFixed()}</td>
      <td className="px-6 py-4 text-sm">
        {order?.confirmed_by_user ? (
          <span className="text-green-600">Confirmed</span>
        ) : (
          <span className="text-red-600">Not Confirmed</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm">{order?.status}</td>
      <td className="px-6 py-4 text-sm">
        {!order?.confirmed_by_owner && order?.status !== 'COMPLETED' && (
          <button
            type="button"
            className="ml-10 p-3 bg-lightGray hover:bg-gray-200 rounded"
            onClick={() => {
              router.push(
                `/trade?orderId=${order?.order_no}&offerId=${
                  order?.offer
                }&offerType=${offerType}&pay=${amountSent.toFixed()}&paymentMethodName=${paymentMethodName}&price=${price}`
              );
            }}
          >
            Confirm order
          </button>
        )}
      </td>
    </tr>
  );
};

export default Row;
