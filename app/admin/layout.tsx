import { AdminThemeProvider } from '@/components/admin/admin-theme-provider'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>
}
