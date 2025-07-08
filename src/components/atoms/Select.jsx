import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Select = forwardRef(({ 
  className, 
  children,
  error = false,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        'input-field pr-10 bg-white cursor-pointer',
        error && 'border-error focus:border-error focus:ring-error/20',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;