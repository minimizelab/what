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
    <div className="h-500 flex flex-col">
      <div className="relative flex-1">
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
      <H1>{title}</H1>
      <TextUppercase className="text-opacity-50">
        {categories?.map(({ title }, i) =>
          i === categories.length - 1 ? title : `${title} / `
        )}
      </TextUppercase>
    </div>
  );
};

export default ProjectCard;
