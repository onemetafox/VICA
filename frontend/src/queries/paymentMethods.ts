import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthService from 'src/services/AuthService';

type CreateOfferData = {
  [x: string]: any;
};

export const useFetchPaymentMethods = () => {
  const result = useQuery(
    ['paymentMethods'],
    () => AuthService.paymentMethods(),
    {
      initialData: null,
      refetchOnWindowFocus: false,
    }
  );
  return result;
};
export const useFetchUserPaymentMethods = () => {
  const result = useQuery(
    ['user-payment-methods'],
    () => AuthService.getUserPaymentMethod(),
    {
      initialData: null,
      refetchOnWindowFocus: false,
    }
  );
  return result;
};

export const useCreateUserPaymentMethod = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: CreateOfferData) => AuthService.createUserPaymentMethod(dt),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['user-payment-method']);
        toast.success(
          'User payment method method has been created successfully !'
        );
      },
      onError: (error: any) => {
        if (typeof error?.non_field_errors[0] === 'string') {
          toast.error(error?.non_field_errors[0]);
        } else {
          toast.error('Error: something went wrong');
        }
      },
    }
  );
  return mutation;
};
