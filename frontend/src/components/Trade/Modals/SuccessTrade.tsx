import { useRouter } from 'next/router';
import Popup from 'reactjs-popup';
import { BsCheckLg } from 'react-icons/bs';

type Props = {
  isOpen: boolean;
  onClose:
    | ((
        event?:
          | KeyboardEvent
          | TouchEvent
          | MouseEvent
          | React.SyntheticEvent<Element, Event>
          | undefined
      ) => void)
    | undefined;
};

const SuccessTrade = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  if (isOpen && onClose) {
    setTimeout(() => {
      onClose();
      router.push('/wallet');
    }, 3000);
  }
  return (
    <Popup position="center center" open={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-center items-center h-full w-full font-poppins my-8">
        <div className="text-4xl border-4 border-green-600 rounded-full p-4 mb-6">
          <BsCheckLg className="text-green-600" />
        </div>
        <h1 className="text-xl">Your trade has been successful !</h1>
      </div>
    </Popup>
  );
};

export default SuccessTrade;
