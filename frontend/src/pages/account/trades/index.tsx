import Spinner from 'src/components/Spinner';
import { useFetchOrders } from 'src/queries/trades';
import Trades from 'src/components/Account/Trades';

const TradePage = () => {
  const { isLoading, data } = useFetchOrders();

  if (isLoading) {
    return (
      <h1 className="w-screen h-screen my-auto mx-auto text-5xl">
        <Spinner /> Loading...
      </h1>
    );
  }
  return <Trades trades={data} />;
};

export default TradePage;
