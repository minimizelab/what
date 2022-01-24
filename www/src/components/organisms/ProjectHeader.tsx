import React, { FC } from 'react';
import { Project } from '../../types';
import H1 from '../atoms/H1';
import TextLarge from '../atoms/TextLarge';
/* import TextUppercase from '../atoms/TextUppercase'; */
import ProjectInfoBox from './ProjectInfoBox';
import Image from 'next/image';

type Props = {
  project: Project;
};

const ProjectHeader: FC<Props> = ({ project }) => {
  const { title, description, mainImage /* categories , subTitle*/ } = project;
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
          {/*    <TextUppercase>
            {categories.map((category) => category.title)}
          </TextUppercase>
          <H1>{subTitle}</H1> */}
          <TextLarge>{description}</TextLarge>
        </div>
        <div className="flex-1">
          <ProjectInfoBox project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
