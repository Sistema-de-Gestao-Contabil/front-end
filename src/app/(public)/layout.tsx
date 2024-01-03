import '../../styles/globals.css'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import MarginWidthWrapper from '@/components/margin-width-wrapper';
import PageWrapper from '@/components/page-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestão Contábil',
  description: 'Sistema de gestão contábil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white${inter.className}`}>
        <div className="flex">
          <main className="flex-1">
           
            <PageWrapper>{children}</PageWrapper>
           
          </main>
        </div>
      </body>
    </html>
  );
}
