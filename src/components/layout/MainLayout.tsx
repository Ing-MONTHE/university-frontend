import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Contenu principal - BIEN ESPACÉ */}
      <main className="ml-72 pt-20">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;