import groq from 'groq';
import { client } from '../lib/sanityClient';
import { Project, Category, Settings, Employee, Studio } from '../types';

const getCategories = async (): Promise<Category[]> => {
  const categories = await client.fetch(groq`*[_type == "category"]`);
  return categories;
};

const getCategory = (slug?: string): Promise<Category> =>
  client.fetch(
    groq`*[_type == "category" && path.current == $slug][0]{..., sortedProjects[]->{..., "mainImage":mainImage.asset->, categories[]->}}`,
    {
      slug,
    }
  );

const getProjects = (): Promise<Project[]> =>
  client.fetch(
    groq`*[_type == "project"] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`
  );

const getProject = (slug?: string): Promise<Project> =>
  client.fetch(
    groq`*[_type == "project" && path.current == $slug][0]{..., "mainImage":mainImage.asset->, categories[]->, images[]{...,asset->}}`,
    {
      slug,
    }
  );

const getProjectsByCategory = (category: string): Promise<Project[]> =>
  client.fetch(
    groq`*[_type == "project" && references($category)] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`,
    { category }
  );

const getSettings = (): Promise<Settings> =>
  client.fetch(
    groq`*[_type == "settings"][0]{..., "logotype":logotype.asset->,featuredProjects[]->{..., "mainImage":mainImage.asset->, categories[]->}, categoriesOrder[]->{...}}`
  );

const getEmployees = (): Promise<Employee[]> =>
  client.fetch(
    groq`*[_type == "employee"] | order(name asc) {_id, name, email, phone, titles, "image":image.asset->}`
  );

const getStudio = (): Promise<Studio> =>
  client.fetch(
    groq`*[_type == "studio"][0]{...,"employees":sortedEmployees[]->{_id, name, email, phone, titles, "image":image.asset->}}`
  );

const sanityService = {
  getStudio,
  getCategories,
  getCategory,
  getProjects,
  getProject,
  getProjectsByCategory,
  getSettings,
  getEmployees,
};

export default sanityService;
