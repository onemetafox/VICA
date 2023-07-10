import React, { Dispatch, SetStateAction, MutableRefObject } from 'react';
import Link from 'next/link';
import { ImCancelCircle } from 'react-icons/im';
import { useFetchUser } from 'src/queries/user';
import UserNavActionsMobile from './UserNavActionsMobile';

type Props = {
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
  hiddenState: [boolean, Dispatch<SetStateAction<boolean>>];
  refCount: MutableRefObject<number>;
};

const MobileNav = ({ modalState, hiddenState, refCount }: Props) => {
  const [showModal, setShowModal] = modalState;
  const [hidden, setHidden] = hiddenState;
  const { data } = useFetchUser();

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setHidden(true);
    }, 500);
  };
  return (
    <>
      <div
        className={` fixed top-0 left-0 z-20 h-full w-screen ${
          (hidden || refCount.current === 0) && 'hidden'
        } ${
          showModal ? ' animate-fadeInOut' : ' animate-fadeOutIn '
        } bg-[rgba(1,11,32,0.6)]`}
        onClick={closeModal}
      />
      <div
        className={` ${(hidden || refCount.current === 0) && 'hidden'}  ${
          showModal
            ? ' right-0 animate-translateIn'
            : '-right-[22rem] animate-translateOut'
        } fixed top-0 z-50 flex h-screen w-[22rem] sm:w-full flex-col bg-[rgb(1,11,32)] py-5 px-10 text-white`}
      >
        <ImCancelCircle
          className="ml-auto h-6 w-6 cursor-pointer text-white hover:text-gray-100"
          onClick={closeModal}
        />
        <Link href="/buy">
          <span className="my-3 cursor-pointer hover:text-gray-100">Buy</span>
        </Link>
        <Link href="/sell">
          <span className="my-3 cursor-pointer hover:text-gray-100">Sell</span>
        </Link>
        <Link href="/wallet">
          <span className="my-3 cursor-pointer hover:text-gray-100">
            Wallet
          </span>
        </Link>
        <Link href="/arbitrage">
          <span className="my-3 cursor-pointer hover:text-gray-100">
            Arbitrage
          </span>
        </Link>
        {data && (
          <>
            <Link href="/create-an-offer">
              <span className="my-3 cursor-pointer hover:text-gray-100">
                Create an Offer
              </span>
            </Link>
            <Link href="/account/offers">
              <span className="my-3 cursor-pointer hover:text-gray-100">
                Offers
              </span>
            </Link>
            <Link href="/account/trades">
              <span className="my-3 cursor-pointer hover:text-gray-100">
                Trades
              </span>
            </Link>
          </>
        )}
        <UserNavActionsMobile />
      </div>
    </>
  );
};

export default MobileNav;
