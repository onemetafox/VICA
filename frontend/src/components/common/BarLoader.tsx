import React from 'react';

type Props = {
  width: string;
};

const BarLoader = ({ width }: Props) => {
  return (
    <div className={`flex-grow-0 ${width} animate-pulse lg:hidden`}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-200 rounded col-span-2" />
          <div className="h-2 bg-slate-200 rounded col-span-1" />
        </div>
        <div className="h-2 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export default BarLoader;
