import { FC } from 'react';
import { Space_Grotesk } from '@next/font/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { email, siteTitle } from '../src/config/defaults';
import Footer from '../src/components/organisms/Footer';
import { DefaultPageProps } from '../src/types';

type Props = AppProps<DefaultPageProps>;

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
});

const App: FC<Props> = ({ Component, pageProps }) => (
  <>
    <style jsx global>{`
      html {
        font-family: ${spaceGrotesk.style.fontFamily};
      }
    `}</style>
    <div className="w-full min-h-screen flex flex-row justify-center">
      <div className="max-w-screen-content w-full flex flex-col">
        <Head>
          <title>{pageProps?.settings?.title ?? siteTitle}</title>
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
  </>
);

export default App;
