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
      description: 'Projektets rubrik',
      validation: (R) => R.required(),
    },
    {
      title: 'Underrubrik',
      name: 'subTitle',
      type: 'string',
      description: 'Projektets underrubrik',
      validation: (R) => R.required(),
    },
    {
      title: 'Beskrivning',
      name: 'description',
      type: 'text',
      description: 'Beskrivning av projektet',
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
      description: 'Omslagsbild för projektet',
    },
    {
      title: 'Kategorier',
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Projektets kategorier',
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
      description: 'Projektets unika sökväg',
      validation: (R) => R.required(),
      options: {
        source: 'title',
      },
    },
    {
      title: 'Credits',
      name: 'credits',
      type: 'string',
      description: 'Credits för foto och bilder',
    },
  ],
};

export default Project;
