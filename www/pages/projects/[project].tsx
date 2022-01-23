import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import React, { FC } from 'react';
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
  return (
    <Page settings={settings}>
      <ProjectHeader project={project} />

      <div className="mb-6">
        {project.images.map(({ asset: { _id, url, metadata } }) => (
          <div key={_id} className="mb-2 mt-4">
            <Image
              src={url}
              alt=""
              placeholder={metadata.lqip ? 'blur' : 'empty'}
              layout="responsive"
              width={metadata.dimensions.width}
              height={metadata.dimensions.height}
              objectFit="contain"
              blurDataURL={metadata.lqip}
            />
          </div>
        ))}
      </div>
      <p>{project.credits}</p>
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
