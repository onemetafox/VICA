import React, { useEffect, useState } from 'react';
import { useCoinsReducer } from 'src/hooks/useCoinsReducer';
import { useCoinsReducerETH } from 'src/hooks/useCoinsReducerETH';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiSearchLine } from 'react-icons/ri';
import { coinFullName } from 'src/utils/coins-full-name';
import BuySellDropDown from 'src/components/Hero/BuySellDropDown';
import PaymentMethods from 'src/components/PaymentMethods';
import { countries } from 'src/utils/countries';
import Input from 'src/components/CreateOffer/Input';
import { PaymentMethod, Offers } from 'src/types/offers';
import { CoinsTypes } from 'src/types/coins';
import { useGeoLocation } from 'src/hooks/useGeolocation';
import { useFetchUser } from 'src/queries/user';
import { useMutateCoinsConversion } from 'src/queries/coins';
import { useRouter } from 'next/router';

type Props = {
  variant: 'BUY' | 'SELL';
  offers: Offers[];
  landedeCoin;
  paymentMethods: PaymentMethod[];
  paymentMethodRef: React.MutableRefObject<string>;
  filterData: {
    coin: CoinsTypes;
    paymentMethodObject: PaymentMethod;
    rowsData: any[];
  };
  setFilterData: React.Dispatch<
    React.SetStateAction<{
      coin: CoinsTypes;
      paymentMethodObject: PaymentMethod;
      rowsData: any[];
    }>
  >;
};

