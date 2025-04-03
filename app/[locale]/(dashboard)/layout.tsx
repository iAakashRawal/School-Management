'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';

export default function Layout({ 
  children, 
  params
}: { 
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <DashboardLayout locale={params.locale}>
      {children}
    </DashboardLayout>
  );
} 