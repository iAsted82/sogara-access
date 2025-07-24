import React from 'react';
import { AppleAccountLayout } from '../components/AppleAccountLayout';
import { useAuth } from '../contexts/AuthContext';

const UserAccountPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace utilisateur...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppleAccountLayout />
  );
};

export default UserAccountPage;