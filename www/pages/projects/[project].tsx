import { SanityImageAssetDocument } from '@sanity/client';
import classNames from 'classnames';
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
  const imageRows = createImageRows(project.images.map((obj) => obj.asset));
  return (
    <Page settings={settings}>
      <ProjectHeader
        title={project.title}
        categories={project.categories}
        description={project.description}
        subTitle={project.subTitle}
      />
      <div className="mb-6 flex flex-col">
        {imageRows.map((row) => (
          <ImageRow key={row[0]._id} images={row}></ImageRow>
        ))}
      </div>
      <p>{project.credits}</p>
    </Page>
  );
};

const ImageRow: FC<{ images: SanityImageAssetDocument[] }> = ({ images }) => (
  <div className="flex flex-row justify-center items-center">
    {images.map((img) => (
      <div
        key={img._id}
        className={classNames(
          'mb-2 mt-4',
          isLandscape(img) ? 'w-full' : 'w-1/2'
        )}
      >
        <Image
          src={img.url}
          alt=""
          placeholder={img.metadata.lqip ? 'blur' : 'empty'}
          layout="responsive"
          width={img.metadata.dimensions.width}
          height={img.metadata.dimensions.height}
          objectFit="contain"
          blurDataURL={img.metadata.lqip}
        />
      </div>
    ))}
  </div>
);

const isLandscape = (img: SanityImageAssetDocument) =>
  img.metadata.dimensions.height < img.metadata.dimensions.width;

const createImageRows = (images: SanityImageAssetDocument[]) => {
  const rows: SanityImageAssetDocument[][] = [];
  while (images.length) {
    const firstImage = images.shift() as SanityImageAssetDocument;
    if (isLandscape(firstImage)) {
      rows.push([firstImage]);
    } else {
      if (images.length) {
        const secondImage = images.shift() as SanityImageAssetDocument;
        if (isLandscape(secondImage)) {
          rows.push([firstImage], [secondImage]);
        } else {
          rows.push([firstImage, secondImage]);
        }
      } else {
        rows.push([firstImage]);
      }
    }
  }
  return rows;
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
