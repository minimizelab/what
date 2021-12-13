import { Document } from '../../types';

const Studio: Document = {
  title: 'Studio',
  name: 'studio',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'string',
      description: 'Sidans titel.',
      readOnly: true,
      validation: (R) => R.required(),
    },
    {
      title: 'Text',
      name: 'textContent',
      type: 'text',
      description: 'Sidans textinnehåll',
      rows: 5,
    },
    {
      title: 'Bilder',
      name: 'images',
      type: 'array',
      of: [{ type: 'image' }],
      options: { layout: 'grid' },
    },
    {
      title: 'Medarbetare som visas först',
      name: 'sortedEmployees',
      type: 'array',
      description:
        'Medarbetare som visas först. De som inte läggs till här kommer att visas i alfabetisk ordning.',
      of: [{ type: 'reference', to: [{ type: 'employee' }] }],
    },
  ],
};

export default Studio;
