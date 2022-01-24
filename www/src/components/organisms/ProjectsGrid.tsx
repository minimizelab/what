import Link from 'next/link';
import React, { FC } from 'react';
import { Project } from '../../types';
import ProjectCard from '../molecules/ProjectCard';
import { LayoutGroup, motion } from 'framer-motion';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <LayoutGroup>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {projects.map((project) => (
        <motion.div
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
          layout
          key={project._id}
        >
          <Link href={`/projects/${project.path.current}`}>
            <a>
              <ProjectCard img={project.mainImage?.url} />
            </a>
          </Link>
        </motion.div>
      ))}
    </div>
  </LayoutGroup>
);

export default ProjectsGrid;
