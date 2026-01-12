import { TimelineProvider } from '@/context/TimelineContext';
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <TimelineProvider>
        {children}
      </TimelineProvider>
    </SessionProvider>
  );
}
