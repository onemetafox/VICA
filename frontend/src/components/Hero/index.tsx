import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCoinsReducer } from 'src/hooks/useCoinsReducer';
import { RiSearchLine } from 'react-icons/ri';
import BuySellDropDown from 'src/components/Hero/BuySellDropDown';
import PaymentMethods from 'src/components/PaymentMethods';

const Hero = () => {
  const [action, setAction] = useState('buy');

  const handleBuySwitch = () => {
    if (action !== 'buy') setAction('buy');
  };
  const handleSellSwitch = () => {
    if (action !== 'sell') setAction('sell');
  };

  return (
    <main className="hero flex w-full flex-col items-center justify-center bg-lightGray bg-[url('/hero-image.png')] bg-cover py-10 text-center px-5 ">
      <h1 className="font-poppinsLarge text-5xl sm:text-[2.5rem] leading-relaxed">
        The Easiest Way To
      </h1>
      <h1 className="text-blue-600 font-black font-poppinsLarge text-5xl sm:text-[2.3rem]  leading-relaxed">
        Buy & Sell Crypto
      </h1>

      <div className="text-md sm:text-sm mt-10 flex w-[30rem] sm:w-full flex-col items-start rounded-[2.3rem] bg-white shadow-md ">
        <div className=" flex w-full  justify-center overflow-hidden">
          <div
            className={`transition-all ease-in duration-300 flex-grow rounded-tl-[2.5rem] px-10 py-3 ${
              action === 'sell' &&
              '-skew-x-[15deg] cursor-pointer rounded-tl-[1.5rem] rounded-br-[1.5rem] bg-lightGray text-darkGray shadow-inner hover:shadow-innerHover'
            } `}
            onClick={handleBuySwitch}
          >
            <div
              className={`${
                action === 'sell' && 'skew-x-[15deg] transition-none'
              }`}
            >
              Buy
            </div>
          </div>
          <div
            className={`transition-all ease-in duration-300 flex-grow rounded-tr-[2.5rem]  py-3 px-10 ${
              action === 'buy' &&
              'skew-x-[15deg] cursor-pointer rounded-tr-[1.5rem] rounded-bl-[1.5rem] bg-lightGray text-darkGray shadow-inner hover:shadow-innerHover'
            }`}
            onClick={handleSellSwitch}
          >
            <div className={`${action === 'buy' && '-skew-x-[15deg]'}`}>
              Sell
            </div>
          </div>
        </div>
        <BuyOrSell action={action} />
      </div>
    </main>
  );
};

const BuyOrSell = ({ action }: { action: string }) => {
  const router = useRouter();
  const [isOpenPaymentMethods, setIsOpenPaymentMethods] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const { state, dispatch } = useCoinsReducer();

  return (
    <div className="flex w-full flex-col  p-7">
      <BuySellDropDown
        dispatch={dispatch}
        list={state.coinList1}
        actionType="Update_first_list"
      />
      <h1 className="mt-5 mb-2 self-start relative">Pay with</h1>
      <div
        className=" flex items-center justify-between relative py-2 px-4 border focus:border-darkGray rounded cursor-pointer"
        onClick={() => setIsOpenPaymentMethods(true)}
      >
        <h1 className="text-darkGray">
          {paymentMethod === '' ||
          paymentMethod === state.coinList1.selectedCoin
            ? 'Select Payment Method'
            : paymentMethod}
        </h1>
        <div className="p-1 px-2  rounded border focus:border-darkGray hover:bg-gray-50 transition-all duration-200">
          Show All
        </div>
      </div>
      <h1 className="mt-5 mb-2 self-start relative">
        I Want To{' '}
        <span
          className={` transition-all ease-in duration-300 absolute ${
            action === 'buy' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Spend
        </span>
        <span
          className={`transition-all ease-in duration-300 ${
            action === 'sell' ? 'opacity-100' : 'opacity-0 '
          }`}
        >
          Get
        </span>
      </h1>
      <input
        type="number"
        pattern="^\d*(\.\d{0,2})?$"
        className="rounded border py-3 px-3 focus:border-darkGray focus:outline-none active:outline-none"
      />
      {/*      <div className="flex w-full">
        <input
          type="number"
          pattern="^\d*(\.\d{0,2})?$"
          className="rounded border py-3 px-3 focus:border-darkGray focus:outline-none active:outline-none"
        />
          <BuySellDropDown
          dispatch={dispatch}
          list={state.coinList2}
          actionType="Update_second_list"
        /> 
      </div> */}
      <button
        type="button"
        onClick={() => router.push(`/${action}`)}
        className="mt-7 flex items-center justify-center rounded-lg bg-blue-700 py-4 font-poppins text-lg sm:text-base text-white hover:bg-blue-600"
      >
        <span>Find Offers</span>
        <RiSearchLine className="ml-2 h-7 w-7" />
      </button>
      <PaymentMethods
        isOpen={isOpenPaymentMethods}
        close={() => setIsOpenPaymentMethods(false)}
        onSelect={(value: string) => setPaymentMethod(value)}
        firstCoin={state.coinList1.selectedCoin}
      />
    </div>
  );
};

export default Hero;
