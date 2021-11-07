import React, { FC } from 'react';
import Section from '../atoms/Section';
import TextUppercase from '../atoms/TextUppercase';

const Nav: FC = () => (
  <nav className="mt-8 relative">
    <Section className="absolute">
      <TextUppercase className="text-lg">PROJEKT</TextUppercase>
      <TextUppercase className="text-lg">STUDIO</TextUppercase>
      <TextUppercase className="text-lg">TJÄNSTER</TextUppercase>
    </Section>
  </nav>
);

export default Nav;
