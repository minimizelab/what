import React, { FC } from 'react';
import Section from '../atoms/Section';

const Footer: FC = () => (
  <footer>
    <Section className="flex flex-row py-12">
      {/* <div className="flex flex-col mr-2 h-full">icon</div> */}
      <div className="flex flex-col flex-1">
        <p>get in touch?</p>
        <a className="text-2xl" href="mailto:hello@whats.se">
          hello@whats.se
        </a>
      </div>
    </Section>
  </footer>
);

export default Footer;
