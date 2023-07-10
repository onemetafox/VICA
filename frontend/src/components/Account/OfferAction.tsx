import { MouseEventHandler } from 'react';

type Props = {
  offer: string;
  type: 'buy' | 'sell';
  onSetOffer: MouseEventHandler<HTMLDivElement>;
  totalOffers: number;
};

const OfferAction = ({ type, offer, totalOffers, onSetOffer }: Props) => {
  return (
    <div
      className={`sm:text-sm flex py-4 px-3 cursor-pointer hover:text-blue-700 ${
        offer === type
          ? 'border-b-2 border-b-blue-700 text-blue-700'
          : 'border-b-2 border-b-lightBlue text-darkGray'
      } `}
      onClick={onSetOffer}
    >
      Offers to {type}{' '}
      <div
        className={`p-[0.2rem] ml-3 text-center w-5 h-5 text-xs ${
          offer === type ? 'text-white bg-blue-700' : 'text-black bg-gray-300'
        }  rounded-full`}
      >
        {totalOffers}
      </div>
    </div>
  );
};

export default OfferAction;
