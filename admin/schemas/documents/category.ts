import { Document } from '../../types';

const categorySlugBlacklist = ['projects'];

const Category: Document = {
  title: 'Kategorier',
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
      validation: (R) =>
        R.required().custom((slug) => {
          if (!slug) return true;
          return categorySlugBlacklist.includes(slug.current)
            ? 'Path not allowed, try another one!'
            : true;
        }),
      options: {
        source: 'title',
      },
    },
    {
      title: 'Prioriterade projekt',
      name: 'sortedProjects',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
    },
  ],
};

export default Category;
