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
      return 'USDT(Tether)';
    case 'VICA':
      return 'ViCA';
    default:
      return name;
  }
};
