import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GiHamburgerMenu } from 'react-icons/gi';
import logo from 'public/logo.png';
import UserNavActions from './UserNavActions';
import MobileNav from './MobileNav';
import NavRoutes from './NavRoutes';

const Nav = () => {
  const refCount = useRef(0);
  const [showModal, setShowModal] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  return (
    <>
      <nav className="font-poppins flex h-20 w-full items-center justify-between bg-white px-20 lg:px-16 asm:px-3 border-b-[1px] border-[#EAECEF]">
        <Link href="/">
          <div className="flex cursor-pointer items-center">
            <Image src={logo} width={50} height={50} alt="logo-viCA" />
            <h1 className="ml-3 font-poppinsLarge text-xl font-black">ViCA</h1>
          </div>
        </Link>
        <NavRoutes />
        <UserNavActions />
        <GiHamburgerMenu
          className="hidden h-7 w-7 lg:block lg:cursor-pointer"
          onClick={() => {
            refCount.current++;
            setShowModal(true);
            setHidden(false);
          }}
        />
      </nav>
      <MobileNav
        modalState={[showModal, setShowModal]}
        hiddenState={[hidden, setHidden]}
        refCount={refCount}
      />
    </>
  );
};

export default Nav;
