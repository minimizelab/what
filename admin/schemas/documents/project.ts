import { Document } from '../../types';

const Project: Document = {
  title: 'Projekt',
  name: 'project',
  type: 'document',
  description: 'A customer project',
  fieldsets: [
    {
      name: 'data',
      title: 'Datapunkter',
      options: { collapsible: true, collapsed: false, columns: 2 },
    },
  ],
  fields: [
    {
      title: 'Rubrik',
      name: 'title',
      type: 'string',
      description: 'The title of the project',
      validation: (R) => R.required(),
    },
    {
      title: 'Underrubrik',
      name: 'subTitle',
      type: 'string',
      description: 'The subtitle of the project',
      validation: (R) => R.required(),
    },
    {
      title: 'Beskrivning',
      name: 'description',
      type: 'text',
      description: 'The description of the project',
      validation: (R) => R.required(),
    },
    {
      title: 'Uppdrag',
      name: 'assignment',
      type: 'string',
      fieldset: 'data',
    },
    {
      title: 'Plats',
      name: 'location',
      type: 'string',
      fieldset: 'data',
    },
    {
      title: 'Beställare',
      name: 'client',
      type: 'string',
      fieldset: 'data',
    },
    {
      title: 'Storlek',
      name: 'size',
      type: 'string',
      fieldset: 'data',
    },
    {
      title: 'Samarbetspartner',
      name: 'collaborator',
      type: 'string',
      fieldset: 'data',
    },
    {
      title: 'År',
      name: 'year',
      type: 'number',
      validation: (R) => R.integer().greaterThan(999).lessThan(2999),
      fieldset: 'data',
    },
    {
      title: 'Utmärkelser',
      name: 'awards',
      fieldset: 'data',
      type: 'string',
    },
    {
      title: 'Huvudbild',
      name: 'mainImage',
      type: 'image',
      description: 'The main image of the project',
    },
    {
      title: 'Kategorier',
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'The categories of the project',
      validation: (R) => R.required(),
    },
    {
      title: 'Bilder',
      name: 'images',
      type: 'array',
      of: [{ type: 'image' }],
      options: { layout: 'grid' },
    },
    {
      title: 'Path',
      name: 'path',
      type: 'slug',
      description: 'The unique url name for the project',
      validation: (R) => R.required(),
      options: {
        source: 'title',
      },
      hidden: true,
    },
  ],
};

export default Project;
