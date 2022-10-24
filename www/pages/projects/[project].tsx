import { GetStaticPaths, GetStaticProps } from 'next';
import { FC } from 'react';
import { ImageGrid } from '../../src/components/molecules/ImageGrid';
import ProjectHeader from '../../src/components/organisms/ProjectHeader';
import Page from '../../src/components/templates/Page';
import sanity from '../../src/services/sanity';
import { Project, Settings } from '../../src/types';

type Params = { project: string };
type Props = {
  project: Project;
  settings: Settings;
};

const ProjectPage: FC<Props> = ({ project, settings }) => {
  const images = project.images.slice(1).map((obj) => obj.asset);
  return (
    <Page settings={settings}>
      <ProjectHeader project={project} />
      <ImageGrid images={images} />
      <p className="mt-4">{project.credits}</p>
    </Page>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const projects = await sanity.getProjects();
  const paths = projects.map(({ path }) => ({
    params: { project: path.current },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const [project, settings] = await Promise.all([
    sanity.getProject(params?.project),
    sanity.getSettings(),
  ]);
  return {
    props: { project, settings },
  };
};

export default ProjectPage;
