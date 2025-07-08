import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Badge from '@/components/atoms/Badge';

const PrioritySelector = ({ value, onChange, className }) => {
  const priorities = [
    { value: 'high', label: 'High', variant: 'high' },
    { value: 'medium', label: 'Medium', variant: 'medium' },
    { value: 'low', label: 'Low', variant: 'low' }
  ];

  return (
    <div className={cn('flex gap-2', className)}>
      {priorities.map((priority) => (
        <motion.button
          key={priority.value}
          type="button"
          onClick={() => onChange(priority.value)}
          className={cn(
            'transition-all duration-200',
            value === priority.value ? 'scale-110' : 'opacity-60 hover:opacity-80'
          )}
          whileHover={{ scale: value === priority.value ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge variant={priority.variant}>
            {priority.label}
          </Badge>
        </motion.button>
      ))}
    </div>
  );
};

export default PrioritySelector;