import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ClientProviders from '@/components/providers/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EasyHome - Pasar Properti Digital Indonesia',
  description: 'Temukan properti impian Anda dengan harga transparan dan transaksi langsung tanpa broker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <Toaster position="top-right" />
        </ClientProviders>
      </body>
    </html>
  );
}
