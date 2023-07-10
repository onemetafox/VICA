import React from 'react';
import Container from 'src/components/Buy&Sell/Container';
import { useFetchOffers } from 'src/queries/offers';
import { useFetchPaymentMethods } from 'src/queries/paymentMethods';
import { PaymentMethod, Offers } from 'src/types/offers';

type Props = {
  variant: 'BUY' | 'SELL';
};
const Wrapper = ({ variant }: Props) => {
  const { data } = useFetchOffers();
  const { data: FetchedPaymentMethods } = useFetchPaymentMethods();
  const offers: Offers[] = data;
  const paymentMethods: PaymentMethod[] = FetchedPaymentMethods;
  if (!offers || !paymentMethods) {
    return <h1>Loading...</h1>;
  }
  return (
    <Container
      variant={variant}
      offers={offers}
      paymentMethods={paymentMethods}
    />
  );
};

export default Wrapper;
