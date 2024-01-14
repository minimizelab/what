import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="sv">
        <Head />
        <body className="font-space bg-what-white cursor-dot">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
