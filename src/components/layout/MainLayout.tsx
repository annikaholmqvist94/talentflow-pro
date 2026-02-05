import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <TopBar />
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
