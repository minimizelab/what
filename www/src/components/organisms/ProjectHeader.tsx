import React, { FC } from 'react';
import { Category } from '../../types';
import H1 from '../atoms/H1';
import TextLarge from '../atoms/TextLarge';
import TextUppercase from '../atoms/TextUppercase';

type Props = {
  title: string;
  categories: Category[];
  description: string;
  subTitle: string;
};

const ProjectHeader: FC<Props> = ({
  title,
  categories,
  description,
  subTitle,
}) => {
  return (
    <div className="mb-6">
      <H1>{title}</H1>
      <TextUppercase>
        {categories.map((category) => category.title)}
      </TextUppercase>
      <H1>{subTitle}</H1>
      <TextLarge className={'text-what-mushroom'}>{description}</TextLarge>
    </div>
  );
};

export default ProjectHeader;
