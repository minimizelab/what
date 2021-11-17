import { getClient } from '../lib/sanity.server';
import { groq } from 'next-sanity';
import { Project, Category } from '../types';

const getCategories = async (preview = false): Promise<Category[]> => {
  const categories = await getClient(preview).fetch(
    groq`*[_type == "category"]`
  );
  return categories;
};

const getCategory = (slug?: string, preview = false): Promise<Category> =>
  getClient(preview).fetch(
    groq`*[_type == "category" && path.current == $slug][0]`,
    {
      slug,
    }
  );

const getProjects = (preview = false): Promise<Project[]> =>
  getClient(preview).fetch(
    groq`*[_type == "project"]{_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->{_id, title, path}}`
  );

const getProject = (slug?: string, preview = false): Promise<Project> =>
  getClient(preview).fetch(
    groq`*[_type == "project" && path.current == $slug][0]{..., _id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->{_id, title, path}, images[]{...,asset->}}`,
    {
      slug,
    }
  );

const getProjectsByCategory = (
  category: string,
  preview = false
): Promise<Project[]> =>
  getClient(preview).fetch(
    groq`*[_type == "project" && references($category)]{_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->{_id, title, path}}`,
    { category }
  );

const sanityService = {
  getCategories,
  getCategory,
  getProjects,
  getProject,
  getProjectsByCategory,
};

export default sanityService;
