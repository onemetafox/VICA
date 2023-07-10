import { useState } from 'react';
import Container from 'src/components/Account/Container';
import OfferAction from './OfferAction';
import OfferTable from './OfferTable';

const Offers = ({ offers }: any) => {
  const [offer, setOffer] = useState('buy');
  const buyOffers = offers?.filter((ofr: any) => ofr.type === 'BUY');
  const sellOffers = offers?.filter((ofr: any) => ofr.type === 'SELL');

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-5">Offers</h1>
      <div className="flex mb-7">
        <OfferAction
          type="sell"
          offer={offer}
          onSetOffer={() => setOffer('sell')}
          totalOffers={sellOffers?.length}
        />
        <OfferAction
          type="buy"
          offer={offer}
          onSetOffer={() => setOffer('buy')}
          totalOffers={buyOffers?.length}
        />
      </div>
      {offer === 'buy' ? (
        <OfferTable data={buyOffers} />
      ) : (
        <OfferTable data={sellOffers} />
      )}
    </Container>
  );
};

export default Offers;
