import Link from 'next/link';
import React, { FC } from 'react';
import TextLarge from '../atoms/TextLarge';

const Nav: FC = () => (
  <nav className="flex flex-row space-x-6 flex-wrap sm:flex-nowrap h-full items-end">
    <TextLarge className="!text-3xl hover:text-what-brick">
      <Link href="/">projekt</Link>
    </TextLarge>
    <TextLarge className="!text-3xl hover:text-what-brick">
      <Link href="/studio">studio </Link>
    </TextLarge>
  </nav>
);

export default Nav;
