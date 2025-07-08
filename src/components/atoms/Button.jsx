import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200',
    danger: 'bg-gradient-to-r from-secondary to-red-500 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;