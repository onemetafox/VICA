import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { RiCloseCircleLine } from 'react-icons/ri';
import { BsInfoCircle } from 'react-icons/bs';
import Link from 'next/link';
import { useSendReport } from 'src/queries/trades';

type Props = {
  isOpen: boolean;
  orderId: any;
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

const SendReport = ({ isOpen, onClose, orderId }: Props) => {
  const messageMutation = useSendReport();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message) {
      messageMutation.mutate({ message, orderId });
      setMessage('');
    }
  };

  return (
    <Popup position="right center" open={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-center items-start font-poppins w-full text-[0.75rem]">
        <button type="button" onClick={onClose} className="self-end">
          <RiCloseCircleLine className="text-darkGray hover:text-darkBlack text-2xl" />
        </button>
        <div className="flex items-center border border-red-200 rounded bg-red-50 p-3 py-4 mt-5">
          <BsInfoCircle className="text-red-500 mr-3 text-4xl" />
          <p className=" w-[90%] mx-3">
            Stay on this trade if you've already made this payment. Start a
            dispute now .
          </p>
        </div>
        <textarea
          id="message"
          value={message}
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />

        <div className="flex justify-between w-full text-sm mt-5">
          <button
            type="button"
            className="border-[1px] rounded p-2 px-4"
            onClick={onClose}
          >
            Back
          </button>
          <Link href="/offer">
            <span
              className="cursor-pointer border-[1px] rounded p-2 px-4 bg-red-500 hover:bg-red-400 transition-all text-white"
              onClick={() => {
                handleSendMessage();
              }}
            >
              Report
            </span>
          </Link>
        </div>
      </div>
    </Popup>
  );
};

export default SendReport;
