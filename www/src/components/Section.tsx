import { FC } from 'react';
import classNames from 'classnames';

type Props = { className?: string };

const Section: FC<Props> = ({ children, className }) => (
  <section className={classNames('mx-8 md:mx-16 lg:mx-32', className)}>
    {children}
  </section>
);

export default Section;
