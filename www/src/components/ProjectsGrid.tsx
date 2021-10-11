import React, { FC } from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 md:grid-flow-col">
    {projects.map((project) => (
      <ProjectCard
        key={project._id}
        category={project.category}
        img={project.mainImage?.url}
        title={project.title}
      />
    ))}
  </div>
);

export default ProjectsGrid;
