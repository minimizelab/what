import React, { FC } from 'react';
import { Category } from '../../types';
import H1 from '../atoms/H1';
import TextLarge from '../atoms/TextLarge';
import TextUppercase from '../atoms/TextUppercase';

type Props = {
  title: string;
  category: Category;
  description: string;
  subTitle: string;
};

const ProjectHeader: FC<Props> = ({
  title,
  category,
  description,
  subTitle,
}) => {
  return (
    <div>
      <H1>{title}</H1>
      <div className="border-b border-white" />
      <TextUppercase>{category.title}</TextUppercase>
      <H1>{subTitle}</H1>
      <TextLarge className={'text-what-mushroom'}>{description}</TextLarge>
    </div>
  );
};

export default ProjectHeader;
