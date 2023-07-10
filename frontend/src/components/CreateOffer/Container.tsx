import React, { FC, PropsWithChildren } from 'react';
import Container from 'src/components/common/Container';

const OfferContainer: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <Container>
      <div className="flex w-full justify-between items-start xl:flex-col">
        {children}
      </div>
    </Container>
  );
};

export default OfferContainer;
