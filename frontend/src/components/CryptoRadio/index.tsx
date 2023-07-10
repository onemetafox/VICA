import { ChangeEvent, Dispatch } from 'react';
import {
  CoinListType,
  ACTIONTYPE,
  UPDATERTYPE,
} from 'src/hooks/useCoinsReducer';
import { ACTIONTYPE as STEPACTIONTYPE } from 'src/hooks/useStepReducer';
import { isCoinTypeOfCoinsList } from 'src/types/coins';
import RadioBox from './RadioBox';

type Props = {
  list: CoinListType;
  actionType: UPDATERTYPE;
  dispatch: Dispatch<ACTIONTYPE>;
};

const CryptoRadio = ({ list, actionType, dispatch }: Props) => {
  const handleSelectCoin = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedCoin = e.target.value;

    if (isCoinTypeOfCoinsList(selectedCoin)) {
      dispatch({ type: actionType, selectedCoin });
    }
  };
  return (
    <div className="flex justify-between md:grid md:grid-cols-2 md:gap-5 w-[30rem] md:w-full">
      {list.list.map((cn) => (
        <RadioBox
          key={cn}
          cn={cn}
          handleSelectCoin={handleSelectCoin}
          selectedCoin={list.selectedCoin}
          name={actionType}
        />
      ))}
    </div>
  );
};

export default CryptoRadio;
