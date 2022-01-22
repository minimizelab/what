import { MdSettings } from 'react-icons/md';
import { Document } from '../../types';
import { emailSchema } from '../../utils';

const Settings: Document = {
  title: 'Inställningar',
  name: 'settings',
  icon: MdSettings,
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'string',
      description: 'Titeln för webbsidan',
      validation: (R) => R.required(),
    },
    {
      title: 'Footer email',
      name: 'contactEmail',
      type: 'string',
      description: 'Emailadress som visas i footer',
      validation: (R) =>
        R.required().custom(async (str) =>
          (await emailSchema.isValid(str)) ? true : 'Needs to be a valid email'
        ),
    },
    {
      title: 'Projekt förstasidan',
      name: 'featuredProjects',
      type: 'array',
      description: 'Projekt som visas på förstasidan',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    },
    {
      title: 'Kategorier projektfilter',
      name: 'categoriesOrder',
      type: 'array',
      description: 'Kategorier i projektfilter på förstasidan',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (R) => R.required().min(1),
    },
  ],
};

export default Settings;
