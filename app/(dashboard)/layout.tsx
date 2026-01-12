import Layout from '@/app/components/Layout/Layout';
import { TimelineProvider } from '@/context/TimelineContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LayoutProvider>
        <TimelineProvider>
          <Layout>{children}</Layout>
        </TimelineProvider>
      </LayoutProvider>
    </SessionProvider>
  );
}
