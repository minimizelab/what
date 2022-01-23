import React, { FC } from 'react';
import { Category, Project } from '../../types';
import H1 from '../atoms/H1';
import TextLarge from '../atoms/TextLarge';
import TextUppercase from '../atoms/TextUppercase';
import ProjectInfoBox from './ProjectInfoBox';

type Props = {
  project: Project;
};

const ProjectHeader: FC<Props> = ({ project }) => {
  const { title, categories, description, subTitle } = project;
  return (
    <div className="mb-6">
      <H1>{title}</H1>
      <div className="flex flex-row justify-between">
        <div>
          <TextUppercase>
            {categories.map((category) => category.title)}
          </TextUppercase>
          <H1>{subTitle}</H1>
          <TextLarge className={'text-what-mushroom'}>{description}</TextLarge>
        </div>
        <ProjectInfoBox project={project} />
      </div>
    </div>
  );
};

export default ProjectHeader;
