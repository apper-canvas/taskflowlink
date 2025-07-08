import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Badge = forwardRef(({ 
  className, 
  variant = 'default', 
  children,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
    success: 'bg-gradient-to-r from-success to-green-600 text-white',
    warning: 'bg-gradient-to-r from-warning to-yellow-600 text-white',
    error: 'bg-gradient-to-r from-error to-red-600 text-white'
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;