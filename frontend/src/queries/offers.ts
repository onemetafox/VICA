import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import AuthService from 'src/services/AuthService';

type CreateOfferData = {
  [x: string]: any;
};

export const useFetchOffers = () => {
  const result = useQuery(['offers'], () => AuthService.offers(), {
    initialData: null,
  });
  return result;
};

export const useFetchMyOffers = () => {
  const result = useQuery(['my-offers'], () => AuthService.getUserOffers(), {
    initialData: null,
  });
  return result;
};

export const useFetchOfferOrders = (id: any) => {
  const result = useQuery(
    ['orders', id],
    () => AuthService.getUserOfferOrders(id),
    {
      initialData: null,
      refetchOnWindowFocus: false,
    }
  );
  return result;
};

export const useCreateOffer = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: CreateOfferData) => AuthService.createOffer(dt),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['offers']);
        toast.success('Offer has been created successfully !');
        router.push('/account/offers');
      },
      onError: (error: any) => {
        if (typeof error?.non_field_errors[0] === 'string') {
          toast.error(error?.non_field_errors[0]);
        } else {
          toast.error('Error: something went wrong');
        }
        router.push('/wallet');
      },
    }
  );
  return mutation;
};

export const useCloseOffer = () => {
  // const router = useRouter();
  const mutation = useMutation(
    (orderId: string) => AuthService.closeOffre(orderId),
    {
      onSuccess: (data) => {
        console.log(data);

        toast.success('Offer has been Deleted successfully !');
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
