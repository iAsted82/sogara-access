import React from 'react';

interface PWAManagerProps {
  children: React.ReactNode;
}

const PWAManager: React.FC<PWAManagerProps> = ({ children }) => {
  return <>{children}</>;
};

export default PWAManager;