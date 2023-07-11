import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Formik, Form } from 'formik';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import SignInUpLeft from 'src/components/User/SignInUpLeft';
import Container from 'src/components/User/Container';
import { LoginSchema, PasswordConfirmSchema } from 'src/utils/forms-schema';
import Input from 'src/components/Input';
import Spinner from 'src/components/Spinner';
import { useFetchUser, useUpadteForgetPassword } from 'src/queries/user';
import { useRouter } from 'next/router';

interface Values {
  password1: string;
  password2: string;
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

const PasswordConfirmation = () => {
  const router = useRouter();
  const { data: user } = useFetchUser();
  const { pathname } = router;
  const { uid, token } = router.query;

  const { mutate, isLoading, isError } = useUpadteForgetPassword(token, uid);
  const onSubmit = (values: Values) => {
    mutate({
      ...values,
      password1: values.password1,
      password2: values.password2,
    });
  };
  if (user) {
    router.push('/');
  }
  return (
    <div className="flex justify-center items-center ">
      <Container type="PasswordConfirm">
        {isError && (
          <div className="w-96 sm:w-full py-5 px-2 text-center bg-red-100 text-red-600 border-t-2 border-red-600 mt-5">
            Invalid credentials
          </div>
        )}
        <Formik
          initialValues={{
            password1: '',
            password2: '',
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={PasswordConfirmSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, values, errors }) => (
            <Form className="flex flex-col justify-start items-center items-stretch w-[25.5rem] sm:w-full sm:text-sm mt-7">
              <label htmlFor="password1" className="mb-2">
                Password
              </label>
              <Input
                value={values.password1}
                onChange={handleChange}
                type="password"
                name="password1"
                id="password1"
                placeholder="password"
                isError={errors.password1}
              />
              {errors.password1 && (
                <p className="text-red-600 mb-2 text-sm">{errors.password1}</p>
              )}

              <label htmlFor="password2" className="mb-2">
                Confirm Password
              </label>
              <Input
                value={values.password2}
                onChange={handleChange}
                type="password"
                name="password2"
                id="password2"
                placeholder="Confirm password"
                isError={errors.password2}
              />
              {errors.password2 && (
                <p className="text-red-600 mb-2 text-sm">{errors.password2}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-7 flex items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-600 py-4 font-poppins text-white `}
              >
                {isLoading ? (
                  <>
                    <Spinner /> <span />{' '}
                  </>
                ) : (
                  <span>Login </span>
                )}
              </button>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default PasswordConfirmation;
