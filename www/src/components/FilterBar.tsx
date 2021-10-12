import React, { FC } from 'react';
import Link from 'next/link';
import { Category } from '../types';
import Section from './Section';

type Props = {
  categories: Category[];
};

const FilterBar: FC<Props> = ({ categories }) => (
  <Section className="flex flex-row">
    <Link href="/">
      <a className="mr-3 underline">Featured</a>
    </Link>
    {categories.map((category) => (
      <Link key={category._id} href={`/${category.path.current}`}>
        <a className="mr-3 underline">{category.title}</a>
      </Link>
    ))}
  </Section>
);

export default FilterBar;
