import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface Props {
  className?: string;
  white?: boolean;
}

const TextLarge: FunctionComponent<Props> = ({ children, className }) => (
  <p className={classNames('text-lg', className)}>{children}</p>
);

export default TextLarge;
