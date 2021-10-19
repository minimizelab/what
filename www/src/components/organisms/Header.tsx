import { FC } from 'react';
import Section from '../atoms/Section';

type Props = { title: string; className?: string };

const Header: FC<Props> = ({ title, children, className }) => (
  <header>
    <Section className={className}>
      <h1>{title}</h1>
      {children}
    </Section>
  </header>
);

export default Header;
