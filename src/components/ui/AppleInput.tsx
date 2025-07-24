import React, { useState, forwardRef } from 'react';
import { DivideIcon as LucideIcon, Eye, EyeOff } from 'lucide-react';

interface AppleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'floating';
  clearable?: boolean;
  onClear?: () => void;
}

export const AppleInput = forwardRef<HTMLInputElement, AppleInputProps>(({
  label,
  error,
  success,
  hint,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  clearable = false,
  onClear,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const inputClasses = `
    input
    ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${isPassword || clearable ? 'pr-10' : ''}
    ${error ? 'border-red-500 focus:border-red-500 focus:shadow-red-100' : ''}
    ${success ? 'border-green-500 focus:border-green-500 focus:shadow-green-100' : ''}
    ${variant === 'filled' ? 'bg-gray-50 border-transparent' : ''}
    ${className}
  `;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-2">
      {label && variant !== 'floating' && (
        <label className="block text-callout text-label font-medium">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Floating Label */}
        {variant === 'floating' && label && (
          <label className={`
            absolute left-4 transition-all duration-200 ease-apple pointer-events-none
            ${isFocused || hasValue 
              ? 'top-2 text-caption-2 text-blue-600' 
              : 'top-1/2 -translate-y-1/2 text-base text-tertiary-label'
            }
          `}>
            {label}
          </label>
        )}

        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChange={handleChange}
          {...props}
        />

        {/* Right Side Actions */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Clear Button */}
          {clearable && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          )}

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {/* Right Icon */}
          {Icon && iconPosition === 'right' && !isPassword && !clearable && (
            <Icon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Helper Text */}
      {(error || success || hint) && (
        <div className="space-y-1">
          {error && (
            <p className="text-caption-1 text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {error}
            </p>
          )}
          {success && (
            <p className="text-caption-1 text-green-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-green-600 rounded-full"></span>
              {success}
            </p>
          )}
          {hint && !error && !success && (
            <p className="text-caption-1 text-secondary-label">{hint}</p>
          )}
        </div>
      )}
    </div>
  );
});

AppleInput.displayName = 'AppleInput';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher...',
  onSubmit,
  className = ''
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-gray-100 border-transparent rounded-xl text-base placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:shadow-lg transition-all duration-200 ease-apple"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};