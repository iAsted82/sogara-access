import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AppleCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const AppleCard: React.FC<AppleCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hoverable = false,
  onClick
}) => {
  const baseClasses = 'card transition-all duration-300 ease-apple';
  
  const variantClasses = {
    default: '',
    elevated: 'card-elevated',
    glass: 'glass'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const interactiveClasses = hoverable || onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
  size = 'md'
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <AppleCard variant="elevated" padding="none" hoverable className={sizeClasses[size]}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-footnote text-secondary-label mb-1">{title}</p>
          <p className="text-title-2 font-semibold text-label">{value}</p>
          {change && (
            <p className={`text-caption-1 mt-1 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </AppleCard>
  );
};