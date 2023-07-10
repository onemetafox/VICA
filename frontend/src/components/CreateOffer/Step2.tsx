import React, {
  useState,
  useContext,
  useMemo,
  FC,
  PropsWithChildren,
} from 'react';
import { OfferContext } from 'src/hooks/useStepReducer';
import RadioBullet from 'src/components/common/RadioBullet';
import { coinFullName } from 'src/utils/coins-full-name';
import OfferContainer from 'src/components/CreateOffer/Container';
import { NumToStringWithComma } from 'src/utils/functions';
import { useFetchCoinsConversion } from 'src/queries/coins';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import ActionButtons from './ActionButtons';
import Input from './Input';

type GridProps = {
  className?: string;
};

const GridItem: FC<PropsWithChildren<GridProps>> = ({
  className,
  children,
}) => {
  return <div className={`px-4 py-10 md:px-1  ${className}`}>{children}</div>;
};

const stringToNum = (str: string) => parseInt(str.replace(/,/g, ''), 10);
const formatPrice = (num: number) =>
  NumToStringWithComma(parseFloat(num.toFixed(2)));

const Pricing = () => {
  const { stepState, stepDispatch } = useContext(OfferContext);
  const { buySell, firstCoin, paymentMethod, limitTime } = stepState;
  const currentCoin = firstCoin === 'USDT' ? paymentMethod : firstCoin;
  const [userPrice, setUserPrice] = useState('');
  const { data } = useFetchCoinsConversion(firstCoin, 'USD', setUserPrice);
  const [amount, setAmount] = useState('');
  const [priceOption, setPriceOption] = useState('fixed');
  const [minimumPrice, setMinimumPrice] = useState('10');
  const [maximumPrice, setMaximumPrice] = useState('100');
  const [timeLimit, setTimeLimit] = useState(limitTime);

  const marketPrice = NumToStringWithComma(data?.result ?? '0.25');

  const numAmount = stringToNum(amount);
  const numMinimumPrice = stringToNum(minimumPrice);
  const numMaximumPrice = stringToNum(maximumPrice);
  const numMarketPrice = stringToNum(marketPrice);
  const numUserPrice = stringToNum(userPrice);

  const minAllowedPrice = numMarketPrice - numMarketPrice * 0.1;
  const maxAllowedPrice = numMarketPrice + numMarketPrice * 0.1;

  const priceError =
    userPrice !== '' &&
    (numUserPrice < minAllowedPrice || numUserPrice > maxAllowedPrice);

  const amountError = numAmount < numMaximumPrice;
  const timeError = parseInt(timeLimit, 10) < 5;
  const limitsError =
    numMinimumPrice < 10 || numMinimumPrice >= numMaximumPrice;

  const isBellow = numMarketPrice > numUserPrice;
  const isAbove = numMarketPrice <= numUserPrice;

  let numHowMuchUserReceive = 0;
  let numPricePercent = 0;

  if (numUserPrice > 0 && isBellow) {
    numPricePercent = ((numMarketPrice - numUserPrice) / numMarketPrice) * 100;
  }

  if (numUserPrice > 0 && isAbove) {
    numPricePercent = ((-numMarketPrice + numUserPrice) / numMarketPrice) * 100;
  }

  numHowMuchUserReceive = isBellow
    ? numMinimumPrice - (numPricePercent / 100) * numMinimumPrice
    : numMinimumPrice + (numPricePercent / 100) * numMinimumPrice;

  const handlePriceOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceOption(e.target.value);
  };
  useMemo(
    () =>
      stepDispatch({
        type: 'updateTradeLimits',
        data: {
          ...stepState,
          trade_limit_min: numMinimumPrice,
          trade_limit_max: numMaximumPrice,
        },
      }),
    [numMinimumPrice, numMaximumPrice]
  );
  return (
    <OfferContainer>
      <LeftSide>
        <h1 className="text-2xl font-bold text-blue-800 mb-7">Trade Pricing</h1>
        <h2 className="text-xl font-bold">
          Choose {coinFullName(firstCoin)} rate you want to use
        </h2>
        <div className="flex md:flex-col mt-6">
          <div className="group flex items-start p-3 py-5 bg-white rounded border-[1px] border-gray-400 ">
            <input
              checked={priceOption === 'fixed'}
              id="fixed"
              type="radio"
              value="fixed"
              onChange={handlePriceOption}
              name="price-radio"
              className="hidden"
            />
            <label
              htmlFor="fixed"
              className=" ml-2 font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
            >
              <div className="flex">
                <div className="w-7 h-7">
                  <RadioBullet isActive={priceOption === 'fixed'} />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-bold mb-1 ">Fixed price</h2>
                  <p className="text-darkGray">
                    Your offer’s selling price is locked when you create it, and
                    won’t change with the market price.
                  </p>
                </div>
              </div>
            </label>
          </div>
          <div className="group flex items-start  bg-white rounded ml-7 md:ml-0 md:mt-5 border-[1px] border-gray-400">
            <input
              checked={priceOption === 'market'}
              id="market"
              type="radio"
              value="market"
              onChange={handlePriceOption}
              name="price-radio"
              className="hidden"
            />
            <label
              htmlFor="market"
              className="ml-2 font-medium p-3 py-5 text-gray-900 dark:text-gray-300 cursor-pointer"
            >
              <div className="flex">
                <div className="w-7 h-7">
                  <RadioBullet isActive={priceOption === 'market'} />
                </div>

                <div className="flex flex-col">
                  <h2 className="font-bold mb-1 ">Market price</h2>
                  <p className="text-darkGray">
                    Your offer’s selling price will change according to the
                    market price of {coinFullName(firstCoin)}.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-3 grid-rows-4 divide-x divide-y ">
          <GridItem className="font-bold text-lg border-b md:text-base">
            Amount
          </GridItem>
          <GridItem className="flex-col col-span-2 border-b">
            <div className="w-2/3 lg:w-full">
              <Input
                type="USD"
                state={amount}
                setState={setAmount}
                isError={amountError}
              />
              {amountError && (
                <p className="text-sm text-orange-700 mt-2">
                  Amount must be greater or equal than Maximum trade limit.
                </p>
              )}
            </div>
            <p className="mt-5">This is how much you want to trade.</p>
          </GridItem>
          <GridItem className="border-t border-l font-bold text-lg md:text-base">
            Offer Trade Limits
          </GridItem>
          <GridItem className="flex-col col-span-2">
            <div className="flex justify-between lg:flex-col">
              <label className="block font-bold text-sm lg:mb-3 ">
                <span className=" block mb-1">Minimum</span>
                <Input
                  state={minimumPrice}
                  setState={setMinimumPrice}
                  type="USD"
                  isError={limitsError}
                />
              </label>

              <label className="block font-bold text-sm ">
                <span className=" block mb-1">Maximum</span>
                <Input
                  state={maximumPrice}
                  setState={setMaximumPrice}
                  type="USD"
                  isError={limitsError}
                />
              </label>
            </div>
            {limitsError && (
              <p className="text-sm text-orange-700 mt-2">
                Minium amount is 10 USD and Maximum amount should be greater
                than Minimum amount.
              </p>
            )}
            <div className="mt-5 bg-yellow-50 border border-yellow-300 py-5 px-7 text-sm rounded flex justify-center items-center">
              {buySell === 'BUY' ? (
                <p>
                  To make this offer visible, be sure to have the minimum amount
                  you’ve set within your wallet.
                </p>
              ) : (
                <p className="leading-7">
                  To list this offer on the Marketplace, you will need at least{' '}
                  {minimumPrice} USD worth of cryptocurrency in your ViCA
                  Wallet.
                </p>
              )}
            </div>
          </GridItem>

          <GridItem className="font-bold text-lg md:text-base">
            Fixed price market rate your offer will list at
          </GridItem>
          <GridItem className="flex-col col-span-2">
            {priceOption === 'fixed' ? (
              <>
                <Input
                  type="USD"
                  state={userPrice}
                  setState={setUserPrice}
                  isError={priceError}
                />
                {priceError && (
                  <p className="text-sm text-orange-700 mt-2">
                    Enter an amount between <strong>{minAllowedPrice}</strong>{' '}
                    USD and{' '}
                    <strong>{`${maxAllowedPrice}hey${setUserPrice}`}</strong>{' '}
                    USD.
                  </p>
                )}
                <p className="leading-7 my-5">
                  Current <strong>{currentCoin}</strong> market price:{' '}
                  <strong>{marketPrice}</strong> USD
                </p>
                {numPricePercent > 0 && (
                  <>
                    <p className="leading-7">
                      Your price is{' '}
                      {isAbove ? (
                        <span className="text-green-700 font-bold">
                          {formatPrice(numPricePercent)}% above
                        </span>
                      ) : (
                        <span className="text-red-700 font-bold">
                          {formatPrice(numPricePercent)}% below
                        </span>
                      )}{' '}
                      the market price
                    </p>
                    <p className="leading-7">
                      You will {buySell === 'BUY' ? 'pay' : 'get'}:{' '}
                      <span className="font-bold">
                        {formatPrice(Math.abs(numMarketPrice - numUserPrice))}{' '}
                        USD {isAbove ? 'above' : 'below'}
                      </span>{' '}
                      the market price for every {firstCoin} you {buySell}
                    </p>
                  </>
                )}
                <p className="leading-7">
                  So for every{' '}
                  <span className="font-bold">
                    {numMinimumPrice <= 0 ? '10.00' : minimumPrice} USD
                  </span>{' '}
                  {buySell === 'SELL' && `worth of ${firstCoin} you sell `}
                  (your minimum trade limit), you will receive an{' '}
                  <span className="font-bold">
                    {formatPrice(numHowMuchUserReceive)} USD{' '}
                  </span>
                  {buySell === 'BUY' && `worth of ${firstCoin} `}
                  in return.
                </p>{' '}
              </>
            ) : (
              <p className="leading-7 my-5">
                Current <strong>{currentCoin}</strong> market price:{' '}
                <strong>{marketPrice}</strong> USD
              </p>
            )}
          </GridItem>

          <GridItem className="font-bold text-lg border-b md:text-base">
            Offer Time Limit
          </GridItem>
          <GridItem className="flex-col col-span-2 border-b">
            <div className="w-2/3 lg:w-full">
              <Input
                type="Minutes"
                state={timeLimit}
                setState={setTimeLimit}
                isError={timeError}
              />
              {timeError && (
                <p className="text-sm text-orange-700 mt-2">
                  Time limit must be equal or greater than 5 minutes.
                </p>
              )}
            </div>
            <p className="leading-7 mt-5">
              This is how much time your trade partner has to make the payment
              and click <strong>Paid</strong> before the trade is automatically
              canceled.
            </p>
          </GridItem>
        </div>
      </LeftSide>
      <RightSide>
        <ActionButtons
          data={{
            ...stepState,
            buySell,
            firstCoin,
            paymentMethod,
            price: numUserPrice,
            amount: numAmount,
            payment_method: 3,
            limitTime: timeLimit,
            trade_limit_min: numMinimumPrice,
            trade_limit_max: numMaximumPrice,
          }}
          stepDispatch={stepDispatch}
          disabledButton={amountError || priceError || timeError || limitsError}
        />
      </RightSide>
    </OfferContainer>
  );
};

export default Pricing;
