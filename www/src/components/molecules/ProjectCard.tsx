import classNames from 'classnames';
import Link from 'next/link';
import { FC, useState } from 'react';
import { Project } from '../../types';
import { SanityImage } from '../atoms/SanityImage';

type Props = {
  project: Project;
  prio?: boolean;
};

const ProjectCard: FC<Props> = ({ project, prio = false }) => {
  const [hover, setHover] = useState<boolean>(false);
  const projectPath = `/projekt/${project.path.current}`;
  return (
    <div className="flex flex-col">
      <Link
        href={projectPath}
        className="relative flex-1 cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {project.mainImage && (
          <SanityImage
            img={project.mainImage}
            sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 67vw, 134vw"
            layout="responsive"
            width="400"
            height="300"
            objectFit="cover"
            priority={prio}
            objectPosition="center"
            alt={'image for project ' + project.title}
          />
        )}
      </Link>
      <Link
        href={projectPath}
        className={classNames(
          'pt-2 self-start hover:text-what-red-01 cursor-pointer text-base',
          hover && 'text-what-red-01'
        )}
      >
        {project.title}
      </Link>
    </div>
  );
};

export default ProjectCard;
