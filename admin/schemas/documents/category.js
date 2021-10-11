export default {
  title: 'Category',
  name: 'category',
  type: 'document',
  description: 'A content category',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'The title of the category',
      validation: (R) => R.required(),
    },
    {
      title: 'Path',
      name: 'path',
      type: 'slug',
      description: 'The unique url name for the category',
      validation: (R) => R.required(),
      options: {
        source: (doc) => doc.title.replaceAll(' ', '-'),
      },
    },
  ],
};
