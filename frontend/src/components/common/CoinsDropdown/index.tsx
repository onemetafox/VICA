import React, { useEffect, useRef, useState } from 'react';
import { allCoins, CoinsTypes } from 'src/types/coins';
import CryptoImage from 'src/components/common/CryptoImage';
import { MdKeyboardArrowDown } from 'react-icons/md';

type CoinsDropdownPropsType = {
  selectedCoin: CoinsTypes;
  handelCoinChange(
    changeType: 'value' | 'coin',
    data: string | CoinsTypes
  ): void;
  disabled: boolean;
};

function CoinsDropdown({
  selectedCoin,
  handelCoinChange,
  disabled,
}: CoinsDropdownPropsType) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // handleOutsideClick
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    function handleOutsideClick(e: Event) {
      if (
        e.currentTarget != dropdownRef.current &&
        !dropdownRef.current?.contains(e.target as Node)
      )
        setIsOpen(false);
    }
    return window.removeEventListener('click', handleOutsideClick);
  }, []);

  const unselectedcoinsEl = allCoins
    .filter((coin) => coin != selectedCoin)
    .map((coin) => (
      <button
        className="flex gap-2	items-center w-full p-2 transition duration-300 disabled:cursor-not-allowed hover:bg-gray-50"
        type="button"
        key={coin}
        onClick={() => {
          if (disabled) return;
          setIsOpen(false);
          handelCoinChange('coin', coin as CoinsTypes);
        }}
        disabled={disabled}
      >
        <CryptoImage coin={coin as CoinsTypes} width={22} />
        <span className="font-semibold text-sm">{coin}</span>
      </button>
    ));
  return (
    <div className="relative w-max f-openSans" ref={dropdownRef}>
      <button
        className={`${
          isOpen ? 'text-white bg-blue-500' : ''
        } flex gap-2	items-center rounded w-max py-0.5 px-3.5 border border-blue-500 transition duration-300`}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <CryptoImage coin={selectedCoin} width={22} />
        <span className="font-semibold text-sm">{selectedCoin}</span>
        <span>
          <MdKeyboardArrowDown
            size="1.7rem"
            className={`${
              isOpen ? 'rotate-180 text-transparent' : ''
            } text-blue-500 transition-all duration-300`}
          />
        </span>
      </button>
      <div
        className={`${
          isOpen ? 'visible opacity-100' : 'opacity-0 invisible'
        } absolute w-full border border-dmGray transition-all duration-300 z-50 top-full bg-white p-2 shadow-sm translate-y-2`}
      >
        {unselectedcoinsEl}
      </div>
    </div>
  );
}

export default CoinsDropdown;
