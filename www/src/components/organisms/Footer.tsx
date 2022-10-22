import { FC } from 'react';
import Section from '../atoms/Section';

const Footer: FC<{ email: string }> = ({ email }) => (
  <footer>
    <Section className="flex flex-row justify-between py-12 flex-wrap">
      <div className="sm:text-2xl text-xl">what! arkitektur</div>
      <a
        className="sm:text-2xl text-xl hover:text-what-brick cursor-pointer"
        href={'mailto:' + email}
      >
        {email}
      </a>
    </Section>
  </footer>
);

export default Footer;
