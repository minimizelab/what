import { FC } from 'react';
import { Project } from '../../types';
import ProjectCard from '../molecules/ProjectCard';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-8">
    {projects.map((project, i) => (
      <ProjectCard key={project._id} project={project} prio={i < 3} />
    ))}
  </div>
);

export default ProjectsGrid;
