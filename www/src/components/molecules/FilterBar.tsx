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
  console.log(router.asPath);
  return (
    <div className="flex flex-row flex-wrap my-8 gap-x-3 gap-y-2">
      <Link href={`/`}>
        <a
          className={classNames('underline-offset-4 cursor-pointer', {
            underline: router.asPath === '/' || router.asPath === '',
          })}
        >
          Alla {console.log(router.asPath)}
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
