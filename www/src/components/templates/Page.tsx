import React, { FC } from 'react';

type Props = {
  title: string;
};

const Page: FC<Props> = ({ children, title }) => (
  <>
    <header className="px-8 md:px-16 lg:px-32">
      <h1>{title}</h1>
    </header>
    <main className="flex-1 px-8 md:px-16 lg:px-32">{children}</main>
  </>
);

export default Page;
