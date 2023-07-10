import React from 'react';
import Link from 'next/link';
import { useFetchUser } from 'src/queries/user';
import UserNavDropDown from './UserNavDropDown';
import BarLoader from '../common/BarLoader';

const UserNavActions = () => {
  const { data, isLoading, isFetching } = useFetchUser();

  /* if (isFetching || isLoading) {
    return <BarLoader width="w-32" />;
  } */

  if (data) {
    return <UserNavDropDown />;
  }
  return (
    <div className="flex items-center lg:hidden">
      <Link href="/login">
        <span className="cursor-pointer hover:text-blue-700">Login</span>
      </Link>
      <Link href="/register">
        <span className="ml-7 rounded bg-blue-700 py-3 px-5 text-white hover:bg-blue-600 cursor-pointer">
          Register
        </span>
      </Link>
    </div>
  );
};

export default UserNavActions;
