import React, { FC, PropsWithChildren, useState, useMemo } from 'react';
import { useFetchUser } from 'src/queries/user';
import { Modal, Button } from 'flowbite-react';
import { useRouter } from 'next/router';

type Props = {
  variant: string;
};
const Card: FC<PropsWithChildren<Props>> = ({ variant, children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { data } = useFetchUser();
  const hasEnoughBalance = useMemo(() => {
    const ethWallet = data?.ethereum_wallet;
    return ethWallet?.active_vica_balance > 10000;
  }, [data]);

  return (
    <>
      <div
        className={`w-[13rem] xl:w-auto asm:w-[15rem] axs:w-auto relative bg-white flex p-9 px-3 flex-col items-center border rounded shadow-md hover:shadow-lg ${
          variant === 'Premium' && 'border-sky-500'
        }`}
      >
        {/*  {variant === 'Premium' && (
<div className="absolute top-0 text-white bg-sky-500 text-[0.7rem] p-1 px-3">
BEST CHOICE
</div>
)} */}
        <h1 className=" text-lg">{variant}</h1>
        {/* <h1 className="text-xl font-bold my-5">10K ViCA</h1>
        <button
          type="button"
          className="text-white text-xs rounded my-5 mb-10 py-2 px-4 bg-blue-700 hover:bg-blue-600 transition-all"
          onClick={() => setShowModal(true)}
        >
          Choose
        </button> */}
        <p className="text-[0.7rem] text-center">{children}</p>
      </div>
      {/*
      <Modal
        show={showModal}
        size="md"
        popup
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {hasEnoughBalance
                ? 'You will be redirected to Arbitrage page'
                : "You don't have enough VICA balance (balance below 10K), please top up your wallet!"}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color={hasEnoughBalance ? 'success' : 'failure'}
                onClick={() => onSubscribe()}
              >
                {hasEnoughBalance ? 'Confirm' : 'Go to Wallet'}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
              */}
    </>
  );
};

export default Card;
