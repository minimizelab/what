import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { siteTitle } from '../src/config/defaults';
import Nav from '../src/components/organisms/Nav';
import Footer from '../src/components/organisms/Footer';

const App = ({ Component, pageProps }: AppProps) => (
  <div className="w-screen min-h-screen flex flex-row justify-center">
    <div className="max-w-screen-1920 w-full flex flex-col">
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </div>
  </div>
);

export default App;
