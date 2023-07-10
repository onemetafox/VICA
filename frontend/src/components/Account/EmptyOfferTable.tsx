import Link from 'next/link';
import { MdOutlineManageSearch } from 'react-icons/md';

const EmptyOfferTable = () => {
  return (
    <div className="border rounded-lg flex flex-col items-center justify-center py-9 w-full bg-white">
      <div className="flex flex-col items-center justify-center">
        <MdOutlineManageSearch className="text-4xl" />
        <h1 className=" my-3 text-darkGray">No offers found</h1>
        <Link href="/create-an-offer">
          <div className="p-2 border-[1px] rounded border-blue-600 cursor-pointer hover:bg-slate-50 transition-colors ease-in">
            Create an offer
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EmptyOfferTable;
