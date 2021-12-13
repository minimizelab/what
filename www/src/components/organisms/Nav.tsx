import Link from 'next/link';
import React, { FC } from 'react';
import Section from '../atoms/Section';
import TextUppercase from '../atoms/TextUppercase';

const Nav: FC = () => (
  <nav className="mt-8 sm:mt-12 relative">
    <Section className="absolute">
      <TextUppercase className="text-lg">
        <Link href="/">PROJEKT</Link>
      </TextUppercase>
      <TextUppercase className="text-lg">
        <Link href="/studio">STUDIO </Link>
      </TextUppercase>
    </Section>
  </nav>
);

export default Nav;
