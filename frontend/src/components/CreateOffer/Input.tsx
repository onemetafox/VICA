import { ChangeEvent, Dispatch } from 'react';
import { useDropDown } from 'src/hooks/useDropDown';
import { NumToStringWithComma } from 'src/utils/functions';

type ACTIONTYPE =
  | { type: 'pay'; price: string; coinMarketPrice: number }
  | { type: 'receive'; price: string; coinMarketPrice: number };

type Props = {
  height?: string;
  type?: string;
  state?: string;
  setState?: React.Dispatch<React.SetStateAction<string>>;
  actionType?: 'pay' | 'receive';
  onChange?: Dispatch<ACTIONTYPE>;
  isError?: boolean;
  coinMarketPrice?: number;
};

const PriceInput = ({
  type,
  actionType,
  height = 'h-12',
  state,
  setState,
  onChange,
  isError,
  coinMarketPrice,
}: Props) => {
  const { toggle, setToggle, dropDownRef } = useDropDown();

  return (
    <div
      className={`group w-full flex ${height}`}
      ref={dropDownRef}
      onClick={() => setToggle(true)}
    >
      <input
        className={`transition-colors ease-in duration-200 md:text-sm w-full border-l border-t border-b ${
          !type && 'border-r'
        } p-3 rounded-l ${!type && 'rounded-r'}  ${
          toggle ? ' border-blue-600' : 'group-hover:border-darkGray'
        } ${
          isError && 'border-orange-700'
        } focus:outline-none sm:w-full h-full `}
        type="text"
        value={state}
        placeholder="Type ..."
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const stringVal = e.target.value.replace(/,/g, '');

          if (typeof parseFloat(stringVal) === 'number' || stringVal === '') {
            const value =
              stringVal === '' || stringVal.startsWith('NaN')
                ? '0'
                : NumToStringWithComma(parseFloat(stringVal));

            if (setState && type === undefined) {
              setState(e.target.value);
            }

            if (setState && type) {
              setState(value);
            }
            if (onChange && actionType && coinMarketPrice) {
              const price = e.target.value;
              onChange({
                type: actionType,
                price,
                coinMarketPrice,
              });
            }
          }
        }}
      />
      {type && (
        <div
          className={`transition-all ease-in duration-200 md:text-sm border-t border-r border-b rounded-r bg-white p-3  ${
            toggle ? ' border-blue-600' : 'group-hover:border-darkGray'
          } ${isError && 'border-orange-700'}`}
        >
          {type}
        </div>
      )}
    </div>
  );
};

export default PriceInput;
