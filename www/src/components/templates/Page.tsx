import classNames from 'classnames';
import React, { FC } from 'react';
import { siteTitle } from '../../config/defaults';
import Section from '../atoms/Section';
import Header from '../organisms/Header';

type Props = {
  className?: string;
};

const Page: FC<Props> = ({ children, className }) => (
  <Section className="flex flex-col flex-1">
    <Header />
    <main className={classNames('flex flex-col flex-1', className)}>
      {children}
    </main>
  </Section>
);

export default Page;
