import { GetStaticProps } from 'next';
import React, { FC } from 'react';
import FilterBar from '../src/components/molecules/FilterBar';
import Page from '../src/components/templates/Page';
import ProjectsGrid from '../src/components/organisms/ProjectsGrid';
import sanity from '../src/services/sanity';
import { Settings } from '../src/types';
import { revalidate } from '../src/config/defaults';

type Props = {
  settings: Settings;
};

const HomePage: FC<Props> = ({ settings }) => (
  <Page
    className="pb-8"
    title={settings.title}
    filterBar={<FilterBar categories={settings.categoriesOrder || []} />}
  >
    <ProjectsGrid projects={settings.featuredProjects || []} />
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [settings] = await Promise.all([sanity.getSettings()]);
  return {
    props: { settings },
    revalidate,
  };
};

export default HomePage;
