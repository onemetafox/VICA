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
};

const BuySellDropDown = ({
  list,
  actionType,
  dispatch,
  width = 'w-full',
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
        className={`flex ${width} cursor-pointer items-center justify-between rounded bg-white py-[0.35rem] pr-1 pl-2 hover:bg-dmGray`}
        onClick={() => setToggle(!toggle)}
      >
        <div className="flex items-center justify-center sm:hidden">
          <CryptoImage coin={coin} width={20} />
          <span className="ml-2 text-sm">{coin}</span>
        </div>
        <span className="ml-2 text-sm hidden sm:block">{coin}</span>
        {toggle ? (
          <RiArrowDropUpLine className="h-7 w-7 text-darkGray" />
        ) : (
          <RiArrowDropDownLine className="h-7 w-7 text-darkGray" />
        )}
      </div>
      <ul
        className={`absolute ${width} right-0 left-0 top-12 z-10 ${
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
            <span className="sm:hidden">
              <CryptoImage coin={cn} width={20} />
            </span>
            <span className="ml-3 text-sm">{cn}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuySellDropDown;
