import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserRole } from '@/types/onboarding';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('employee');

  const toggleRole = () => {
    setRole(prev => prev === 'employee' ? 'hr' : 'employee');
  };

  return (
    <UserContext.Provider value={{ role, setRole, toggleRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserRole = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserProvider');
  }
  return context;
};
