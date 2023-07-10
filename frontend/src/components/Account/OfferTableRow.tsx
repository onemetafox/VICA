import React from 'react';
import { useRouter } from 'next/router';
import { useFetchCoinsConversion } from 'src/queries/coins';
import { useFetchOfferOrders, useCloseOffer } from 'src/queries/offers';
import CryptoImage from '../common/CryptoImage';

const OfferTableRow = ({ offer, paymentMethods }: any) => {
  const router = useRouter();
  const { data: orders } = useFetchOfferOrders(offer?.id);
  const closeOffreMutation = useCloseOffer();
  const paymentMethod = paymentMethods?.filter(
    (pMethod: any) => pMethod?.id === offer?.payment_method
  )[0];
  const paymentMethodName = paymentMethod?.name;
  const paymentMethodType = paymentMethod?.type;
  const paymentMethodToConvert =
    paymentMethodType === 'DC' ? paymentMethodName : 'USD';

  const { data: currencyInUsd } = useFetchCoinsConversion(
    offer?.currency,
    'USD'
  );
  const { data: paymentMethodInUsd } = useFetchCoinsConversion(
    paymentMethodToConvert,
    'USD'
  );
  let Available = '0';
  let price = '0';
  let tradeMin = '0';
  let tradeMax = '0';
  let numberToMultiplyWith =
    offer?.type === 'BUY' ? currencyInUsd?.result : paymentMethodInUsd?.result;

  if (paymentMethodType !== 'DC') {
    numberToMultiplyWith = 1;
  }
  if (offer?.price) {
    console.log(offer);

    Available = offer?.available_amount;
    price = (parseFloat(offer?.price) * numberToMultiplyWith).toFixed(2);
    tradeMin = (
      parseFloat(offer?.trade_limit_min) * numberToMultiplyWith
    ).toFixed(0);
    tradeMax = (
      parseFloat(offer?.trade_limit_max) * numberToMultiplyWith
    ).toFixed(0);
  }
  const handleCloseOffre = () => {
    if (offer.id) {
      closeOffreMutation.mutate(offer.id);
    }
  };

  return (
    // @dev Vertical View
    <tr key={offer.id} className="border-b-[1px]">
      <td className="px-6 py-4 text-sm sm:py-2">
        <CryptoImage coin={offer?.currency} />
        <div className=" hidden ed:flex ed:flex-col ed:mt-2 sm:text-xs">
          <div className="mb-2 flex w-full justify-between items-center">
            <p>Available Amount :</p>
            <p>{Available} USD</p>
          </div>
          <div className="mb-2 flex w-full justify-between items-center">
            <p>Price : </p>
            <p>{price} USD</p>
          </div>
          <div className="mb-2 flex w-full justify-between items-center">
            <p>Payment Method : </p>
            <p>{paymentMethodName}</p>
          </div>
          <div className="mb-2 flex w-full justify-between items-center">
            <p>Trade limits : </p>
            <p>
              {tradeMin}-{tradeMax} USD
            </p>
          </div>
          <div className="mb-2 flex w-full justify-between items-center">
            <p>Active orders :</p>
            <p>{orders ? orders?.length : 'Loading...'}</p>
          </div>
          {orders?.length > 0 && (
            <div className="mb-2 flex w-full justify-between items-center">
              <p>Actions: </p>
              <p>
                <button
                  type="button"
                  className="ml-10 p-3 bg-lightGray hover:bg-gray-200 rounded"
                  onClick={() =>
                    router.push(
                      `/orders?ordersList=${encodeURIComponent(
                        JSON.stringify(orders)
                      )}&currency=${
                        offer?.currency
                      }&paymentMethodName=${paymentMethodName}&offerType=${
                        offer?.type
                      }&price=${price}&tradeMin=${tradeMin}&tradeMax=${tradeMax}&numberToMultiplyAmountWith=${numberToMultiplyWith}`
                    )
                  }
                >
                  View orders
                </button>
              </p>
            </div>
          )}
          <div className="mb-2 flex w-full justify-between items-center">
            <p />
            <p>
              {offer?.status == 'CANCELLED' ? (
                <button
                  type="button"
                  className="ml-10 p-2 bg-gray-400 text-white rounded"
                >
                  {offer?.status}
                </button>
              ) : (
                <button
                  type="button"
                  className="ml-10 p-2 bg-red-400 text-white hover:bg-red-600 rounded"
                  onClick={() => handleCloseOffre()}
                >
                  Cancel Order
                </button>
              )}
            </p>
          </div>
        </div>
        {/* . //@dev horizontal View  */}
      </td>
      <td className="px-6 py-4 text-sm ed:hidden">{Available}</td>
      <td className="px-6 py-4 text-sm ed:hidden">{price} USD</td>
      <td className="px-6 py-4 text-sm ed:hidden">
        {tradeMin}-{tradeMax} USD
      </td>
      <td className="px-6 py-4 text-sm ed:hidden">{paymentMethodName}</td>
      <td className="px-6 py-4 text-sm text-center ed:hidden">
        {orders ? orders?.length : 'Loading...'}
      </td>
      <td className="px-6 pl-4 text-sm text-center ed:hidden">
        {orders?.length > 0 && (
          <button
            type="button"
            className="ml-10 p-3 bg-lightGray hover:bg-gray-200 rounded"
            onClick={() =>
              router.push(
                `/orders?ordersList=${encodeURIComponent(
                  JSON.stringify(orders)
                )}&currency=${
                  offer?.currency
                }&paymentMethodName=${paymentMethodName}&offerType=${
                  offer?.type
                }&price=${price}&tradeMin=${tradeMin}&tradeMax=${tradeMax}&numberToMultiplyAmountWith=${numberToMultiplyWith}`
              )
            }
          >
            View orders
          </button>
        )}
        {offer?.status == 'CANCELLED' ? (
          <button
            type="button"
            className="ml-10 p-2 bg-gray-400 text-white rounded"
          >
            {offer?.status}
          </button>
        ) : (
          <button
            type="button"
            className="ml-10 p-2 bg-red-400 text-white hover:bg-red-600 rounded"
            onClick={() => handleCloseOffre()}
          >
            Cancel Order
          </button>
        )}
      </td>
    </tr>
  );
};

export default OfferTableRow;
