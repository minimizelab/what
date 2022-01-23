import React, { FC } from 'react';
import Image from 'next/image';
import { Category } from '../../types';
import H1 from '../atoms/H1';
import TextUppercase from '../atoms/TextUppercase';

type Props = {
  img?: string;
  title: string;
  categories?: Category[];
};

const ProjectCard: FC<Props> = ({ img, title, categories }) => {
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
