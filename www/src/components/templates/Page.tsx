import classNames from 'classnames';
import React, { FC } from 'react';
import Section from '../atoms/Section';
import Header from '../organisms/Header';

type Props = {
  className?: string;
  filterBar?: React.ReactNode;
};

const Page: FC<Props> = ({ children, className, filterBar }) => (
  <Section className="flex flex-col flex-1">
    <Header filterBar={filterBar} />
    <main className={classNames('flex flex-col flex-1', className)}>
      {children}
    </main>
  </Section>
);

export default Page;
