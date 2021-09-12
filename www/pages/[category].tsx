import { GetStaticPaths, GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/FilterBar';
import Page from '../src/components/Page';
import ProjectsGrid from '../src/components/ProjectsGrid';
import { siteTitle, revalidate } from '../src/config/defaults';
import sanity from '../src/services/sanity';
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
  const categories = await sanity.getCategories();
  const paths = categories.map(({ path }) => ({
    params: { category: path.current },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const category = await sanity.getCategory(params?.category);
  const [categories, projects] = await Promise.all([
    sanity.getCategories(),
    sanity.getProjectsByCategory(category._id),
  ]);
  return {
    props: { categories, projects, category },
    revalidate,
  };
};

export default CategoryPage;