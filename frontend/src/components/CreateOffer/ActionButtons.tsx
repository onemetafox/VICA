import React, { useState } from 'react';
import { ACTIONTYPE, STEPSTATETYPE } from 'src/hooks/useStepReducer';
import { PaymentMethod } from 'src/types/offers';
import { useCreateOffer } from 'src/queries/offers';
import { useFetchPaymentMethods } from 'src/queries/paymentMethods';
import { useFetchCoinsConversion } from 'src/queries/coins';
import { APIPAYMENTMETHOD } from 'src/types/paymentMethods';

type Props = {
  data: STEPSTATETYPE;
  stepDispatch: React.Dispatch<ACTIONTYPE>;
  disabledButton?: boolean;
};

const ActionButtons = ({ data, stepDispatch, disabledButton }: Props) => {
  const [isCreateOffer, setIsCreateOffer] = useState(false);
  const { data: paymentMethods } = useFetchPaymentMethods();
  const {
    buySell,
    firstCoin,
    paymentMethod,
    step,
    price,
    amount,
    label,
    status,
    instructions,
    terms,
    trade_limit_max,
    trade_limit_min,
  } = data;

  const mutation = useCreateOffer();

  const paymentMethodType = paymentMethods?.filter(
    (payment: APIPAYMENTMETHOD) => payment?.name === paymentMethod
  )[0]?.type;

  const paymentMethodId = paymentMethods?.filter(
    (pay: PaymentMethod) => pay?.name === data.paymentMethod
  )[0]?.id;

  const newPaymentMethod = paymentMethodType === 'DC' ? paymentMethod : 'USD';

  const { data: paymentMethodPrice } = useFetchCoinsConversion(
    newPaymentMethod,
    'USD'
  );
  const { data: coinPrice } = useFetchCoinsConversion(firstCoin, 'USD');

  const handelCreateOffer = () => {
    const cr1InUsd: number = coinPrice?.result;
    const cr2InUsd: number = paymentMethodPrice?.result;
    let amountConverted = 0;
    let priceConverted = 0;
    let tradeLimitMin = 0;
    let tradeLimitMax = 0;

    if (paymentMethodType !== 'DC') {
      amountConverted = parseFloat((amount / cr1InUsd).toFixed(6));
      priceConverted = parseFloat(price.toFixed(6));
      tradeLimitMin = parseFloat(trade_limit_min.toFixed(6));
      tradeLimitMax = parseFloat(trade_limit_max.toFixed(6));
    } else if (buySell === 'SELL') {
      amountConverted = parseFloat((amount / cr1InUsd).toFixed(6));
      priceConverted = parseFloat((price / cr2InUsd).toFixed(6));
      tradeLimitMin = parseFloat((trade_limit_min / cr2InUsd).toFixed(6));
      tradeLimitMax = parseFloat((trade_limit_max / cr2InUsd).toFixed(6));
    } else if (buySell === 'BUY') {
      amountConverted = parseFloat((amount / cr2InUsd).toFixed(6));
      priceConverted = parseFloat((price / cr1InUsd).toFixed(6));
      tradeLimitMin = parseFloat((trade_limit_min / cr1InUsd).toFixed(6));
      tradeLimitMax = parseFloat((trade_limit_max / cr1InUsd).toFixed(6));
    }

    mutation.mutate({
      type: data.buySell.toUpperCase(),
      currency: data.firstCoin.toUpperCase(),
      payment_method: paymentMethodId,
      price: priceConverted,
      label,
      instructions,
      terms,
      status,
      time_limit: parseFloat(data.limitTime),
      trade_limit_min: tradeLimitMin,
      trade_limit_max: tradeLimitMax,
      amount: amountConverted,
    });
  };

  if (mutation.isLoading && isCreateOffer === false) {
    setIsCreateOffer(true);
  }
  if (!paymentMethods || !paymentMethodPrice || !coinPrice) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="flex w-full asm:self-stretch items-center mt-10 asm:flex-col-reverse">
      <button
        type="button"
        disabled={step === 1}
        onClick={() => {
          if (step >= 1) {
            stepDispatch({ type: 'Decrement', data });
          }
        }}
        className={` py-4 w-56 asm:mt-3 border-[1px] border-gray-400 rounded ml-3 asm:ml-0 asm:w-full ${
          step === 1
            ? 'bg-gray-200 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-lightGray'
        }`}
      >
        Previous step
      </button>
      <button
        type="button"
        disabled={disabledButton || isCreateOffer}
        onClick={() => {
          if (step < 3) {
            stepDispatch({ type: 'Increment', data });
          } else if (step === 3) {
            handelCreateOffer();
          }
        }}
        className={` border-[1px]  py-4 w-56  rounded ml-3 asm:ml-0 asm:w-full ${
          disabledButton || isCreateOffer
            ? 'bg-gray-200 text-gray-400'
            : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-500 '
        }`}
      >
        {step === 3 ? 'Create offer' : 'Next'}
      </button>
    </div>
  );
};

export default ActionButtons;
