import React, { FC } from 'react';
import Section from './Section';

const Footer: FC = () => (
  <footer>
    <Section className="flex flex-row border-t-2 border-white py-12">
      <div className="flex flex-col mr-2">icon</div>
      <div className="flex flex-col flex-1">Text</div>
    </Section>
  </footer>
);

export default Footer;
