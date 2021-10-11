import { FC } from 'react';
import Section from './Section';

const Header: FC<{ title: string }> = ({ title }) => (
  <header>
    <Section>
      <h1>{title}</h1>
    </Section>
  </header>
);

export default Header;
