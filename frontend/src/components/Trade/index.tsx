import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { IoIosSend } from 'react-icons/io';
import { BsInfoCircle } from 'react-icons/bs';
import { IoTimeOutline } from 'react-icons/io5';
import { AiOutlineCheck } from 'react-icons/ai';
import { GrAttachment } from 'react-icons/gr';
import CancelTrade from 'src/components/Trade/Modals/CancelTrade';
import Container from 'src/components/common/Container';
import InfoCard from 'src/components/common/InfoCard';
import { coinFullName } from 'src/utils/coins-full-name';
import { CoinsTypes, isCoinTypeOfCoinsList } from 'src/types/coins';
import {
  useOwnerConfirmOrder,
  useSendMessage,
  useUserConfirmOrder,
} from 'src/queries/trades';
import { useFetchUser } from 'src/queries/user';
import { useFetchOffers, useFetchOfferOrders } from 'src/queries/offers';
import toast from 'react-hot-toast';

const TODAY = new Date();

const Trade = () => {
  const router = useRouter();
  const urlParams = new URLSearchParams(window?.location?.search);
  const offerId = urlParams.get('offerId');
  const { data: user } = useFetchUser();
  const { data: offers } = useFetchOffers();
  const { data: relatedOrders } = useFetchOfferOrders(offerId);
  const messageMutation = useSendMessage();
  const confirmUserMutation = useUserConfirmOrder();
  const confirmOwnerMutation = useOwnerConfirmOrder();

  const [closeRemember, setIsCaRememberClosed] = useState(false);
  const [closekepp, setIsCakeepClosed] = useState(false);
  const [closeTrade, setCloseTrade] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  const today = `${TODAY.toDateString()} at ${TODAY.toLocaleTimeString()}`;

  const orderId = urlParams.get('orderId');

  const pay = urlParams.get('pay');
  const price = urlParams.get('price');
  const offerType = urlParams.get('offerType');

  const offer = offers?.filter((ofr: any) => ofr?.id == offerId)[0];

  const receive = offer?.amount;
  const tradeSpeed = offer?.time_limit;
  const terms = offer?.terms;
  const order = relatedOrders?.filter(
    (ordr: any) => ordr?.order_no == orderId
  )[0];
  const messages = order?.messages;

  const isOfferOwner = offer?.username === user?.username;
  const isConfirmedByUser = order?.confirmed_by_user;
  const isConfirmedByOwner = order?.confirmed_by_owner;

  let buttonDisabled = false;
  if (isOfferOwner && offerType === 'SELL') {
    buttonDisabled = true;
    if (isConfirmedByUser) {
      buttonDisabled = false;
    }
  } else if (!isOfferOwner && offerType === 'SELL') {
    buttonDisabled = true;
    if (isConfirmedByOwner) {
      buttonDisabled = false;
    }
  }

  let mainCoin: CoinsTypes = 'BTC';

  const mainCoinParam = urlParams.get('mainCoin');
  const paymentMethodName = urlParams.get('paymentMethodName');

  if (isCoinTypeOfCoinsList(mainCoinParam)) {
    mainCoin = mainCoinParam;
  }

  if (tradeSpeed && minutes === 0) {
    setMinutes(tradeSpeed);
  }

  const timeOutId = setTimeout(() => {
    if (seconds === 0) {
      setSeconds(59);
      setMinutes(minutes - 1);
    } else {
      setSeconds(seconds - 1);
    }
  }, 1000);
  if (minutes === 0 && seconds === 0) {
    clearTimeout(timeOutId);
  }

  const handleConfirmPayment = () => {
    if (orderId && !isOfferOwner) {
      confirmUserMutation.mutate(orderId);
    } else if (orderId && isOfferOwner) {
      confirmOwnerMutation.mutate(orderId);
    }
  };

  const handleSendMessage = () => {
    if (orderId && message) {
      messageMutation.mutate({ message, orderId });
      setMessage('');
    }
  };
  if (!offer) {
    return <h1>Loading...</h1>;
  }
  if (order?.status === 'COMPLETED' && !isOrderCompleted) {
    toast.success('Order completed successfully !');
    router.push('/');
    setIsOrderCompleted(true);
  }

  return (
    <Container>
      <div className="flex items-center mb-5 ">
        <div className="flex h-3 w-3 relative justify-center items-center mr-3 ">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </div>
        <h1 className="text-xl font-bold ">Trade Started</h1>
      </div>
      <div className="flex items-start justify-start lg:flex-col-reverse lg:w-full ">
        <div className="flex-col w-[55%] lg:w-full text-[0.8rem] mr-10">
          {!closeRemember && (
            <InfoCard onCloseCard={() => setIsCaRememberClosed(true)}>
              Remember to keep all conversations within the trade chat. Trading
              off escrow is against our policies and moderators won’t be able to
              assist you if something goes wrong outside of ViCA.
            </InfoCard>
          )}
          <div className="w-full border-[1px] rounded shadow-md mt-5 bg-white">
            <div className="flex p-4 border-b-[1px]">
              <IoTimeOutline className="text-4xl mr-3" />
              <div className="flex-col">
                <h1 className="font-bold text-sm">
                  You will {offerType === 'SELL' ? 'get' : 'make'} a payment of{' '}
                  {pay} USD using {paymentMethodName}.
                </h1>
                <p>
                  {receive} {mainCoin} will be{' '}
                  {offerType === 'SELL' ? 'transferred from' : 'added to'} your{' '}
                  {coinFullName(mainCoin)} wallet
                </p>
              </div>
            </div>
            <div className="flex items-start flex-col p-5 py-8 border-b-[1px] ">
              {offerType === 'SELL' ? (
                <p className=" mb-5">
                  Once you’ve received the payment, be sure to click Confirm
                  payment within the given time limit. Otherwise the trade will
                  be automatically canceled and the {mainCoin} will be returned
                  to your wallet.
                </p>
              ) : (
                <p className=" mb-5">
                  Once you’ve made the payment, be sure to click Paid within the
                  given time limit. Otherwise the trade will be automatically
                  canceled and the {mainCoin} will be returned to the seller’s
                  wallet.
                </p>
              )}

              <button
                type="button"
                disabled={buttonDisabled}
                className={`w-[12rem] flex items-center ${
                  !buttonDisabled
                    ? 'text-white bg-blue-600 hover:bg-blue-500'
                    : 'text-white bg-darkGray'
                }  transition-all rounded p-2 px-4`}
                onClick={handleConfirmPayment}
              >
                <div className="flex-col items-start justify-start">
                  <p className="font-bold text-left mb-1">
                    {offerType === 'SELL' ? 'Confirm Payment' : 'Paid'}
                  </p>
                  <p className="text-[0.6rem] w-[5.5rem] text-left">
                    Time left 00:
                    {minutes.toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                    :
                    {seconds.toLocaleString('en-US', {
                      minimumIntegerDigits: 2,
                      useGrouping: false,
                    })}
                  </p>
                </div>
                <AiOutlineCheck className="text-lg ml-3" />
              </button>
            </div>

            {!closekepp && (
              <div className="flex items-start flex-col p-5 border-b-[1px] bg-lightGray ">
                <InfoCard onCloseCard={() => setIsCakeepClosed(true)}>
                  Keep trades within ViCA. Some users may ask you to trade
                  outside the ViCA platform. This is against our Terms of
                  Service and likely a scam attempt. You must insist on keeping
                  all trade conversations within ViCA. If you choose to proceed
                  outside ViCA, note that we cannot help or support you if you
                  are scammed during such trades.
                </InfoCard>
              </div>
            )}

            <div className="flex justify-between items-center p-5 py-4 ">
              <button
                type="button"
                className="border rounded border-red-600 hover:bg-red-50 transition-all p-1 px-4"
                onClick={() => setCloseTrade(true)}
              >
                Cancel Trade
              </button>
              <div className="text-xs flex items-center text-darkGray">
                <BsInfoCircle className="mr-2 text-base" />
                You haven't paid yet
              </div>
            </div>
          </div>
          <h1 className="text-[1rem] font-bold my-3 mt-7">
            Please follow {offer?.username}'s instructions
          </h1>
          <p>{terms}</p>
          <h1 className="text-[1rem] font-bold my-3">Trade Information</h1>
          <p className="mb-3">
            {receive} {mainCoin} has been reserved for this trade. This includes
            ViCA’s fee of 0 {mainCoin}.
          </p>
          <div className="flex w-full justify-between">
            <div className="flex-col">
              <h3 className="text-xs font-bold text-blue-800 mb-1">RATE</h3>
              <p className="text-xs">
                {price} USD/{mainCoin}
              </p>
            </div>
            <div className="flex-col">
              <h3 className="text-xs font-bold text-blue-800 mb-1">TRADE ID</h3>
              <p className="text-xs">wd4uy1LirVU</p>
            </div>
            <div className="flex-col">
              <h3 className="text-xs font-bold text-blue-800 mb-1">STARTED</h3>
              <p className="text-xs">a few seconds ago</p>
            </div>
          </div>
          <div className="flex justify-between mt-7 ">
            <button
              type="button"
              className="bg-white hover:bg-gray-50 transition-all text-xs p-2 px-4 border border-darkGray rounded"
            >
              Report
            </button>
            <Link href="/buy">
              <span className="bg-white hover:bg-gray-50 transition-all text-xs p-2 px-4 border border-darkGray rounded cursor-pointer">
                View Offers
              </span>
            </Link>
          </div>
        </div>
        <div className="w-1/2 lg:w-full lg:mb-7 shadow rounded h-full min-h-[30rem] bg-white">
          <div className="border-b-[1px] pb-7">
            <div className="p-3 flex justify-between">
              <div className="flex items-center">
                <p className="text-blue-600 ml-2 cursor-pointer hover:text-blue-500">
                  {offer?.username}
                </p>
                <img
                  alt="United States"
                  src="http://purecatamphetamine.github.io/country-flag-icons/3x2/MA.svg"
                  className="w-5 h-5 ml-3"
                />
              </div>
              <div className="flex text-xs">
                <div className="flex items-center justify-center rounded bg-green-100 border-2 border-green-300 w-14">
                  <FiThumbsUp className="text-green-700" />
                  <p className="text-[0.6rem] ml-1 font-bold">9860</p>
                </div>
                <div className="ml-2 flex items-center justify-center rounded bg-red-100 border-2 border-red-300 w-14">
                  <FiThumbsDown className="text-red-700" />
                  <p className="text-[0.6rem] ml-1 font-bold">0</p>
                </div>
              </div>
            </div>
            {/* <div className="flex ml-3 items-center">
              <div className="w-2 h-2 rounded-full bg-green-600 mr-2" />
              <h1>Seen 7 minutes ago</h1>
            </div> */}
          </div>
          <div className="flex flex-col p-3 border-t-[1px]">
            {/* <div className="bg-blue-100 p-3 rounded mb-1">
              The buyer is paying 10 USD via Ethereum ETH for 0.00050219 BTC
              (9.88 USD). 0.00050721 BTC (9.98 USD) is now in escrow. It is now
              safe for the buyer to pay. The buyer will have 1 hour to make
              their payment and click on the "PAID" button before the trade
              expires.
            </div>
            <p className="text-[0.55rem] text-darkGray mb-3">
              SEPTEMBER 4, 2022 AT 3:15 PM
            </p> */}
            <div className="bg-blue-100 p-3 rounded mb-1">
              <p className="font-bold">
                Follow these instructions from your trade partner:
              </p>
              <p className="mt-5">{terms}</p>
            </div>
            <p className="text-[0.55rem] text-darkGray mb-3">{today}</p>
            {messages?.map((msg: any) => (
              <div
                key={msg?.created_at}
                className={`${
                  user?.username === msg?.username ? 'ml-auto' : 'mr-auto'
                }  w-auto`}
              >
                <div
                  className={`text-white ${
                    user?.username === msg?.username
                      ? 'bg-blue-500 '
                      : 'bg-darkGray'
                  }  p-3 rounded mb-1`}
                >
                  <p className="text-sm">{msg?.message}</p>
                </div>
                <p className="text-[0.55rem] text-darkGray mb-3">
                  {`${new Date(msg?.created_at).toDateString()} at ${new Date(
                    msg?.created_at
                  ).toLocaleTimeString()}`}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 w-full flex-col">
            <textarea
              value={message}
              placeholder="write a message..."
              className="outline-none w-full resize-none"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <div className="flex justify-between mt-5 items-center">
              <div className="p-3 border-[1px] rounded cursor-pointer">
                <GrAttachment />
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white rounded transition-all hover:bg-blue-500 px-3 py-2 flex items-center"
                onClick={handleSendMessage}
              >
                <IoIosSend className="text-lg mr-2" />
                Send
              </button>
            </div>
          </div>
        </div>
        <CancelTrade onClose={() => setCloseTrade(false)} isOpen={closeTrade} />
        {/*  <SuccessTrade
        onClose={() => setSuccessTrade(false)}
        isOpen={successTrade}
      /> */}
      </div>
    </Container>
  );
};

export default Trade;
