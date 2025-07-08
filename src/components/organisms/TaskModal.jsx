import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import FormField from '@/components/molecules/FormField';
import PrioritySelector from '@/components/molecules/PrioritySelector';
import { taskService } from '@/services/api/taskService';
import { listService } from '@/services/api/listService';

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    listId: '1'
  });
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadLists();
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          listId: task.listId || '1'
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          listId: '1'
        });
      }
      setErrors({});
    }
  }, [isOpen, task]);

  const loadLists = async () => {
    try {
      const data = await listService.getAll();
      setLists(data);
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? `${formData.dueDate}T10:00:00Z` : null
      };

      let savedTask;
      if (task) {
        savedTask = await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        savedTask = await taskService.create(taskData);
        toast.success('Task created successfully');
      }

      onSave(savedTask);
      onClose();
    } catch (error) {
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-premium max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <Button
                variant="ghost"
                onClick={onClose}
                className="p-2 h-8 w-8"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Title"
                error={errors.title}
                required
              >
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter task title..."
                  error={!!errors.title}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter task description..."
                  rows={3}
                />
              </FormField>

              <FormField label="Priority">
                <PrioritySelector
                  value={formData.priority}
                  onChange={(value) => handleChange('priority', value)}
                />
              </FormField>

              <FormField label="Due Date">
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </FormField>

              <FormField label="List">
                <select
                  value={formData.listId}
                  onChange={(e) => handleChange('listId', e.target.value)}
                  className="input-field"
                >
                  {lists.map((list) => (
                    <option key={list.Id} value={list.Id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;