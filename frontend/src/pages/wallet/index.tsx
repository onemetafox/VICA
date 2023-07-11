import { useFetchUser } from 'src/queries/user';
import Intro from 'src/components/Wallet/Intro';
import Dashboard from 'src/components/Wallet/Dashboard';
import { useFetchTransactions } from 'src/queries/transactions';

const Wallet = () => {
  const { data, isLoading } = useFetchUser();
  const { data: arbitrageTransactions } = useFetchTransactions();
  const transactionsByDate = arbitrageTransactions?.sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (isLoading) {
    return <h1>Loading ...</h1>;
  }
  if (!data) {
    return <Intro />;
  }
  return <Dashboard user={data} transactions={transactionsByDate} />;
};

export default Wallet;
