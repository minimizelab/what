import { FC } from 'react';
import classNames from 'classnames';

const Section: FC<{ className?: string }> = ({ children, className }) => (
  <section className={classNames('mx-8 md:mx-16 lg:mx-32', className)}>
    {children}
  </section>
);

export default Section;
