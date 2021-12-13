import React, { FC } from 'react';
import Link from 'next/link';
import { Category } from '../../types';
import { useRouter } from 'next/router';

type Props = {
  categories: Category[];
};

const FilterBar: FC<Props> = ({ categories }) => {
  const router = useRouter();
  return (
    <div className="flex flex-row flex-wrap my-8 gap-x-3 gap-y-2">
      <Link href={`/`}>
        <a
          className={`${
            router.asPath === '/' && 'underline'
          } underline-offset-4 cursor-pointer`}
        >
          Alla{' '}
        </a>
      </Link>
      {categories.map((category) => (
        <span key={category._id}>
          <Link href={`/${category.path.current}`}>
            <a
              className={`${
                router.asPath === '/' + category.path.current && 'underline'
              } underline-offset-4 cursor-pointer
                `}
            >
              {category.title}
            </a>
          </Link>
        </span>
      ))}
    </div>
  );
};

export default FilterBar;
