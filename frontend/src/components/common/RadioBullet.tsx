import React from 'react';

type Props = {
  isActive: boolean;
};

const RadioBullet = ({ isActive }: Props) => {
  return (
    <div
      className={`h-5 w-5 border transition-all ease-in border-darkGray flex items-center justify-center rounded-full mr-2 ${
        isActive ? 'bg-blue-600' : 'bg-white'
      }`}
    >
      <div
        className={`h-2 w-2 rounded-full transition-all ease-in ${
          isActive ? 'bg-white' : 'bg-white group-hover:bg-blue-300'
        } `}
      />
    </div>
  );
};

export default RadioBullet;
