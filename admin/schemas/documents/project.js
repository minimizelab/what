export default {
  title: 'Project',
  name: 'project',
  type: 'document',
  description: 'A customer project',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'The title of the project',
      validation: (R) => R.required(),
    },
    {
      title: 'Path',
      name: 'path',
      type: 'slug',
      description: 'The unique url name for the project',
      validation: (R) => R.required(),
      options: {
        source: (doc) => doc.title.replaceAll(' ', '-'),
      },
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string',
      description: 'The subtitle of the project',
      validation: (R) => R.required(),
    },
    {
      title: 'Description',
      name: 'description',
      type: 'string',
      description: 'The description of the project',
      validation: (R) => R.required(),
    },
    {
      title: 'Category',
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'The category of the project',
      validation: (R) => R.required(),
    },
  ],
};
