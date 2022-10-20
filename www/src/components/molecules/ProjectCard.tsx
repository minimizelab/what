import { FC } from 'react';
import { Project } from '../../types';
import { SanityImage } from '../atoms/SanityImage';

type Props = {
  project: Project;
};

const ProjectCard: FC<Props> = ({ project }) => {
  return (
    <div className="flex flex-col">
      <div className="relative flex-1">
        {project.mainImage && (
          <SanityImage
            img={project.mainImage}
            sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 67vw, 134vw"
            layout="responsive"
            width="4"
            height="3"
            objectFit="cover"
            objectPosition="center"
            alt={'image for project ' + project.title}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
