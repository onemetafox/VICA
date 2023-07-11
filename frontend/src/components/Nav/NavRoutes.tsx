import React from 'react';
import { useFetchUser } from 'src/queries/user';
import NavRoute from './NavRoute';

const NavRoutes = () => {
  const { data } = useFetchUser();

  return (
    <div className="text-lg lg:hidden">
      <NavRoute route="/buy">Buy</NavRoute>
      <NavRoute route="/sell">Sell</NavRoute>
      <NavRoute route="/wallet">Wallet</NavRoute>
      <NavRoute route="/arbitrage">Arbitrage</NavRoute>
      {/* <NavRoute route="/convert">Convert</NavRoute> */}
      {data && <NavRoute route="/create-an-offer">Create an Offer</NavRoute>}
    </div>
  );
};

export default NavRoutes;
