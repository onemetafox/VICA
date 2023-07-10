import Spinner from 'src/components/Spinner';
import Orders from 'src/components/Orders';
import { useFetchUser } from 'src/queries/user';

const OrdersPage = () => {
  const { isLoading, data } = useFetchUser();

  if (isLoading) {
    return (
      <h1 className="w-screen h-screen my-auto mx-auto text-5xl">
        <Spinner /> Loading...
      </h1>
    );
  }
  return <Orders user={data} />;
};

export default OrdersPage;
