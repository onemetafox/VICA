import React, { FC, PropsWithChildren } from 'react';
import Header from './Header';

const LeftSide: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div className="flex flex-col w-full border-r-2 pr-7 xl:border-0 xl:p-0">
      <Header />
      {children}
    </div>
  );
};

export default LeftSide;
