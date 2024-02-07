import { defineType } from 'sanity';

const Studio = defineType({
  title: 'Studio',
  name: 'studio',
  type: 'document',
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
      name: 'pageContent',
      type: 'richText',
      description: 'Sidans innehåll',
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
});

export default Studio;
