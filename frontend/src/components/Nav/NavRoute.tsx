import React, { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {
  route: string;
};

const NavRoute: FC<PropsWithChildren<Props>> = ({ route, children }) => {
  const router = useRouter();
  return (
    <Link href={route}>
      <span
        className={`text-[1rem] transition-all ease-in mx-7 cursor-pointer hover:text-blue-600 hover:underline ${
          router.route === route && 'text-blue-600 underline'
        }`}
      >
        {children}
      </span>
    </Link>
  );
};

export default NavRoute;
