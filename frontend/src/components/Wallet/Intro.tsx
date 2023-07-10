import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import walletImage from 'src/assets/images/wallet_wallpaper.svg';
import Container from './Container';

const Intro = () => {
  return (
    <Container>
      <div className="flex lg:flex-col  items-center justify-center">
        <div className="flex flex-col w-2/3 items-center justify-center h-full lg:w-full lg:text-center">
          <h1 className="font-black font-poppinsLarge text-5xl text-blue-700 lg:text-3xl leading-[3.6rem] ">
            Get your secure Bitcoin, Ethereum and ViCA wallets
          </h1>
          <div className="hidden lg:block mt-5">
            <Image
              src={walletImage}
              alt="vica-secure-wallet"
              className="w-1/3"
            />
          </div>

          <h2 className="text-darkGray font-bold text-xl my-5 lg:text-lg">
            A simple and safe way to buy, sell, send, and store your Crypto.
          </h2>
          <p className="mb-5">
            The ViCA Wallet is a secure and convenient way to manage your money.
            Sign up today and find out for yourself why millions of people trust
            us.
          </p>
          <Link href="/register">
            <span className="px-7 py-4 rounded bg-blue-600 hover:bg-blue-500 cursor-pointer text-white self-start lg:self-center">
              Get your free wallet
            </span>
          </Link>
        </div>
        <div className="lg:hidden">
          <Image src={walletImage} alt="vica-secure-wallet" className="w-1/3" />
        </div>
      </div>
    </Container>
  );
};

export default Intro;
