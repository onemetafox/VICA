import React, { FC, PropsWithChildren } from 'react';
import Footer from 'src/components/Footer';
import Nav from 'src/components/Nav';
import Menu from 'src/components/Account/Menu';

const Account: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div className="w-full bg-white font-poppins text-darkBlack">
      <Nav />
      <main className="bg-lightGray w-full min-h-screen px-20 py-16 flex font-poppins lg:px-16 asm:px-3">
        <Menu />
        <section className="flex-grow flex flex-col ml-24 xl:ml-0">
          {children}
        </section>
      </main>
      <Footer bgColor="white" />
    </div>
  );
};

export default Account;
