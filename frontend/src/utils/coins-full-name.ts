import { CoinsTypes } from 'src/types/coins';

export const coinFullName = (name: CoinsTypes) => {
  switch (name) {
    case 'BTC':
      return 'Bitcoin';
    case 'ETHER':
      return 'Ethereum';
    case 'ETH':
      return 'Ethereum';
    case 'USDT':
      return 'Tether';
    case 'VICA':
    default:
      return 'ViCA';
  }
};
