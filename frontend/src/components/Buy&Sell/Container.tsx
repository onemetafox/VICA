import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IoIosAdd } from 'react-icons/io';
import { coinFullName } from 'src/utils/coins-full-name';
import Footer from 'src/components/Footer';
import Nav from 'src/components/Nav';
import { useFetchUser } from 'src/queries/user';
import { CoinsTypes } from 'src/types/coins';
import { PaymentMethod, Offers } from 'src/types/offers';
import router, { useRouter } from 'next/router';
import Table from './Table';
import Advantages from './Advantages';
import Aside from './Aside';

type Props = {
  variant: 'BUY' | 'SELL';
  offers: Offers[];
  paymentMethods: PaymentMethod[];
};

const Container = ({ variant, offers, paymentMethods }: Props) => {
  const buySell = variant === 'BUY' ? 'SELL' : 'BUY';
  const { data: user } = useFetchUser();
  const { query } = useRouter();
  const { currency } = query;
  const coinRef = useRef<CoinsTypes>('BTC');
  const paymentMethodRef = useRef('ETHER');

  if (currency === 'ETHER' || currency === 'BTC') {
    coinRef.current = currency;
    paymentMethodRef.current = 'USDT';
  }

  const initCoin = coinRef.current;
  const initPaymentMethodObject = paymentMethods?.filter(
    (pay: PaymentMethod) => pay?.name === paymentMethodRef.current
  )[0];
  const initOffers = offers?.filter(
    (offer) =>
      offer.type === variant &&
      offer.currency === initCoin &&
      offer.payment_method === initPaymentMethodObject?.id &&
      offer.username !== user?.username
  );
  const [filterData, setFilterData] = useState({
    coin: initCoin,
    paymentMethodObject: initPaymentMethodObject,
    rowsData: [...initOffers],
  });
  const { coin, paymentMethodObject, rowsData } = filterData;

  return (
    <>
      <Nav />
      <div className="flex w-full font-poppins lg:flex-col ">
        <Aside
          offers={offers}
          variant={variant}
          paymentMethods={paymentMethods}
          paymentMethodRef={paymentMethodRef}
          filterData={filterData}
          setFilterData={setFilterData}
          landedeCoin={coinRef.current}
        />
        <section className="min-h-screen  flex flex-col items-start justify-start lg:items-center sm:justify-center w-full pr-20 pl-10 pt-16 pb-32 ed:pt-10 ed:pb-20 lg:px-16 asm:px-3 lg:bg-lightGray">
          <h1 className="mb-5 font-black text-4xl text-blue-800 mr-3 capitalize ed:text-2xl lg:hidden">
            {buySell} {coinFullName(coin)} with {paymentMethodObject.name}
          </h1>

          <p className="mb-10 text-gray-600 ed:text-sm lg:hidden">
            ViCA makes it easy and secure for you to {buySell} and hold {coin}.
            Find the best offer below and {buySell} {coinFullName(coin)} with{' '}
            {paymentMethodObject.name} today.
          </p>
          {filterData.rowsData?.length === 0 ? (
            <div className="mx-auto text-center h-56 flex flex-col justify-center items-center">
              No offers
            </div>
          ) : (
            <Table
              mainCoin={coin}
              paymentMethodObject={paymentMethodObject}
              variant={variant}
              data={rowsData}
            />
          )}

          <Link href={`/create-an-offer?opt=${buySell}`}>
            <div className="flex items-center rounded px-4 py-3 bg-blue-600 text-white cursor-pointer hover:bg-blue-500 mt-7">
              <IoIosAdd className="text-white text-3xl" />
              <span>Create an offer</span>
            </div>
          </Link>
          <h1 className="text-xl mt-16 mb-7 font-bold text-blue-800 sm:text-center sm:text-lg">
            Advantages of ViCA exchange
          </h1>
          <Advantages />
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Container;
