import { defineQuery } from 'groq';
import { client } from '../lib/sanityClient';

const SETTINGS_QUERY = defineQuery(
  `*[_type == "settings"][0]{..., "logotype":logotype.asset->,featuredProjects[defined(@->_id)]->{..., "mainImage":mainImage.asset->, categories[]->}, categoriesOrder[defined(@->_id)]->{...}}`
);

const CATEGORY_QUERY = defineQuery(
  `*[_type == "category" && path.current == $slug][0]{..., sortedProjects[defined(@->_id)]->{..., "mainImage":mainImage.asset->, categories[]->}}`
);

const PROJECTS_QUERY = defineQuery(
  `*[_type == "project"]{..., "mainImage":mainImage.asset->, categories[]->, images[]{...,asset->}}`
);

const PROJECTS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "project" && references($category)] | order(year desc) {_id, title, path, subTitle, description, "mainImage":mainImage.asset->, categories[]->}`
);

const EMPLOYEES_QUERY = defineQuery(
  `*[_type == "employee"] | order(name asc) {_id, name, email, phone, titles, "image":image.asset->}`
);

const STUDIO_QUERY = defineQuery(
  `*[_type == "studio"][0]{...,"employees":sortedEmployees[defined(@->_id)]->{_id, name, email, phone, titles, "image":image.asset->}}`
);

// Singleton documents every build depends on; fail loudly if one is missing.
const required = <T>(name: string) => (value: T | null): T => {
  if (!value) throw new Error(`Sanity document missing: ${name}`);
  return value;
};

// Every page needs the settings document; fetch it once per build.
let settings: ReturnType<typeof fetchSettings> | undefined;
const fetchSettings = () =>
  client.fetch(SETTINGS_QUERY).then(required('settings'));

const sanityService = {
  getSettings: () => (settings ??= fetchSettings()),
  getCategory: (slug: string) => client.fetch(CATEGORY_QUERY, { slug }),
  getProjects: () => client.fetch(PROJECTS_QUERY),
  getProjectsByCategory: (category: string) =>
    client.fetch(PROJECTS_BY_CATEGORY_QUERY, { category }),
  getEmployees: () => client.fetch(EMPLOYEES_QUERY),
  getStudio: () => client.fetch(STUDIO_QUERY).then(required('studio')),
};

export default sanityService;
