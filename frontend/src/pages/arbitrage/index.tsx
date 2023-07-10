import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useFetchUser } from 'src/queries/user';
import Intro from 'src/components/Wallet/Intro';
import Dashboard from 'src/components/arbitrage/Dashboard';
import { useFetchArbitrageTransactions } from 'src/queries/transactions';
import { useRouter } from 'next/router';

export const getStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['user'], () => null);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Arbitrage = () => {
  const { data } = useFetchUser();
  const { data: arbitrageTransactions } = useFetchArbitrageTransactions();
  const router = useRouter();

  if (!data) {
    return <Intro />;
  }

  if (!data?.has_active_arbitrage_account) {
    router.push('/subscription');
    return;
  }
  return <Dashboard user={data} transactions={arbitrageTransactions} />;
};

export default Arbitrage;
