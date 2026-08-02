import DashboardLayout from '@/components/DashboardLayout'

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
