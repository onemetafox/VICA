import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import AuthService from 'src/services/AuthService';

type CreateOrderData = {
  [x: string]: any;
};

export const useFetchOrders = () => {
  const result = useQuery(['orders'], () => AuthService.getOrders(), {
    initialData: null,
    refetchOnWindowFocus: false,
  });
  return result;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: CreateOrderData) => AuthService.createOrder(dt),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Order created successfully !');
      },
      onError: (error: any) => {
        if (typeof error?.non_field_errors[0] === 'string') {
          toast.error(error?.non_field_errors[0]);
        } else if (typeof error?.offer[0] === 'string') {
          toast.error(error?.offer[0]);
        } else {
          toast.error('Error: something went wrong');
        }
      },
    }
  );
  return mutation;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: CreateOrderData) => AuthService.sendMessage(dt),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        // toast.success('Order created successfully !');
      },
      onError: (error: any) => {
        if (typeof error?.non_field_errors[0] === 'string') {
          toast.error(error?.non_field_errors[0]);
        } else if (typeof error?.offer[0] === 'string') {
          toast.error(error?.offer[0]);
        } else {
          toast.error('Error: something went wrong');
        }
      },
    }
  );
  return mutation;
};

export const useSendFeedback = (orderId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: CreateOrderData) => AuthService.sendFeedback(dt, orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Thanks for your feedback !');
      },
      onError: (error: any) => {
        toast.error('You have already submitted a review !');
        if (typeof error?.non_field_errors[0] === 'string') {
          toast.error(error?.non_field_errors[0]);
        } else if (typeof error?.offer[0] === 'string') {
          toast.error(error?.offer[0]);
        } else {
          toast.error('Error: something went wrong');
        }
      },
    }
  );
  return mutation;
};

export const useUserConfirmOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (orderId: string) => AuthService.userConfirmOrder(orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Payment confirmed successfully !');
        // router.push('/wallet');
      },
      onError: (error: any) => {
        if (typeof error?.non_field_errors[0] === 'string') {
          toast.error(error?.non_field_errors[0]);
        } else if (typeof error?.offer[0] === 'string') {
          toast.error(error?.offer[0]);
        } else {
          toast.error('Error: something went wrong');
        }
        // router.push('/wallet');
      },
    }
  );
  return mutation;
};

export const useOwnerConfirmOrder = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (orderId: string) => AuthService.ownerConfirmOrder(orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Order confirmed successfully !');
        // router.push('/wallet');
      },
      onError: (error: any) => {
        if (typeof error?.non_field_errors[0] === 'string') {
          toast.error(error?.non_field_errors[0]);
        } else if (typeof error?.offer[0] === 'string') {
          toast.error(error?.offer[0]);
        } else {
          toast.error('Error: something went wrong');
        }
        // router.push('/wallet');
      },
    }
  );
  return mutation;
};
