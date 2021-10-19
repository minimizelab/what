import Link from 'next/link';
import React, { FC } from 'react';
import { Project } from '../../types';
import Section from '../atoms/Section';
import ProjectCard from '../molecules/ProjectCard';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 md:grid-flow-col">
    {projects.map((project) => (
      <Link href={`projects/${project.path.current}`} key={project._id}>
        <a>
          <ProjectCard
            category={project.category}
            img={project.mainImage?.url}
            title={project.title}
          />
        </a>
      </Link>
    ))}
  </Section>
);

export default ProjectsGrid;
