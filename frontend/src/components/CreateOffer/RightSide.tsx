import React, { FC, PropsWithChildren, useContext } from 'react';
import { OfferContext } from 'src/hooks/useStepReducer';
import { coinFullName } from 'src/utils/coins-full-name';

const Step1Text = () => (
  <p className="mt-3">
    Start creating your offer by selecting the cryptocurrency you want to trade,
    whether or not you want to buy or sell, and the payment method you want to
    use.
  </p>
);

const Step2Text = () => (
  <p className="mt-3">
    Decide the price you want to trade at, and set the limits for your offer.
  </p>
);

const Step3Text = () => (
  <p className="mt-3">
    Set the terms, instructions, and limitations for people to trade on this
    offer.
  </p>
);

const RightSide: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { stepState } = useContext(OfferContext);
  const {
    firstCoin,
    buySell,
    trade_limit_min,
    trade_limit_max,
    paymentMethod,
    step,
  } = stepState;

  return (
    <div className="flex flex-col pl-10 w-[30%] xl:w-full sm:pl-0 xl:mt-10">
      <h1 className="font-bold text-2xl">About this step</h1>
      {step === 1 && <Step1Text />}
      {step === 2 && <Step2Text />}
      {step === 3 && <Step3Text />}
      <ul className="mt-5 text-sm list-none asm:text-sm">
        <li className="mb-2 ml-3 flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
          You want to {buySell.toLowerCase()}
          <span className="font-bold px-2">
            {coinFullName(firstCoin)} ({firstCoin})
          </span>
        </li>
        <li className="mb-2 ml-3 flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
          And {buySell === 'BUY' ? 'pay' : 'get paid'} via
          <span className="font-bold px-2">{paymentMethod}</span>
        </li>
        {step >= 2 && (
          <li className="mb-2 ml-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
            People can trade between {trade_limit_min} USD and {trade_limit_max}{' '}
            USD
          </li>
        )}

        {buySell === 'SELL' && (
          <li className="mb-2 ml-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
            You will pay ViCA a 1 % fee for each trade
          </li>
        )}
      </ul>
      {children}
    </div>
  );
};

export default RightSide;
