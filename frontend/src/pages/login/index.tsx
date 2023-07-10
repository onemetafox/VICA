import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Formik, Form } from 'formik';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import SignInUpLeft from 'src/components/User/SignInUpLeft';
import Container from 'src/components/User/Container';
import { LoginSchema } from 'src/utils/forms-schema';
import Input from 'src/components/Input';
import Spinner from 'src/components/Spinner';
import { useFetchUser, useLogin } from 'src/queries/user';
import { useRouter } from 'next/router';

interface Values {
  email: string;
  password: string;
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

const Login = () => {
  const router = useRouter();
  const { mutate, isLoading, isError } = useLogin();
  const { data: user } = useFetchUser();

  const onSubmit = (values: Values) => {
    mutate({ ...values, username: values.email });
  };
  if (user) {
    router.push('/');
  }
  return (
    <div className="w-full h-screen flex ">
      <SignInUpLeft />
      <Container type="login">
        {isError && (
          <div className="w-96 sm:w-full py-5 px-2 text-center bg-red-100 text-red-600 border-t-2 border-red-600 mt-5">
            Invalid credentials
          </div>
        )}
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={LoginSchema}
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
                placeholder="john@acme.com"
                type="email"
                autoComplete="username"
                isError={errors.email}
              />
              {errors.email && (
                <p className="text-red-600 mb-2 text-sm">{errors.email}</p>
              )}
              <label htmlFor="password" className="mb-2">
                Password
              </label>
              <Input
                value={values.password}
                onChange={handleChange}
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                isError={errors.password}
              />
              {errors.password && (
                <p className="text-red-600 mb-2 text-sm">{errors.password}</p>
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
                  <span>Login</span>
                )}
              </button>
            </Form>
          )}
        </Formik>
        <Link href="/password-reset">
          <span className="text-blue-600 hover:text-blue-400 text-center text-sm mt-5 cursor-pointer">
            Forgot your password ?
          </span>
        </Link>
      </Container>
    </div>
  );
};

export default Login;
