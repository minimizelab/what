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
    <div className="mb-10 lg:mb-20 space-y-10 lg:space-y-20 flex flex-col">
      {mainImage && (
        <div>
          <SanityImage
            img={mainImage}
            alt={'image for project ' + title}
            sizes="(min-width: 1440px) 1280px, 100vw"
            layout="responsive"
            priority
            objectFit="contain"
          />
        </div>
      )}
      <div className="max-w-5xl space-y-6 self-center">
        <H1 className="!text-4xl text-what-brick">{title}</H1>
        <div className="flex flex-row flex-wrap lg:flex-nowrap justify-between lg:space-y-0 space-y-8 space-x-0 lg:space-x-16">
          <div>
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
    </div>
  );
};

export default ProjectHeader;
