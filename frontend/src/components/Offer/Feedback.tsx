import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';

const Feedback = ({ order, currency }: any) => {
  const date = new Date(order?.updated_at).toDateString();
  const review = order?.review;

  return (
    <div className="asm:flex-col px-5 py-4 border-b-2 flex hover:shadow-md transition-all ease-in duration-200">
      <div className="flex">
        <div className="mr-5 h-10 w-10 bg-lightGray rounded-full flex justify-center items-center">
          <BsFillPersonFill className="text-lg text-darkGray" />
        </div>
        <div>
          <h1 className="mb-1 text-sm cursor-pointer text-blue-800">
            {order?.username}
          </h1>
          <p className="text-[0.65rem] text-darkGray">{date}</p>
          <div className="text-xs flex mt-3">
            {review?.feedback ? (
              <p className="border flex items-center bg-green-100 rounded self-start p-1 px-2 border-green-200">
                <FiThumbsUp className=" text-green-600 mr-1 text-[0.9rem] font-bold" />
                Positive
              </p>
            ) : (
              <p className="border flex items-center bg-red-100 rounded self-start p-1 px-2 border-red-200">
                <FiThumbsDown className=" text-red-600 mr-1 text-[0.9rem] font-bold" />
                Negative
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex-col ml-20 text-xs asm:ml-0 asm:mt-3">
        <p className="font-bold mb-2">{currency}</p>
        <p>{review?.comment}</p>
      </div>
    </div>
  );
};

export default Feedback;
