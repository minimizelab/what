import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
}

const TextMedium: FunctionComponent<Props> = ({ children, className }) => (
  <p className={classNames('text-md', className)}>{children}</p>
);

export default TextMedium;
