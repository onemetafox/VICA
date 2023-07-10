import React from 'react';
import { useFetchCoinsConversion } from 'src/queries/coins';
import { APIPAYMENTMETHOD } from 'src/types/paymentMethods';
import { CoinsTypes } from 'src/types/coins';
import { Offers } from 'src/types/offers';
import { useFetchUser } from 'src/queries/user';
import Row from './Row';

type Props = {
  variant: 'BUY' | 'SELL';
  mainCoin: CoinsTypes;
  data: Offers[];
  paymentMethodObject: APIPAYMENTMETHOD;
};

const MainTable = ({ variant, mainCoin, paymentMethodObject, data }: Props) => {
  const { data: user } = useFetchUser();

  const paymentMethodType = paymentMethodObject?.type;
  const paymentMethodName = paymentMethodObject?.name;
  const paymentMethod = paymentMethodType === 'DC' ? paymentMethodName : 'USD';

  const { data: coinPrice } = useFetchCoinsConversion(mainCoin, 'USD');
  const { data: paymentMethodPrice } = useFetchCoinsConversion(
    paymentMethod,
    'USD'
  );

  const cr1InUsd: number = coinPrice?.result;
  const cr2InUsd: number = paymentMethodPrice?.result;
  let priceToMultiply = cr1InUsd;
  // let likes = user?.likes;

  if (typeof cr1InUsd !== 'number' && typeof cr2InUsd !== 'number' && !user) {
    return <h1>Loading...</h1>;
  }
  if (paymentMethodType !== 'DC') {
    priceToMultiply = 1;
  } else if (variant === 'SELL') {
    priceToMultiply = cr2InUsd;
  }

  return (
    <table className="rounded-lg w-full text-sm text-left text-gray-500 border-t border-l border-r ">
      <thead className="text-gray-700 bg-gray-50 capitalize">
        <tr>
          <th scope="col" className="px-6 py-3 w-[37%] lg:w-[50]">
            {variant === 'BUY' ? 'Buy From' : 'Sell To'}
          </th>
          <th scope="col" className="px-6 py-3 w-[14%] lg:hidden">
            Get Paid With
          </th>
          <th scope="col" className="px-6 py-3 w-[14%] lg:hidden">
            Avg. Trade Speed
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-center w-[45%] lg:w-[50] lg:text-right"
          >
            Price / {mainCoin}
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.map((offer) => (
          <Row
            key={offer.id}
            offerId={offer.id}
            variant={variant}
            mainCoin={mainCoin}
            mainCoinInUsd={cr1InUsd}
            paymentMethodInUsd={cr2InUsd}
            paymentMethodId={offer?.payment_method}
            paymentMethod={paymentMethod}
            paymentMethodName={paymentMethodName}
            paymentMethodType={paymentMethodType}
            price={parseFloat(offer.price) * priceToMultiply}
            name={offer.username}
            tradeSpeed={offer.time_limit}
            likes={9836}
            limits={[
              Math.floor(parseFloat(offer.trade_limit_min) * priceToMultiply),
              Math.floor(parseFloat(offer.trade_limit_max) * priceToMultiply),
            ]}
            terms={offer.terms}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MainTable;
