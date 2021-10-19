import { GetStaticPaths, GetStaticProps } from 'next';
import React, { FC } from 'react';
import ProjectHeader from '../../src/components/organisms/ProjectHeader';
import Page from '../../src/components/templates/Page';
import { revalidate } from '../../src/config/defaults';
import sanity from '../../src/services/sanity';
import { Category, Project } from '../../src/types';

type Params = { project: string };
type Props = {
  project: Project;
  projectCategory?: Category;
};

const ProjectPage: FC<Props> = ({ project }) => (
  <Page title={project.title}>
    <ProjectHeader
      title={project.title}
      category={project.category}
      description={project.description}
      subTitle={project.subTitle}
    />
  </Page>
);

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
  const project = await sanity.getProject(params?.project);
  return {
    props: { project },
    revalidate,
  };
};

export default ProjectPage;
