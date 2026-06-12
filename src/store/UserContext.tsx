import React, { createContext, useContext, ReactNode } from 'react';
import { useOnboardingStore } from './onboardingStore';
import type { UserRole } from '@/types/onboarding';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const role = useOnboardingStore((s) => s.role);
  const setRole = useOnboardingStore((s) => s.setRole);
  const toggleRole = useOnboardingStore((s) => s.toggleRole);

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
