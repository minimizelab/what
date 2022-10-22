import { FC } from 'react';
import Section from '../atoms/Section';

const Footer: FC<{ email: string }> = ({ email }) => (
  <footer>
    <Section className="flex flex-row justify-between pt-16 pb-12 flex-wrap">
      <a
        className="md:text-3xl text-2xl hover:text-what-brick cursor-pointer"
        href={'/'}
      >
        what! arkitektur
      </a>
      <a
        className="md:text-3xl text-2xl hover:text-what-brick cursor-pointer"
        href={'mailto:' + email}
      >
        {email}
      </a>
    </Section>
  </footer>
);

export default Footer;
