import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = 'No tasks yet', 
  description = 'Create your first task to get started',
  action,
  actionLabel = 'Add Task',
  icon = 'CheckSquare'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} size={32} className="text-primary" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action} className="gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;