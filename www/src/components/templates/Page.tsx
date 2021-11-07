import React, { FC } from 'react';
import { siteTitle } from '../../config/defaults';
import Section from '../atoms/Section';
import Header from '../organisms/Header';

type Props = {
  title?: string;
};

const Page: FC<Props> = ({ children, title }) => (
  <Section className="flex flex-col flex-1">
    <Header title={title ?? siteTitle} />
    <main className="flex flex-col flex-1">{children}</main>
  </Section>
);

export default Page;
