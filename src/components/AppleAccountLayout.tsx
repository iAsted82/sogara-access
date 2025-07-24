import React, { useState } from 'react';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { AppleAccountNavigation } from './AppleAccountNavigation';
import UserAccount from './screens/AppleUserAccount';
import { useAuth } from '../contexts/AuthContext';

interface AppleAccountLayoutProps {
  children?: React.ReactNode;
  onBack?: () => void;
}

export const AppleAccountLayout: React.FC<AppleAccountLayoutProps> = ({ 
  children,
  onBack
}) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Mobile & Desktop */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Back Button */}
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center text-blue-600 font-medium gap-1 hover:text-blue-700 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Retour</span>
              </button>
            )}
            
            <h1 className="text-2xl font-bold">Espace Utilisateur</h1>
            
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar Navigation */}
        <div className={`
          fixed md:relative inset-y-0 left-0 transform z-50 md:z-0 w-64 bg-white
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:w-72 md:shrink-0 md:transform-none
        `}>
          <AppleAccountNavigation 
            onNavigate={(itemId) => {
              setActiveSection(itemId);
              setIsSidebarOpen(false);
            }}
            activeItem={activeSection}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-auto">
          <UserAccount />
        </main>
      </div>
    </div>
  );
};