import * as yup from 'yup';

export const supportRequestValidationSchema = yup.object().shape({
  status: yup.string().required(),
  description: yup.string().required(),
  user_id: yup.string().nullable(),
  company_id: yup.string().nullable(),
});
