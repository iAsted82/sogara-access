import React, { useState } from 'react';
import { Check, ChevronRight, User, Calendar, Star, Settings } from 'lucide-react';
import { AppleCard } from './ui/AppleCard';

interface AppleAccountCardProps {
  title: string;
  icon?: React.ElementType;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  badge?: string | number;
  actions?: React.ReactNode;
  variant?: 'default' | 'info' | 'success' | 'warning';
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  iconColor?: string;
  iconBackground?: string;
}

export const AppleAccountCard: React.FC<AppleAccountCardProps> = ({
  title,
  icon: Icon,
  description,
  children,
  onClick,
  badge,
  actions,
  variant = 'default',
  selectable = false,
  selected = false,
  onSelect,
  className = '',
  iconColor = 'text-blue-600',
  iconBackground = 'bg-blue-100'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    default: '',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <AppleCard
      variant={selected ? "elevated" : "default"}
      className={`transition-all duration-300 ${onClick || selectable ? 'cursor-pointer' : ''} ${selected ? 'border-blue-500' : ''} ${variantStyles[variant]} ${className}`}
      onClick={selectable ? onSelect : onClick}
      hoverable={!!onClick || selectable}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {Icon && (
              <div className={`p-2.5 rounded-xl mr-3.5 ${iconBackground}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
          </div>
          
          {badge && (
            <div className="bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {badge}
            </div>
          )}
          
          {selectable && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selected ? 'bg-blue-600 border-2 border-blue-600' : 'border-2 border-gray-300'} transition-colors`}>
              {selected && <Check className="h-4 w-4 text-white" />}
            </div>
          )}
          
          {onClick && !selectable && (
            <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          )}
        </div>
        
        {children && <div className="mt-3">{children}</div>}
        
        {actions && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-3">
            {actions}
          </div>
        )}
      </div>
    </AppleCard>
  );
};

// Prebuilt Card Variants
export const ProfileCard: React.FC<{ name: string; role: string; avatar?: string; onClick?: () => void }> = ({ 
  name, 
  role,
  avatar,
  onClick 
}) => {
  return (
    <AppleAccountCard
      title={name}
      icon={User}
      description={role}
      onClick={onClick}
      className="hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500">En ligne</span>
        </div>
        <span className="text-xs text-gray-400">Dernière activité: aujourd'hui</span>
      </div>
    </AppleAccountCard>
  );
};

export const StatsCard: React.FC<{ title: string; value: string | number; trend?: string; icon?: React.ElementType; description?: string }> = ({ 
  title,
  value,
  trend,
  icon: Icon = Star,
  description
}) => {
  return (
    <AppleAccountCard
      title={title}
      icon={Icon}
      iconColor="text-orange-600"
      iconBackground="bg-orange-100"
      description={description}
    >
      <div className="mt-2 flex items-end gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} font-medium`}>
            {trend}
          </div>
        )}
      </div>
    </AppleAccountCard>
  );
};

export const AppointmentCard: React.FC<{ date: string; time: string; title: string; location?: string; onClick?: () => void }> = ({ 
  date,
  time,
  title,
  location,
  onClick
}) => {
  return (
    <AppleAccountCard
      title={title}
      icon={Calendar}
      iconColor="text-purple-600"
      iconBackground="bg-purple-100"
      description={location}
      onClick={onClick}
      className="hover:shadow-md"
    >
      <div className="flex items-center gap-3 mt-3">
        <div className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
          {date}
        </div>
        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          {time}
        </div>
      </div>
    </AppleAccountCard>
  );
};

export const SettingsCard: React.FC<{ title: string; description: string; isEnabled: boolean; onChange: (value: boolean) => void }> = ({ 
  title,
  description,
  isEnabled,
  onChange
}) => {
  return (
    <AppleAccountCard
      title={title}
      icon={Settings}
      description={description}
    >
      <div className="flex items-center justify-end mt-2">
        <div className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={isEnabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
      </div>
    </AppleAccountCard>
  );
};