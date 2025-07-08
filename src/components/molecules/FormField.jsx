import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const FormField = forwardRef(({ 
  label, 
  error, 
  children, 
  className,
  required = false,
  ...props 
}, ref) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;