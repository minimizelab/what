import React, { FC } from 'react';
import Link from 'next/link';
import { Category } from '../types';

type Props = {
  categories: Category[];
};

const FilterBar: FC<Props> = ({ categories }) => (
  <div className="flex flex-row">
    <Link href="/">
      <a className="mr-3 underline">Featured</a>
    </Link>
    {categories.map((category) => (
      <Link key={category.id} href={category.slug}>
        <a className="mr-3 underline">{category.title}</a>
      </Link>
    ))}
  </div>
);

export default FilterBar;
