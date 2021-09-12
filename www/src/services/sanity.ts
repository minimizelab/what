import { Project, Category } from '../types';

import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'lu0lnnx1',
  dataset: 'production',
  apiVersion: '2019-01-29', // use current UTC date - see "specifying API version"!
  useCdn: true, // `false` if you want to ensure fresh data
});

const getCategories = async (): Promise<Category[]> => {
  const categories = await client.fetch('*[_type == "category"]');
  return categories;
};

const getCategory = (slug?: string): Promise<Category> =>
  client.fetch('*[_type == "category" && path.current == $slug][0]', {
    slug,
  });

const getProjects = (): Promise<Project[]> =>
  client.fetch('*[_type == "project"]');

const getProjectsByCategory = (category: string): Promise<Project[]> =>
  client.fetch('*[_type == "project" && references($category)]', { category });

const sanityService = {
  getCategories,
  getCategory,
  getProjects,
  getProjectsByCategory,
};

export default sanityService;
