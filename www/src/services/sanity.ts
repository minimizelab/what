import { Project, Category } from '../types';

type GetProjectsFilters = {
  category?: string;
  featured?: boolean;
};

type GetProjects = (filters: GetProjectsFilters) => Project[];

const categories: Category[] = [
  { title: 'Bostad', id: '2', slug: 'bostad' },
  { title: 'Verksamhet', id: '3', slug: 'verksamhet' },
  { title: 'Stad & Land', id: '4', slug: 'stad-land' },
];

const projects: Project[] = [
  {
    id: '1',
    title: 'Test project 1',
    img: 'some img',
    categorySlug: 'bostad',
    featured: true,
  },
  {
    id: '2',
    title: 'Test project 2',
    img: 'some img',
    categorySlug: 'verksamhet',
    featured: false,
  },
  {
    id: '2',
    title: 'Test project 3',
    img: 'some img',
    categorySlug: 'stad-land',
    featured: true,
  },
];

const getCategories = () => categories;
const getCategory = (slug?: string) =>
  categories.find((cat) => cat.slug === slug);

const getProjects: GetProjects = ({ category, featured }) =>
  projects
    .filter((proj) => (category ? proj.categorySlug === category : true))
    .filter((proj) => (featured ? proj.featured : true))
    .map((proj) => ({ ...proj, category: getCategory(proj.categorySlug) }));

const sanityService = {
  getCategories,
  getCategory,
  getProjects,
};

export default sanityService;
