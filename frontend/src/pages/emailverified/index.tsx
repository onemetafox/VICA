import React from 'react';
import Nav from 'src/components/Nav';
import Footer from 'src/components/Footer';
import { useRouter } from 'next/router';

const EmailVerified = () => {
  const router = useRouter();

  return (
    <>
      <Nav />
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
        <div className="max-w-xl px-5 text-center">
          <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
            Wohoo ! Email Verified.
          </h2>
          <p className="mb-2 text-lg text-zinc-500">
            We are glad, that you’re with us :)
          </p>
          {/* <button
          type="button"
          className="px-2 py-2 text-blue-200 bg-blue-600 rounded"
          onClick={() => router.push('/')}
        >
          Home
  </button> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmailVerified;
