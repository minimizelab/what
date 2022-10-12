import { GetStaticProps } from 'next';
import { FC } from 'react';
import FilterBar from '../src/components/molecules/FilterBar';
import Page from '../src/components/templates/Page';
import ProjectsGrid from '../src/components/organisms/ProjectsGrid';
import sanity from '../src/services/sanity';
import { Settings } from '../src/types';

type Props = {
  settings: Settings;
};

const HomePage: FC<Props> = ({ settings }) => (
  <Page
    className="pb-8"
    title={settings.title}
    settings={settings}
    filterBar={<FilterBar categories={settings.categoriesOrder || []} />}
  >
    <ProjectsGrid projects={settings.featuredProjects || []} />
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [settings] = await Promise.all([sanity.getSettings()]);
  return {
    props: { settings },
  };
};

export default HomePage;
