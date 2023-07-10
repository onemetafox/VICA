import { FC, PropsWithChildren } from 'react';
import Nav from 'src/components/Nav';
import Footer from 'src/components/Footer';

const Container: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div className="font-poppins">
      <Nav />
      <div className="px-20 py-16 lg:px-16 asm:px-3 w-full h-full min-h-screen bg-lightGray">
        {children}
      </div>
      <Footer bgColor="bg-white" />
    </div>
  );
};

export default Container;
