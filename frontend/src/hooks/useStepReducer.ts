import React, { useReducer, Reducer, createContext } from 'react';
import { CoinsTypes } from 'src/types/coins';

export type STEPSTATETYPE = {
  step: number;
  buySell: 'BUY' | 'SELL';
  firstCoin: CoinsTypes;
  paymentMethod: string;
  price: number;
  amount: number;
  payment_method: number;
  trade_limit_min: number;
  trade_limit_max: number;
  limitTime: string;
  label: string;
  terms: string;
  instructions: string;
  status: string;
};

export type ACTIONTYPE =
  | { type: 'BUY' }
  | { type: 'SELL' }
  | { type: 'firstCoin'; data: CoinsTypes }
  | { type: 'paymentMethod'; data: string }
  | { type: 'Increment'; data: STEPSTATETYPE }
  | { type: 'Decrement'; data: STEPSTATETYPE }
  | { type: 'updateTradeLimits'; data: STEPSTATETYPE };

export type REDUCERTYPE = {
  stepState: STEPSTATETYPE;
  stepDispatch: React.Dispatch<ACTIONTYPE>;
};

const initialStep: STEPSTATETYPE = {
  step: 1,
  buySell: 'SELL',
  firstCoin: 'BTC',
  paymentMethod: 'ETHER',
  price: 0,
  payment_method: 3,
  amount: 0,
  trade_limit_min: 10,
  trade_limit_max: 100,
  limitTime: '60',
  label: '',
  terms: '',
  instructions: '',
  status: 'ACTIVE',
};

const stepReducer = (
  state: STEPSTATETYPE,
  action: ACTIONTYPE
): STEPSTATETYPE => {
  switch (action.type) {
    case 'BUY':
      return { ...state, buySell: 'BUY' };
    case 'SELL':
      return { ...state, buySell: 'SELL' };
    case 'Increment':
      return { ...state, ...action.data, step: state.step + 1 };
    case 'Decrement':
      return { ...state, ...action.data, step: state.step - 1 };
    case 'firstCoin':
      return { ...state, firstCoin: action.data };
    case 'paymentMethod':
      return { ...state, paymentMethod: action.data };
    case 'updateTradeLimits':
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export const OfferContext = createContext<REDUCERTYPE>({
  stepState: initialStep,
  stepDispatch: () => null,
});

export const useStepReducer = () => {
  const [state, dispatch] = useReducer<Reducer<STEPSTATETYPE, ACTIONTYPE>>(
    stepReducer,
    initialStep
  );
  return { stepState: state, stepDispatch: dispatch };
};
