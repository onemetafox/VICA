import React from 'react';
import Trade from 'src/components/Trade/index';

const TradePage = () => {
  if (typeof window === 'undefined') {
    return <h1>Loading...</h1>;
  }

  return <Trade />;
};

export default TradePage;
