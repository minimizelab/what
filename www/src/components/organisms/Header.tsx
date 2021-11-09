import classNames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

type Props = { title: string; className?: string };

const Header: FC<Props> = ({ title, children, className }) => (
  <header
    className={classNames(
      'h-60 border-b border-white flex flex-row justify-between',
      className
    )}
  >
    <div>{children}</div>
    <div className="flex flex-col content-between text-right justify-between pb-8">
      <Link href="/">
        <a className="text-2xl">WHAT</a>
      </Link>
      <h1>{title}</h1>
    </div>
  </header>
);

export default Header;
