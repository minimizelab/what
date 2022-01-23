import React, { FC } from 'react';
import Image from 'next/image';

type Props = {
  img?: string;
};

const ProjectCard: FC<Props> = ({ img }) => {
  return (
    <div className="flex flex-col">
      <div className="relative flex-1">
        {img && (
          <Image
            sizes="(max-width: 1000px) 50vw, 1440px"
            layout="responsive"
            width="300"
            height="200"
            objectFit="cover"
            objectPosition="center"
            src={img}
            alt="Main image"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
