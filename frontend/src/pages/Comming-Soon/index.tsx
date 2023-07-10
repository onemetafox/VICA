import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Nav from 'src/components/Nav';

const Login = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Convert coins</title>
      </Head>

      <Nav />
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-lightGray">
        <div className="max-w-xl px-5 text-center">
          <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
            Comming Soon ....
          </h2>
        </div>
      </div>
    </>
  );
};

export default Login;
