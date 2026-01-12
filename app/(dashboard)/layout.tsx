import Layout from '@/app/components/Layout/Layout';
import { TimelineProvider } from '@/context/TimelineContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimelineProvider>
      <Layout>{children}</Layout>
    </TimelineProvider>
  );
}
