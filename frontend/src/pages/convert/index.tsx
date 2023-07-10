/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useReducer, useRef } from 'react';
import Head from 'next/head';
import Nav from 'src/components/Nav';
import Image from 'next/image';
import { allCoins, CoinsTypes } from 'src/types/coins';
import { convertValueByFactor } from 'src/utils/functions';
import AuthService from 'src/services/AuthService';
import {
  ExchangeRate,
  ConverterInputTab,
} from '../../components/Convert/_convert';

const COUNTER_START = 30;

type ConverterState = {
  loading: boolean;
  coinsExchangeData: Record<string, unknown> | undefined;
  fromCoin: {
    name: CoinsTypes;
    value: string;
  };
  toCoin: {
    name: CoinsTypes;
    value: string;
  };
  count: number | null;
};
type ConverterAction = {
  type: string;
  payload?: any;
};
const initialtState: ConverterState = {
  loading: true,
  coinsExchangeData: {},
  fromCoin: {
    name: 'BTC',
    value: '',
  },
  toCoin: {
    name: 'USDT',
    value: '',
  },
  count: null,
};

const reducer = (state: ConverterState, action: ConverterAction) => {
  switch (action.type) {
    case 'LOAD_COINS_EXCHANGE_DATA':
      return { ...state, loading: true, count: null };
    case 'LOAD_EXCHANGE_DATA_SUCCESS':
      return {
        ...state,
        toCoin: {
          ...state.toCoin,
          value: convertValueByFactor(
            state.fromCoin.value,
            action.payload[state.fromCoin.name][state.toCoin.name]
          ),
        },
        coinsExchangeData: action.payload,
        loading: false,
        count: COUNTER_START,
      };
    case 'LOAD_EXCHANGE_DATA_FAIL':
      return {
        ...state,
        loading: false,
      };
    case 'COUNT_DECREASE':
      return { ...state, count: (state.count as number)-- };
    case 'CHANGE_FROM_COIN':
      return { ...state, fromCoin: action.payload };
    case 'CHANGE_TO_COIN':
      return { ...state, toCoin: action.payload };
    default:
      return state;
  }
};

