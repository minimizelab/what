import React, { FC } from 'react';
import Image from 'next/image';
import { Category } from '../types';
import H1 from './atoms/H1';
import TextUppercase from './atoms/TextUppercase';

type Props = {
  img?: string;
  title: string;
  category?: Category;
};

const ProjectCard: FC<Props> = ({ img, title, category }) => {
  return (
    <div className="h-96 bg-white flex flex-col shadow-md hover:shadow-2xl transition ease-in-out duration-300">
      <div className="pt-8 px-8 pb-6 flex-1">
        <H1>{title}</H1>
        <TextUppercase>{category?.title}</TextUppercase>
      </div>
      <div className="w-full h-3/4 relative">
        {img && (
          <Image
            layout="fill"
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
