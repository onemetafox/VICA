import React from 'react';
import Link from 'next/link';
import { BiLike, BiStopwatch } from 'react-icons/bi';
import { HiOutlineArrowDown, HiOutlineArrowUp } from 'react-icons/hi';
import CryptoImage from 'src/components/common/CryptoImage';
import { CoinsTypes } from 'src/types/coins';
import { useFetchOfferOrders } from 'src/queries/offers';

type Props = {
  variant: 'BUY' | 'SELL';
  mainCoin: CoinsTypes;
  mainCoinInUsd: number;
  paymentMethodId: number;
  paymentMethod: string;
  paymentMethodName: string;
  paymentMethodType: string;
  paymentMethodInUsd: number;
  name: string;
  likes: number;
  tradeSpeed: number;
  limits: number[];
  price: number;
  terms: string;
  offerId: number;
};

const MainRow = ({
  variant,
  mainCoin,
  paymentMethodId,
  paymentMethod,
  paymentMethodName,
  paymentMethodType,
  paymentMethodInUsd,
  name,
  likes,
  tradeSpeed,
  limits,
  price,
  terms,
  mainCoinInUsd,
  offerId,
}: Props) => {
  const { data: orders } = useFetchOfferOrders(offerId);
  const buySell = variant === 'BUY' ? 'SELL' : 'BUY';
  const diff = price - mainCoinInUsd;
  const percentage = Math.abs((diff / mainCoinInUsd) * 100).toFixed(2);

  return (
    <tr className="bg-white border-b">
      <td className="px-6 py-4 lg:flex lg:flex-col">
        <div className="flex justify-start items-center">
          <div className="mr-3 w-10 h-1 lg:hidden text-white bg-gray-500 rounded-full flex justify-center items-center font-bold">
            {name[0].toUpperCase()}
          </div>
          <div className="flex flex-col ">
            <span className="text-blue-600 hover:underline cursor-pointer">
              {name}
            </span>
            <div className="flex justify-start mt-2 items-center">
              <BiLike className="text-green-700 mr-1" /> {likes}
            </div>
          </div>
        </div>
        <div className="py-2 font-bold hidden lg:block">{paymentMethod}</div>
        <div className="lg:flex-col hidden lg:flex">
          <div>
            Min {buySell === 'SELL' ? 'sale' : 'purchase'}:{' '}
            <span className="text-darkGray">{limits[0]} USD</span>
          </div>
          <div>
            Max {buySell === 'SELL' ? 'sale' : 'purchase'}:{' '}
            <span className="text-darkGray">{limits[1]} USD</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-bold lg:hidden">{paymentMethod}</td>
      <td className="px-6 py-4 lg:hidden">
        <div className="flex items-center">
          {tradeSpeed} min <BiStopwatch className="ml-1" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col items-end leading-relaxed">
          <span className="font-bold">{price.toFixed(2)} USD</span>
          <div
            className={`font-bold flex items-center my-1 ${
              diff > 0 ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {diff < 0 ? <HiOutlineArrowDown /> : <HiOutlineArrowUp />}{' '}
            {percentage}%
          </div>
          <div className="flex justify-center items-center">
            <div className="flex flex-col mr-3 lg:hidden">
              <div>
                Min {buySell === 'SELL' ? 'sale' : 'purchase'}:{' '}
                <span className="text-darkGray">{limits[0]} USD</span>
              </div>
              <div>
                Max {buySell === 'SELL' ? 'sale' : 'purchase'}:{' '}
                <span className="text-darkGray">{limits[1]} USD</span>
              </div>
            </div>{' '}
            <Link
              href={`/offer?orders=${encodeURIComponent(
                JSON.stringify(orders)
              )}&offerId=${offerId}&buySell=${buySell}&mainCoin=${mainCoin}&mainCoinInUsd=${mainCoinInUsd}&paymentMethodInUsd=${paymentMethodInUsd}&paymentMethodName=${paymentMethodName}&paymentMethodType=${paymentMethodType}&paymentMethod=${paymentMethod}&paymentMethodId=${paymentMethodId}&userName=${name}&tradeSpeed=${tradeSpeed}&price=${price}&limits=${JSON.stringify(
                limits
              )}&likes=${likes}&aboveOrBellow=${diff}&percentage=${percentage}&terms=${terms}`}
            >
              <div className="cursor-pointer flex justify-center items-center bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-400">
                <span className="mr-2 font-bold capitalize">{buySell}</span>
                <CryptoImage coin={mainCoin} width={25} />
              </div>
            </Link>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default MainRow;
