import Link from 'next/link';
import { FC } from 'react';
import { Project } from '../../types';
import ProjectCard from '../molecules/ProjectCard';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {projects.map((project) => (
      <Link href={`/projects/${project.path.current}`} key={project._id}>
        <a>
          <ProjectCard img={project.mainImage?.url} />
        </a>
      </Link>
    ))}
  </div>
);

export default ProjectsGrid;
