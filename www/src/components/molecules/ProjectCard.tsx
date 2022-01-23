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
