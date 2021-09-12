import React, { FC } from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <div className="grid grid-cols-3 gap-4">
    {projects.map((project) => (
      <ProjectCard
        key={project._id}
        img={project.mainImage?.url}
        title={project.title}
      />
    ))}
  </div>
);

export default ProjectsGrid;
