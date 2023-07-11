import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Formik, Form } from 'formik';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import SignInUpLeft from 'src/components/User/SignInUpLeft';
import { ResetPassword } from 'src/utils/forms-schema';
import Input from 'src/components/Input';
import Spinner from 'src/components/Spinner';
import { useFetchUser, useResetPassword } from 'src/queries/user';
import { useRouter } from 'next/router';

interface Values {
  email: string;
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['user'], () => null);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const PasswordReset = () => {
  const router = useRouter();
  const { mutate, isLoading, isError } = useResetPassword();
  const { data: user } = useFetchUser();

  const onSubmit = (values: Values) => {
    mutate(values);
  };
  if (user) {
    router.push('/');
  }

  return (
    <div className="w-full h-screen flex ">
      <SignInUpLeft />
      <div className="font-poppins w-[66%] py-6 flex flex-col justify-center items-center lg:w-full sm:text-sm sm:w-full sm:px-2">
        <h1 className="text-2xl text-center">Forgot your password ?</h1>
        <p className="w-96 text-center text-sm mt-3 sm:w-full">
          Enter the email address associated with your account. We will send you
          a password recovery link to reset your password.
        </p>
        {isError && (
          <div className="w-96 sm:w-full py-5 px-2 text-center bg-red-100 text-red-600 border-t-2 border-red-600 mt-5">
            Email is not registered
          </div>
        )}
        <Formik
          initialValues={{
            email: '',
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={ResetPassword}
          onSubmit={onSubmit}
        >
          {({ handleChange, values, errors }) => (
            <Form className="flex flex-col justify-start items-stretch w-[25.5rem] sm:w-full sm:text-sm mt-7">
              <label htmlFor="email" className="mb-2">
                Email
              </label>
              <Input
                value={values.email}
                onChange={handleChange}
                id="email"
                name="email"
                placeholder="john@mail.com"
                type="email"
                autoComplete="username"
                isError={errors.email}
              />
              {errors.email && (
                <p className="text-red-600 mb-2 text-sm">{errors.email}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-7 flex items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-600 py-4 font-poppins text-white `}
              >
                {isLoading ? (
                  <>
                    <Spinner /> <span>Loading...</span>{' '}
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </button>
            </Form>
          )}
        </Formik>
        <Link href="/login">
          <span className="text-darkGray cursor-pointer mt-5 text-sm text-center">
            Go back
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PasswordReset;
