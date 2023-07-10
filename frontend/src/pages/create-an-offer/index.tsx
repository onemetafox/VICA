import React, { useEffect } from 'react';
import Router from 'next/router';
import { useStepReducer, OfferContext } from 'src/hooks/useStepReducer';
import { useFetchUser } from 'src/queries/user';
import Payment from 'src/components/CreateOffer/Step1';
import Pricing from 'src/components/CreateOffer/Step2';
import Settings from 'src/components/CreateOffer/Step3';

const OfferPage = () => {
  const { stepState, stepDispatch } = useStepReducer();
  const { data } = useFetchUser();

  /*   useEffect(() => {
    if (!data) {
      Router.push('/');
    }
  }, [data]); */

  return (
    <OfferContext.Provider
      value={{
        stepState,
        stepDispatch,
      }}
    >
      {stepState.step === 1 && <Payment />}
      {stepState.step === 2 && <Pricing />}
      {stepState.step === 3 && <Settings />}
    </OfferContext.Provider>
  );
};

export default OfferPage;
