import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="card p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-md animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;