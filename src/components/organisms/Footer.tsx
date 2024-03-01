import { FC } from 'react';
import Section from '../atoms/Section';

const Footer: FC<{ email: string; title: string }> = ({ email, title }) => (
  <footer>
    <Section className="flex flex-row justify-between py-12 flex-wrap">
      <a
        className="md:text-3xl text-2xl hover:text-what-red-01 cursor-pointer"
        href={'/'}
      >
        {title}
      </a>
      <a
        className="md:text-3xl text-2xl hover:text-what-red-01 cursor-pointer"
        href={'mailto:' + email}
      >
        {email}
      </a>
    </Section>
  </footer>
);

export default Footer;
