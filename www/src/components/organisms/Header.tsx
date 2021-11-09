import classNames from 'classnames';
import React, { FC } from 'react';
import H1 from '../atoms/H1';

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
      <H1>WHAT</H1>
      <h1>{title}</h1>
    </div>
  </header>
);

export default Header;
