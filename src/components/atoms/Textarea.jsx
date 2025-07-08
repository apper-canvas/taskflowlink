import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Textarea = forwardRef(({ 
  className, 
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        'input-field resize-none',
        error && 'border-error focus:border-error focus:ring-error/20',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;