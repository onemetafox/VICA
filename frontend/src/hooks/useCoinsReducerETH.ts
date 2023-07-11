import { useReducer, Reducer } from 'react';
import { CoinsTypes } from 'src/types/coins';

const initialList1: CoinsTypes[] = ['BTC', 'ETHER', 'USDT', 'VICA'];
const initialList2: CoinsTypes[] = ['ETHER', 'USDT', 'VICA'];

const initializeList = (
  firstCoin: CoinsTypes,
  secondCoin: CoinsTypes
): STATETYPE => {
  return {
    coinList1: {
      selectedCoin: firstCoin,
      list: initialList1,
    },
    coinList2: {
      selectedCoin: secondCoin,
      list: initialList2,
    },
  };
};

export type CoinListType = {
  selectedCoin: CoinsTypes;
  list: CoinsTypes[];
};

export type UPDATERTYPE = 'Update_first_list' | 'Update_second_list';
export type ACTIONTYPE =
  | { type: 'Update_first_list'; selectedCoin: CoinsTypes }
  | { type: 'Update_second_list'; selectedCoin: CoinsTypes };

export type STATETYPE = {
  coinList1: CoinListType;
  coinList2: CoinListType;
};

const selectRandomElement = (list: CoinsTypes[], coin: CoinsTypes) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i] !== coin) {
      return list[i];
    }
  }
  return list[0];
};
const selectCoinReducer = (state: STATETYPE, action: ACTIONTYPE) => {
  switch (action.type) {
    case 'Update_first_list': {
      const newList2 = [
        ...initialList1.filter((coin) => coin !== action.selectedCoin),
      ];
      const newSelectedCoin2 =
        state.coinList2.selectedCoin === action.selectedCoin
          ? selectRandomElement(newList2, action.selectedCoin)
          : state.coinList2.selectedCoin;

      return {
        coinList1: {
          selectedCoin: action.selectedCoin,
          list: initialList1,
        },
        coinList2: {
          selectedCoin: newSelectedCoin2,
          list: newList2,
        },
      };
    }
    case 'Update_second_list':
      return {
        ...state,
        coinList2: {
          selectedCoin: action.selectedCoin,
          list: state.coinList2.list,
        },
      };
    default:
      return state;
  }
};

export const useCoinsReducerETH = (
  firstCoin: CoinsTypes = 'ETHER',
  secondCoin: CoinsTypes = 'BTC'
) => {
  const [stateETH, dispatchETH] = useReducer<Reducer<STATETYPE, ACTIONTYPE>>(
    selectCoinReducer,
    initializeList(firstCoin, secondCoin)
  );
  return { stateETH, dispatchETH };
};
