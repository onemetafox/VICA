import React from 'react';
import Link from 'next/link';
import {
  RiSecurePaymentFill,
  RiExchangeFill,
  RiWallet3Fill,
  RiNumber1,
  RiNumber2,
  RiNumber3,
} from 'react-icons/ri';
import { BsArrowRight, BsCheck2All } from 'react-icons/bs';

const Section = () => {
  return (
    <section className="flex flex-col items-center justify-center px-20 pb-20  ed:px-10 lg:px-28 asm:px-7">
      <h1 className=" mt-24 font-poppinsLarge text-3xl sm:text-2xl sm:text-center font-bold leading-relaxed">
        Your Best crypto exchange
      </h1>
      <div className="my-20 grid grid-cols-3 gap-20 text-lightBlack md:flex md:flex-col lg:gap-10">
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center">
            <RiNumber1 className="h-16 w-14 sm:w-10 sm:h-10 text-blue-700" />
            <BsArrowRight className="h-16 w-14 sm:w-10 sm:h-10 text-blue-700" />
          </div>

          <h1 className="my-3 font-bold">Choose currency</h1>
          <p className="text-sm">Pick the currency you want to list or buy.</p>
        </div>
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center">
            <RiNumber2 className="h-16 w-14 sm:w-10 sm:h-10 text-blue-700" />
            <BsArrowRight className="h-16 w-14 sm:w-10 sm:h-10 text-blue-700" />
          </div>

          <h1 className="my-3 font-bold">Make deposit</h1>
          <p className="text-sm">
            Confirm details and send your assets to the generated address.
          </p>
        </div>
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center">
            <RiNumber3 className="h-16 w-14 sm:w-10 sm:h-10 text-blue-700" />
            <BsCheck2All className="h-16 w-14 sm:w-10 sm:h-10 text-green-600" />
          </div>

          <h1 className="my-3 font-bold">Get your coins</h1>
          <p className="text-sm">Receive exchanged crypto instantly.</p>
        </div>
      </div>
      <h1 className="mt-15 font-poppinsLarge text-3xl sm:text-2xl sm:text-center font-bold leading-relaxed">
        Your trusted crypto exchange
      </h1>
      <p className="mb-20 text-lightBlack sm:text-center ">
        Elevate your financial freedom to a higher plane with ViCA.
      </p>
      <div className="mb-20 grid grid-cols-3 gap-20 text-lightBlack md:flex md:flex-col lg:gap-10 ">
        <div className="flex flex-col items-center justify-start text-center">
          <RiExchangeFill className="h-14 w-14 text-blue-700" />
          <h1 className="my-3 font-bold">Buy & Sell Crypto online</h1>
          <p className="text-sm">
            Buy & Sell Bitcoin and other cryptos on ViCA in real time. Trade
            with other users online using our live chat.
          </p>
        </div>

        <div className="flex flex-col items-center justify-start text-center">
          <RiSecurePaymentFill className="h-14 w-14 text-blue-700" />
          <h1 className="my-3 font-bold">Swap securely</h1>
          <p className="text-sm">
            Your Bitcoin is held in our secure escrow until the trade is
            completed successfully.
          </p>
        </div>
        <div className="flex flex-col items-center justify-start text-center">
          <RiWallet3Fill className="h-14 w-14 text-blue-700" />
          <h1 className="my-3 font-bold">Get a free wallet</h1>
          <p className="text-sm">
            Get a life-time free Bitcoin wallet maintained by BitGo, the leading
            provider of secure Bitcoin wallets.
          </p>
        </div>
      </div>
      <h1 className="mt-15 font-poppinsLarge text-3xl font-bold leading-relaxed sm:text-2xl sm:text-center">
        Start earning today
      </h1>
      <Link href="/register">
        <span className="cursor-pointer my-10 rounded bg-blue-700 py-4 px-10 font-poppins text-xl sm:text-base text-white hover:bg-blue-600">
          Sign Up Now
        </span>
      </Link>
    </section>
  );
};

export default Section;
