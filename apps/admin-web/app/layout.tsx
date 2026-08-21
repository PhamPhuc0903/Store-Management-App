import './globals.css';
import {Metadata} from "next";
import {ReactNode} from "react";


export const metadata: Metadata = {
  title: 'StoreManagementApp Admin',
  description: 'Web administration for StoreManagementApp.'
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