const Convert = () => {
  const [state, dispatch] = useReducer(reducer, initialtState);
  const countIntervalId: { current: NodeJS.Timer | null } = useRef(null);

  useEffect(() => {
    loadCoinsExchangeData();
  }, []);

  useEffect(() => {
    if (state.count !== 0) return;
    loadCoinsExchangeData();
  }, [state.count]);

  function loadCoinsExchangeData() {
    const all: Promise<{ from: string; to: string; result: number }>[] = [];

    if (countIntervalId.current)
      clearInterval(countIntervalId.current as NodeJS.Timeout);

    dispatch({ type: 'LOAD_COINS_EXCHANGE_DATA' });

    // "all" variable it's an array of promises, each promise resolve to a coin conversion
    allCoins.reduce((total, fromCoin) => {
      const newTotal = total.filter((item) => item != fromCoin);
      newTotal.forEach((toCoin) => {
        all.push(
          AuthService.coinsConverter(fromCoin, toCoin).then((res) =>
            Promise.resolve({
              from: fromCoin,
              to: toCoin,
              result: res.result || 1,
            })
          )
        );
      });
      return newTotal;
    }, allCoins);

    /*
      we will take all the resolved coins conversion, and put in one var, 
      and dispatch LOAD_EXCHANGE_DATA_SUCCESS with that var
    */
    Promise.all(all)
      .then((exchangeData) => {
        const newCoinsExchangeData = exchangeData.reduce((data, item) => {
          if (!data[item.from]) data[item.from] = {};
          if (!data[item.to]) data[item.to] = {};
          data[item.from][item.to] = item.result;
          data[item.to][item.from] = 1 / item.result;
          return data;
        }, {});
        dispatch({
          type: 'LOAD_EXCHANGE_DATA_SUCCESS',
          payload: newCoinsExchangeData,
        });
        countIntervalId.current = setInterval(() => {
          dispatch({ type: 'COUNT_DECREASE' });
        }, 1000);
      })
      .catch((e) => {
        dispatch({ type: 'LOAD_EXCHANGE_DATA_FAIL' });
        throw e;
      });
  }

  function handleFromCoinChange(
    changeType: 'value' | 'coin',
    data: string | CoinsTypes
  ) {
    if (changeType === 'value') {
      dispatch({
        type: 'CHANGE_FROM_COIN',
        payload: { ...state.fromCoin, value: data },
      });

      dispatch({
        type: 'CHANGE_TO_COIN',
        payload: {
          ...state.toCoin,
          value: convertValueByFactor(
            data,
            state.coinsExchangeData[state.fromCoin.name][state.toCoin.name]
          ),
        },
      });
    } else {
      const swap = data === state.toCoin.name;
      dispatch({
        type: 'CHANGE_FROM_COIN',
        payload: { ...state.fromCoin, name: data },
      });

      dispatch({
        type: 'CHANGE_TO_COIN',
        payload: {
          name: state[swap ? 'fromCoin' : 'toCoin'].name,
          value: convertValueByFactor(
            state.fromCoin.value,
            state.coinsExchangeData[data][
              state[swap ? 'fromCoin' : 'toCoin'].name
            ]
          ),
        },
      });
    }
  }

  function handleToCoinChange(
    changeType: 'value' | 'coin',
    data: string | CoinsTypes
  ) {
    if (changeType === 'value') {
      dispatch({
        type: 'CHANGE_TO_COIN',
        payload: { ...state.toCoin, value: data },
      });

      dispatch({
        type: 'CHANGE_FROM_COIN',
        payload: {
          ...state.fromCoin,
          value: convertValueByFactor(
            data,
            state.coinsExchangeData[state.toCoin.name][state.fromCoin.name]
          ),
        },
      });
    } else {
      const swap = data === state.fromCoin.name;
      dispatch({
        type: 'CHANGE_TO_COIN',
        payload: {
          value: convertValueByFactor(
            state.fromCoin.value,
            state.coinsExchangeData[state[swap ? 'toCoin' : 'fromCoin'].name][
              data
            ]
          ),
          name: data,
        },
      });

      dispatch({
        type: 'CHANGE_FROM_COIN',
        payload: {
          name: state[swap ? 'toCoin' : 'fromCoin'].name,
          value: state.fromCoin.value,
        },
      });
    }
  }

  function handelChangeButtonClick() {
    dispatch({
      type: 'CHANGE_FROM_COIN',
      payload: { ...state.toCoin },
    });

    dispatch({
      type: 'CHANGE_TO_COIN',
      payload: {
        name: state.fromCoin.name,
        value: convertValueByFactor(
          state.toCoin.value,
          state.coinsExchangeData[state.toCoin.name][state.fromCoin.name]
        ),
      },
    });
  }

  return (
    <>
      <Head>
        <title>Convert coins</title>
      </Head>

      <Nav />
      <div className="text-black w-full px-20 lg:px-8 asm:px-3 mt-12 font-openSans">
        <div className="w-full flex md:flex-col flex-row  border border-mediumGray bg-white rounded-lg justify-center items-center">
          <ConverterInputTab
            text="You are converting"
            available={0}
            disabled={state.loading}
            coinData={state.fromCoin}
            handelCoinChange={handleFromCoinChange}
          />
          <button
            className="w-12	h-12 grid place-items-center rounded-full border border-dmGray bg-white z-10 -mx-6 md:-mx-0 -my-0 md:-my-6 md:rotate-90 disabled:cursor-not-allowed"
            type="button"
            aria-label="exchange"
            disabled={state.loading}
            onClick={handelChangeButtonClick}
          >
            <Image
              width={24}
              height={24}
              src="/exchange.png"
              alt="exchange"
              aria-hidden="true"
            />
          </button>
          <ConverterInputTab
            text="You will receive"
            available={0}
            disabled={state.loading}
            coinData={state.toCoin}
            handelCoinChange={handleToCoinChange}
          />
        </div>
        <div className="flex md:flex-col flex-row justify-between gap-3 items-center	md:items-stretch">
          <ExchangeRate
            from={state.fromCoin.name}
            to={state.toCoin.name}
            coinsExchangeData={state.coinsExchangeData}
            count={state.count}
            totalCount={COUNTER_START}
            loading={state.loading}
          />
          <button
            className="w-36 md:w-auto md:mx-4 text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center px-3.5 py-2 font-medium focus:z-10 rounded-lg"
            disabled={state.loading}
            type="button"
          >
            Convert
          </button>
        </div>
      </div>
    </>
  );
};

export default Convert;
