import React from 'react';

export const metadata = {
  title: 'What! Arkitektur',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="bg-what-white cursor-dot">{children}</body>
    </html>
  );
}
