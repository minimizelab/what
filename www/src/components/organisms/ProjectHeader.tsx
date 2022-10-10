import { FC, ReactNode } from 'react';
import { Project } from '../../types';
import H1 from '../atoms/H1';
import ProjectInfoBox from './ProjectInfoBox';
import { PortableText } from '@portabletext/react';
import serializers from '../../lib/serializers';
import { SanityImage } from '../atoms/SanityImage';

type Props = {
  project: Project;
};

const Block: FC<{ children?: ReactNode }> = ({ children }) => (
  <p className="text-md">{children}</p>
);

const ProjectHeader: FC<Props> = ({ project }) => {
  const { title, images, textBody } = project;
  const mainImage = images[0]?.asset;
  return (
    <div className="mb-6 lg:mb-8 space-y-8">
      {mainImage && (
        <SanityImage
          img={mainImage}
          alt={'image for project ' + title}
          sizes="(max-width: 1440px) 100vw, 1440px"
          layout="responsive"
          objectFit="contain"
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
