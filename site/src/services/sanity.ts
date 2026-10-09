import groq from 'groq';
import { client } from '../lib/sanityClient';
import type { Project, Category, Settings, Employee, Studio } from '../types';

// Singleton documents every build depends on; fail loudly if one is missing.
const required = <T>(name: string) => (value: T | null): T => {
  if (!value) throw new Error(`Sanity document missing: ${name}`);
  return value;
};

// Every page needs the settings document; fetch it once per build.
let settings: Promise<Settings> | undefined;

const getSettings = (): Promise<Settings> =>
  (settings ??= client
    .fetch(
      groq`*[_type == "settings"][0]{..., "logotype":logotype.asset->,featuredProjects[defined(@->_id)]->{..., "mainImage":mainImage.asset->, categories[]->}, categoriesOrder[defined(@->_id)]->{...}}`
    )
    .then(required<Settings>('settings')));

const getCategory = (slug: string): Promise<Category | null> =>
  client.fetch(
    groq`*[_type == "category" && path.current == $slug][0]{..., sortedProjects[defined(@->_id)]->{..., "mainImage":mainImage.asset->, categories[]->}}`,
    { slug }
  );

const getProjects = (): Promise<Project[]> =>
  client.fetch(
    groq`*[_type == "project"]{..., "mainImage":mainImage.asset->, categories[]->, images[]{...,asset->}}`
  );

const getProjectsByCategory = (category: string): Promise<Project[]> =>
  client.fetch(
    groq`*[_type == "project" && references($category)] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`,
    { category }
  );

const getEmployees = (): Promise<Employee[]> =>
  client.fetch(
    groq`*[_type == "employee"] | order(name asc) {_id, name, email, phone, titles, "image":image.asset->}`
  );

const getStudio = (): Promise<Studio> =>
  client
    .fetch(
      groq`*[_type == "studio"][0]{...,"employees":sortedEmployees[defined(@->_id)]->{_id, name, email, phone, titles, "image":image.asset->}}`
    )
    .then(required<Studio>('studio'));

const sanityService = {
  getStudio,
  getCategory,
  getProjects,
  getProjectsByCategory,
  getSettings,
  getEmployees,
};

export default sanityService;
