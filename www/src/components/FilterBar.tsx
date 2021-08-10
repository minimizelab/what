import React, { FC } from 'react';
import { Category } from '../types';

type Props = {
  categories: Category[];
};

const FilterBar: FC<Props> = ({ categories }) => <div>Filter Bar</div>;

export default FilterBar;
