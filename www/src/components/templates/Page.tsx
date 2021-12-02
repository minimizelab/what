import classNames from 'classnames';
import Head from 'next/head';
import React, { FC } from 'react';
import { siteTitle } from '../../config/defaults';
import Section from '../atoms/Section';
import Header from '../organisms/Header';

type Props = {
  title?: string;
  className?: string;
};

const Page: FC<Props> = ({ children, title = siteTitle, className }) => (
  <Section className="flex flex-col flex-1">
    <Head>
      <title>{title}</title>
    </Head>
    <Header title={title} />
    <main className={classNames('flex flex-col flex-1', className)}>
      {children}
    </main>
  </Section>
);

export default Page;
