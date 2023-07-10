import React from 'react';
import Link from 'next/link';
import { useFetchUser, useLogout } from 'src/queries/user';

const UserNavActionsMobile = () => {
  const mutation = useLogout();
  const { data } = useFetchUser();

  if (data) {
    return (
      <>
        <Link href="/account/profile">
          <span className=" my-3 rounded bg-blue-700 py-3 px-5 text-white hover:bg-blue-600 text-center cursor-pointer">
            My Account
          </span>
        </Link>
        <button
          onClick={() => {
            mutation.mutate();
          }}
          type="button"
          className="my-3 rounded bg-[rgb(17,33,65)] py-3 px-5 text-white hover:bg-[rgb(27,43,75)] text-center cursor-pointer"
        >
          Logout
        </button>
      </>
    );
  }
  return (
    <>
      <Link href="/register">
        <span className=" my-3 rounded bg-blue-700 py-3 px-5 text-white hover:bg-blue-600 text-center cursor-pointer">
          Register
        </span>
      </Link>
      <Link href="/login">
        <span className="my-3 rounded bg-[rgb(17,33,65)] py-3 px-5 text-white hover:bg-[rgb(27,43,75)] text-center cursor-pointer">
          Login
        </span>
      </Link>
    </>
  );
};

export default UserNavActionsMobile;
