import { FC } from 'react';
import classNames from 'classnames';

type Props = { className?: string };

const Section: FC<Props> = ({ children, className }) => (
  <section className={classNames('mx-8 sm:mx-16', className)}>
    {children}
  </section>
);

export default Section;
