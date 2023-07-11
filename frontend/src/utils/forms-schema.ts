import * as Yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('* Invalid email').required('* Email is required'),
  first_name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('* First name is required'),
  last_name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('* Last name is required'),
  dial_code: Yup.string(),
  phone_number: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  country: Yup.string().required('* Country is Required'),
  city: Yup.string().required('* City is Required'),
  password1: Yup.string()
    .required('* You must set a password')
    .matches(
      /* eslint-disable */
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      '* Password must Contain 8 Characters, One Number and One Special Case Character'
    ),
  password2: Yup.string()
    .required('* Passwords must match')
    .oneOf([Yup.ref('password1'), null], '* Passwords must match'),
});
export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('* Invalid email').required('* Email is required'),
  password: Yup.string().required('* You must enter a password'),
});

export const EditUserSchema = Yup.object().shape({
  user_name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('* First name is required'),
  first_name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('* First name is required'),
  last_name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('* Last name is required'),
  //dial_code: Yup.string(),
  //phone_number: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  country: Yup.string().required('* Country is Required'),
  city: Yup.string().required('* City is Required'),
});

export const ResetPassword = Yup.object().shape({
  email: Yup.string().email('* Invalid email').required('* Email is required'),
});

export const ChangePasswordSchema = Yup.object({
  oldPassword: Yup.string()
    .required('Old Password is required')
    .matches(
      /* eslint-disable */
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      '* Password must Contain 8 Characters, One Number and One Special Case Character'
    ),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /* eslint-disable */
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      '* Password must Contain 8 Characters, One Number and One Special Case Character'
    ),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

export const PasswordConfirmSchema = Yup.object({
  password1: Yup.string()
    .required('Password is required')
    .matches(
      /* eslint-disable */
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      '* Password must Contain 8 Characters, One Number and One Special Case Character'
    ),
  password2: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

