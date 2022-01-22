import classNames from 'classnames';
import Head from 'next/head';
import React, { FC } from 'react';
import { siteTitle } from '../../config/defaults';
import { Settings } from '../../types';
import Section from '../atoms/Section';
import Header from '../organisms/Header';

type Props = {
  className?: string;
  filterBar?: React.ReactNode;
  title?: string;
  settings: Settings;
};

const Page: FC<Props> = ({
  children,
  title = siteTitle,
  className,
  filterBar,
  settings,
}) => (
  <Section className="flex flex-col flex-1">
    <Head>
      <title>{title}</title>
    </Head>
    <Header filterBar={filterBar} logotype={settings.logotype} />
    <main className={classNames('flex flex-col flex-1', className)}>
      {children}
    </main>
  </Section>
);

export default Page;
