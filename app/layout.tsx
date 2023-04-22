import '@/styles/globals.css';
import Image from 'next/image';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import TwitterIcon from '@/public/icons/twitter-icon.svg';
import Providers from './providers';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <div className="h-screen w-screen xs:w-0 relative">
            <Image
              src={TwitterIcon}
              height={96}
              width={96}
              alt="Welcome to Twitter"
              className="absolute m-auto inset-0"
            />
          </div>
          <div className="max-w-40 min-h-screen w-full border border-gray-200">
            <Providers>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
