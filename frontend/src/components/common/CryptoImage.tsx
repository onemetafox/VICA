import React from 'react';
import Image from 'next/image';
import { CoinsTypes } from 'src/types/coins';
import btcLogo from 'src/assets/images/btc.svg';
import ethLogo from 'src/assets/images/eth.svg';
import vicaLogo from 'src/assets/images/ViCA.png';
import tetherLogo from 'src/assets/images/tether.svg';

type Props = {
  coin: CoinsTypes;
  width?: number;
};

const CryptoImage = ({ width = 30, coin }: Props) => {
  switch (coin) {
    case 'BTC':
      return <Image src={btcLogo} width={width} height={width} alt="btc" />;
    case 'ETHER':
      return <Image src={ethLogo} width={width} height={width} alt="eth" />;
    case 'ETH':
      return <Image src={ethLogo} width={width} height={width} alt="eth" />;
    case 'USDT':
      return (
        <Image src={tetherLogo} width={width} height={width} alt="tether" />
      );
    case 'VICA':
    default:
      return <Image src={vicaLogo} width={width} height={width} alt="viCA" />;
  }
};

export default CryptoImage;
