import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Password Vault - Secure Password Manager',
  description: 'Generate and store passwords securely with client-side encryption',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
