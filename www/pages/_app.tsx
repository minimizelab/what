import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { email, siteTitle } from '../src/config/defaults';
import Footer from '../src/components/organisms/Footer';
import { DefaultPageProps } from '../src/types';

type Props = AppProps<DefaultPageProps>;

const App: FC<Props> = ({ Component, pageProps }) => (
  <div className="w-full min-h-screen flex flex-row justify-center">
    <div className="max-w-screen-content w-full flex flex-col">
      <Head>
        <title>{pageProps?.settings?.title ?? siteTitle}</title>
      </Head>
      <Component {...pageProps} />
      <Footer email={pageProps?.settings?.email ?? email} />
    </div>
  </div>
);

export default App;
