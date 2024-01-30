import { MdSettings } from 'react-icons/md';
import { emailSchema } from '../../utils';
import { defineType } from 'sanity';

const Settings = defineType({
  title: 'Inställningar',
  name: 'settings',
  icon: MdSettings,
  type: 'document',
  fieldsets: [
    {
      name: 'contact',
      title: 'Kontaktuppgifter',
      options: { collapsible: true, collapsed: false, columns: 1 },
    },
  ],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'string',
      description: 'Titeln för webbsidan',
      validation: (R) => R.required(),
    },
    {
      title: 'Epost',
      name: 'email',
      type: 'string',
      fieldset: 'contact',
      description: 'Epostadress för kontakt',
      validation: (R) =>
        R.required().custom(async (str) =>
          (await emailSchema.isValid(str))
            ? true
            : 'Måste vara en korrekt epostadress'
        ),
    },
    {
      title: 'Telefonnummer',
      name: 'phone',
      type: 'string',
      fieldset: 'contact',
      description: 'Telefonnummer för kontakt',
      validation: (R) => R.required(),
    },
    {
      title: 'Adress',
      name: 'address',
      type: 'array',
      fieldset: 'contact',
      of: [{ type: 'string' }],
      validation: (R) => R.required(),
    },
    {
      title: 'Epost Jobb',
      name: 'emailJob',
      type: 'string',
      fieldset: 'contact',
      description: 'Epostadress för kontakt gällande jobb',
      validation: (R) =>
        R.required().custom(async (str) =>
          (await emailSchema.isValid(str))
            ? true
            : 'Måste vara en korrekt epostadress'
        ),
    },
    {
      title: 'Logotyp',
      name: 'logotype',
      type: 'image',
      validation: (R) => R.required(),
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
});

export default Settings;
