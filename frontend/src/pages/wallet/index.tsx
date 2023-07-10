import { useFetchUser } from 'src/queries/user';
import Intro from 'src/components/Wallet/Intro';
import Dashboard from 'src/components/Wallet/Dashboard';
import { useFetchArbitrageTransactions } from 'src/queries/transactions';

const Wallet = () => {
  const { data, isLoading } = useFetchUser();
  const { data: arbitrageTransactions } = useFetchArbitrageTransactions();
  const transactionsByDate = arbitrageTransactions?.sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
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
