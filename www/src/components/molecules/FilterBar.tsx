import React, { FC } from 'react';
import Link from 'next/link';
import { Category } from '../../types';
import { useRouter } from 'next/router';
import classNames from 'classnames';

type Props = {
  categories: Category[];
};

const FilterBar: FC<Props> = ({ categories }) => {
  const router = useRouter();
  return (
    <div className="flex flex-row flex-wrap pt-8 gap-x-3 gap-y-2">
      <Link href={`/`}>
        <a
          className={classNames(
            'cursor-pointer hover:text-what-brick',
            (router.asPath === '/' || router.asPath === '') && 'text-what-brick'
          )}
        >
          alla
        </a>
      </Link>
      {categories.map((category) => (
        <span key={category._id}>
          <Link href={`/${category.path.current}`}>
            <a
              className={classNames(
                'cursor-pointer hover:text-what-brick',
                router.asPath === '/' + category.path.current &&
                  'text-what-brick'
              )}
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
