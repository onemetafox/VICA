import React from 'react';
import { Spinner } from 'flowbite-react';
import CoinsDropdown from 'src/components/common/CoinsDropdown';
import { CoinsTypes } from 'src/types/coins';
import { TbRefresh } from 'react-icons/tb';

type ExchangeRateProps = {
  from: CoinsTypes;
  to: CoinsTypes;
  count: number | null;
  totalCount: number;
  loading: boolean;
  coinsExchangeData: Record<string, unknown>;
};
type ConverterInputTabProps = {
  text: string;
  available: number;
  coinData: { name: CoinsTypes; value: string };
  disabled: boolean;
  handelCoinChange(
    changeType: 'value' | 'coin',
    data: string | CoinsTypes
  ): void;
};

export const ExchangeRate = ({
  from,
  to,
  count,
  totalCount,
  loading,
  coinsExchangeData,
}: ExchangeRateProps) => {
  const transparentDeg = count
    ? `${((totalCount - count) / totalCount) * 360}deg`
    : '';

  if (loading)
    return (
      <div className="p-6 flex items-center gap-3">
        <Spinner size="lg" />
        <span>Refreshing Exchange Rate</span>
      </div>
    );

  return (
    <div className="p-6 flex items-center gap-3">
      <div
        className="shrink-0	relative grid place-items-center w-8 h-8 rounded-full bg-gray-200 after:-z-10 after:absolute after:content-[''] after:scale-110	after:w-full after:h-full after:bg-refresh-counter-icon after:rounded-full"
        style={{ '--transparentDeg': transparentDeg } as React.CSSProperties}
      >
        <TbRefresh />
      </div>
      <div className="flex flex-col text-sm">
        <span>
          Exchange rate:{' '}
          <span className="font-semibold">
            1 {from} = {(coinsExchangeData as any)[from][to]} {to}
          </span>
        </span>
        <span className="text-xs">
          Refreshing in <span className="font-semibold">{count} seconds</span>
        </span>
      </div>
    </div>
  );
};

export const ConverterInputTab = ({
  text,
  available,
  coinData,
  disabled,
  handelCoinChange,
}: ConverterInputTabProps) => {
  return (
    <div className="w-1/2 md:w-full	border-b border-dmGray last:border-l last:md:border-l-0 pl-8 pr-12 py-8">
      <div className="flex justify-between text-sm">
        <span className="font-semibold">{text}</span>
        <span>
          Available:{' '}
          <span className="font-semibold text-blue-400">{available}</span>
        </span>
      </div>
      <div className="flex gap-3 justify-between items-center mt-7">
        <div>
          <input
            className="w-full p-0 font-semibold text-3xl placeholder:font-bold placeholder:text-gray-300 border-none outline-0 outline-transparent focus:border-transparent focus:ring-0 disabled:cursor-not-allowed"
            placeholder="Enter amount"
            type="number"
            disabled={disabled}
            value={coinData.value}
            onChange={(e) => handelCoinChange('value', e.target.value)}
          />
        </div>
        <CoinsDropdown
          handelCoinChange={handelCoinChange}
          selectedCoin={coinData.name}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
