import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Wrapper from 'src/components/Buy&Sell/Wrapper';
import Intro from 'src/components/Wallet/Intro';
import { useFetchUser } from 'src/queries/user';

const Page = () => {
  const { data, status } = useFetchUser();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (status === 'error') {
    return <div>An error has occurred</div>;
  }
  if (!data) {
    return <Intro />;
  }
  return <Wrapper variant="BUY" />;
};

export default Page;
