import { MdHistory } from 'react-icons/md';
import { AiTwotoneSetting } from 'react-icons/ai';
import { GiArchiveRegister } from 'react-icons/gi';
import NavRoute from './NavRoute';

const Menu = () => {
  return (
    <aside className="flex flex-col xl:hidden">
      <NavRoute
        route="/account/profile"
        Icon={AiTwotoneSetting}
        name="Profile Settings"
      />
      <NavRoute route="/account/offers" Icon={MdHistory} name="Offers" />
      <NavRoute
        route="/account/trades"
        Icon={GiArchiveRegister}
        name="Trades"
      />
    </aside>
  );
};

export default Menu;
