import React, { FC } from 'react';
import { Project } from '../types';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <div>
    <h1>Projects Grid</h1>
    <ul>
      {projects.map((project) => (
        <li key={project._id}>{project.title}</li>
      ))}
    </ul>
  </div>
);

export default ProjectsGrid;
