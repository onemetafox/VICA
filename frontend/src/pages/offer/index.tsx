import { useState, useReducer, Reducer } from 'react';
import Router from 'next/router';
import { motion } from 'framer-motion';
import { BsInfoCircle } from 'react-icons/bs';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { AiOutlineCheck } from 'react-icons/ai';
import { RiArrowDropUpLine, RiArrowDropDownLine } from 'react-icons/ri';
import { useCreateOrder } from 'src/queries/trades';
import {
  useCreateUserPaymentMethod,
  useFetchUserPaymentMethods,
} from 'src/queries/paymentMethods';
import Container from 'src/components/common/Container';
import Input from 'src/components/CreateOffer/Input';
import Feedback from 'src/components/Offer/Feedback';
import { coinFullName } from 'src/utils/coins-full-name';
import { CoinsTypes, isCoinTypeOfCoinsList } from 'src/types/coins';

const buySells = {
  open: { opacity: 1, height: 'auto' },
  closed: { opacity: 1, height: 0 },
};

const intialState = {
  pay: '',
  receive: '',
};
type STATETYPE = typeof intialState;
type ACTIONTYPE =
  | { type: 'pay'; price: string; coinMarketPrice: number }
  | { type: 'receive'; price: string; coinMarketPrice: number };

function reducer(state: STATETYPE, action: ACTIONTYPE) {
  switch (action.type) {
    case 'pay':
      const payPrice = parseFloat(action.price?.replace(/,/g, ''));
      const receive =
        action.price === ''
          ? ''
          : (payPrice / action.coinMarketPrice).toString();
      return {
        pay: action.price,
        receive,
      };
    case 'receive':
      const receivePrice = parseFloat(action.price?.replace(/,/g, ''));
      const pay =
        action.price === ''
          ? ''
          : (receivePrice * action.coinMarketPrice).toString();
      return {
        receive: action.price,
        pay,
      };
    default:
      return state;
  }
}
const Offer = () => {
  const mutationCreateOrder = useCreateOrder();
  const mutationUserPaymentMethod = useCreateUserPaymentMethod();
  const { data: userPaymentMethods } = useFetchUserPaymentMethods();
  const [state, dispatch] = useReducer<Reducer<STATETYPE, ACTIONTYPE>>(
    reducer,
    { pay: '', receive: '' }
  );

  const [isOpenFeedback, setIsOpenFeedback] = useState(true);
  const [isOrderCreated, setIsordercreated] = useState(false);

  if (typeof window === 'undefined') {
    return <h1>Loading...</h1>;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const offerId = urlParams.get('offerId');
  let mainCoin: CoinsTypes = 'BTC';

  const mainCoinParam = urlParams.get('mainCoin');
  const paymentMethod = urlParams.get('paymentMethod');
  const paymentMethodId = urlParams.get('paymentMethodId');
  const paymentMethodName = urlParams.get('paymentMethodName');
  const paymentMethodType = urlParams.get('paymentMethodType');
  const paymentMethodInUsd = urlParams.get('paymentMethodInUsd');
  const orders = urlParams.get('orders');
  if (isCoinTypeOfCoinsList(mainCoinParam)) {
    mainCoin = mainCoinParam;
  }

  const userName = urlParams.get('userName');
  const likes = urlParams.get('likes');
  const buySell = urlParams.get('buySell');

  let limits = [15, 150];
  const limitsParams = urlParams.get('limits');
  if (limitsParams) {
    limits = JSON.parse(limitsParams);
  }
  let numMainCoinCurrentPrice = 0;
  const mainCoinInUsd = urlParams.get('mainCoinInUsd');
  if (mainCoinInUsd) {
    numMainCoinCurrentPrice = parseFloat(mainCoinInUsd);
  }

  const { receive, pay } = state;
  const userPrice = urlParams.get('price');
  const percentage = urlParams.get('percentage');
  const aboveOrBellow = urlParams.get('aboveOrBellow');
  const numAboveOrBellow = aboveOrBellow ? parseInt(aboveOrBellow, 10) : 0;
  const payNum = parseFloat(state.pay.replace(/,/g, ''));
  const tradeSpeed = urlParams.get('tradeSpeed');
  const terms = urlParams.get('terms');
  const feedbackCountGood = 0;
  const feedbackCountBad = 0;

  const isNotReady =
    state.pay === '' || payNum < limits[0] || payNum > limits[1];

  let amount = 0;
  let ordersList;
  if (paymentMethodType !== 'DC') {
    amount = parseFloat(parseFloat(pay).toFixed(10));
  } else if (receive && pay && paymentMethodInUsd) {
    amount =
      buySell === 'SELL'
        ? parseFloat(parseFloat(receive).toFixed(10))
        : parseFloat(
            (parseFloat(pay) / parseFloat(paymentMethodInUsd)).toFixed(10)
          );
  }

  const isUserPaymentMethodSaved = userPaymentMethods?.some(
    (payment: any) =>
      payment?.payment_method === parseInt(paymentMethodId ?? '', 10)
  );

  const handleCreateOrder = () => {
    if (paymentMethodType === 'DC' && amount) {
      mutationCreateOrder.mutate({
        offer: offerId,
        amount_sent: amount,
      });
      setIsordercreated(true);
    } else if (!isUserPaymentMethodSaved) {
      mutationUserPaymentMethod.mutate({ payment_method: paymentMethodId });
    } else if (amount && paymentMethodId) {
      const userSavedPaymentMethodId = userPaymentMethods.filter(
        (payment: any) =>
          payment?.payment_method === parseInt(paymentMethodId ?? '', 10)
      )[0]?.id;

      mutationCreateOrder.mutate({
        offer: offerId,
        amount_sent: amount,
        user_payment_method: userSavedPaymentMethodId,
      });

      setIsordercreated(true);
    }
  };

  // Handle order creation in case user uses a new  payment method
  if (
    paymentMethodType !== 'DC' &&
    !isOrderCreated &&
    mutationUserPaymentMethod?.data?.length > 0 &&
    amount &&
    !mutationCreateOrder.isSuccess
  ) {
    const userSavedPaymentMethodId = mutationUserPaymentMethod?.data?.filter(
      (payment: any) =>
        payment?.payment_method === parseInt(paymentMethodId ?? '', 10)
    )[0]?.id;

    mutationCreateOrder.mutate({
      offer: offerId,
      amount_sent: amount,
      user_payment_method: userSavedPaymentMethodId,
    });
    setIsordercreated(true);
  }
  // if order created go to confirmation page
  if (paymentMethodType === 'DC' && mutationCreateOrder?.data) {
    Router.push('/account/trades');
  } else if (paymentMethodType !== 'DC' && mutationCreateOrder?.data) {
    Router.push(
      `/trade?orderId=${mutationCreateOrder?.data?.order_no}&offerId=${offerId}&offerType=${buySell}&pay=${pay}&paymentMethodName=${paymentMethodName}&price=${userPrice}`
    );
  }
  if (!offerId) {
    Router.push('/');
  }
  if (orders) {
    ordersList = JSON.parse(orders)?.filter(
      (order: any) => order?.review !== null
    );
  }

  return (
    <Container>
      <div className="flex flex-col justify-center items-center w-[80%] xl:w-full mx-auto">
        <h1 className="text-5xl asm:text-3xl font-bold text-center leading-[4rem] capitalize">
          {buySell?.toLowerCase()} {coinFullName(mainCoin)} with{' '}
          {paymentMethodName}
          (USD)
        </h1>
        <div className="mt-14 flex flex-col justify-center items-center border rounded bg-white p-7 w-full">
          <h2 className="font-bold text-2xl asm:text-xl text-blue-700 text-center">
            How much do you want to {buySell?.toLowerCase()}?
          </h2>
          <div className="flex asm:flex-col w-full justify-between mt-10">
            <label className="block text-sm lg:mb-3 w-full mr-5">
              <span className=" block mb-1">I will pay</span>
              <Input
                state={state.pay}
                actionType="pay"
                onChange={dispatch}
                coinMarketPrice={numMainCoinCurrentPrice}
                type="USD"
              />
            </label>
            <label className="block text-sm lg:mb-3 w-full">
              <span className=" block mb-1">and receive</span>
              <Input
                state={state.receive}
                actionType="receive"
                onChange={dispatch}
                type={mainCoin}
                coinMarketPrice={numMainCoinCurrentPrice}
              />
            </label>
          </div>
          {state.pay !== '' && (payNum < limits[0] || payNum > limits[1]) ? (
            <div className="self-start text-xs flex items-center mt-3 text-red-600">
              <BsInfoCircle className="mr-2 text-base" />
              The trade limit is {limits[0]} — {limits[1]} USD
            </div>
          ) : (
            <div className="self-start text-xs flex items-center mt-3 text-darkGray">
              <BsInfoCircle className="mr-2 text-base" />
              Enter amount to get started
            </div>
          )}

          <button
            type="button"
            disabled={isNotReady || mutationCreateOrder.isLoading}
            className={`capitalize mt-7 text-sm w-full py-[0.7rem] rounded border-2 ${
              !isNotReady
                ? 'text-white bg-blue-700 border-blue-700 hover:bg-blue-600'
                : 'text-darkGray bg-lightGray border-gray-200'
            } `}
            onClick={handleCreateOrder}
          >
            {buySell?.toLowerCase()} now
          </button>
          <div className="text-sm mt-5">
            Reserve Bitcoin for this trade and start live chat with
            <span className="text-blue-600 ml-1 cursor-pointer hover:text-blue-500">
              {userName}
            </span>
          </div>
        </div>
        <div className="flex ed:flex-col w-full ">
          <div className="w-1/2 ed:w-full mr-7 mt-8">
            <h1 className="font-bold text-lg text-blue-700 mb-3">
              About this offer
            </h1>
            <div className="px-7 py-5 border bg-white asm:px-3 overflow-hidden">
              <div className="flex flex-col pb-3">
                <p className="text-sm text-darkGray">Seller rate</p>
                <h1 className="font-bold">
                  {userPrice} USD .{' '}
                  <span className="text-darkGray">
                    {percentage}% {numAboveOrBellow > 0 ? 'above' : 'below'}{' '}
                    market
                  </span>
                </h1>
              </div>
              <div className="flex flex-col pb-3">
                <p className="text-sm text-darkGray">Buy limits</p>
                <h1 className="font-bold">
                  Min {limits[0]} USD - Max {limits[1]} USD
                </h1>
              </div>
              <div className="flex pb-3 w-full justify-between">
                <div className="flex-col">
                  <p className="text-sm text-darkGray">Trade time limit</p>
                  <h1 className="font-bold">{tradeSpeed} min</h1>
                </div>
                <div className="flex-col">
                  <p className="text-sm text-darkGray">ViCA fee</p>
                  <h1 className="font-bold">0 %</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 ed:w-full mt-8">
            <h1 className="font-bold text-lg text-blue-700 mb-3">
              About this seller
            </h1>
            <div className="pl-7 pr-16 py-5 border bg-white asm:px-3 overflow-hidden">
              <div className="flex pb-3 mb-7">
                <div className="w-10 h-10 text-white bg-gray-500 rounded-full flex justify-center items-center font-bold">
                  {userName && userName[0].toUpperCase()}
                </div>
                <div className="flex-col h-14 items-start justify-start ml-5 w-auto">
                  <div className="flex ">
                    <p className="text-sm font-bold">{userName}</p>
                    <img
                      alt="United States"
                      src="http://purecatamphetamine.github.io/country-flag-icons/3x2/MA.svg"
                      className="w-5 h-5 ml-3"
                    />
                  </div>
                  <div className="text-xs mt-4 flex">
                    <p className="border bg-lightGray rounded self-start p-1">
                      Power Trader
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex asm:flex-col justify-between mb-5">
                <div className="flex-col">
                  <h1 className="text-sm text-darkGray mb-1">
                    Positive feedback
                  </h1>
                  <div className="flex items-center">
                    <FiThumbsUp className="text-lg text-green-600" />
                    <p className="ml-2 font-bold text-lg">{likes}</p>
                  </div>
                </div>
                <div className="flex-col asm:mt-3">
                  <h1 className="text-sm text-darkGray mb-1">
                    Negative feedback
                  </h1>
                  <div className="flex items-center">
                    <FiThumbsDown className="text-lg text-red-600" />
                    <p className="ml-2 font-bold text-lg">
                      {Math.floor(Math.random() * 10) + 1}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 asm:grid-cols-1 asm:grid-rows-4 gap-x-9  gap-y-3">
                <div className="flex items-center">
                  <AiOutlineCheck className="text-green-700 text-lg" />
                  <p className="text-sm ml-2">ID verified</p>
                </div>
                <div className="flex items-center">
                  <AiOutlineCheck className="text-green-700 text-lg justify-self-end" />
                  <p className="text-sm ml-2">Address verified</p>
                </div>
                <div className="flex items-center">
                  <AiOutlineCheck className="text-green-700 text-lg" />
                  <p className="text-sm ml-2">Email verified</p>
                </div>
                <div className="flex items-center">
                  <AiOutlineCheck className="text-green-700 text-lg self-end" />
                  <p className="text-sm ml-2">Phone verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col w-full ">
          <h1 className="font-bold text-lg text-blue-700 mb-3">Offer terms</h1>
          <div className="border rounded px-5 py-7 bg-white asm:px-3 w-full">
            <p className="text-sm  leading-7">{terms}</p>
          </div>
        </div>
        <div className="border rounded  px-0 bg-white w-full flex-col mt-8">
          <div className="flex justify-between py-7 items-center mx-5">
            <h1 className="font-bold text-lg text-blue-700 mb-3">
              Feedback on this offer
            </h1>
            <div
              className="cursor-pointer hover:bg-lightGray hover:rounded"
              onClick={() => setIsOpenFeedback(!isOpenFeedback)}
            >
              {isOpenFeedback ? (
                <RiArrowDropUpLine className="text-[2.5rem] text-darkGray" />
              ) : (
                <RiArrowDropDownLine className="text-[2.5rem] text-darkGray" />
              )}
            </div>
          </div>
          <motion.div
            className="overflow-hidden"
            animate={isOpenFeedback ? 'open' : 'closed'}
            variants={buySells}
            transition={{
              duration: 0.5,
            }}
          >
            {ordersList?.map((order: any) => (
              <Feedback
                key={order?.order_no}
                order={order}
                currency={mainCoin}
              />
            ))}
          </motion.div>
        </div>
        <h1 className="text-xs text-darkGray text-center mt-12 w-2/3">
          ViCA and the services provided by ViCA on ViCA.com (and elsewhere) may
          not be affiliated, associated with, endorsed nor sponsored by your
          selected payment method.
        </h1>
      </div>
    </Container>
  );
};

export default Offer;
