import { Sidebar } from './Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar />
      <main className="ml-16 min-h-screen">
        {children}
      </main>
    </div>
  )
}
