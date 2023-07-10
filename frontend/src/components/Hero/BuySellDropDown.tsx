import { useState, useEffect, MouseEvent, Dispatch } from 'react';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import {
  CoinListType,
  ACTIONTYPE,
  UPDATERTYPE,
} from 'src/hooks/useCoinsReducer';
import { isCoinTypeOfCoinsList } from 'src/types/coins';
import { useDropDown } from 'src/hooks/useDropDown';
import CryptoImage from 'src/components/common/CryptoImage';

type Props = {
  list: CoinListType;
  actionType: UPDATERTYPE;
  dispatch: Dispatch<ACTIONTYPE>;
  width?: string;
  bg?: string;
};

const BuySellDropDown = ({
  list,
  actionType,
  dispatch,
  width = 'w-full',
  bg = 'bg-lightGray',
}: Props) => {
  const { toggle, setToggle, dropDownRef } = useDropDown();
  const [coin, setCoin] = useState(list.selectedCoin);

  const handleSelectCoin = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) => {
    const selectedCoin = e.currentTarget.textContent;

    if (selectedCoin && isCoinTypeOfCoinsList(selectedCoin)) {
      dispatch({ type: actionType, selectedCoin });
    }
    setToggle(false);
  };
  useEffect(() => {
    setCoin(list.selectedCoin);
  }, [list.selectedCoin]);
  return (
    <div className="relative flex w-full flex-col" ref={dropDownRef}>
      <div
        className={`flex ${width} cursor-pointer items-center justify-between rounded-lg ${bg} py-2 pr-3 pl-5 hover:bg-dmGray`}
        onClick={() => setToggle(!toggle)}
      >
        <div className="flex items-center justify-center">
          <CryptoImage coin={coin} />
          <span className="ml-2">{coin}</span>
        </div>
        {toggle ? (
          <RiArrowDropUpLine className="h-9 w-9 text-darkGray" />
        ) : (
          <RiArrowDropDownLine className="h-9 w-9 text-darkGray" />
        )}
      </div>
      <ul
        className={`absolute ${width} right-0 left-0 top-16 z-10 ${
          toggle ? 'flex' : 'hidden'
        } flex-col rounded-lg border bg-white p-1`}
      >
        {list.list.map((cn) => (
          <li
            key={cn}
            className="flex cursor-pointer items-center justify-start p-2 hover:bg-lightGray"
            onClick={handleSelectCoin}
            value={cn}
          >
            <CryptoImage coin={cn} />
            <span className="ml-3">{cn}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuySellDropDown;
