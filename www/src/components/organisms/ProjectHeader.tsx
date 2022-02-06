import React, { FC } from 'react';
import { Project } from '../../types';
import H1 from '../atoms/H1';
import ProjectInfoBox from './ProjectInfoBox';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import serializers from '../../lib/serializers';

type Props = {
  project: Project;
};

const Block: FC = ({ children }) => <p className="text-lg">{children}</p>;

const ProjectHeader: FC<Props> = ({ project }) => {
  const { title, images, textBody } = project;
  const mainImage = images[0]?.asset;
  return (
    <div className="mb-6 lg:mb-8 space-y-8">
      {mainImage && (
        <Image
          src={mainImage.url}
          alt=""
          sizes="(max-width: 1440px) 100vw, 1440px"
          placeholder={mainImage.metadata.lqip ? 'blur' : 'empty'}
          layout="responsive"
          width={mainImage.metadata.dimensions.width}
          height={mainImage.metadata.dimensions.height}
          objectFit="contain"
          blurDataURL={mainImage.metadata.lqip}
        />
      )}
      <H1 className="!text-4xl text-what-brick">{title}</H1>
      <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between space-x-0 xl:space-x-12">
        <div className="flex-2 pb-8 xl:pb-0">
          <PortableText
            value={textBody}
            components={{ ...serializers, block: Block }}
          />
        </div>
        <div>
          <ProjectInfoBox project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
