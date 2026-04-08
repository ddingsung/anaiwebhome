import { AppShell } from '@idp/components/layout/AppShell'

export default function IDPLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
