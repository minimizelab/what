import { GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/molecules/FilterBar';
import Page from '../src/components/templates/Page';
import ProjectsGrid from '../src/components/organisms/ProjectsGrid';
import sanity from '../src/services/sanity';
import { Category, Settings } from '../src/types';
import { revalidate } from '../src/config/defaults';

type Props = {
  categories: Category[];
  settings: Settings;
};

const Home: FC<Props> = ({ categories, settings }) => (
  <Page
    className="pb-8"
    title={settings.title}
    filterBar={<FilterBar categories={categories} />}
  >
    <ProjectsGrid projects={settings.featuredProjects || []} />
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [settings, categories] = await Promise.all([
    sanity.getSettings(),
    sanity.getCategories(),
  ]);
  return {
    props: { categories, settings },
    revalidate,
  };
};

export default Home;
