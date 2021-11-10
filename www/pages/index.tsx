import { GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/molecules/FilterBar';
import Page from '../src/components/templates/Page';
import ProjectsGrid from '../src/components/organisms/ProjectsGrid';
import sanity from '../src/services/sanity';
import { Category, Project } from '../src/types';
import { revalidate } from '../src/config/defaults';

type Props = {
  categories: Category[];
  projects: Project[];
};

const Home: FC<Props> = ({ categories, projects }) => (
  <Page className="pb-8" title="Welcome to What! web page">
    <FilterBar categories={categories} />
    <ProjectsGrid projects={projects} />
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [categories, projects] = await Promise.all([
    sanity.getCategories(),
    sanity.getProjects(),
  ]);
  return {
    props: { categories, projects },
    revalidate,
  };
};

export default Home;
