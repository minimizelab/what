import Link from 'next/link';
import React, { FC } from 'react';
import Section from '../atoms/Section';
import TextLarge from '../atoms/TextLarge';
import TextUppercase from '../atoms/TextUppercase';

const Nav: FC = () => (
  <nav className="flex flex-row space-x-6 flex-wrap sm:flex-nowrap h-full items-end">
    <TextLarge className="!text-2xl hover:text-what-brick">
      <Link href="/">projekt</Link>
    </TextLarge>
    <TextLarge className="!text-2xl hover:text-what-brick">
      <Link href="/studio">studio </Link>
    </TextLarge>
  </nav>
);

export default Nav;
