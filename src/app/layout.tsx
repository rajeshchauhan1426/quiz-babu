import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuizBabu',
  description: 'A ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col h-full">
        <div className="flex-grow">{children}</div>
        <footer className="text-center p-4 bg-background text-muted-foreground text-sm">
          © 2025 Rajesh Chauhan. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
