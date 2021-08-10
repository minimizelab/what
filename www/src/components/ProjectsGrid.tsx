import React, { FC } from 'react';
import { Project } from '../types';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => <div>Projects Grid</div>;

export default ProjectsGrid;
