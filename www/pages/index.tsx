import { GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/FilterBar';
import Page from '../src/components/Page';
import ProjectsGrid from '../src/components/ProjectsGrid';
import { Category, Project } from '../src/types';

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

export const getStaticProps: GetStaticProps<Props> = () => {
  const categories = [
    { title: 'Featured', id: '1' },
    { title: 'Bostad', id: '2' },
    { title: 'Verksamhet', id: '3' },
    { title: 'Stad & Land', id: '4' },
  ];
  const projects = [
    {
      id: '1',
      title: 'Test projects',
      img: 'some img',
      category: 'Bostad',
      featured: true,
    },
  ];
  return {
    props: { categories, projects },
  };
};

export default Home;
