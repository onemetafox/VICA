export type CoinsTypes = 'BTC' | 'ETHER' | 'VICA' | 'USDT' | 'ETH';

export const allCoins = ['BTC', 'ETHER', 'VICA', 'USDT'];

export const isCoinTypeOfCoinsList = (
  value: string | null
): value is CoinsTypes => {
  if (value) {
    return allCoins.includes(value);
  }
  return false;
};
