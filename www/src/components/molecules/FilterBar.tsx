import React, { FC } from 'react';
import Link from 'next/link';
import { Category } from '../../types';

type Props = {
  categories: Category[];
};

const FilterBar: FC<Props> = ({ categories }) => (
  <div className="flex flex-row my-8 ">
    {categories.map((category, i) => (
      <span key={category._id}>
        <Link href={`/${category.path.current}`}>
          <a className="mr-2 ml-2">{category.title}</a>
        </Link>
        {i !== categories.length - 1 && '/'}
      </span>
    ))}
  </div>
);

export default FilterBar;
