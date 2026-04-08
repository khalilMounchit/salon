import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Salon Booking',
  description: 'A mobile-first salon booking experience with fast checkout.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
