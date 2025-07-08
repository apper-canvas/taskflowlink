import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { listService } from '@/services/api/listService';
import { cn } from '@/utils/cn';

const Sidebar = ({ isOpen, onClose }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListForm, setShowListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const location = useLocation();

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const data = await listService.getAll();
      setLists(data);
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const newList = await listService.create({
        name: newListName.trim(),
        color: '#5B4CFF',
        icon: 'Folder'
      });
      setLists([...lists, newList]);
      setNewListName('');
      setShowListForm(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const mainNavItems = [
    { path: '/all-tasks', label: 'All Tasks', icon: 'List' },
    { path: '/today', label: 'Today', icon: 'Calendar' },
    { path: '/upcoming', label: 'Upcoming', icon: 'Clock' },
    { path: '/archive', label: 'Archive', icon: 'Archive' }
  ];

  const NavItem = ({ item, isActive, onClick }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
        isActive 
          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-sm' 
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <ApperIcon name={item.icon} size={20} />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );

  const ListItem = ({ list, isActive, onClick }) => (
    <NavLink
      to={`/list/${list.Id}`}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200',
        isActive 
          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-sm' 
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <ApperIcon name={list.icon} size={18} style={{ color: isActive ? 'white' : list.color }} />
      <span className="flex-1 truncate">{list.name}</span>
      <span className="text-sm opacity-70">{list.taskCount}</span>
    </NavLink>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
          <ApperIcon name="CheckSquare" size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 font-display">TaskFlow</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              onClick={onClose}
            />
          ))}
        </div>

        {/* Lists Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Lists
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowListForm(true)}
              className="p-1 h-6 w-6"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>

          {/* Add List Form */}
          {showListForm && (
            <motion.form
              onSubmit={handleAddList}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                autoFocus
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="text-xs">
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowListForm(false);
                    setNewListName('');
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}

          {/* Lists */}
          <div className="space-y-1">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              lists.map((list) => (
                <ListItem
                  key={list.Id}
                  list={list}
                  isActive={location.pathname === `/list/${list.Id}`}
                  onClick={onClose}
                />
              ))
            )}
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-full border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;