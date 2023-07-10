import React from 'react';
import Link from 'next/link';
import { MdHistory, MdLogout } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import { GiArchiveRegister } from 'react-icons/gi';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { useDropDown } from 'src/hooks/useDropDown';
import { useLogout } from 'src/queries/user';

const UserNavDropDown = () => {
  const { toggle, setToggle, dropDownRef } = useDropDown();
  const { mutate } = useLogout();

  return (
    <div className="relative flex flex-col lg:hidden" ref={dropDownRef}>
      <div
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg py-2 pr-2 pl-4 hover:bg-lightGray ${
          toggle && 'bg-lightGray'
        }`}
        onClick={() => setToggle(!toggle)}
      >
        <div className="flex items-center justify-center">
          <CgProfile className=" text-darkGray text-2xl mr-2" />
          <h1 className="text-sm">My Account</h1>
        </div>
        {toggle ? (
          <RiArrowDropUpLine className="h-9 w-9 text-darkGray" />
        ) : (
          <RiArrowDropDownLine className="h-9 w-9 text-darkGray" />
        )}
      </div>
      <ul
        className={`text-sm w-56 py-6 px-0 absolute -translate-x-7 right-0 left-0 top-14 z-10 ${
          toggle ? 'flex' : 'hidden'
        } flex-col rounded-lg border bg-white p-1`}
      >
        <li className="flex cursor-pointer items-center justify-start p-2 px-6 hover:bg-lightGray w-full mb-4">
          <Link href="/account/profile">
            <div className="flex items-center">
              <FiSettings className="text-darkGray mr-2 text-lg" />
              <p>Profile</p>
            </div>
          </Link>
        </li>
        <li className="flex cursor-pointer items-center justify-start p-2 px-6 hover:bg-lightGray w-full mb-4">
          <Link href="/account/trades">
            <div className="flex items-center">
              <GiArchiveRegister className="text-darkGray mr-2 text-lg" />
              <p>Trades</p>
            </div>
          </Link>
        </li>
        <li className="flex cursor-pointer items-center justify-start p-2 px-6 hover:bg-lightGray w-full mb-4">
          <Link href="/account/offers">
            <div className="flex items-center">
              <MdHistory className="text-darkGray mr-2 text-lg" />
              <p>Offers</p>
            </div>
          </Link>
        </li>
        <li className="flex cursor-pointer items-center justify-start p-2 px-6 w-full hover:bg-lightGray">
          <div
            className="flex items-center"
            onClick={() => {
              setToggle(!toggle);
              mutate();
            }}
          >
            <MdLogout className="text-darkGray mr-2 text-lg" />
            <p>Logout</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UserNavDropDown;
