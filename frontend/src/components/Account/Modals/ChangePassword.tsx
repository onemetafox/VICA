import React from 'react';
import Popup from 'reactjs-popup';
import { RiCloseCircleLine } from 'react-icons/ri';
import Input from 'src/components/Input';
import { Formik, Form } from 'formik';
import { ChangePasswordSchema } from 'src/utils/forms-schema';
import { useChangePassword } from 'src/queries/user';

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
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}
const ChangePassword = ({ isOpen, close }: Props) => {
  const mutation = useChangePassword();
  const onSubmit = (values: Values) => {
    mutation.mutate({
      old_password: values?.oldPassword,
      new_password1: values?.password,
      new_password2: values?.passwordConfirmation,
    });
  };
  return (
    <Popup position="right center" open={isOpen} onClose={close}>
      <div className="flex flex-col justify-center items-center font-poppins w-full">
        <button type="button" onClick={close} className="self-end">
          <RiCloseCircleLine className="text-darkGray hover:text-darkBlack text-2xl" />
        </button>
        <h1 className="text-xl font-bold mb-7 mt-7">Change password</h1>
        <Formik
          initialValues={{
            oldPassword: '',
            password: '',
            passwordConfirmation: '',
          }}
          validationSchema={ChangePasswordSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={onSubmit}
        >
          {({ handleChange, values, errors }) => (
            <Form className="flex flex-col justify-center items-start w-full">
              {/*         <label
                htmlFor="password0"
                className="mb-2 self-start text-darkGray text-sm"
              >
                Old password
              </label>
              <Input
                value={values.password0}
                id="password0"
                name="password0"
                type="password"
                autoComplete="password"
              /> */}
              <label
                htmlFor="oldPassword"
                className="mb-2 self-start text-darkGray text-sm"
              >
                Old password
              </label>
              <Input
                value={values.oldPassword}
                id="oldPassword"
                name="oldPassword"
                type="text"
                autoComplete="password"
              />
              {errors.oldPassword && (
                <p className="text-red-600 mb-2 text-sm ">
                  {errors.oldPassword}
                </p>
              )}
              <label
                htmlFor="password1"
                className="mb-2 self-start text-darkGray text-sm"
              >
                New password
              </label>
              <Input
                value={values.password}
                id="password"
                name="password"
                type="password"
                autoComplete="password"
              />
              {errors.password && (
                <p className="text-red-600 mb-2 text-sm ">{errors.password}</p>
              )}
              <label
                htmlFor="password2"
                className="mb-2 self-start text-darkGray text-sm mt-5"
              >
                Confirm password
              </label>
              <Input
                value={values.passwordConfirmation}
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="password"
              />
              {errors.passwordConfirmation && (
                <p className="text-red-600 mb-2 text-sm ">
                  {errors.passwordConfirmation}
                </p>
              )}

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

export default ChangePassword;
