'use client';

import Layout from '@/app/components/Layout/Layout';
import { LayoutProvider } from '@/context/LayoutContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <Layout>{children}</Layout>
    </LayoutProvider>
  );
}
