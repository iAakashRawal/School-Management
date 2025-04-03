import type { Metadata } from 'next';
import './globals.css';
import '../styles/theme.css';
import '../styles/rtl.css';
import RootLayoutClient from './layout-client';

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'A comprehensive school management system',
  icons: {
    icon: [
      {
        url: '/school-logo.svg',
        type: 'image/svg+xml',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
} 