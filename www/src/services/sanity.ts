import { getClient } from '../lib/sanity.server';
import { groq } from 'next-sanity';
import { Project, Category, Settings } from '../types';

const getCategories = async (preview = false): Promise<Category[]> => {
  const categories = await getClient(preview).fetch(
    groq`*[_type == "category"]`
  );
  return categories;
};

const getCategory = (slug?: string, preview = false): Promise<Category> =>
  getClient(preview).fetch(
    groq`*[_type == "category" && path.current == $slug][0]{..., sortedProjects[]->{..., "mainImage":mainImage.asset->, categories[]->}}`,
    {
      slug,
    }
  );

const getProjects = (preview = false): Promise<Project[]> =>
  getClient(preview).fetch(
    groq`*[_type == "project"] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`
  );

const getProject = (slug?: string, preview = false): Promise<Project> =>
  getClient(preview).fetch(
    groq`*[_type == "project" && path.current == $slug][0]{..., _id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->, images[]{...,asset->}}`,
    {
      slug,
    }
  );

const getProjectsByCategory = (
  category: string,
  preview = false
): Promise<Project[]> =>
  getClient(preview).fetch(
    groq`*[_type == "project" && references($category)] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`,
    { category }
  );

const getSettings = (preview = false): Promise<Settings> =>
  getClient(preview).fetch(
    groq`*[_type == "settings"][0]{...,featuredProjects[]->{..., "mainImage":mainImage.asset->, categories[]->}}`
  );

const sanityService = {
  getCategories,
  getCategory,
  getProjects,
  getProject,
  getProjectsByCategory,
  getSettings,
};

export default sanityService;
