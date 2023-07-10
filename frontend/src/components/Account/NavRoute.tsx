import { IconType } from 'react-icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {
  route: string;
  Icon: IconType;
  name: string;
};

const NavRoute = ({ route, Icon, name }: Props) => {
  const router = useRouter();
  return (
    <Link href={route}>
      <div className="flex items-center text-darkGray transition-all ease-in cursor-pointer hover:text-darkBlack mb-5">
        <div
          className={`w-9 h-9 rounded-lg flex justify-center items-center text-xl mr-3 ${
            router.route === route ? 'bg-blue-600 text-white' : 'bg-mediumGray '
          }`}
        >
          <Icon />
        </div>
        <span className={`${router.route === route && 'text-darkBlack'}`}>
          {name}
        </span>
      </div>
    </Link>
  );
};

export default NavRoute;
