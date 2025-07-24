import { StaffMember } from '../types/staff';

/**
 * Sample data for Staff Management Module
 */
export const staffData: StaffMember[] = [
  {
    id: 'staff-001',
    firstName: 'Jean',
    lastName: 'NGUEMA',
    function: 'Chef Service Documentation',
    department: 'Documentation',
    internalPhone: '4001',
    email: 'jean.nguema@sogara.ga',
    isAvailable: true,
    location: 'Bureau 203, Bâtiment A',
    lastSeen: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'Chef de Service',
    skills: ['Management', 'Documentation', 'Administration'],
    languages: ['Français', 'Anglais']
  },
  {
    id: 'staff-002',
    firstName: 'Marie',
    lastName: 'AKUE',
    function: 'Agent de Guichet',
    department: 'Documentation',
    internalPhone: '4002',
    email: 'marie.akue@sogara.ga',
    isAvailable: true,
    location: 'Guichet 3, Rez-de-chaussée',
    lastSeen: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    role: 'Agent',
    skills: ['Accueil', 'Traitement Dossiers'],
    languages: ['Français']
  },
  {
    id: 'staff-003',
    firstName: 'Paul',
    lastName: 'OBIANG',
    function: 'Chef Service Immigration',
    department: 'Immigration',
    internalPhone: '5001',
    email: 'paul.obiang@sogara.ga',
    isAvailable: false,
    location: 'Bureau 305, Bâtiment B',
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    role: 'Chef de Service',
    skills: ['Immigration', 'Visas', 'Relations Internationales'],
    languages: ['Français', 'Anglais', 'Espagnol']
  },
  {
    id: 'staff-004',
    firstName: 'Sylvie',
    lastName: 'MBOUMBA',
    function: 'Réceptionniste Principal',
    department: 'Accueil',
    internalPhone: '1001',
    email: 'sylvie.mboumba@sogara.ga',
    isAvailable: true,
    location: 'Hall d\'Accueil Principal',
    lastSeen: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    role: 'Réceptionniste',
    skills: ['Accueil', 'Service Client', 'Communication'],
    languages: ['Français', 'Anglais'],
    startDate: '2022-06-15',
    emergencyContact: '+241 77 88 99 00'
  },
  {
    id: 'staff-005',
    firstName: 'André',
    lastName: 'MOUNGOUNGOU',
    function: 'Agent Contrôle Frontalier',
    department: 'Immigration',
    internalPhone: '5002',
    email: 'andre.moungoungou@sogara.ga',
    isAvailable: false,
    location: 'Poste Frontière Est',
    lastSeen: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    role: 'Agent',
    skills: ['Contrôle Frontière', 'Vérification Documents'],
    languages: ['Français'],
    startDate: '2021-08-10'
  },
  {
    id: 'staff-006',
    firstName: 'Claire',
    lastName: 'MOUELE',
    function: 'Agent Administratif',
    department: 'Administration',
    internalPhone: '2001',
    email: 'claire.mouele@sogara.ga',
    isAvailable: true,
    location: 'Bureau 105, Bâtiment A',
    lastSeen: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    role: 'Agent',
    skills: ['Administration', 'Archivage'],
    languages: ['Français'],
    startDate: '2023-01-20'
  },
  {
    id: 'staff-007',
    firstName: 'Robert',
    lastName: 'NDONG',
    function: 'Administrateur Système',
    department: 'IT',
    internalPhone: '6001',
    email: 'robert.ndong@sogara.ga',
    isAvailable: true,
    location: 'Service Informatique, Étage 4',
    lastSeen: new Date().toISOString(),
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    role: 'Administrateur',
    skills: ['Informatique', 'Développement', 'Réseau', 'Sécurité'],
    languages: ['Français', 'Anglais'],
    startDate: '2020-03-01',
    emergencyContact: '+241 66 77 88 99'
  }
];

/**
 * Returns all available departments from staff data
 */
export function getAllDepartments(): string[] {
  const departments = new Set<string>();
  staffData.forEach(staff => departments.add(staff.department));
  return Array.from(departments).sort();
}

/**
 * Returns staff statistics
 */
export function getStaffStats() {
  return {
    total: staffData.length,
    available: staffData.filter(staff => staff.isAvailable).length,
    unavailable: staffData.filter(staff => !staff.isAvailable).length,
    departments: getAllDepartments().length
  };
}