import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Field, Form } from 'formik';
import SignInUpLeft from 'src/components/User/SignInUpLeft';
import Container from 'src/components/User/Container';
import { RegisterSchema } from 'src/utils/forms-schema';
import Input from 'src/components/Input';
import { countries } from 'src/utils/countries';
import Spinner from 'src/components/Spinner';
import { useFetchUser, useRegisterUser } from 'src/queries/user';
import { useGeoLocation } from 'src/hooks/useGeolocation';

interface Values {
  email: string;
  first_name: string;
  last_name: string;
  dial_code: string;
  phone_number: string;
  country: string;
  city: string;
  password1: string;
  password2: string;
  toggle: boolean;
}

const Register = () => {
  const { country: locationCountry, loading: locationLoading } =
    useGeoLocation();
  const router = useRouter();
  const { data: user } = useFetchUser();

  const { data, mutate, isLoading, isSuccess, isError, error } =
    useRegisterUser();
  let country = 'MA';
  let dial_code = '+1';
  const disabledButton = isLoading || isSuccess;
  const onSubmit = (values: Values) => {
    mutate({ ...values, phone_number: values.dial_code + values.phone_number });
  };
  if (locationLoading) {
    return <h1>Loading ...</h1>;
  }
  if (locationCountry) {
    country = locationCountry;
    console.log(country);

    dial_code = countries?.filter(
      (ctry: { name: string; dial_code: string; code: string }) =>
        ctry.code === country
    )[0].dial_code;

    console.log(dial_code);
  }
  if (user) {
    router.push('/');
  }

  return (
    <div className="w-full flex items-stretch">
      <SignInUpLeft />
      <Container type="register">
        {isError && (error as { [x: string]: any })?.email && (
          <div className="w-96 sm:w-full py-5 px-2 text-center bg-red-100 text-red-600 border-t-2 border-red-600 mt-5">
            A user is already registered with this e-mail address.
          </div>
        )}
        <Formik
          initialValues={{
            email: '',
            first_name: '',
            last_name: '',
            dial_code,
            phone_number: '',
            country,
            city: '',
            password1: '',
            password2: '',
            toggle: false,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={RegisterSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, values, errors }) => (
            <Form className="flex flex-col justify-start items-stretch w-[25.5rem] sm:w-full sm:text-sm mt-7">
              <label htmlFor="first_name" className="mb-2 text-lightBlack">
                Name
              </label>
              <div className="flex justify-between w-full">
                <div className="flex flex-col w-1/2">
                  <Input
                    value={values.first_name}
                    onChange={handleChange}
                    name="first_name"
                    id="first_name"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    isError={errors.first_name}
                  />
                  {errors.first_name && (
                    <p className="text-red-600 mb-2 ">{errors.first_name}</p>
                  )}
                </div>
                <div className="flex flex-col flex-grow pl-3 w-1/2">
                  <Input
                    value={values.last_name}
                    onChange={handleChange}
                    name="last_name"
                    id="last_name"
                    placeholder="Last name"
                    type="text"
                    autoComplete="family-name"
                    isError={errors.last_name}
                  />
                  {errors.last_name && (
                    <p className="text-red-600 mb-2 ">{errors.last_name}</p>
                  )}
                </div>
              </div>
              <label htmlFor="email" className="my-1 text-lightBlack ">
                Email
              </label>
              <Input
                value={values.email}
                onChange={handleChange}
                name="email"
                id="email"
                placeholder="john@acme.com"
                type="email"
                autoComplete="username"
                isError={errors.email}
              />
              {errors.email && (
                <p className="text-red-600 mb-2 ">{errors.email}</p>
              )}

              <label htmlFor="country" className="my-1 text-lightBlack ">
                Location
              </label>
              <div className="flex justify-between w-full sm:flex-col">
                <select
                  value={values.country}
                  onChange={handleChange}
                  name="country"
                  id="country"
                  autoComplete="country"
                  className="bg-white w-1/2 sm:w-full truncate  border rounded p-3 active:border-blue-500 focus:border-blue-500 focus:outline-none mb-2"
                >
                  {countries.map((ctry) => (
                    <option key={ctry.code} value={ctry.code}>
                      {ctry.name}
                    </option>
                  ))}
                </select>

                {errors.country && (
                  <p className="text-red-600 mb-2 ">{errors.country}</p>
                )}
                <Input
                  value={values.city}
                  onChange={handleChange}
                  name="city"
                  id="city"
                  type="text"
                  placeholder="City"
                  autoComplete="street-address"
                  className="ml-3 flex-grow sm:ml-0"
                  isError={errors.city}
                />
              </div>
              {errors.city && (
                <p className="text-red-600 mb-2 ">{errors.city}</p>
              )}
              <label htmlFor="phone_number" className="my-1 text-lightBlack ">
                Phone number
              </label>
              <div className="flex justify-between items-stretch w-full sm:flex-col">
                <select
                  value={values.dial_code}
                  onChange={handleChange}
                  name="dial_code"
                  id="dial_code"
                  autoComplete="tel-country-code"
                  className="bg-white w-1/2 sm:w-full truncate  border rounded p-3 active:border-blue-500 focus:border-blue-500 focus:outline-none mb-2"
                >
                  {countries.map((ctry) => (
                    <option key={ctry.code} value={ctry.dial_code}>
                      {ctry.dial_code} {ctry.code}
                    </option>
                  ))}
                </select>

                <div className=" ml-3 sm:ml-0 flex flex-col w-full">
                  <Input
                    value={values.phone_number}
                    onChange={handleChange}
                    name="phone_number"
                    id="phone_number"
                    type="text"
                    autoComplete="tel-national"
                    className="flex-grow p-3"
                    placeholder="XXXXXXX"
                    isError={errors.phone_number}
                  />
                </div>
              </div>
              {errors.phone_number && (
                <p className="text-red-600 mb-2 ">{errors.phone_number}</p>
              )}
              <label htmlFor="password1" className="my-1 text-lightBlack ">
                Password
              </label>

              <div className="flex flex-col">
                <Input
                  value={values.password1}
                  onChange={handleChange}
                  type="password"
                  name="password1"
                  id="password1"
                  placeholder="New password"
                  autoComplete="new-password"
                  isError={errors.password1}
                />
                {errors.password1 && (
                  <p className="text-red-600 mb-2  text-justify">
                    {errors.password1}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Input
                  value={values.password2}
                  onChange={handleChange}
                  type="password"
                  name="password2"
                  id="password2"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  isError={errors.password2}
                />
                {errors.password2 && (
                  <p className="text-red-600 mb-2  text-justify">
                    {errors.password2}
                  </p>
                )}
              </div>

              <div className="flex justify-start items-start leading-5 mt-3">
                <Field
                  type="checkbox"
                  name="toggle"
                  className="mr-2 w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300"
                />
                <span className=" text-lightBlack">
                  By continuing you agree to ViCA&apos;s &nbsp;
                  <Link href="/terms-of-service">
                    <span className="text-blue-700 cursor-pointer hover:text-blue-500">
                      Terms of Service
                    </span>
                  </Link>
                  &nbsp; and &nbsp;
                  <Link href="/privacy-policy">
                    <span className="text-blue-700 cursor-pointer hover:text-blue-500">
                      Privacy Policy.
                    </span>
                  </Link>
                </span>
              </div>
              <button
                disabled={!values.toggle || disabledButton}
                type="submit"
                className={`mt-5 flex items-center justify-center rounded-lg ${
                  !values.toggle || disabledButton
                    ? 'bg-blue-300'
                    : 'bg-blue-700 hover:bg-blue-600'
                } py-4 font-poppins text-white `}
              >
                {disabledButton ? (
                  <>
                    <Spinner /> <span>Loading...</span>{' '}
                  </>
                ) : (
                  <span>Register</span>
                )}
              </button>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default Register;
