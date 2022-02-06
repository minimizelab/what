import { GetStaticPaths, GetStaticProps } from 'next';
import React, { FC } from 'react';
import { ImageGrid } from '../../src/components/molecules/ImageGrid';
import ProjectHeader from '../../src/components/organisms/ProjectHeader';
import Page from '../../src/components/templates/Page';
import { revalidate } from '../../src/config/defaults';
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
      <div className="xl:px-0 2xl:px-72">
        <ProjectHeader project={project} />
        <ImageGrid images={images} />
        <p className="mt-4">{project.credits}</p>
      </div>
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
    fallback: 'blocking',
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
    revalidate,
  };
};

export default ProjectPage;
