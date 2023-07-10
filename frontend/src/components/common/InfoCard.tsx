import { MouseEventHandler, ReactNode } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { IoCloseSharp } from 'react-icons/io5';

type CardProps = {
  onCloseCard: MouseEventHandler<SVGElement>;
  children: ReactNode;
};

const InfoCard = ({ onCloseCard, children }: CardProps) => {
  return (
    <div className="flex items-center border border-orange-200 rounded bg-orange-50 p-3 py-4">
      <BsInfoCircle className="text-orange-500 mr-3 text-4xl font-bold w-[3%] ed:hidden" />
      <p className="text-[0.75rem] w-[90%] mx-3">{children}</p>
      <IoCloseSharp
        className="cursor-pointer self-start text-5xl -translate-y-4 ml-3 w-[3%] ed:w-[7%] ed:ml-0"
        onClick={onCloseCard}
      />
    </div>
  );
};

export default InfoCard;
