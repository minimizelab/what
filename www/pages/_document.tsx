import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <body className="font-space">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
