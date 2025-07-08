import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'input-field',
        error && 'border-error focus:border-error focus:ring-error/20',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;