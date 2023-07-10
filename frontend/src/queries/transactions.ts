import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthService from 'src/services/AuthService';

export const useWithdrawBtc = () => {
  const mutation = useMutation(
    (dt: { recipient_address: string; amount: number }) =>
      AuthService.createBtcTransaction(dt),
    {
      onSuccess: (data) => {
        toast.success('Withdrawal successful !');
      },
      onError: (error: any) => {
        toast.error('something wrong happened !');
      },
    }
  );
  return mutation;
};

export const useWithdrawEth = () => {
  const mutation = useMutation(
    (dt: {
      recipient_address: string;
      amount: number;
      currency_type: string;
    }) => AuthService.createEthTransaction(dt),
    {
      onSuccess: (data) => {
        toast.success('Withdrawal successful !');
      },
      onError: (error: any) => {
        toast.error('something wrong happened ! Please Try Later');
      },
    }
  );
  return mutation;
};

export const useFetchTransactions = () => {
  const result = useQuery(
    ['transactions'],
    () => AuthService.getUserTransactions(),
    {
      initialData: null,
    }
  );
  return result;
};

export const useFetchArbitrageTransactions = () => {
  const result = useQuery(
    ['arbitrage-transactions'],
    () => AuthService.getArbitrageTransactions(),
    {
      initialData: null,
    }
  );
  return result;
};

export const useArbitrageTransaction = () => {
  const mutation = useMutation(
    (dt: { amount: number; currency: string }) =>
      AuthService.createArbitrageTransaction(dt),
    {
      onSuccess: (data) => {
        toast.success('Transfer successful !');
      },
      onError: (error: any) => {
        toast.error(error.non_field_errors[0]);
      },
    }
  );
  return mutation;
};

// @dev Create arbitrage Subscription
export const useCreateArbitrage = () => {
  const mutation = useMutation(() => AuthService.subscribeArbitrage(), {
    onSuccess: (data) => {
      toast.success('You can use now the Arbitage service ');
    },
    onError: (error: any) => {
      toast.error(error.non_field_errors[0]);
    },
  });
  return mutation;
};

// @dev Arbitrage Request withdraw
export const useReqWithdraw = () => {
  const mutation = useMutation(
    (transactionId: string) => AuthService.requestWithdraw(transactionId),
    {
      onSuccess: (data) => {
        toast.success('You request has been Sent ! ');
      },
      onError: (error: any) => {
        toast.error(error.non_field_errors[0]);
      },
    }
  );
  return mutation;
};
