import { GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/FilterBar';
import Page from '../src/components/Page';
import ProjectsGrid from '../src/components/ProjectsGrid';
import { getCategories, getProjects } from '../src/services/sanity';
import { Category, Project } from '../src/types';
import { revalidate } from '../src/config/defaults';

type Props = {
  categories: Category[];
  projects: Project[];
};

const Home: FC<Props> = ({ categories, projects }) => (
  <Page title="Welcome to What! web page">
    <FilterBar categories={categories} />
    <ProjectsGrid projects={projects} />
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ featured: true }),
  ]);
  return {
    props: { categories, projects },
    revalidate,
  };
};

export default Home;
