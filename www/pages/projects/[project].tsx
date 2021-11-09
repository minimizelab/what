import { GetStaticPaths, GetStaticProps } from 'next';
import React, { FC } from 'react';
import ProjectHeader from '../../src/components/organisms/ProjectHeader';
import Page from '../../src/components/templates/Page';
import { revalidate } from '../../src/config/defaults';
import { PortableText } from '../../src/lib/sanity.client';
import { projectSerializers } from '../../src/serializers';
import sanity from '../../src/services/sanity';
import { Project } from '../../src/types';

type Params = { project: string };
type Props = {
  project: Project;
};

const ProjectPage: FC<Props> = ({ project }) => {
  return (
    <Page title={project.title}>
      <ProjectHeader
        title={project.title}
        categories={project.categories}
        description={project.description}
        subTitle={project.subTitle}
      />
      <div className="mb-6">
        <PortableText
          serializers={projectSerializers}
          blocks={project.content}
        />
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
  const project = await sanity.getProject(params?.project);
  return {
    props: { project },
    revalidate,
  };
};

export default ProjectPage;
