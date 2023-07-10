import React from 'react';
import { OfferContext } from 'src/hooks/useStepReducer';
import { BsCheckLg } from 'react-icons/bs';

const Header = () => {
  const { stepState } = React.useContext(OfferContext);
  const { step, firstCoin, buySell } = stepState;
  return (
    <>
      <h1 className="text-3xl font-black font-poppinsLarge mb-5 asm:text-2xl">
        Create an offer to{' '}
        <span className="capitalize">{buySell.toLowerCase()}</span> {firstCoin}
      </h1>
      <div className="flex justify-between w-full mb-10">
        <div className="flex items-center">
          <div
            className={`w-7 h-7 sm:w-5 sm:h-5 p-2 sm:p-0 flex justify-center items-center rounded-full shadow-lg ${
              step === 1 ? 'bg-white' : 'bg-green-700'
            } mr-3`}
          >
            {step === 1 ? (
              <div className="w-3 h-3 rounded-full shadow-lg bg-blue-500" />
            ) : (
              <BsCheckLg className="text-white" />
            )}
          </div>
          <span className="font-bold sm:text-sm">Payment</span>
        </div>
        <div className="relative flex py-5 items-center w-full mx-3 sm:mx-1">
          <div className="flex-grow border-t-2 border-gray-300" />
        </div>
        <div className="flex items-center">
          <div
            className={`w-7 h-7 sm:w-5 sm:h-5 p-2 sm:p-0 flex justify-center items-center rounded-full shadow-lg ${
              step === 2 && 'bg-white'
            } ${step === 3 && 'bg-green-700'} mr-3 sm:mr-1 `}
          >
            {step === 3 ? (
              <BsCheckLg className="text-white md:text-sm" />
            ) : (
              <div
                className={`w-3 h-3 rounded-full shadow-lg ${
                  step === 2 ? 'bg-blue-500' : 'bg-gray-500'
                } `}
              />
            )}
          </div>
          <span className="font-bold sm:text-sm">Pricing</span>
        </div>
        <div className="relative flex py-5 items-center w-full  mx-3 sm:mx-1">
          <div className="flex-grow border-t-2 border-gray-300" />
        </div>
        <div className="flex items-center w-full">
          <div
            className={`w-7 h-7 sm:w-5 sm:h-5 p-2 sm:p-0 flex justify-center items-center rounded-full shadow-lg ${
              step === 3 && 'bg-white'
            } mr-3`}
          >
            <div
              className={`w-3 h-3 rounded-full shadow-lg ${
                step === 3 ? 'bg-blue-500' : 'bg-gray-500'
              } `}
            />
          </div>
          <span className="font-bold sm:text-sm">Other settings</span>
        </div>
      </div>
    </>
  );
};

export default Header;
