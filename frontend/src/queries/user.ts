import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AuthService from 'src/services/AuthService';

type FetchData = {
  [x: string]: any;
};

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation((dt: FetchData) => AuthService.login(dt), {
    onSuccess: (data: FetchData) => {
      if (data?.key) {
        localStorage.setItem('Session', data.key);
        router.push('/');
      }
    },
  });

  return mutation;
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(() => AuthService.logout(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      router.push('/');
    },
  });

  return mutation;
};

export const useRegisterUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation((dt: FetchData) => AuthService.register(dt), {
    onSuccess: (data) => {
      if (data?.key) {
        localStorage.setItem('Session', data.key);
        router.push('/email-sent');
      }
      queryClient.invalidateQueries(['user']);
    },
  });

  return mutation;
};

export const useResetPassword = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: FetchData) => AuthService.resetPassword(dt),
    {
      onSuccess: () => {
        localStorage.removeItem('Session');
        queryClient.invalidateQueries(['user']);
        router.push('/login');
      },
      onError: (error: any) => {
        toast.error(error.non_field_errors[0]);
      },
    }
  );

  return mutation;
};

export const useUpdateImage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: FetchData) => AuthService.updateUserImage(dt),
    {
      onSuccess: () => {
        toast.success('Image changed successfully !');
        // router.push('/account/profile');
      },
      onError: (error: any) => {
        toast.error('Something went wrong , please try later !');
      },
    }
  );

  return mutation;
};

export const useUserInfos = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: FetchData) => AuthService.updateUserInfos(dt),
    {
      onSuccess: () => {
        toast.success('Profile updated !');
        router.push('/account/profile');
      },
      onError: (error: any) => {
        toast.error('Something went wrong , please try later !');
      },
    }
  );

  return mutation;
};

export const useChangePassword = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (dt: FetchData) => AuthService.changePassword(dt),
    {
      onSuccess: () => {
        localStorage.removeItem('Session');
        queryClient.invalidateQueries(['user']);
        toast.success('Password changed successfully !');
        router.push('/login');
      },
      onError: (error: any) => {
        toast.error(error.non_field_errors[0]);
      },
    }
  );

  return mutation;
};
export const useFetchUser = () => {
  const result = useQuery(['user'], () => AuthService.user(), {
    initialData: null,
    refetchOnWindowFocus: false,
  });
  return result;
};
