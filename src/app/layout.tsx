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
      <body className="font-body antialiased flex flex-col h-full">
        <div className="flex-grow">{children}</div>
        <footer className="text-center p-4 bg-background text-muted-foreground text-sm">
          © 2025 Rajesh Chauhan. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
