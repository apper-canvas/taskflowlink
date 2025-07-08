import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;