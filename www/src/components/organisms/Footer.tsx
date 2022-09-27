import { FC } from 'react';
import Section from '../atoms/Section';

const Footer: FC<{ email: string }> = ({ email }) => (
  <footer>
    <Section className="flex flex-row justify-between py-12 flex-wrap">
      <div className="text-3xl">what! arkitektur</div>
      <a className="text-3xl hover:text-what-brick" href={'mailto:' + email}>
        {email}
      </a>
    </Section>
  </footer>
);

export default Footer;