const Aside = ({
  offers,
  paymentMethods,
  landedeCoin,
  variant,
  paymentMethodRef,
  filterData,
  setFilterData,
}: Props) => {
  const buySell = variant === 'BUY' ? 'SELL' : 'BUY';
  const { country: locationCountry } = useGeoLocation();
  const { data: user } = useFetchUser();
  const [isOpenPaymentMethods, setIsOpenPaymentMethods] = useState(false);
  const [ownerCountry, setOwnerCountry] = useState('');
  const { state, dispatch } = useCoinsReducer();
  const { stateETH, dispatchETH } = useCoinsReducerETH();
  const [amount, setAmount] = useState('');
  const mutationCoinPrice = useMutateCoinsConversion();
  const mutationPaymentMethodPrice = useMutateCoinsConversion();

  const [paymentMethod, setPaymentMethod] = useState(filterData.paymentMethodObject.name);
  if (locationCountry && ownerCountry === '') {
    setOwnerCountry(locationCountry);
  }

  /* if (paymentMethodRef.current === state.coinList1.selectedCoin) {
    paymentMethodRef.current = '';
  } */
  const onFindOffers = () => {
    const country = countries.filter((ctr) => ctr.code === ownerCountry)[0]
      .code;
    const coin = state.coinList1.selectedCoin;
    const newPaymentMethodObject = paymentMethods.filter(
      (pay: PaymentMethod) => pay?.name === paymentMethodRef.current
    )[0];
    if (amount === '') {
      let newRowsData = [...offers].filter(
        (offer) =>
          offer.type === variant &&
          offer.currency === coin &&
          offer.payment_method === newPaymentMethodObject.id &&
          offer?.username !== user?.username &&
          offer?.user_country === country
      );
      if (ownerCountry == 'ww') {
        newRowsData = [...offers].filter(
          (offer) =>
            offer.type === variant &&
            offer.currency === coin &&
            offer.payment_method === newPaymentMethodObject.id &&
            offer?.username !== user?.username
        );
      }

      setFilterData({
        coin,
        paymentMethodObject: newPaymentMethodObject,
        rowsData: [...newRowsData],
      });
    } else {
      const paymentMethodName = paymentMethods.filter(
        (pay: PaymentMethod) => pay?.name === paymentMethodRef.current
      )[0].name;
      mutationCoinPrice.mutate(coin);
      mutationPaymentMethodPrice.mutate(paymentMethodName);
    }
  };

  useEffect(() => {
    const findOffers = () => {
      const country = countries.filter((ctr) => ctr.code === ownerCountry)[0]
        .name;
      const coin = state.coinList1.selectedCoin;
      const newPaymentMethodObject = paymentMethods.filter(
        (pay: PaymentMethod) => pay?.name === paymentMethodRef.current
      )[0];
      const paymentMethodType = newPaymentMethodObject.type;
      const cr1InUsd: number = mutationCoinPrice?.data?.result;
      const cr2InUsd: number = mutationPaymentMethodPrice?.data?.result;
      let priceToMultiply = cr1InUsd;

      if (paymentMethodType !== 'DC') {
        priceToMultiply = 1;
      } else if (variant === 'SELL') {
        priceToMultiply = cr2InUsd;
      }
      const amountConverted = parseInt(amount, 10) / priceToMultiply;
      const newRowsData = [...offers].filter(
        (offer) =>
          offer.type === variant &&
          offer.currency === coin &&
          offer.payment_method === newPaymentMethodObject.id &&
          offer?.username !== user?.username &&
          // offer?.user_country === country &&
          offer.current_trade_limit_max >= amountConverted &&
          offer?.current_trade_limit_min <= amountConverted
      );
      setFilterData({
        coin,
        paymentMethodObject: newPaymentMethodObject,
        rowsData: [...newRowsData],
      });
    };
    if (mutationCoinPrice.data && mutationPaymentMethodPrice.data) {
      findOffers();
    }
  }, [mutationCoinPrice.data, mutationPaymentMethodPrice.data]);

  return (
    <aside className="bg-gray-50 min-h-screen pl-20 pr-10 pt-16 pb-32 ed:pt-10 ed:pb-20 lg:px-16 asm:px-10 axs:px-3">
      <h1 className="text-center mb-10 font-black text-4xl text-blue-800 mr-3 capitalize ed:text-2xl hidden lg:block ">
        {buySell} {coinFullName(filterData.coin)} with {paymentMethod}
      </h1>
      <div className="flex flex-col lg:grid lg:grid-cols-2 asm:grid-cols-1 lg:content-center lg:items-center lg:gap-7 w-52 lg:w-full h-full ">
        <label className="lg:space-y-2">
          <h1 className="lg:text-sm mt-5 mb-2 self-start relative capitalize lg:self-center lg:mt-0 lg:mb-0">
            {buySell.toLowerCase()}
          </h1>
          <BuySellDropDown
            dispatch={landedeCoin == 'ETHER' ? dispatchETH : dispatch}
            list={landedeCoin == 'ETHER' ? stateETH.coinList1 : state.coinList1}
            actionType="Update_first_list"
            bg="bg-white"
          />
        </label>
        <label className="lg:space-y-2">
          <h1 className="lg:text-sm mt-5 mb-2 self-start relative lg:w-36 lg:self-center lg:m-0">
            Pay with
          </h1>
          <div
            className="bg-white  text-sm flex items-center justify-between relative py-2 px-4 border-[1px] border-blue-700 rounded cursor-pointer"
            onClick={() => setIsOpenPaymentMethods(true)}
          >
            <h1 className="text-darkGray">
              {paymentMethod === '' ? 'Payment Method' : paymentMethod}
            </h1>
            <div className="p-2 px-2 border-[1px] rounded border-blue-700 hover:bg-gray-50 transition-all duration-200">
              <AiOutlineMenu />
            </div>
          </div>
        </label>

        <PaymentMethods
          isOpen={isOpenPaymentMethods}
          close={() => setIsOpenPaymentMethods(false)}
          onSelect={(value: string) => {paymentMethodRef.current = value; setPaymentMethod(value)}}
          firstCoin={state.coinList1.selectedCoin}
        />
        <label className="lg:space-y-2">
          <h1 className="lg:text-sm mt-5 mb-2 self-start relative lg:w-36 lg:self-center lg:m-0 lg:ml-3 lg:mr-2">
            I want to {buySell === 'BUY' ? 'spend' : 'get'}
          </h1>
          <Input type="USD" state={amount} setState={setAmount} />
        </label>
        <label className="lg:space-y-2">
          <h1 className="lg:text-sm mt-5 mb-2 self-start relative lg:w-36 lg:self-center lg:m-0 lg:ml-3 lg:mr-2">
            Offer Location
          </h1>
          <select
            value={ownerCountry}
            onChange={(e) => setOwnerCountry(e.target.value)}
            name="country"
            id="country"
            autoComplete="country"
            className="bg-white w-full border rounded p-3 active:border-blue-500 focus:border-blue-500 focus:outline-none mb-2"
          >
            {countries.map((ctry) => (
              <option key={ctry.code} value={ctry.code}>
                {ctry.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onFindOffers}
          className="mt-7 flex col-span-2 asm:col-span-1 items-center justify-center rounded-lg bg-blue-700 py-4 font-poppins text-lg sm:text-base text-white hover:bg-blue-600"
        >
          <span>Find Offers</span>
          <RiSearchLine className="ml-2 h-7 w-7" />
        </button>
      </div>
    </aside>
  );
};

export default Aside;
