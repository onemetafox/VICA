import { useRef, ChangeEventHandler } from 'react';
import {
  CoinListType,
  ACTIONTYPE,
  UPDATERTYPE,
} from 'src/hooks/useCoinsReducer';
import CryptoImage from 'src/components/common/CryptoImage';
import { CoinsTypes } from 'src/types/coins';

type Props = {
  cn: CoinsTypes;
  selectedCoin: CoinsTypes;
  name: UPDATERTYPE;
  handleSelectCoin: ChangeEventHandler<HTMLInputElement>;
};

const RadioBox = ({ cn, selectedCoin, name, handleSelectCoin }: Props) => {
  const radioRef = useRef<HTMLInputElement>(null);

  return (
    <label
      key={cn}
      className={`p-3 w-28 md:w-full border rounded bg-white cursor-pointer transition-all ease-in flex justify-center hover:${
        selectedCoin !== cn && 'bg-lightGray'
      } ${selectedCoin === cn && 'border-blue-600'}`}
      onClick={() => {
        if (radioRef?.current) {
          radioRef.current.click();
        }
      }}
    >
      <input
        type="radio"
        className="appearance-none hidden"
        name={name}
        ref={radioRef}
        value={cn}
        onChange={handleSelectCoin}
      />
      <CryptoImage coin={cn} />
    </label>
  );
};

export default RadioBox;
