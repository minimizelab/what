import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { siteTitle } from '../src/config/defaults';
import Nav from '../src/components/organisms/Nav';
import Footer from '../src/components/organisms/Footer';

const App = ({ Component, pageProps }: AppProps) => (
  <div className="w-full min-h-screen flex flex-row justify-center">
    <div className="max-w-screen-content w-full flex flex-col">
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
