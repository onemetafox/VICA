import { useQuery, useMutation } from '@tanstack/react-query';
import AuthService from 'src/services/AuthService';
import { isCoinTypeOfCoinsList } from 'src/types/coins';
import { NumToStringWithComma } from 'src/utils/functions';

export const useFetchCoinsConversion = (
  from: string,
  to: string,
  setData?: React.Dispatch<React.SetStateAction<string>>
) => {
  let coinFromConvert = from === 'ETHER' ? 'ETH' : from;
  let coinToConvert = to === 'ETHER' ? 'ETH' : to;
  coinFromConvert = coinFromConvert === 'USDT' ? 'USD' : coinFromConvert;
  coinToConvert = coinToConvert === 'USDT' ? 'USD' : coinToConvert;
  if (!isCoinTypeOfCoinsList(from)) {
    coinFromConvert = 'USD';
  }
  const result = useQuery(
    [`${coinFromConvert}${coinToConvert}`],
    () => AuthService.coinsConverter(coinFromConvert, coinToConvert),
    {
      initialData: null,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (setData) setData(NumToStringWithComma(data?.result ?? '0.25'));
      },
    }
  );
  return result;
};
export const useMutateCoinsConversion = () => {
  const result = useMutation([`to-usd`], (from: string) => {
    let coinFromConvert = from === 'ETHER' ? 'ETH' : from;

    coinFromConvert = coinFromConvert === 'USDT' ? 'USD' : coinFromConvert;

    if (!isCoinTypeOfCoinsList(from)) {
      coinFromConvert = 'USD';
    }
    return AuthService.coinsConverter(coinFromConvert, 'USD');
  });
  return result;
};
