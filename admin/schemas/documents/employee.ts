import { Document } from '../../types';
import * as yup from 'yup';
import { string } from 'prop-types';

const emailSchema = yup.string().email();

const Employee: Document = {
  title: 'Medarbetare',
  name: 'employee',
  type: 'document',
  fields: [
    {
      title: 'Namn',
      name: 'name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      title: 'Bild',
      name: 'image',
      type: 'image',
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string',
      validation: (R) =>
        R.custom(async (str) =>
          (await emailSchema.isValid(str)) ? true : 'Needs to be a valid email'
        ),
    },
    {
      title: 'Telefonnummer',
      name: 'phone',
      type: 'string',
    },
    {
      title: 'Titlar',
      name: 'titles',
      type: 'string',
    },
  ],
};

export default Employee;
