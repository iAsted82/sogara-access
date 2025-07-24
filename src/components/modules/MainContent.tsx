import { StaffManagementModule } from '../modules/StaffManagementModule';
import { UserProfile } from '../UserProfile';
import DashboardModule from '../dashboard/DashboardModule';

// Ajout d'un compteur pour forcer le rechargement des composants

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'documentation':
        return <DocumentationModule />;
      case 'immigration':
        return <ImmigrationModule />;
      case 'statistics':
        return <StatisticsModule />;
      case 'users':
        return <UsersModule />;
      case 'audit':
        return <AuditModule />;
      case 'reception':
        return <ReceptionModule />;
      case 'packages':
        return <PackagesModule />;
      case 'visitor-stats':