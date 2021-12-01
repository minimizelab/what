import classNames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

type Props = { className?: string };

const Header: FC<Props> = ({ children, className }) => (
  <header
    className={classNames('h-40 flex flex-row justify-between', className)}
  >
    <div>{children}</div>
    <div className="flex flex-col content-between text-right justify-between pb-8">
      <Link href="/">
        <a className="text-2xl">WHAT</a>
      </Link>
    </div>
  </header>
);

export default Header;
