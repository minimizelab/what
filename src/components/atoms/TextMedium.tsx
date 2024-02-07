import { FC, ReactNode } from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
  children?: ReactNode;
}

const TextMedium: FC<Props> = ({ children, className }) => (
  <p className={classNames('text-md', className)}>{children}</p>
);

export default TextMedium;
