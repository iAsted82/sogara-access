import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  location: string;
  lastLogin: Date;
  permissions: string[];
  employeeId?: string;
  position?: string;
  workSchedule?: WorkSchedule;
  stats?: ReceptionistStats;
  securityLevel?: 'standard' | 'elevated' | 'maximum';
  sites?: string[];
}

interface WorkSchedule {
  monday: { start: string; end: string };
  tuesday: { start: string; end: string };
  wednesday: { start: string; end: string };
  thursday: { start: string; end: string };
  friday: { start: string; end: string };
  saturday: { start: string; end: string; optional: boolean };
  sunday: { start: string; end: string; optional: boolean };
}

interface ReceptionistStats {
  visitorsRegisteredToday: number;
  visitorsRegisteredThisWeek: number;
  visitorsRegisteredThisMonth: number;
  badgesIssuedToday: number;
  averageCheckInTime: number; // En secondes
  satisfactionScore: number; // Sur 5
  packagesReceivedToday: number;
  appointmentsToday: number;
  emergencyContactsAvailable: number;
  vipVisitorsToday: number;
  averageWaitTime: number; // En minutes
  badgesActive: number;
  deliveriesManaged: number;
  securityAlertsToday: number;
}

export type UserRole = 
  | 'ADMIN'
  | 'DG'
  | 'CSD'
  | 'CSI'
  | 'AG'
  | 'ACF'
  | 'SR'
  | 'AC'
  | 'RECEP'; // Réceptionniste SOGARA

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Profils complets des collaborateurs DGDI
const userProfiles = {
  'admin@dgdi.ga': {
    id: 'admin-001',
    firstName: 'Robert',
    lastName: 'NDONG MÉGNE',
    role: 'ADMIN' as const,
    department: 'Administration Système',
    location: 'DGDI Siège Libreville',
    employeeId: 'ADMIN-001',
    position: 'Administrateur Système Principal',
    securityLevel: 'maximum' as const,
    permissions: ['all_permissions', 'system_admin', 'user_management', 'security_config']
  },
  'recep@dgdi.ga': {
    id: 'recep-001',
    role: 'RECEP' as const,
    department: 'Accueil et Orientation',
    location: 'SOGARA Libreville - Hall d\'Accueil Principal',
    employeeId: 'RECEP-001',
    position: 'Réceptionniste Principal SOGARA',
    securityLevel: 'elevated' as const,
    sites: ['SOGARA Libreville', 'SOGARA Port-Gentil', 'SOGARA Franceville'],
    workSchedule: {
      monday: { start: '07:30', end: '16:30' },
      tuesday: { start: '07:30', end: '16:30' },
      wednesday: { start: '07:30', end: '16:30' },
      thursday: { start: '07:30', end: '16:30' },
      friday: { start: '07:30', end: '16:30' },
      saturday: { start: '08:00', end: '12:00', optional: true },
      sunday: { start: '00:00', end: '00:00', optional: true }
    },
    stats: {
      visitorsRegisteredToday: 47,
      visitorsRegisteredThisWeek: 324,
      visitorsRegisteredThisMonth: 1456,
      badgesIssuedToday: 8,
      averageCheckInTime: 180, // 3 minutes
      satisfactionScore: 4.3,
      packagesReceivedToday: 3,
      appointmentsToday: 12,
      emergencyContactsAvailable: 25,
      vipVisitorsToday: 2,
      averageWaitTime: 15,
      badgesActive: 8,
      deliveriesManaged: 7,
      securityAlertsToday: 1
    },
    permissions: [
      'manage_visitors',
      'view_schedules', 
      'manage_appointments',
      'manage_deliveries',
      'view_employee_directory',
      'emergency_contacts',
      'issue_badges',
      'revoke_badges',
      'create_temporary_badges',
      'view_security_cameras',
      'evacuation_management',
      'vip_protocol_access',
      'multi_site_access',
      'ai_document_extraction',
      'visitor_statistics',
      'security_monitoring'
    ]
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier que l'email existe dans les profils actifs
      if (email !== 'admin@dgdi.ga' && email !== 'recep@dgdi.ga') {
        throw new Error('Compte désactivé ou non autorisé');
      }

      // Récupérer le profil utilisateur
      const profile = userProfiles[email as 'admin@dgdi.ga' | 'recep@dgdi.ga'];
      if (!profile) {
        throw new Error('Compte non trouvé dans le système');
      }
      
      const mockUser: User = {
        ...profile,
        email,
        lastLogin: new Date()
      };
      
      setUser(mockUser);
    } catch (error) {
      throw new Error('Échec de la connexion - Vérifiez vos identifiants');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};