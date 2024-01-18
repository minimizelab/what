import { FC } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { email, siteTitle } from '../src/config/defaults';
import Footer from '../src/components/organisms/Footer';
import { DefaultPageProps } from '../src/types';
import { Montserrat, IBM_Plex_Mono } from '@next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const IBMPlexMono = IBM_Plex_Mono({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

type Props = AppProps<DefaultPageProps>;

const App: FC<Props> = ({ Component, pageProps }) => (
  <div
    className={`${montserrat.variable} ${IBMPlexMono.variable} w-full min-h-screen flex flex-row justify-center font-what font-medium`}
  >
    <div className="max-w-screen-content w-full flex flex-col">
      <Head>
        <title>{pageProps?.settings?.title ?? siteTitle}</title>
        <link rel="shortcut icon" type="image/jpg" href="favicon.png" />
        <meta property="og:url" content={`https://www.whats.se`}></meta>
        <meta
          property="og:title"
          content={pageProps?.settings?.title ?? siteTitle}
        />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
      <Footer email={pageProps?.settings?.email ?? email} />
    </div>
  </div>
);

export default App;
