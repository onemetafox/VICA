import React, { useState, useContext, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useCoinsReducer } from 'src/hooks/useCoinsReducer';
import { OfferContext } from 'src/hooks/useStepReducer';
import CryptoRadio from 'src/components/CryptoRadio';
import PaymentMethods from 'src/components/PaymentMethods';
import RadioBullet from 'src/components/common/RadioBullet';
import OfferContainer from 'src/components/CreateOffer/Container';
import { coinFullName } from 'src/utils/coins-full-name';
import { useRouter } from 'next/router';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import ActionButtons from './ActionButtons';

const Payment = () => {
  const [isOpenPaymentMethods, setIsOpenPaymentMethods] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('ETHER');
  const { stepState, stepDispatch } = useContext(OfferContext);
  const { state, dispatch } = useCoinsReducer(stepState.firstCoin);
  const { query } = useRouter();
  const { opt } = query;
  const {
    buySell,
    firstCoin: stepFirstCoin,
    paymentMethod: stepPaymentMethod,
  } = stepState;

  const firstCoin = state.coinList1.selectedCoin;

  if (paymentMethod === firstCoin) {
    setPaymentMethod('');
  }

  if (firstCoin !== stepFirstCoin) {
    stepDispatch({ type: 'firstCoin', data: firstCoin });
  }
  if (paymentMethod !== stepPaymentMethod) {
    stepDispatch({ type: 'paymentMethod', data: paymentMethod });
  }

  const handleBuySellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'BUY' || e.target.value === 'SELL') {
      stepDispatch({ type: e.target.value });
    }
  };

  useEffect(() => {
    if (opt == 'BUY') {
      stepDispatch({ type: opt });
    }
  }, [query.opt]);
  return (
    <OfferContainer>
      <LeftSide>
        <p className=" mb-7">Select a cryptocurrency :</p>
        <CryptoRadio
          dispatch={dispatch}
          list={state.coinList1}
          actionType="Update_first_list"
        />
        <h1 className="text-xl font-bold my-9">What would you like to do ?</h1>
        <div className="flex flex-col mb-7 md:flex-col">
          <div className="flex items-start mb-4">
            <input
              checked={buySell === 'SELL'}
              id="SELL"
              type="radio"
              value="SELL"
              onChange={handleBuySellChange}
              name="BUY-SELL-radio"
              className="hidden"
            />
            <label
              htmlFor="SELL"
              className="ml-2 group font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
            >
              <div className="flex">
                <RadioBullet isActive={buySell === 'SELL'} />
                <div className="flex flex-col">
                  <h2 className="font-bold mb-1">
                    Sell {coinFullName(firstCoin)}
                  </h2>
                  <p className="text-darkGray">
                    Your offer will be listed on the Buy{' '}
                    {coinFullName(firstCoin)} page.
                  </p>
                </div>
              </div>
            </label>
          </div>
          <div className="flex items-start ">
            <input
              checked={buySell === 'BUY'}
              id="BUY"
              type="radio"
              value="BUY"
              onChange={handleBuySellChange}
              name="BUY-SELL-radio"
              className="hidden"
            />
            <label
              htmlFor="BUY"
              className="group ml-2 font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
            >
              <div className="flex">
                <RadioBullet isActive={buySell === 'BUY'} />
                <div className="flex flex-col">
                  <h2 className="font-bold mb-1 ">
                    Buy {coinFullName(firstCoin)}
                  </h2>
                  <p className="text-darkGray">
                    Your offer will be listed on the Sell{' '}
                    {coinFullName(firstCoin)} page.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>
        <p className=" mb-7">
          Select the payment method you want to{' '}
          {buySell === 'BUY' ? 'pay with' : 'be paid with'} :
        </p>
        <div
          className="self-start w-56 bg-white text-sm flex items-center justify-between relative py-2 px-4 border-[1px] border-blue-700 rounded cursor-pointer"
          onClick={() => setIsOpenPaymentMethods(true)}
        >
          <h1 className="text-darkGray">
            {paymentMethod === '' ? 'Payment Method' : paymentMethod}
          </h1>
          <div className="p-1 px-2 border-[1px] rounded border-blue-700 hover:bg-gray-50 transition-all duration-200">
            <AiOutlineMenu />
          </div>
        </div>

        <PaymentMethods
          isOpen={isOpenPaymentMethods}
          close={() => setIsOpenPaymentMethods(false)}
          onSelect={(value: string) => setPaymentMethod(value)}
          firstCoin={state.coinList1.selectedCoin}
        />
      </LeftSide>
      <RightSide>
        <ActionButtons
          disabledButton={paymentMethod === ''}
          stepDispatch={stepDispatch}
          data={{ ...stepState, buySell, firstCoin, paymentMethod }}
        />
      </RightSide>
    </OfferContainer>
  );
};

export default Payment;
