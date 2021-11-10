import classNames from 'classnames';
import { FC } from 'react';

const H1: FC<{ className?: string }> = ({ children, className }) => {
  return <h1 className={classNames('text-2xl', className)}>{children}</h1>;
};

export default H1;
