import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowLeft } from 'react-icons/bs';
import logo from 'public/logo.png';

type Props = {
  type: string;
  children: React.ReactNode;
};
const Container = ({ type, children }: Props) => {
  return (
    <div className="font-poppins w-[66%] py-6 flex flex-col justify-center items-center lg:w-full sm:text-sm sm:w-full sm:px-2">
      <nav className=" justify-between items-center p-3 border-b-[1px] border-[#EAECEF] w-full hidden lg:flex">
        <Link href="/">
          <div className="flex cursor-pointer items-center">
            <Image src={logo} width={50} height={50} alt="logo-viCA" />
            <h1 className="ml-3 font-poppinsLarge text-xl font-black">ViCA</h1>
          </div>
        </Link>
        <Link href="/">
          <div className="flex cursor-pointer items-center text-darkGray">
            <BsArrowLeft />
            <h1 className="ml-3">Home</h1>
          </div>
        </Link>
      </nav>
      {type === 'PasswordConfirm' ? (
        <div className="flex justify-center items-center">{children}</div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full sm:w-full sm:px-3 flex-grow">
          <h1 className="text-3xl leading-relaxed sm:text-xl ">
            {type === 'register' ? 'Register' : 'Login'}
          </h1>

          <p className="text-lightBlack text-center">
            {type === 'register'
              ? 'Already have an account ?'
              : "Don't have an account yet ?"}{' '}
            <Link href={type === 'register' ? '/login' : '/register'}>
              <span className="text-blue-700 cursor-pointer hover:text-blue-500">
                {type === 'register' ? 'Login' : 'Register'}
              </span>
            </Link>
          </p>
          {children}
        </div>
      )}
    </div>
  );
};

export default Container;
