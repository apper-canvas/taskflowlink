import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ onSearch, placeholder = "Search tasks..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <motion.div 
      className="relative w-full max-w-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={18} className="text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary/20"
      />
      {searchTerm && (
        <motion.button
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => {
            setSearchTerm('');
            onSearch('');
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ApperIcon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;