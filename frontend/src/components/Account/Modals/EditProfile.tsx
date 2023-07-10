import React from 'react';
import Popup from 'reactjs-popup';
import { RiCloseCircleLine } from 'react-icons/ri';
import Input from 'src/components/Input';
import { Formik, Form } from 'formik';
import { EditUserSchema } from 'src/utils/forms-schema';
import { countries } from 'src/utils/countries';
import { useFetchUser, useUserInfos } from 'src/queries/user';

type Props = {
  isOpen: boolean;
  close:
    | ((
        event?:
          | KeyboardEvent
          | TouchEvent
          | MouseEvent
          | React.SyntheticEvent<Element, Event>
          | undefined
      ) => void)
    | undefined;
};

interface Values {
  user_name: string;
  first_name: string;
  last_name: string;
  dial_code: string;
  phone_number: string;
  country: string;
  city: string;
}

const EditProfile = ({ isOpen, close }: Props) => {
  const { data } = useFetchUser();
  const { mutate: UpdateImage } = useUserInfos();

  const onSubmit = (values: Values, { resetForm }) => {
    UpdateImage({
      username: values.user_name,
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      country: values.country,
      city: values.city,
    });
    resetForm({ values: '' });
    if (close) close();
  };

  return (
    <Popup position="right center" open={isOpen} onClose={close}>
      <div className="flex flex-col justify-center items-center font-poppins w-full">
        <button type="button" onClick={close} className="self-end">
          <RiCloseCircleLine className="text-darkGray hover:text-darkBlack text-2xl" />
        </button>
        <h1 className="text-xl font-bold mb-7 mt-7">Edit profile</h1>
        <Formik
          initialValues={{
            user_name: data?.username ?? '',
            first_name: data?.first_name ?? '',
            last_name: data?.last_name ?? '',
            dial_code: '+1',
            phone_number: data?.phone_number ?? '',
            country: data?.country ?? '',
            city: data?.city ?? '',
          }}
          enableReinitialize
          validationSchema={EditUserSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={onSubmit}
        >
          {({ handleChange, values, errors }) => (
            <Form className="flex flex-col justify-center items-start w-full">
              <label
                htmlFor="user_name"
                className="mb-2 text-lightBlack text-sm"
              >
                Username
              </label>
              <div className="w-full">
                <Input
                  value={values.user_name}
                  onChange={handleChange}
                  name="user_name"
                  id="user_name"
                  type="text"
                  placeholder="user name"
                  autoComplete="given-name"
                />
                {errors.user_name && (
                  <p className="text-red-600 mb-2 text-sm">
                    {errors.user_name}
                  </p>
                )}
              </div>
              <label
                htmlFor="first_name"
                className="mb-2 text-lightBlack text-sm"
              >
                Name
              </label>
              <div className="flex justify-between w-full lg:flex-col">
                <div className="flex flex-col w-1/2 lg:w-full">
                  <Input
                    value={values.first_name}
                    onChange={handleChange}
                    name="first_name"
                    id="first_name"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                  />
                  {errors.first_name && (
                    <p className="text-red-600 mb-2 text-sm">
                      {errors.first_name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col flex-grow pl-3 w-1/2 lg:pl-0 lg:w-full">
                  <Input
                    value={values.last_name}
                    onChange={handleChange}
                    name="last_name"
                    id="last_name"
                    placeholder="Last name"
                    type="text"
                    autoComplete="family-name"
                  />
                  {errors.last_name && (
                    <p className="text-red-600 mb-2 text-sm">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>
              <label
                htmlFor="country"
                className="my-1 text-lightBlack text-sm "
              >
                Location
              </label>
              <div className="flex justify-between w-full lg:flex-col">
                <select
                  defaultValue={values.country}
                  value={values.country}
                  onChange={handleChange}
                  name="country"
                  id="country"
                  autoComplete="country"
                  className="bg-white flex-grow w-32 lg:w-full truncate text-sm border rounded p-3 active:border-blue-500 focus:border-blue-500 focus:outline-none mb-2"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>

                {errors.country && (
                  <p className="text-red-600 mb-2 text-sm">{errors.country}</p>
                )}
                <Input
                  value={values.city}
                  onChange={handleChange}
                  name="city"
                  id="city"
                  type="text"
                  placeholder="City"
                  autoComplete="street-address"
                  className="flex-grow ml-3 lg:ml-0"
                />
                {errors.city && (
                  <p className="text-red-600 mb-2 text-sm">{errors.city}</p>
                )}
              </div>
              {/*   <label
                htmlFor="phone_number"
                className="my-1 text-lightBlack text-sm"
              >
                Phone number
              </label>
              <div className="flex justify-between w-full lg:flex-col">
                <select
                  value={values.dial_code}
                  onChange={handleChange}
                  name="dial_code"
                  id="dial_code"
                  autoComplete="tel-country-code"
                  className="bg-white w-32 lg:w-full truncate text-sm border rounded p-3 active:border-blue-500 focus:border-blue-500 focus:outline-none mb-2"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.dial_code}>
                      {country.dial_code} {country.code}
                    </option>
                  ))}
                </select>

                {errors.dial_code && (
                  <p className="text-red-600 mb-2 text-sm">
                    {errors.dial_code}
                  </p>
                )}
                <Input
                  value={values.phone_number}
                  onChange={handleChange}
                  name="phone_number"
                  id="phone_number"
                  type="text"
                  autoComplete="tel-national"
                  className="flex-grow ml-3 lg:ml-0"
                />
                {errors.phone_number && (
                  <p className="text-red-600 mb-2 text-sm">
                    {errors.phone_number}
                  </p>
                )}
              </div> */}

              <div className="flex justify-between items-center mt-4 mb-12 mx-auto sm:flex-col sm:w-full">
                <button
                  type="submit"
                  className="mr-1 sm:mr-0 sm:mb-3 text-sm rounded-lg w-28 sm:w-full py-3 text-white bg-blue-600 hover:bg-blue-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="ml-1 sm:ml-0 text-sm rounded-lg w-28 sm:w-full py-3 text-blue-600 bg-mediumGray hover:text-white hover:bg-blue-600"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Popup>
  );
};

export default EditProfile;
