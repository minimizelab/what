import { GetStaticPaths, GetStaticProps } from 'next';
import { FC } from 'react';
import FilterBar from '../src/components/molecules/FilterBar';
import Page from '../src/components/templates/Page';
import ProjectsGrid from '../src/components/organisms/ProjectsGrid';
import sanity from '../src/services/sanity';
import { Category, Project, Settings } from '../src/types';
import getSortedArray from '../src/utils/getSortedArray';

type Params = { category: string };
type Props = {
  settings: Settings;
  projects: Project[];
  category: Category;
};

const CategoryPage: FC<Props> = ({ settings, projects }) => (
  <Page
    settings={settings}
    filterBar={<FilterBar categories={settings.categoriesOrder} />}
  >
    <ProjectsGrid projects={projects} />
  </Page>
);

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const settings = await sanity.getSettings();
  const paths = settings.categoriesOrder.map(({ path }) => ({
    params: { category: path.current },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const category = await sanity.getCategory(params?.category);
  if (!category) {
    return { notFound: true };
  }
  const [settings, allProjects] = await Promise.all([
    sanity.getSettings(),
    sanity.getProjectsByCategory(category._id),
  ]);
  const projects = getSortedArray<Project>(
    allProjects,
    category.sortedProjects
  );
  return {
    props: { settings, projects, category },
  };
};

export default CategoryPage;
