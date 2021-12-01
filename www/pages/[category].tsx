import { GetStaticPaths, GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/molecules/FilterBar';
import Page from '../src/components/templates/Page';
import ProjectsGrid from '../src/components/organisms/ProjectsGrid';
import { revalidate } from '../src/config/defaults';
import sanity from '../src/services/sanity';
import { Category, Project } from '../src/types';
import getProjectArray from '../src/utils/getProjectArray';

type Params = { category: string };
type Props = {
  categories: Category[];
  projects: Project[];
  category: Category;
};

const CategoryPage: FC<Props> = ({ categories, projects, category }) => (
  <Page title={category.title}>
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
  const [categories, allProjects] = await Promise.all([
    sanity.getCategories(),
    sanity.getProjectsByCategory(category._id),
  ]);
  const projects = getProjectArray(allProjects, category.sortedProjects);
  return {
    props: { categories, projects, category },
    revalidate,
  };
};

export default CategoryPage;
