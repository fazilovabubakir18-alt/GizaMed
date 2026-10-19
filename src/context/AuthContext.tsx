import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';

interface AuthContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
    branchId: string;
    avatarUrl?: string;
  };
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export') => boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, Record<string, string[]>> = {
  super_admin: {
    '*': ['view', 'create', 'edit', 'delete', 'export']
  },
  branch_manager: {
    dashboard: ['view', 'export'],
    students: ['view', 'create', 'edit', 'export'],
    teachers: ['view', 'create', 'edit', 'delete', 'export'],
    courses: ['view', 'create', 'edit'],
    schedule: ['view', 'create', 'edit'],
    attendance: ['view', 'edit', 'export'],
    homework: ['view'],
    crm: ['view', 'create', 'edit', 'export'],
    contracts: ['view', 'create', 'edit', 'export'],
    finance: ['view', 'create', 'export'],
    branches: ['view'],
    aiAssistant: ['view'],
    reports: ['view', 'export'],
    support: ['view', 'create'],
    settings: ['view', 'edit']
  },
  admin: {
    dashboard: ['view'],
    students: ['view', 'create', 'edit', 'export'],
    teachers: ['view', 'create', 'edit', 'delete'],
    courses: ['view', 'create', 'edit'],
    schedule: ['view', 'create', 'edit'],
    attendance: ['view', 'edit'],
    homework: ['view'],
    crm: ['view', 'create', 'edit'],
    contracts: ['view', 'create', 'edit', 'export'],
    finance: ['view', 'create'],
    branches: ['view'],
    aiAssistant: ['view'],
    reports: ['view'],
    support: ['view', 'create'],
    settings: ['view']
  },
  crm_manager: {
    dashboard: ['view'],
    crm: ['view', 'create', 'edit', 'export'],
    students: ['view', 'create'],
    teachers: ['view'],
    courses: ['view'],
    contracts: ['view', 'create'],
    schedule: ['view'],
    support: ['view', 'create'],
    settings: ['view']
  },
  cashier: {
    dashboard: ['view'],
    finance: ['view', 'create', 'edit', 'export'],
    students: ['view'],
    teachers: ['view'],
    contracts: ['view'],
    reports: ['view', 'export'],
    support: ['view', 'create'],
    settings: ['view']
  },
  teacher: {
    dashboard: ['view'],
    teachers: ['view'],
    courses: ['view'],
    schedule: ['view'],
    attendance: ['view', 'create', 'edit'],
    homework: ['view', 'create', 'edit', 'delete'],
    students: ['view'],
    support: ['view', 'create'],
    settings: ['view']
  },
  student_parent: {
    dashboard: ['view'],
    teachers: ['view'],
    schedule: ['view'],
    attendance: ['view'],
    homework: ['view', 'create'], // submit
    contracts: ['view', 'edit'],   // view & sign
    finance: ['view'],            // receipts & payments
    support: ['view', 'create'],
    settings: ['view']
  },
  support_agent: {
    dashboard: ['view'],
    support: ['view', 'create', 'edit'],
    settings: ['view']
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');

  const currentUser = {
    id: currentRole === 'teacher' ? 'stf-3' : currentRole === 'student_parent' ? 'stu-1' : 'stf-1',
    name: currentRole === 'super_admin' ? 'Farhod Qodirov (Direktor)' :
          currentRole === 'teacher' ? 'Sardorbek Alimov (O‘qituvchi)' :
          currentRole === 'crm_manager' ? 'Azizbek Rahmonov (Sotuv)' :
          currentRole === 'cashier' ? 'Shahnoza Usmonova (Kassir)' :
          currentRole === 'branch_manager' ? 'Dilnoza Karimova (Chilonzor)' :
          currentRole === 'student_parent' ? 'Javohir Tursunov (Talaba)' : 'Administrator',
    email: 'admin@eduverse.uz',
    branchId: 'br-1',
    avatarUrl: '/src/assets/images/avatar_director_1792036219459.jpg'
  };

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export'): boolean => {
    if (currentRole === 'super_admin') return true;
    const permissions = ROLE_PERMISSIONS[currentRole];
    if (!permissions) return false;
    if (permissions['*']?.includes(action)) return true;
    const modulePerms = permissions[module];
    if (!modulePerms) return false;
    return modulePerms.includes(action);
  };

  return (
    <AuthContext.Provider value={{
      currentRole,
      setCurrentRole,
      currentUser,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
