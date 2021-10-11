import React, { FC } from 'react';
import Header from './Header';

type Props = {
  title: string;
};

const Page: FC<Props> = ({ children, title }) => (
  <>
    <Header title={title} />
    <main className="flex-1">{children}</main>
  </>
);

export default Page;
