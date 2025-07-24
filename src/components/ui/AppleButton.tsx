import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AppleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'btn focus-ring';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
        </>
      )}
    </button>
  );
};

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red' | 'purple';
  size?: 'md' | 'lg';
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  onClick,
  color = 'blue',
  size = 'md',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25',
    green: 'bg-green-600 hover:bg-green-700 shadow-green-500/25',
    red: 'bg-red-600 hover:bg-red-700 shadow-red-500/25',
    purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
  };

  const sizeClasses = {
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const iconSizeClasses = {
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        text-white
        rounded-full
        shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-apple
        hover:scale-110
        active:scale-95
        focus-ring
        ${className}
      `}
    >
      <Icon className={iconSizeClasses[size]} />
    </button>
  );
};

interface SegmentedControlProps {
  options: Array<{ label: string; value: string; icon?: LucideIcon }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`inline-flex bg-gray-100 p-1 rounded-xl ${className}`}>
      {options.map((option) => {
        const isSelected = option.value === value;
        const Icon = option.icon;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-apple
              flex items-center gap-2 min-w-[44px] justify-center
              ${isSelected 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};