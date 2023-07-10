import React, { useState } from 'react';
import CryptoImage from 'src/components/common/CryptoImage';
import { useFetchCoinsConversion } from 'src/queries/coins';
import { useFetchOffers } from 'src/queries/offers';
import Feedback from './Modals/Feedback';

type Props = {
  order: any;
  offerId: string;
  paymentMethods: any;
};

const Row = ({ order, offerId, paymentMethods }: Props) => {
  const [openFeedback, setOpenFeedback] = useState(false);
  const { data: offers } = useFetchOffers();
  const offer = offers?.filter((ofr: any) => ofr.id == offerId)[0];
  const paymentMethod = paymentMethods?.filter(
    (pMethod: any) => pMethod?.id === offer?.payment_method
  )[0];

  const orderId = order?.order_no;
  const amount = order?.amount_sent;
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
  let price = 0;
  let numberToMultiplyWith =
    offer?.type === 'BUY' ? currencyInUsd?.result : paymentMethodInUsd?.result;

  if (paymentMethodType !== 'DC') {
    numberToMultiplyWith = 1;
  }
  if (amount) {
    price = Math.floor(parseFloat(amount) * numberToMultiplyWith);
  }

  const currency = offer?.currency;
  const userName = offer?.username;
  const createdAt = new Date(offer?.created_at);
  const tradeType = offer?.type === 'BUY' ? 'Sell' : 'Buy';
  const status = order?.status;

  return (
    <tr className="px-5 py-7 flex items-center ed:flex-col ed:items-start ">
      <p className="hidden mb-2 ed:block">{paymentMethodName}</p>
      <div className="flex items-center">
        <p className="hidden ml-2 text-blue-700 cursor-pointer ed:block">
          {userName}
        </p>
      </div>
      <div className="flex-col justify-center ml-3 ed:ml-0 ed:my-4 ed:items-start ">
        <p className=" mb-2 ed:hidden">{paymentMethodName}</p>
        <div className="flex text-xs items-center">
          <CryptoImage coin={currency} width={25} />
          <p className="mx-2">{tradeType}</p>
          <p className="mr-2 text-blue-700 cursor-pointer ed:hidden">
            {userName}
          </p>
          <p>
            {createdAt?.toDateString()}, {createdAt?.toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="flex items-center ml-auto ed:ml-0 ed:flex-col ed:items-start ed:justify-start">
        <div className="flex-col ed:flex">
          <p className="text-sm mb-2 font-bold">{price} USD</p>
          <p className="text-xs text-darkGray">
            Rate: {parseFloat(order?.price).toFixed(2)} {currency} /{' '}
            {paymentMethodToConvert}
          </p>
        </div>
        <div className="p-3 rounded text-sm bg-lightGray ml-5 ed:ml-0 ed:p-2 ed:my-3">
          {status}
        </div>

        {status === 'COMPLETED' &&
          (!order?.review ? (
            <button
              type="button"
              onClick={() => setOpenFeedback(true)}
              className="p-3 rounded text-sm bg-blue-700 hover:bg-blue-500 text-white y ml-5 ed:ml-0  ed:p-2"
            >
              Leave a feedback
            </button>
          ) : (
            <div className="p-3 rounded text-sm bg-darkGray text-white y ml-5 ed:ml-0 ed:p-2">
              Feedback sent !
            </div>
          ))}
      </div>
      {typeof orderId === 'string' && (
        <Feedback
          isOpen={openFeedback}
          onClose={() => setOpenFeedback(false)}
          orderId={orderId}
        />
      )}
    </tr>
  );
};

export default Row;
