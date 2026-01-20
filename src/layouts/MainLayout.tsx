import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar fixe */}
            <Sidebar />
            {/* Contenu principal */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Header */}
                <Header />
                {/* Contenu de la page */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;