import React from 'react';
import { Field } from 'formik';

type Props = {
  [x: string]: any;
};

const Input = ({ className, isError, ...props }: Props) => {
  return (
    <Field
      className={`w-full text-sm border rounded p-3 active:border-blue-500 focus:border-blue-500 focus:outline-none mb-2 sm:w-full ${className} ${
        isError && 'border-red-600'
      }`}
      {...props}
    />
  );
};

export default Input;
