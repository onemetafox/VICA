import React from 'react';
import Image from 'next/image';
import btc from 'src/assets/images/btc_3d.webp';
import tether from 'src/assets/images/tether_3d.webp';

const SignInUpLeft = () => {
  return (
    <div className="min-h-screen flex-grow relative overflow-hidden flex justify-center items-center lg:hidden bg-register-cover bg-cover bg-no-repeat">
      <h1 className="text-white absolute text-2xl font-poppinsLarge font-black">
        Buy/Sell Crypto in Minutes
      </h1>
      <div className="absolute bottom-0 -right-10 w-48">
        <Image src={btc} alt="btc" />
      </div>
      <div className="absolute top-10 -left-10 w-48">
        <Image src={tether} alt="tether" />
      </div>
    </div>
  );
};

export default SignInUpLeft;
