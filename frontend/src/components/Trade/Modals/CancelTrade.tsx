import React from 'react';
import Popup from 'reactjs-popup';
import { RiCloseCircleLine } from 'react-icons/ri';
import { BsInfoCircle } from 'react-icons/bs';
import Link from 'next/link';

type Props = {
  isOpen: boolean;
  onClose:
    | ((
        event?:
          | KeyboardEvent
          | TouchEvent
          | MouseEvent
          | React.SyntheticEvent<Element, Event>
          | undefined
      ) => void)
    | undefined;
};

const CancelTrade = ({ isOpen, onClose }: Props) => {
  return (
    <Popup position="right center" open={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-center items-start font-poppins w-full text-[0.75rem]">
        <button type="button" onClick={onClose} className="self-end">
          <RiCloseCircleLine className="text-darkGray hover:text-darkBlack text-2xl" />
        </button>
        <div className="flex items-center border border-red-200 rounded bg-red-50 p-3 py-4 mt-5">
          <BsInfoCircle className="text-red-500 mr-3 text-4xl" />
          <p className=" w-[90%] mx-3">
            Stay on this trade if you've already made this payment. For any
            other issues, click Back and start a dispute.
          </p>
        </div>

        <label>
          <input type="checkbox" className="w-3 h-3 mt-3" />
          <span>
            {' '}
            I confirm that <strong>I have not paid</strong> on this trade and I
            want to cancel.
          </span>
        </label>
        <div className="flex justify-between w-full text-sm mt-5">
          <button
            type="button"
            className="border-[1px] rounded p-2 px-4"
            onClick={onClose}
          >
            Back
          </button>
          <Link href="/offer">
            <span className="cursor-pointer border-[1px] rounded p-2 px-4 bg-red-500 hover:bg-red-400 transition-all text-white">
              Cancel Trade
            </span>
          </Link>
        </div>
      </div>
    </Popup>
  );
};

export default CancelTrade;
