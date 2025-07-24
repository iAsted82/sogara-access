import React from 'react';

interface AppleBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AppleBadge: React.FC<AppleBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-caption-2',
    md: 'px-3 py-1 text-caption-1',
    lg: 'px-4 py-2 text-footnote'
  };

  return (
    <span className={`
      inline-flex items-center
      rounded-full
      font-medium
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `}>
      {children}
    </span>
  );
};

interface NotificationDotProps {
  count?: number;
  color?: 'red' | 'blue' | 'green' | 'orange';
  className?: string;
}

export const NotificationDot: React.FC<NotificationDotProps> = ({
  count,
  color = 'red',
  className = ''
}) => {
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500'
  };

  if (count === undefined || count === 0) {
    return (
      <div className={`w-2 h-2 ${colorClasses[color]} rounded-full ${className}`} />
    );
  }

  return (
    <div className={`
      min-w-[20px] h-5
      ${colorClasses[color]}
      rounded-full
      flex items-center justify-center
      text-white text-caption-2 font-semibold
      ${className}
    `}>
      {count > 99 ? '99+' : count}
    </div>
  );
};

export const StatusIndicator: React.FC<{
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ status, size = 'md', className = '' }) => {
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-orange-500',
    busy: 'bg-red-500'
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      ${statusClasses[status]}
      rounded-full
      ${status === 'online' ? 'animate-pulse' : ''}
      ${className}
    `} />
  );
};