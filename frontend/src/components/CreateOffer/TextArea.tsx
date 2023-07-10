import { ChangeEvent } from 'react';
import { useDropDown } from 'src/hooks/useDropDown';

type Props = {
  placeholder?: string;
  type?: string;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
};

const TextArea = ({
  type,
  state,
  placeholder = 'Type ...',
  setState,
}: Props) => {
  const { toggle, setToggle, dropDownRef } = useDropDown();
  return (
    <div
      className="group w-full"
      ref={dropDownRef}
      onClick={() => setToggle(true)}
    >
      <textarea
        className={` w-full border p-3 rounded h-36  ${
          toggle ? ' border-blue-600' : 'group-hover:border-darkGray'
        } focus:outline-none sm:w-full h-full `}
        placeholder={placeholder}
        value={state}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setState(e.target.value);
        }}
      />
    </div>
  );
};

export default TextArea;
