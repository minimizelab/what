import { GetStaticPaths, GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/FilterBar';
import Page from '../src/components/Page';
import ProjectsGrid from '../src/components/ProjectsGrid';
import { siteTitle, revalidate } from '../src/config/defaults';
import {
  getCategories,
  getCategory,
  getProjects,
} from '../src/services/sanity';
import { Category, Project } from '../src/types';

type Params = { category: string };
type Props = {
  categories: Category[];
  projects: Project[];
  category?: Category;
};

const CategoryPage: FC<Props> = ({ categories, projects, category }) => (
  <Page title={category?.title ?? siteTitle}>
    <FilterBar categories={categories} />
    <ProjectsGrid projects={projects} />
  </Page>
);

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const categories = await getCategories();
  const paths = categories.map(({ slug }) => ({ params: { category: slug } }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const [categories, projects, category] = await Promise.all([
    getCategories(),
    getProjects({ category: params?.category }),
    getCategory(params?.category),
  ]);
  return {
    props: { categories, projects, category },
    revalidate,
  };
};

export default CategoryPage;
