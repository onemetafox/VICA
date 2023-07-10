import React, { FC, PropsWithChildren } from 'react';
import Nav from 'src/components/Nav';
import Footer from 'src/components/Footer';

type Props = {
  bg?: string;
};
const Container: FC<PropsWithChildren<Props>> = ({
  children,
  bg = 'bg-lightGray',
}) => {
  return (
    <div className="w-full bg-white font-poppins text-darkBlack">
      <Nav />
      <main
        className={`${bg} w-full min-h-screen px-20 py-12 lg:px-16 asm:px-3`}
      >
        {children}
      </main>
      <Footer bgColor="white" />
    </div>
  );
};

export default Container;
