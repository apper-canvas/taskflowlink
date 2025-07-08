import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';
import { exportService } from '@/services/api/exportService';

const ExportDialog = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      await exportService.exportTasks(format);
      toast.success(`Tasks exported successfully as ${format.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to export tasks. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (isExporting) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-premium max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Export Tasks
              </h3>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="p-2 hover:bg-gray-100"
                disabled={isExporting}
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>

            <div className="space-y-4">
              <FormField label="Export Format" required>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={isExporting}
                >
                  <option value="json">JSON (.json)</option>
                  <option value="csv">CSV (.csv)</option>
                </Select>
              </FormField>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Export includes:</strong>
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Task titles and descriptions</li>
                  <li>• Priority levels and due dates</li>
                  <li>• Completion status and timestamps</li>
                  <li>• List assignments and creation dates</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isExporting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1 gap-2"
                >
                  {isExporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Loader2" size={16} />
                      </motion.div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Download" size={16} />
                      Export
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExportDialog;