import React, { FC } from 'react';

type Props = {
  title: string;
};

const Page: FC<Props> = ({ children, title }) => (
  <>
    <header>
      <h1>{title}</h1>
    </header>
    <main className="flex-1">{children}</main>
  </>
);

export default Page;
