import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.div 
      className="relative inline-flex items-center cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <div
        className={cn(
          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
          checked 
            ? 'bg-gradient-to-r from-accent to-success border-transparent' 
            : 'border-gray-300 bg-white hover:border-gray-400',
          className
        )}
        onClick={onChange}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ApperIcon name="Check" size={14} className="text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;