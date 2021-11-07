import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
}

const TextUppercase: FunctionComponent<Props> = ({ children, className }) => (
  <p className={classNames('uppercase tracking-wider text-xs', className)}>
    {children}
  </p>
);

export default TextUppercase;
