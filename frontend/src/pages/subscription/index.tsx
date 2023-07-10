import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import Container from 'src/components/common/Container';
import Card from 'src/components/Subscription/Card';
import { useFetchUser } from 'src/queries/user';
import { Modal, Button } from 'flowbite-react';
import { useCreateArbitrage } from 'src/queries/transactions';

const Subscription = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { data } = useFetchUser();
  const hasEnoughBalance = useMemo(() => {
    const ethWallet = data?.ethereum_wallet;
    return ethWallet?.active_vica_balance > 1000;
  }, [data]);
  const { mutate: Arbitrage } = useCreateArbitrage();
  const onSubscribe = () => {
    Arbitrage();
    router.push(hasEnoughBalance ? '/arbitrage' : '/wallet');
  };

  return (
    <Container>
      <div className="flex flex-col">
        <h1 className=" font-extrabold text-[3.5rem] lg:text-4xl asm:text-3xl asm:tex-center mb-16 ">
          Subscribe Now and Start Earning <br className="md:hidden" />{' '}
          <span className="text-clip animate-flipVertical">
            {' '}
            ONLY 10 000 VICA{' '}
          </span>
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <div className=" grid grid-cols-5 grid-rows-1 gap-8 lg:gap-5 lg:grid-rows-auto lg:grid-cols-2 asm:grid-cols-1">
          <Card variant="1 months">
            <br className="md:hidden" />
            Revenue up to{' '}
            <strong className="font-extrabold text-[1rem] lg:text-4xl">
              5 %
            </strong>{' '}
            for subscription period less than 3 months
          </Card>
          <Card variant="3 months">
            <br className="md:hidden" />
            Revenue up to{' '}
            <strong className="font-extrabold text-[1rem] lg:text-4xl">
              12 %
            </strong>{' '}
            for subscription period between 3 and 6 months
          </Card>
          <Card variant="6 months">
            <br className="md:hidden" />
            Revenue up to{' '}
            <strong className="font-extrabold text-[1rem] lg:text-4xl">
              27 %
            </strong>{' '}
            for subscription period between 6 and 9 months
          </Card>
          <Card variant="9 months">
            <br className="md:hidden" />
            Revenue up to{' '}
            <strong className="font-extrabold text-[1rem] lg:text-4xl">
              40 %
            </strong>{' '}
            for subscription period between 9 and 12 months
          </Card>
          <Card variant="12 months">
            <br className="md:hidden" />
            Revenue up to{' '}
            <strong className="font-extrabold text-[1rem] lg:text-4xl">
              60 %
            </strong>{' '}
            for subscription period more than 12 months
          </Card>
        </div>
        <button
          type="button"
          className="text-white w-36 h-12 space-y-30 mt-20 text-xs rounded my-5 mb-10 py-2 px-4 bg-blue-700 hover:bg-blue-600 animate-heartBeat "
          onClick={() => setShowModal(true)}
        >
          Subscribe Now
        </button>
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
                  ? `You Have ${data?.ethereum_wallet?.active_vica_balance} VICA in your wallet \n you will pay 10 000 VICA to Acces this Service `
                  : "You don't have enough VICA balance (balance below 10K), please top up your wallet!"}
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color={hasEnoughBalance ? 'success' : 'failure'}
                  onClick={() => onSubscribe()}
                >
                  {hasEnoughBalance ? 'Pay Now' : 'Go to Wallet'}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <h2 className="text-lg font-bold mt-16 mb-5 ">
          About ViCA arbitrage service{' '}
        </h2>
        <p className="text-justify w-[90%] text-sm leading-7 text-darkGray">
          10,000 ViCA required to participate in the service. You are required
          to deposit ETH or USDT or both. ViBot will automatically transfer the
          amount into an equal ratio of ETH and USDT to be used for arbitrage on
          both exchanges, Upbit and Binance. For example, if you deposit 1000
          USDT, Vibot will split it into 500 USDT and $500 USD worth of ETH.
          Every week, you will get an update on the weekly revenue generated by
          arbitrage. You can withdraw profits at any time. Moreover, you can
          withdraw your deposit at any time but you should allow for 5 business
          days to complete the withdrawal. The arbitrage system is safe and
          generates steady revenue. With more than 15 months of continuous
          growth, the system has become very effective and reliable. You can
          watch the arbitrage trades being performed on live video by following
          this link.
        </p>
        <table className="bg-white border-collapse divide-y border-1 shadow rounded-lg w-[45%] mt-9 ed:w-full">
          <thead className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 font-bold text-sm text-center sm:px-2">
                Subscription Period
              </td>
              <td className="px-6 py-4 font-bold text-sm text-center sm:px-2">
                Revenue Rewards
              </td>
              <td className="px-6 py-4 font-bold text-sm text-center sm:px-2">
                Expected Return
              </td>
            </tr>
          </thead>
          <tbody>
            <SpanRow period="1" expectedReturn="0.10" revenue="5" span={2} />
            <NormalRow period="2" expectedReturn="0.20" />
            <SpanRow period="3" expectedReturn="0.73" revenue="12" span={3} />
            <NormalRow period="4" expectedReturn="0.99" />
            <NormalRow period="5" expectedReturn="1.25" />
            <SpanRow period="6" expectedReturn="3.41" revenue="27" span={3} />
            <NormalRow period="7" expectedReturn="4.01" />
            <NormalRow period="8" expectedReturn="4.63" />
            <SpanRow period="9" expectedReturn="7.80" revenue="40" span={3} />
            <NormalRow period="10" expectedReturn="8.76" />
            <NormalRow period="11" expectedReturn="9.73" />
            <SpanRow
              period="12"
              expectedReturn="16.96"
              revenue="60"
              span={25}
            />
            {/*
            <NormalRow period="13" expectedReturn="17.62" />
            <NormalRow period="14" expectedReturn="19.17" />
            <NormalRow period="15" expectedReturn="20.75" />
            <NormalRow period="16" expectedReturn="22.37" />
            <NormalRow period="17" expectedReturn="24.01" />
            <NormalRow period="18" expectedReturn="25.69" />
            <NormalRow period="19" expectedReturn="27.41" />
            <NormalRow period="20" expectedReturn="29.16" />
            <NormalRow period="21" expectedReturn="30.94" />
            <NormalRow period="22" expectedReturn="32.76" />
            <NormalRow period="23" expectedReturn="34.61" />
            <NormalRow period="24" expectedReturn="36.51" />
            <NormalRow period="25" expectedReturn="38.44" />
            <NormalRow period="26" expectedReturn="40.41" />
            <NormalRow period="27" expectedReturn="42.41" />
            <NormalRow period="28" expectedReturn="44.46" />
            <NormalRow period="29" expectedReturn="46.55" />
            <NormalRow period="30" expectedReturn="48.68" />
            <NormalRow period="31" expectedReturn="50.86" />
            <NormalRow period="32" expectedReturn="53.07" />
            <NormalRow period="33" expectedReturn="55.33" />
            <NormalRow period="34" expectedReturn="47.64" />
            <NormalRow period="35" expectedReturn="59.99" />
            <NormalRow period="36" expectedReturn="62.39" />
            */}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

type NormalRowProps = {
  period: string;
  expectedReturn: string;
};
type SpanRowProps = {
  period: string;
  expectedReturn: string;
  revenue: string;
  span: number;
};
const NormalRow = ({ period, expectedReturn }: NormalRowProps) => (
  <tr className="border-b">
    <td className="px-6 py-4 text-sm sm:text-xs">{period}</td>
    <td className="px-6 py-4 text-sm sm:text-xs">{expectedReturn} %</td>
  </tr>
);

const SpanRow = ({ period, revenue, expectedReturn, span }: SpanRowProps) => (
  <tr className="border-b">
    <td className="px-6 py-4 text-sm sm:text-xs">{period}</td>
    <td
      className="px-6 py-4 text-sm border-l border-r text-center"
      rowSpan={span}
    >
      {revenue} %
    </td>
    <td className="px-6 py-4 text-sm sm:text-xs">{expectedReturn} %</td>
  </tr>
);
export default Subscription;
