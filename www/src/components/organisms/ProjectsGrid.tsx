import Link from 'next/link';
import { FC } from 'react';
import { Project } from '../../types';
import { SanityImage } from '../atoms/SanityImage';

type Props = {
  projects: Project[];
};

const ProjectsGrid: FC<Props> = ({ projects }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {projects.map((project) => (
      <Link href={`/projects/${project.path.current}`} key={project._id}>
        <a>
          <div className="flex flex-col">
            <div className="relative flex-1">
              {project.mainImage && (
                <SanityImage
                  img={project.mainImage}
                  sizes="(max-width: 1000px) 50vw, 1440px"
                  layout="responsive"
                  width="300"
                  height="200"
                  objectFit="cover"
                  objectPosition="center"
                  alt={'image for project ' + project.title}
                />
              )}
            </div>
          </div>
        </a>
      </Link>
    ))}
  </div>
);

export default ProjectsGrid;
