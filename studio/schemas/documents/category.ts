import { Slug, defineType } from 'sanity';

const categorySlugBlacklist = ['projekt'];

const Category = defineType({
  title: 'Kategorier',
  name: 'category',
  type: 'document',
  description: 'A content category',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Namn på kategori',
      validation: (R) => R.required(),
    },
    {
      title: 'Path',
      name: 'path',
      type: 'slug',
      description: 'Kategorins unika sökväg',
      validation: (R) =>
        R.required().custom((slug: Slug) => {
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
      description: 'Projekt som visas först',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
    },
  ],
});

export default Category;
