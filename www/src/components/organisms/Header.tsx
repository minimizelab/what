import classNames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

type Props = { className?: string; filterBar?: React.ReactNode };

const Header: FC<Props> = ({ children, className, filterBar }) => (
  <header
    className={classNames('h-64 flex flex-col justify-between', className)}
  >
    <div className="flex flex-row justify-between">
      <div>{children}</div>
      <div className="flex flex-col content-between text-right justify-between pb-8">
        <Link href="/">
          <a className="text-2xl">WHAT</a>
        </Link>
      </div>
    </div>
    {filterBar && filterBar}
  </header>
);

export default Header;
