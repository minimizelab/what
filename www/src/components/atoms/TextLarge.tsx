import classNames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';

interface Props {
  className?: string;
  white?: boolean;
  children?: ReactNode;
}

const TextLarge: FunctionComponent<Props> = ({ children, className }) => (
  <p className={classNames('text-lg', className)}>{children}</p>
);

export default TextLarge;
